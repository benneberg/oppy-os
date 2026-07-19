import cron from 'node-cron';
import { Opportunity } from '../types';
import { saveOpportunity, getOpportunities } from './db';
import { computeMatchScore } from '../services/scoringEngine';

// -------------------------------------------------------------
// Fuzzy Deduplication & Levenshtein Distance
// -------------------------------------------------------------

export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}

export function getSimilarity(s1: string, s2: string): number {
  const len = Math.max(s1.length, s2.length);
  if (len === 0) return 1.0;
  return 1.0 - levenshteinDistance(s1.toLowerCase(), s2.toLowerCase()) / len;
}

export function findDuplicate(existingOpps: Opportunity[], newOpp: Opportunity): Opportunity | null {
  for (const existing of existingOpps) {
    if (existing.url && newOpp.url && existing.url === newOpp.url) {
      return existing;
    }
    if (getSimilarity(existing.name, newOpp.name) > 0.8) {
      return existing;
    }
  }
  return null;
}

// -------------------------------------------------------------
// Rule-Based Scam Detection
// -------------------------------------------------------------

interface ScamCheckResult {
  riskScore: number;
  reasons: string[];
}

export function detectScam(title: string, description: string): ScamCheckResult {
  const reasons: string[] = [];
  let riskScore = 0;

  const lowTitle = title.toLowerCase();
  const lowDesc = description.toLowerCase();

  // Rule 1: Upfront payment keywords
  const upfrontKeywords = [
    'upfront payment', 'pay upfront', 'deposit required', 'buy this', 
    'invest first', 'security deposit', 'fee first', 'send deposit'
  ];
  for (const kw of upfrontKeywords) {
    if (lowDesc.includes(kw) || lowTitle.includes(kw)) {
      riskScore += 4;
      reasons.push(`Suspected upfront payment demand: "${kw}"`);
    }
  }

  // Rule 2: Unrealistic pay rate claims
  if (
    lowDesc.includes('$5000/week') || 
    lowDesc.includes('$1000/day') || 
    lowDesc.includes('$2000/day') || 
    (lowDesc.includes('data entry') && (lowDesc.includes('$50/hr') || lowDesc.includes('$100/hr')))
  ) {
    riskScore += 3;
    reasons.push('Unrealistic rate of pay for basic skill level');
  }

  // Rule 3: Telegram-only contact bypasses platform escrow
  if (
    (lowDesc.includes('telegram') || lowDesc.includes('t.me/')) && 
    !lowDesc.includes('slack') && 
    !lowDesc.includes('email') &&
    !lowDesc.includes('linkedin')
  ) {
    riskScore += 3;
    reasons.push('Telegram-only communication channel');
  }

  // Rule 4: Suspicious payment channels or quick wealth
  if (lowDesc.includes('whatsapp') && (lowDesc.includes('crypto') || lowDesc.includes('invest'))) {
    riskScore += 4;
    reasons.push('Typical WhatsApp & Crypto scam pattern');
  }

  // Rule 5: Generic "no skills required but make money fast" hooks
  if (lowDesc.includes('no experience required') && (lowDesc.includes('earn $') || lowDesc.includes('easy money'))) {
    riskScore += 2;
    reasons.push('"No experience required" and "easy money" marketing pattern');
  }

  return {
    riskScore: Math.min(10, riskScore),
    reasons
  };
}

// -------------------------------------------------------------
// Crawlers (Reddit, Hacker News, GitHub)
// -------------------------------------------------------------

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 (OppyOS/1.0)'
};

