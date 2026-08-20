import type { TestRunnerConfig } from '@storybook/test-runner'
import { checkA11y, injectAxe } from 'axe-playwright'

// Runs against a built Storybook (see package.json's `test:a11y` script and the
// accessibility CI workflow) — separate from the Vitest-based interaction tests,
// which exercise components directly rather than the static build output.
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
    // Only fail CI on violations serious enough to block a release; moderate/minor
    // issues are still reported in the run output but don't gate the pipeline.
    await checkA11y(page, '#storybook-root', {
      includedImpacts: ['serious', 'critical'],
      detailedReport: true
    })
  }
}

export default config
