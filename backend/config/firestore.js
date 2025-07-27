const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'gcp-service-account.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: 'wedding-website-final',
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();
module.exports = db;