export async function crawlReddit(): Promise<Opportunity[]> {
  const subreddits = ['forhire', 'slavelabour', 'entrepreneur', 'sideprojects', 'freelance'];
  const opportunities: Opportunity[] = [];

  for (const sub of subreddits) {
    try {
      const url = `https://www.reddit.com/r/${sub}/new.json?limit=5`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`Reddit sub /r/${sub} fetch returned ${res.status}`);
        continue;
      }
      const json: any = await res.json();
      const posts = json?.data?.children || [];

      for (const post of posts) {
        const data = post.data;
        if (!data || data.over_18 || data.stickied) continue;

        const title = data.title || '';
        const body = data.selftext || '';
        const link = `https://www.reddit.com${data.permalink}`;
        
        // Skip meta/pinned posts
        if (title.length < 10) continue;

        const scamResult = detectScam(title, body);

        opportunities.push({
          type: 'opportunity',
          id: `reddit_${data.id}`,
          name: title.slice(0, 70) + (title.length > 70 ? '...' : ''),
          tagline: `Reddit Sourced post from r/${sub} by u/${data.author}`,
          category: sub === 'forhire' || sub === 'freelance' || sub === 'slavelabour' ? 'Developer Productivity' : 'Strategic Insight',
          stage: 'sandbox',
          status: 'active',
          created: new Date(data.created_utc * 1000).toISOString(),
          updated: new Date().toISOString(),
          owner: 'Scout Crawler',
          description: body.slice(0, 1000) + (body.length > 1000 ? '...' : ''),
          problem: `Client is looking for contract work or feedback in r/${sub}.`,
          solution: `u/${data.author} states: "${title}"`,
          target_user: `Reddit user u/${data.author}`,
          workaround: 'Manual forum searching and classified ads.',
          monetization: 'Direct payment / contract agreement.',
          mvp: 'Provide direct programming or consulting support.',
          riskScore: scamResult.riskScore,
          trustScore: Math.max(10, 100 - scamResult.riskScore * 10),
          estimatedHours: 10,
          source: `Reddit r/${sub}`,
          url: link,
          location: 'Remote',
          skills: ['Automation', 'Programming', 'Marketing', 'Consulting'],
          incomeEstimate: { min: 250, max: 1500, currency: 'USD' },
          scores: {
            iqi: {
              pain_intensity: 7,
              willingness_to_pay: 6,
              validation_speed: 8,
              reachability: 7,
              switching_friction: 5,
              competition: 4,
              ttfd_score: 7,
              total_iqi: 70
            },
            killer: {
              demand_risk: 'Low Risk',
              budget_risk: 'Low Risk',
              access_risk: 'Low Risk',
              competition_risk: 'Medium Risk',
              complexity_risk: 'Low Risk',
              ttfd_risk: 'Low Risk',
              overall_risk: 'Low Risk',
              risk_penalty: scamResult.riskScore
            },
            ttfd: {
              pay_this_month: true,
              rapid_mvp_days: 7,
              data_available: true,
              interviews_immediate: true,
              speed_bonus: 5
            },
            priority_score: 65,
            oppy_score_v1: 65
          },
          validation: {
            interviews: 0,
            positive_interviews: 0,
            negative_interviews: 0,
            landing_visits: 0,
            signup_rate: 0,
            demo_requests: 0,
            preorders: 0,
            revenue: 0,
            evidence_score: 10,
            evidence_weight_percent: 10
          },
          artifacts: {},
          decision: {
            recommended_action: 'Investigate Fast',
            reason: 'Sourced from live active Reddit feed with strong initial match characteristics.'
          },
          experiments: []
        });
      }
    } catch (err) {
      console.error(`crawlReddit failed for sub ${sub}:`, err);
    }
  }
  return opportunities;
}

