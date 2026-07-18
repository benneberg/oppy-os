/**
 * Service to generate highly tailored, high-conversion, non-sales outreach materials.
 * Focused on seeking feedback and scheduling 10-minute customer interviews.
 */

export interface OutreachPayload {
  name: string;
  problem: string;
  workaround: string;
  target_user: string;
  tagline: string;
}

export function generateLinkedInOutreach(opp: OutreachPayload): string[] {
  return [
    `Hi [First Name], saw you lead teams as ${opp.target_user}. We're conducting peer research on how operations divisions are handling the friction of ${opp.problem}. Open to a 10-minute benchmarking review next week? No sales pitch whatsoever. Best, [My Name]`,
    `Hi [First Name], quick question for you: how is your team handling ${opp.workaround} right now to avoid ${opp.problem}? We are building a lightweight tool to automate this and are seeking feedback from active practitioners. Best, [My Name]`
  ];
}

export function generateColdEmail(opp: OutreachPayload): string {
  return `Subject: Quick question re: peer benchmarking for ${opp.problem}

Hi [First Name],

I noticed you manage operations as ${opp.target_user}.

Many leaders in your sector mention that managing ${opp.problem} is a major operational bottleneck, often forcing teams to rely on costly manual workarounds like ${opp.workaround}.

We're testing a lightweight digital intervention called **${opp.name}** to automate this workflow: ${opp.tagline}.

Would you be open to a brief 10-minute feedback call next Tuesday? I'd be glad to share the benchmarks we've gathered from other operations teams so far.

Best regards,

[My Name]
Founder, ${opp.name}`;
}
