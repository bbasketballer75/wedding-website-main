import fs from 'fs';
import path from 'path';

/**
 * Helper to decode base64-encoded Google Cloud service account credentials
 * from environment variables for production deployment.
 * Falls back to local file for development.
 */

/**
 * Get Google Cloud credentials from environment variables.
 * In development: reads from local JSON file
 * In production: decodes from base64 environment variable
 */
export function getGoogleCredentials() {
  // Try both possible local paths for tests and dev
  const possiblePaths = [
    path.join(process.cwd(), 'backend', 'config', 'gcs-key.json'),
    path.join(process.cwd(), 'config', 'gcs-key.json'),
  ];
  for (const credPath of possiblePaths) {
    try {
      if (fs.existsSync(credPath)) {
        const credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
        // Check if this is a dummy/placeholder file
        if (credentials.private_key && credentials.private_key.includes('DUMMY')) {
          console.warn(
            `Found service account file at ${credPath}, but it contains placeholder credentials`
          );
          continue; // Try next path or fall back to env var
        }
        return credentials;
      }
    } catch (error) {
      console.warn(`Failed to read credentials from ${credPath}:`, error.message);
      // continue to next path
    }
  }
  // If not found, fallback to env var (for CI/CD or production)
  if (process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64) {
    try {
      const decoded = Buffer.from(process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString(
        'utf8'
      );
      const credentials = JSON.parse(decoded);
      // Validate decoded credentials too
      if (credentials.private_key && credentials.private_key.includes('DUMMY')) {
        throw new Error('Environment variable contains placeholder credentials');
      }
      return credentials;
    } catch (err) {
      console.error('Failed to decode GCP service account from base64:', err);
      throw new Error('Invalid GCP service account credentials');
    }
  }
  console.error('Could not load valid GCS credentials from any known path.');
  throw new Error('No valid Google Cloud credentials found');
}

/**
 * Initialize Google Cloud credentials for firebase-admin
 * @param {Object} admin - Firebase admin instance
 */
export function initializeGoogleCloudCredentials(admin) {
  if (admin.apps.length > 0) {
    return; // Already initialized
  }

  const credentials = getGoogleCredentials();

  const config = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'wedding-website-final',
  };

  // If we have decoded credentials, use them
  if (credentials) {
    config.credential = admin.credential.cert(credentials);
  } else {
    // In development, use the service account file path
    const serviceAccountPath = path.join(process.cwd(), 'config', 'gcp-service-account.json');
    config.credential = admin.credential.cert(serviceAccountPath);
  }

  admin.initializeApp(config);
  console.log('Firebase Admin initialized successfully');
}