export async function crawlHackerNews(): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  try {
    const url = `https://hn.algolia.com/api/v1/search?tags=story&query=hiring&hitsPerPage=10`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`HackerNews Algolia API fetch returned ${res.status}`);
      return [];
    }
    const json: any = await res.json();
    const hits = json?.hits || [];

    for (const hit of hits) {
      const title = hit.title || '';
      const text = hit.story_text || '';
      const link = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;

      if (!title || title.length < 5) continue;

      const scamResult = detectScam(title, text);

      opportunities.push({
        type: 'opportunity',
        id: `hn_${hit.objectID}`,
        name: title,
        tagline: `HN thread post by ${hit.author}`,
        category: 'Developer Productivity',
        stage: 'sandbox',
        status: 'active',
        created: new Date(hit.created_at).toISOString(),
        updated: new Date().toISOString(),
        owner: 'Scout Crawler',
        description: text || `Hacker News submission titled: ${title}`,
        problem: 'Sourcing remote software development talents or freelance builders.',
        solution: 'Direct contact with HN poster or thread participants.',
        target_user: `Hacker News hiring poster ${hit.author}`,
        workaround: 'Job boards and expensive recruitment agencies.',
        monetization: 'Remote freelance hourly or contract billing.',
        mvp: 'Direct response with pitch deck/portfolio matching requirements.',
        riskScore: scamResult.riskScore,
        trustScore: Math.max(10, 100 - scamResult.riskScore * 10),
        estimatedHours: 15,
        source: 'Hacker News',
        url: link,
        location: 'Remote',
        skills: ['Programming', 'AI', 'Architecture'],
        incomeEstimate: { min: 1000, max: 8000, currency: 'USD' },
        scores: {
          iqi: {
            pain_intensity: 8,
            willingness_to_pay: 8,
            validation_speed: 6,
            reachability: 7,
            switching_friction: 6,
            competition: 5,
            ttfd_score: 7,
            total_iqi: 72
          },
          killer: {
            demand_risk: 'Medium Risk',
            budget_risk: 'Medium Risk',
            access_risk: 'Low Risk',
            competition_risk: 'Medium Risk',
            complexity_risk: 'Medium Risk',
            ttfd_risk: 'Low Risk',
            overall_risk: 'Medium Risk',
            risk_penalty: scamResult.riskScore
          },
          ttfd: {
            pay_this_month: true,
            rapid_mvp_days: 7,
            data_available: true,
            interviews_immediate: true,
            speed_bonus: 5
          },
          priority_score: 74,
          oppy_score_v1: 74
        },
        validation: {
          interviews: 0,
          positive_interviews: 0,
          negative_interviews: 0,
          landing_visits: 0,
          signup_rate: 0,
          demo_requests: 0,
          preorders: 0,
          revenue: 0,
          evidence_score: 15,
          evidence_weight_percent: 15
        },
          artifacts: {},
          decision: {
            recommended_action: 'Investigate Fast',
            reason: 'Sourced from live active Hacker News hiring feed.'
          },
          experiments: []
      });
    }
  } catch (err) {
    console.error('crawlHackerNews failed:', err);
  }
  return opportunities;
}

