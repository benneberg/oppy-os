import { Opportunity } from '../types';

/**
 * Service to generate canonical customer discovery assets.
 * Contains both baseline heuristic templates and AI prompt constructors.
 */

export function generateCanonical8Questions(opp: { name: string; problem: string; workaround: string; monetization: string; target_user: string }): string {
  return `### Canonical 8 Diagnostic Customer Interview Questions
Designed for: **${opp.target_user}** regarding **${opp.name}**

1. **How do you currently handle ${opp.problem} in your day-to-day operations?**
   *Why: Establishes a baseline and verifies that the pain is active.*

2. **What is the most frustrating part about using ${opp.workaround || 'your current solution'} today?**
   *Why: Searches for friction points and emotional triggers.*

3. **What does this friction cost your department monthly in terms of time, efficiency, or direct cash?**
   *Why: Quantifies the economic pain to determine pricing ceiling.*

4. **What happens if you do nothing and keep using ${opp.workaround || 'the current workaround'} for the next 12 months?**
   *Why: Tests the urgency. If "nothing happens," there is no active budget.*

5. **Who else in your company experiences this problem, and who owns the budget to solve it?**
   *Why: Uncovers the true economic buyer and procurement obstacles.*

6. **Have you actively spent money or resources trying to build or buy a solution for this in the past?**
   *Why: Past spending behavior is the only reliable indicator of future WTP.*

7. **If you could wave a magic wand, what does the perfect workflow look like for this process?**
   *Why: Lets the buyer describe the solution without bias toward your product.*

8. **Would your department approve a budget of ${opp.monetization || '$300/mo'} if we could guarantee the elimination of this friction?**
   *Why: The direct Willingness-to-Pay validation gate.*`;
}

export function generateLandingPageTemplate(opp: { name: string; tagline: string; problem: string; solution: string; target_user: string; workaround: string; monetization: string }): string {
  return `# LANDING PAGE TEMPLATE: ${opp.name}
*Value Proposition: ${opp.tagline}*

---

## [Header Section]
### Stop suffering through ${opp.workaround}.
${opp.tagline} designed specifically for **${opp.target_user}**.

[Get Early Access / Pre-Order Now]

---

## [The Core Friction]
Are you tired of dealing with **${opp.problem}**?
Most ${opp.target_user}s are forced to use slow workarounds like **${opp.workaround}**. This wastes hours, frustrates teams, and drains operational budgets.

---

## [The Intelligent Intervention]
Introducing **${opp.name}**—the evidence-first solution.
We automate and streamline this process by delivering:
- **Instant Resolution**: ${opp.solution}
- **Seamless Integration**: Plugs directly into your existing operations with zero switching friction.
- **Immediate ROI**: Eliminates manual bottlenecks on day one.

---

## [Pricing & Transparency]
Simple, predictable pricing built for ROI.
- **Founder Special**: **${opp.monetization}** with a 30-day money-back validation guarantee.
- No set-up fees. No hidden consulting retainers.

[Pre-Order Now - Lock In Early Access]`;
}
