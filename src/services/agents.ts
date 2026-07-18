import { AIAgentStatus } from '../types';

export const INITIAL_AI_AGENTS: AIAgentStatus[] = [
  {
    id: 'agent_ingest',
    name: 'Signal Ingest Agent',
    role: 'Strips founder bias from raw inputs, extracts structural economic friction, and creates clean JSON structures.',
    status: 'ONLINE',
    lastAction: 'Parsed raw operational feedback for Downtime Root-Cause Analyzer.',
    processedCount: 14,
    accuracyRate: '98.5%'
  },
  {
    id: 'agent_scorer',
    name: 'Scoring Engine Agent',
    role: 'Scans opportunities against procurement reality and calculates OppyScore v1 (Potential + Evidence - Risk).',
    status: 'ONLINE',
    lastAction: 'Calculated Risk Penalty for compliance automation sandbox candidates.',
    processedCount: 32,
    accuracyRate: '96.2%'
  },
  {
    id: 'agent_validation',
    name: 'Customer Discovery Agent',
    role: 'Creates strict verification protocols, drafts interview questions, and generates landing page markdown.',
    status: 'ONLINE',
    lastAction: 'Formulated canonical 8 questions for Kubernetes Deployment cost analyzer.',
    processedCount: 21,
    accuracyRate: '94.8%'
  },
  {
    id: 'agent_outreach',
    name: 'Growth Mining Agent',
    role: 'Extracts buyer search operators and crafts LinkedIn and cold email templates asking for feedback over selling.',
    status: 'ONLINE',
    lastAction: 'Drafted cold outreach scripts targeted at Head of Infrastructure.',
    processedCount: 29,
    accuracyRate: '97.1%'
  }
];