export async function crawlGitHubBounty(): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  try {
    const url = 'https://api.github.com/search/issues?q=label:bounty+state:open&per_page=10';
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`GitHub API fetch returned ${res.status}`);
      return [];
    }
    const json: any = await res.json();
    const items = json?.items || [];

    for (const item of items) {
      const title = item.title || '';
      const body = item.body || '';
      const link = item.html_url || '';

      const scamResult = detectScam(title, body);

      opportunities.push({
        type: 'opportunity',
        id: `github_${item.id}`,
        name: title,
        tagline: `GitHub Issue #${item.number} in open-source repository`,
        category: 'Developer Productivity',
        stage: 'sandbox',
        status: 'active',
        created: new Date(item.created_at).toISOString(),
        updated: new Date().toISOString(),
        owner: 'Scout Crawler',
        description: body.slice(0, 1000) + (body.length > 1000 ? '...' : ''),
        problem: 'Open source project bounty program offering rewards for resolving issues.',
        solution: 'Review, implement a pull-request fix, and claim the specified bounty.',
        target_user: 'OSS Repository Maintainers and Contributors',
        workaround: 'Waiting for unpaid contributors to fix critical bugs.',
        monetization: 'Bounty rewards paid upon PR merger.',
        mvp: 'Fork repository, write unit test and fix, submit merge request.',
        riskScore: scamResult.riskScore,
        trustScore: Math.max(30, 100 - scamResult.riskScore * 10),
        estimatedHours: 8,
        source: 'GitHub Bounties',
        url: link,
        location: 'Remote',
        skills: ['Programming', 'TypeScript', 'Debugging'],
        incomeEstimate: { min: 100, max: 1000, currency: 'USD' },
        scores: {
          iqi: {
            pain_intensity: 6,
            willingness_to_pay: 7,
            validation_speed: 9,
            reachability: 8,
            switching_friction: 3,
            competition: 3,
            ttfd_score: 8,
            total_iqi: 75
          },
          killer: {
            demand_risk: 'Low Risk',
            budget_risk: 'Medium Risk',
            access_risk: 'Low Risk',
            competition_risk: 'Low Risk',
            complexity_risk: 'Medium Risk',
            ttfd_risk: 'Low Risk',
            overall_risk: 'Low Risk',
            risk_penalty: scamResult.riskScore
          },
          ttfd: {
            pay_this_month: true,
            rapid_mvp_days: 7,
            data_available: true,
            interviews_immediate: true,
            speed_bonus: 5
          },
          priority_score: 78,
          oppy_score_v1: 78
        },
        validation: {
          interviews: 0,
          positive_interviews: 0,
          negative_interviews: 0,
          landing_visits: 0,
          signup_rate: 0,
          demo_requests: 0,
          preorders: 0,
          revenue: 0,
          evidence_score: 20,
          evidence_weight_percent: 20
        },
          artifacts: {},
          decision: {
            recommended_action: 'Investigate Fast',
            reason: 'Sourced from GitHub Bounties issue list.'
          },
          experiments: []
      });
    }
  } catch (err) {
    console.error('crawlGitHubBounty failed:', err);
  }
  return opportunities;
}

// -------------------------------------------------------------
// Combined Sourcing Runner (with Deduplication)
// -------------------------------------------------------------

export async function runScoutFleet(existingOpps: Opportunity[], profile?: any): Promise<Opportunity[]> {
  console.log('[SCOUT FLEET] Dispatched Reddit, HackerNews, and GitHub crawlers...');
  
  const [reddit, hn, github] = await Promise.all([
    crawlReddit().catch(() => []),
    crawlHackerNews().catch(() => []),
    crawlGitHubBounty().catch(() => [])
  ]);

  const allCrawled = [...reddit, ...hn, ...github];
  const newOpps: Opportunity[] = [];

  for (const item of allCrawled) {
    // 1. Scam Check Filter
    if (item.riskScore && item.riskScore >= 7) {
      console.log(`[SCOUT FLEET] Filtered scam opportunity: "${item.name}" (Score: ${item.riskScore})`);
      continue;
    }

    // 2. Levenshtein Deduplication Filter
    const duplicate = findDuplicate([...existingOpps, ...newOpps], item);
    if (duplicate) {
      console.log(`[SCOUT FLEET] Deduplicated opportunity: "${item.name}" (matches "${duplicate.name}")`);
      continue;
    }

    // 3. Compute dynamic fit score
    if (profile) {
      item.matchScore = computeMatchScore(item, profile);
    }

    newOpps.push(item);
  }

  console.log(`[SCOUT FLEET] Successfully sourced and filtered ${newOpps.length} opportunities!`);
  return newOpps;
}

// -------------------------------------------------------------
// Scheduler Init
// -------------------------------------------------------------

