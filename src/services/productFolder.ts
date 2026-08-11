import JSZip from 'jszip';
import { Opportunity } from '../types';

export function generateProductFolderFiles(opp: Opportunity): Record<string, string> {
  const folderName = opp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'venture-folder';

  const readmeMd = `# Venture Executive Summary: ${opp.name}

> **Tagline**: ${opp.tagline || 'No tagline set'}
> **Category**: ${opp.category} | **Stage**: ${opp.stage.toUpperCase()} | **Priority Score**: ★ ${opp.scores.priority_score}/100
> **Target Buyer**: ${opp.target_user || 'To be specified'}

---

## Executive Overview
${opp.description || opp.problem || 'No overview provided.'}

## Problem & Current Friction
**Problem Statement**: ${opp.problem || 'N/A'}
**Current Workaround**: ${opp.workaround || 'N/A'}

## Proposed Solution & MVP
**Solution**: ${opp.solution || 'N/A'}
**Rapid MVP Plan**: ${opp.mvp || 'N/A'}

## Business Model & Economics
- **Monetization Strategy**: ${opp.monetization || 'N/A'}
- **IQI Potential Index**: ${opp.scores.iqi.total_iqi}/100
- **Risk Level**: ${opp.scores.killer.overall_risk}

## Current Validation Progress
- **Interviews Conducted**: ${opp.validation.interviews} (${opp.validation.positive_interviews} positive, ${opp.validation.negative_interviews} negative)
- **Booked Cash Revenue**: $${opp.validation.revenue}
- **Preorders / Demo Requests**: ${opp.validation.preorders} preorders, ${opp.validation.demo_requests} demo requests
- **Empirical Evidence Weight**: ${opp.validation.evidence_weight_percent ?? 0}%
- **Logged Experiments**: ${opp.experiments.length}
`;

  const opportunityJson = JSON.stringify(opp, null, 2);

  const landingPageMd = opp.artifacts?.landing_page_md || `# ${opp.name} Landing Page Copy

## Hero Headline
# ${opp.tagline || opp.name}
### The primary automation solution for ${opp.target_user}.

> Stop relying on: ${opp.workaround || 'manual workarounds'}

[ Get Early Access ] [ Schedule Demo ]

## Problem Statement
${opp.problem}

## Solution & Key Benefits
${opp.solution}

- **Speed to Value**: Deploy in days, not months.
- **ROI**: Eliminate manual errors and cut friction.
- **Built for**: ${opp.target_user}.
`;

  const interviewGuideMd = opp.artifacts?.interview_guide_md || `# Canonical Discovery Interview Guide: ${opp.name}

Target Economic Buyer: ${opp.target_user}

## Core 8 Discovery Questions
1. How do you solve "${opp.problem}" today?
2. What frustrates you most about your current workaround (${opp.workaround})?
3. How much time or money does this problem cost your organization each month?
4. What happens if this problem remains unsolved for the next 6 months?
5. If a solution like "${opp.solution}" existed today, who would need to approve purchasing it?
6. What is the maximum monthly price you would pay to make this problem disappear immediately?
7. Have you tried any existing tools or competitors to fix this? What was missing?
8. If we built an MVP addressing this in 14 days, would you be willing to test it on a 30-day pilot?
`;

  const linkedinMsgs = opp.artifacts?.linkedin_outreach && opp.artifacts.linkedin_outreach.length > 0
    ? opp.artifacts.linkedin_outreach.map((m, i) => `### Option ${i + 1}\n${m}`).join('\n\n')
    : `### Option 1\nHi [Name], saw your work in ${opp.category}. We are building a quick solution for ${opp.target_user} to fix ${opp.problem.slice(0, 80)}... Would love 10 mins to compare notes!`;

  const coldEmail = opp.artifacts?.cold_email || `Subject: Quick question re: ${opp.problem.slice(0, 40)}

Hi [First Name],

I noticed you manage operations for ${opp.target_user}. Many teams we speak with struggle with ${opp.workaround}.

We developed ${opp.name} to help:
- ${opp.solution}

Would you be open to a 10-minute discovery call this Thursday?

Best regards,
[Your Name]
Founder, ${opp.name}`;

  const redditPost = opp.artifacts?.reddit_post || `Title: How are other ${opp.target_user} handling ${opp.problem.slice(0, 50)}?

Hey everyone,

Curious how you currently tackle ${opp.workaround}. We've been looking into automating this and wanted to hear what tools or workflows you use today?`;

  const outreachMd = `# Outreach Sequences & Templates: ${opp.name}

## 1. LinkedIn Direct Message Templates
${linkedinMsgs}

---

## 2. Cold Email Campaign
${coldEmail}

---

## 3. Community / Reddit Post Draft
${redditPost}
`;

  const experimentsMd = `# Experiments Log & Lifecycle Decisions (${opp.name})

| Date | Hypothesis | Experiment | Result | Decision | Next Action |
| --- | --- | --- | --- | --- | --- |
${opp.experiments.length > 0
  ? opp.experiments.map(e => `| ${e.date} | ${e.hypothesis.replace(/\|/g, '-')} | ${e.experiment.replace(/\|/g, '-')} | ${e.result.replace(/\|/g, '-')} | **${e.decision}** | ${e.next_action.replace(/\|/g, '-')} |`).join('\n')
  : '| ' + new Date().toISOString().slice(0, 10) + ' | Initial venture discovery | Pipeline creation | Auto-registered in Sandbox stage | **Continue** | Schedule 5 discovery interviews |'
}
`;

  const validationSummaryMd = `# Validation Evidence Summary: ${opp.name}

- **Current Lifecycle Stage**: \`${opp.stage.toUpperCase()}\`
- **OppyScore / Priority Rank**: ★ ${opp.scores.priority_score}/100
- **Empirical Evidence Score**: +${opp.validation.evidence_score}
- **Evidence vs Heuristic Weight**: ${opp.validation.evidence_weight_percent ?? 0}%
- **Total Interviews Logged**: ${opp.validation.interviews}
  - Positive Feedback: ${opp.validation.positive_interviews}
  - Negative Rejections: ${opp.validation.negative_interviews}
- **Landing Page Traffic**: ${opp.validation.landing_visits} visits
- **Preorders Confirmed**: ${opp.validation.preorders}
- **Demo Requests**: ${opp.validation.demo_requests}
- **Booked Revenue**: $${opp.validation.revenue} USD
- **Decision Recommendation**: **${opp.decision?.recommended_action || 'Collect Evidence'}** (${opp.decision?.reason || 'Gather real customer data.'})
`;

  return {
    [`${folderName}/README.md`]: readmeMd,
    [`${folderName}/opportunity.json`]: opportunityJson,
    [`${folderName}/landing_page.md`]: landingPageMd,
    [`${folderName}/interview_guide.md`]: interviewGuideMd,
    [`${folderName}/outreach.md`]: outreachMd,
    [`${folderName}/experiments.md`]: experimentsMd,
    [`${folderName}/validation_summary.md`]: validationSummaryMd
  };
}

export async function downloadProductFolderZip(opp: Opportunity): Promise<void> {
  const zip = new JSZip();
  const files = generateProductFolderFiles(opp);

  for (const [filePath, content] of Object.entries(files)) {
    zip.file(filePath, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const folderName = opp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'venture';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}-product-folder.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
