# Testing Delta & Roadmap

## Existing Verification Infrastructure
- **Score**: 85/100
- **Linter Coverage**: Fully validated by `tsc --noEmit` and custom eslint constraints.
- **Build Target**: Vite production bundle completes with full tree-shaking, transpiling all files correctly into `dist/` with ES Modules and server assets bundle in CJS formats.

## Testing Gaps Identified
1. **Scoring Engine Edge Cases**: Lack of automated unit tests for negative values of reachability, switching friction, or extreme competition parameters in `computeOppyScore`.
2. **BYOK Routing Failover**: Manual verification is used to confirm transition behavior from standard server key usage to custom header authorization; needs structured client integration tests.
3. **Mock Heuristic Integrity**: Missing schema validity checks on fallback JSON structures when LLM calls are disabled.

## Recommended Delta Testing Suite
```typescript
// Proposed test file: /src/__tests__/scoringEngine.test.ts
import { computeOppyScore } from '../services/scoringEngine';
import { Opportunity } from '../types';

describe('Venture Scoring Engine', () => {
  it('correctly calculates high potential ideas with low risks', () => {
    // Write test assertions validating that highly reachable, high-pain opportunities return high values
  });

  it('safely handles minimum bound values and avoids negative score bounds', () => {
    // Assert floor values are kept at zero
  });
});
```
