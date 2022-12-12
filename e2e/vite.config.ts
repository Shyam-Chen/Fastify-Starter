import type { PlaywrightTestConfig } from '@playwright/test';

export default {
  use: {
    baseURL: 'http://localhost:8000',
  },
} as PlaywrightTestConfig;
