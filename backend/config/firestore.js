import admin from 'firebase-admin';
import { getGoogleCredentials } from './gcp-credentials.js';

let dbPromise = (async () => {
  if (!admin.apps.length) {
    try {
      // Check if we should use Firebase emulator for development
      if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
        console.log('Using Firestore Emulator at:', process.env.FIRESTORE_EMULATOR_HOST);
        admin.initializeApp({
          projectId: 'wedding-website-final',
        });
        console.log('Firebase Admin initialized with emulator');
      } else {
        // Try to get real credentials
        let credentials;
        try {
          credentials = getGoogleCredentials();
        } catch (credError) {
          console.error('Failed to load Google Cloud credentials:', credError.message);
          if (process.env.NODE_ENV === 'development') {
            console.log('💡 For local development, you can:');
            console.log(
              '   1. Set up Firebase emulator: npm install -g firebase-tools && firebase emulators:start --only firestore'
            );
            console.log('   2. Set FIRESTORE_EMULATOR_HOST=localhost:8080 environment variable');
            console.log(
              '   3. Or provide valid service account credentials in backend/config/gcs-key.json'
            );
            throw new Error(
              'No valid Firebase credentials for development. See suggestions above.'
            );
          }
          throw credError;
        }

        const config = {
          projectId: 'wedding-website-final',
        };

        if (credentials) {
          // Validate that the credentials have a proper private key
          if (!credentials.private_key || credentials.private_key.includes('DUMMY')) {
            throw new Error(
              'Invalid service account credentials: private_key appears to be a placeholder'
            );
          }
          config.credential = admin.credential.cert(credentials);
        } else {
          throw new Error('No Google Cloud credentials available');
        }

        admin.initializeApp(config);
        console.log('Firebase Admin initialized successfully with service account');
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return admin.firestore();
})();

export default dbPromise;
