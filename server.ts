import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_OPPORTUNITIES } from './src/data/initialOpportunities.ts';
import { getMorningAnswers, generateMorningAIIntelligence, discoverNewOpportunityAI, generateArtifactsAI, calculatePriorityScore, analyzeTranscriptAI } from './src/server/oppyEngine.ts';
import { Opportunity, LLMConfig, UserProfile } from './src/types.ts';
import { computeOppyScore, computeMatchScore } from './src/services/scoringEngine.ts';
import {
  getOpportunities,
  saveOpportunity,
  deleteOpportunity,
  saveAllOpportunities,
  getUserProfile,
  saveUserProfile
} from './src/server/db.ts';
import {
  runScoutFleet,
  startCrawlerScheduler
} from './src/server/crawlers.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize state
let portfolio: Opportunity[] = [];
let userProfile: UserProfile = {
  email: 'benneberg@gmail.com',
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
    // Load from SQLite
    userProfile = getUserProfile(userProfile);
    portfolio = getOpportunities();

    if (portfolio.length === 0) {
      console.log('[DB] Database is empty. Seeding with INITIAL_OPPORTUNITIES...');
      portfolio = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
      saveAllOpportunities(portfolio);
      saveUserProfile(userProfile);
    }
  } catch (err) {
    console.warn('[DB] SQLite read error, using memory fallback.', err);
    portfolio = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
  }
}

function saveData() {
  try {
    saveAllOpportunities(portfolio);
    saveUserProfile(userProfile);
  } catch (err) {
    console.error('[DB] SQLite save error:', err);
  }
}

async function startServer() {
  loadData();

  // Start background crawler scheduler
  startCrawlerScheduler(
    () => portfolio,
    (updatedPortfolio) => {
      portfolio = updatedPortfolio;
      saveAllOpportunities(portfolio);
    },
    () => userProfile
  );

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
    saveUserProfile(userProfile);
    saveAllOpportunities(portfolio);
    res.json({ success: true, userProfile });
  });

  app.post('/api/discover', async (req, res) => {
    const { rawSignal, category } = req.body;
    if (!rawSignal) return res.status(400).json({ error: 'Missing rawSignal' });
    try {
      const config = getLLMConfig(req);
      
      // 1. LLM Brainstorming of venture idea
      const newOpp = await discoverNewOpportunityAI(rawSignal, category || 'Industrial AI', config, userProfile.email);
      portfolio.unshift(newOpp);
      saveOpportunity(newOpp);

      // 2. Active Scout Fleet live crawls (Reddit, Hacker News, GitHub)
      try {
        console.log('[SCOUT FLEET] Running active multi-source live crawler...');
        const crawled = await runScoutFleet(portfolio, userProfile, config);
        if (crawled.length > 0) {
          console.log(`[SCOUT FLEET] Successfully sourced ${crawled.length} matching jobs.`);
          portfolio = [...crawled, ...portfolio];
          saveAllOpportunities(crawled);
        }
      } catch (crawlErr) {
        console.error('[SCOUT FLEET] Active live crawl failed:', crawlErr);
      }

      res.json(newOpp);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Discover failed' });
    }
  });

  function reinforceProfileFromFeedback(opp: Opportunity, action: 'save' | 'delete') {
    try {
      if (action === 'save') {
        // If promoted to active/validated/production, reinforce skills
        if (opp.stage === 'active' || opp.stage === 'validated' || opp.stage === 'production') {
          if (opp.skills && opp.skills.length > 0) {
            let updated = false;
            const currentSkills = [...userProfile.skills];
            for (const s of opp.skills) {
              if (!currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase())) {
                currentSkills.push(s);
                updated = true;
              }
            }
            if (updated) {
              userProfile.skills = currentSkills;
              saveUserProfile(userProfile);
              console.log(`[OPPY LEARNER] Reinforced skills in user profile based on "${opp.name}" promotion:`, opp.skills);
            }
          }
        }
      } else if (action === 'delete') {
        // Hiding/deleting - can help filter down preferences or register telemetry
        console.log(`[OPPY LEARNER] Registered deleted signal for opportunity "${opp.name}" of category "${opp.category}".`);
      }
    } catch (err) {
      console.error('[OPPY LEARNER] Failed to reinforce profile:', err);
    }
  }

  app.post('/api/opportunities', (req, res) => {
    const opp: Opportunity = req.body;
    if (!opp || !opp.id) return res.status(400).json({ error: 'Invalid opportunity data' });

    // Recalculate using central OppyScore v1 formula
    const scoreObj = computeOppyScore(opp.scores.iqi, opp.validation, opp.scores.killer, opp.experiments);
    
    opp.scores.priority_score = scoreObj.finalScore;
    opp.scores.oppy_score_v1 = scoreObj.finalScore;
    opp.validation.evidence_score = scoreObj.evidence;
    opp.validation.evidence_weight_percent = scoreObj.evidenceWeightPercent;
    
    opp.scores.killer.risk_penalty = scoreObj.risk;
    opp.updated = new Date().toISOString();

    const idx = portfolio.findIndex(p => p.id === opp.id);
    if (idx !== -1) {
      portfolio[idx] = opp;
    } else {
      portfolio.unshift(opp);
    }
    saveOpportunity(opp);
    reinforceProfileFromFeedback(opp, 'save');
    res.json(opp);
  });

  app.delete('/api/opportunities/:id', (req, res) => {
    const { id } = req.params;
    const targetOpp = portfolio.find(p => p.id === id);
    if (targetOpp) {
      reinforceProfileFromFeedback(targetOpp, 'delete');
    }
    portfolio = portfolio.filter(p => p.id !== id);
    deleteOpportunity(id);
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
      saveOpportunity(updated);
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
    saveAllOpportunities(portfolio);
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
