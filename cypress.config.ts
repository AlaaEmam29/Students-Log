import { defineConfig } from 'cypress'
import pkg from 'cy-verify-downloads'

const { verifyDownloadTasks } = pkg

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('task', {
        verifyDownloadTasks
      })
    }
  }
})
