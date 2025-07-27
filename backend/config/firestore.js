import admin from 'firebase-admin';
import { getGoogleCredentials } from './gcp-credentials.js';

if (!admin.apps.length) {
  try {
    const credentials = getGoogleCredentials();

    const config = {
      projectId: 'wedding-website-final',
    };

    // In development, use local file path
    if (process.env.NODE_ENV === 'development' && !credentials) {
      const path = await import('path');
      const serviceAccountPath = path.join(process.cwd(), 'backend', 'config', 'gcs-key.json');
      config.credential = admin.credential.cert(serviceAccountPath);
    } else if (credentials) {
      // Use decoded credentials from environment
      config.credential = admin.credential.cert(credentials);
    } else {
      throw new Error('No Google Cloud credentials available');
    }

    admin.initializeApp(config);
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();
export default db;
