// Mock Firebase for tests
import { vi } from 'vitest';

// Mock Firebase Admin
vi.mock('firebase-admin', () => ({
  default: {
    apps: [],
    initializeApp: vi.fn(),
    credential: {
      cert: vi.fn(),
    },
    firestore: vi.fn(() => ({
      collection: vi.fn(() => ({
        add: vi.fn(),
        doc: vi.fn(() => ({
          get: vi.fn(),
          set: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
        })),
        where: vi.fn(() => ({
          get: vi.fn(),
        })),
        orderBy: vi.fn(() => ({
          get: vi.fn(),
        })),
        limit: vi.fn(() => ({
          get: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock GCP credentials
vi.mock('../config/gcp-credentials.js', () => ({
  getGoogleCredentials: vi.fn(() => null),
}));

// Mock cloud storage
vi.mock('../services/cloudStorage.js', () => ({
  default: {
    uploadToGCS: vi.fn(),
    deleteFromGCS: vi.fn(),
  },
}));
