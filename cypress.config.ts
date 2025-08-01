import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'm7s6t6',
  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      // Register logA11yViolations task for a11y debugging
      on('task', {
        logA11yViolations(violations) {
          if (Array.isArray(violations)) {
            violations.forEach((v) => {
              // Print summary and nodes

              console.log(
                `A11Y Violation: ${v.id} - ${v.help}\nImpact: ${v.impact}\nDescription: ${v.description}\nHelp: ${v.helpUrl}`
              );
              v.nodes.forEach(
                (
                  node: { html: string; target: string[]; failureSummary?: string },
                  idx: number
                ) => {
                  console.log(`  Node ${idx + 1}:`, node);
                }
              );
            });
          }
          return null;
        },
      });
      return config;
    },
  },
});
