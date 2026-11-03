import { defineConfig } from 'vitest/config'

// Running `vitest` from the repo root delegates to each workspace's own config
// (aliases, setup files, environment)
export default defineConfig({
  test: {
    projects: ['frontend', 'backend'],
  },
})
