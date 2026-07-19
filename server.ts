import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_OPPORTUNITIES } from './src/data/initialOpportunities.ts';
import { getMorningAnswers, generateMorningAIIntelligence, discoverNewOpportunityAI, generateArtifactsAI, calculatePriorityScore, analyzeTranscriptAI } from './src/server/oppyEngine.ts';
import { Opportunity, LLMConfig, UserProfile } from './src/types.ts';
import { computeOppyScore, computeMatchScore } from './src/services/scoringEngine.ts';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'oppy_lab_data.json');

// Initialize state
let portfolio: Opportunity[] = [];
let userProfile: UserProfile = {
  skills: ['Automation', 'AI', 'Programming'],
  experienceLevel: 'Expert',
  preferredWork: ['Remote'],
  timeAvailable: 15,
  incomeGoal: 2500,
  startupBudget: 100,
  riskTolerance: 'Low',
  interests: 'Automating local services and businesses, custom voice assistants, technical writing, API integrations',
  excludedCategories: ['MLM', 'Crypto', 'Gambling']
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        portfolio = parsed;
      } else {
        portfolio = parsed.portfolio || [];
        if (parsed.userProfile) {
          userProfile = parsed.userProfile;
        }
      }
    } else {
      portfolio = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
      saveData();
    }
  } catch (err) {
    console.warn('Could not read oppy_lab_data.json, falling back to initial seed.');
    portfolio = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
  }
}

function saveData() {
  try {
    const out = {
      portfolio,
      userProfile
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write oppy_lab_data.json:', err);
  }
}

async function startServer() {
  loadData();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to extract custom BYOK LLM Configuration headers
  function getLLMConfig(req: express.Request): LLMConfig | undefined {
    const provider = req.header('X-LLM-Provider');
    const model = req.header('X-LLM-Model');
    const apiKey = req.header('X-LLM-API-Key');

    if (provider && apiKey) {
      return {
        provider,
        model: model || '',
        apiKey
      };
    }
    return undefined;
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Oppy Founder Decision OS', count: portfolio.length });
  });

  app.get('/api/portfolio', (req, res) => {
    portfolio = portfolio.map(opp => {
      opp.matchScore = computeMatchScore(opp, userProfile);
      return opp;
    });
    const morning = getMorningAnswers(portfolio);
    res.json({ portfolio, morning, userProfile });
  });

  app.post('/api/profile', (req, res) => {
    userProfile = req.body;
    portfolio = portfolio.map(opp => {
      opp.matchScore = computeMatchScore(opp, userProfile);
      return opp;
    });
    saveData();
    res.json({ success: true, userProfile });
  });

  app.post('/api/discover', async (req, res) => {
    const { rawSignal, category } = req.body;
    if (!rawSignal) return res.status(400).json({ error: 'Missing rawSignal' });
    try {
      const config = getLLMConfig(req);
      const newOpp = await discoverNewOpportunityAI(rawSignal, category || 'Industrial AI', config);
      portfolio.unshift(newOpp);
      saveData();
      res.json(newOpp);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Discover failed' });
    }
  });

  app.post('/api/opportunities', (req, res) => {
    const opp: Opportunity = req.body;
    if (!opp || !opp.id) return res.status(400).json({ error: 'Invalid opportunity data' });

    // Recalculate using central OppyScore v1 formula
    const scoreObj = computeOppyScore(opp.scores.iqi, opp.validation, opp.scores.killer, opp.experiments);
    
    opp.scores.priority_score = scoreObj.finalScore;
    opp.scores.oppy_score_v1 = scoreObj.finalScore;
    opp.validation.evidence_score = scoreObj.evidence;
    opp.validation.evidence_weight_percent = scoreObj.evidenceWeightPercent;
    
    // Maintain speed_bonus as is, and update overall risk and penalty
    opp.scores.killer.risk_penalty = scoreObj.risk;

    opp.updated = new Date().toISOString();

    const idx = portfolio.findIndex(p => p.id === opp.id);
    if (idx !== -1) {
      portfolio[idx] = opp;
    } else {
      portfolio.unshift(opp);
    }
    saveData();
    res.json(opp);
  });

  app.delete('/api/opportunities/:id', (req, res) => {
    const { id } = req.params;
    portfolio = portfolio.filter(p => p.id !== id);
    saveData();
    res.json({ success: true });
  });

  app.post('/api/artifacts/:id', async (req, res) => {
    const { id } = req.params;
    const idx = portfolio.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    try {
      const config = getLLMConfig(req);
      const updated = await generateArtifactsAI(portfolio[idx], config);
      portfolio[idx] = updated;
      saveData();
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Artifact generation failed' });
    }
  });

  app.post('/api/transcribe-interview', async (req, res) => {
    const { transcript, opportunityName } = req.body;
    if (!transcript || !opportunityName) {
      return res.status(400).json({ error: 'Missing transcript or opportunityName' });
    }
    try {
      const config = getLLMConfig(req);
      const result = await analyzeTranscriptAI(transcript, opportunityName, config);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Analysis failed' });
    }
  });

  app.post('/api/morning-brief', async (req, res) => {
    try {
      const config = getLLMConfig(req);
      const brief = await generateMorningAIIntelligence(portfolio, config);
      res.json({ brief });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reset', (req, res) => {
    portfolio = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
    saveData();
    res.json({ success: true });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Oppy Founder OS Server running on http://localhost:${PORT}`);
  });
}

startServer();