export function startCrawlerScheduler(getPortfolio: () => Opportunity[], saveCallback: (opps: Opportunity[]) => void, profileGetter: () => any) {
  // Reddit: high-priority, run every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    console.log('[SCHEDULER] Running scheduled Reddit crawl...');
    try {
      const existing = getPortfolio();
      const redditOpps = await crawlReddit();
      const newOpps: Opportunity[] = [];
      for (const item of redditOpps) {
        if (item.riskScore && item.riskScore >= 7) continue;
        if (findDuplicate([...existing, ...newOpps], item)) continue;
        if (profileGetter()) {
          item.matchScore = computeMatchScore(item, profileGetter());
        }
        newOpps.push(item);
      }
      if (newOpps.length > 0) {
        saveCallback([...newOpps, ...existing]);
        console.log(`[SCHEDULER] Committed ${newOpps.length} new Reddit opportunities.`);
      }
    } catch (err) {
      console.error('[SCHEDULER] Scheduled Reddit crawl error:', err);
    }
  });

  // HackerNews & GitHub: low-priority, run once a day
  cron.schedule('0 0 * * *', async () => {
    console.log('[SCHEDULER] Running scheduled daily HackerNews & GitHub crawls...');
    try {
      const existing = getPortfolio();
      const hnOpps = await crawlHackerNews();
      const ghOpps = await crawlGitHubBounty();
      const allNew = [...hnOpps, ...ghOpps];
      const newOpps: Opportunity[] = [];
      for (const item of allNew) {
        if (item.riskScore && item.riskScore >= 7) continue;
        if (findDuplicate([...existing, ...newOpps], item)) continue;
        if (profileGetter()) {
          item.matchScore = computeMatchScore(item, profileGetter());
        }
        newOpps.push(item);
      }
      if (newOpps.length > 0) {
        saveCallback([...newOpps, ...existing]);
        console.log(`[SCHEDULER] Committed ${newOpps.length} new daily HN/GH opportunities.`);
      }
    } catch (err) {
      console.error('[SCHEDULER] Scheduled daily crawls error:', err);
    }
  });

  // Daily Digest Email: Runs at 8:00 AM daily
  cron.schedule('0 8 * * *', () => {
    console.log('[SCHEDULER] Compiling Daily Digest Email brief...');
    try {
      const existing = getPortfolio();
      const profile = profileGetter();
      if (!profile) return;

      // Filter active matching opportunities and sort by matchScore desc
      const matches = existing
        .filter(p => p.stage === 'active' || p.stage === 'sandbox')
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 5);

      const emailSubject = `Oppy OS: Your Top 5 Venture Matches for Today`;
      const emailHeader = `
============================================================
Daily Venture Briefing - ${new Date().toLocaleDateString()}
Target Goal: ${profile.incomeGoal ? `$${profile.incomeGoal}/mo` : 'Not Set'}
============================================================
Hello, Founder!

Here is your customized morning digest of high-probability ventures matching your expert skillset (${(profile.skills || []).join(', ')}).

`;
      const emailBody = matches.length > 0 
        ? matches.map((opp, idx) => `
[#${idx + 1}] ${opp.name} (${opp.matchScore || 0}% Match)
Tagline: ${opp.tagline}
Category: ${opp.category}
Est. Income: ${opp.incomeEstimate ? `$${opp.incomeEstimate.min}-${opp.incomeEstimate.max}/mo` : opp.monetization || 'N/A'}
Risk Profile: ${opp.scores?.killer?.overall_risk || 'Low Risk'}
Action Trigger: ${opp.decision?.recommended_action || 'Review Signal'}
Reason: ${opp.decision?.reason || 'Aligned with preferences.'}
Link: http://localhost:3000/#opp-${opp.id}
------------------------------------------------------------`
        ).join('\n')
        : '\nNo outstanding matching opportunities found matching your profile thresholds today.\n';

      const emailFooter = `
============================================================
Build your MVP. Collect real evidence. Conquer the niche.
Oppy Founder OS Intelligence Engine.
============================================================
`;
      console.log(`\n--- [SMTP SIMULATOR] OUTGOING EMAIL DISPATCHED ---`);
      console.log(`To: benneberg@gmail.com`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`${emailHeader}${emailBody}${emailFooter}`);
      console.log(`--- [SMTP SIMULATOR] DISPATCH COMPLETED SUCCESSFULLY ---\n`);
    } catch (err) {
      console.error('[SCHEDULER] Failed to compile daily digest:', err);
    }
  });

  console.log('[SCHEDULER] Background crawler schedule armed successfully.');
}
