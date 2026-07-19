import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Opportunity, UserProfile } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', '..', 'oppy_lab.db');

let db: any;

try {
  db = new Database(DB_FILE);
  // Enable WAL mode for concurrent write resilience
  db.pragma('journal_mode = WAL');

  // Create tables if they don't exist
  db.prepare(`
    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      type TEXT,
      category TEXT,
      summarized INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  // Try to add summarized column to opportunities if it doesn't exist yet
  try {
    db.prepare('ALTER TABLE opportunities ADD COLUMN summarized INTEGER DEFAULT 0').run();
  } catch (err) {
    // Column already exists, ignore
  }

  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `).run();
} catch (err) {
  console.error('Failed to initialize SQLite Database, using mock DB state:', err);
  // Fallback memory state in case of environment limitation
  const mockState: Record<string, string> = {};
  db = {
    prepare: () => ({
      run: () => {},
      all: () => [],
      get: () => null
    }),
    pragma: () => {}
  };
}

export function getOpportunities(): Opportunity[] {
  try {
    const rows = db.prepare('SELECT data FROM opportunities ORDER BY updated_at DESC').all();
    return rows.map((r: any) => JSON.parse(r.data));
  } catch (err) {
    console.error('getOpportunities failed:', err);
    return [];
  }
}

export function saveOpportunity(opp: Opportunity): void {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO opportunities (id, data, type, category, summarized, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    stmt.run(
      opp.id,
      JSON.stringify(opp),
      opp.type || 'venture',
      opp.category,
      opp.summarized ? 1 : 0,
      opp.created || now,
      opp.updated || now
    );
  } catch (err) {
    console.error(`saveOpportunity ${opp.id} failed:`, err);
  }
}

export function deleteOpportunity(id: string): void {
  try {
    db.prepare('DELETE FROM opportunities WHERE id = ?').run(id);
  } catch (err) {
    console.error(`deleteOpportunity ${id} failed:`, err);
  }
}

export function saveAllOpportunities(opps: Opportunity[]): void {
  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO opportunities (id, data, type, category, summarized, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Use transaction for massive performance boost and safety
    const transaction = db.transaction((items: Opportunity[]) => {
      for (const opp of items) {
        const now = new Date().toISOString();
        insert.run(
          opp.id,
          JSON.stringify(opp),
          opp.type || 'venture',
          opp.category,
          opp.summarized ? 1 : 0,
          opp.created || now,
          opp.updated || now
        );
      }
    });
    
    transaction(opps);
  } catch (err) {
    console.error('saveAllOpportunities failed:', err);
  }
}

export function getUserProfile(fallback: UserProfile): UserProfile {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('user_profile');
    if (row) {
      return JSON.parse(row.value);
    }
  } catch (err) {
    console.error('getUserProfile failed:', err);
  }
  return fallback;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run('user_profile', JSON.stringify(profile));
  } catch (err) {
    console.error('saveUserProfile failed:', err);
  }
}

export function getCrawlerMetadata(key: string): any {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(`crawler_${key}`);
    if (row) {
      return JSON.parse(row.value);
    }
  } catch (err) {
    console.error(`getCrawlerMetadata ${key} failed:`, err);
  }
  return null;
}

export function saveCrawlerMetadata(key: string, data: any): void {
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run(`crawler_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`saveCrawlerMetadata ${key} failed:`, err);
  }
}
