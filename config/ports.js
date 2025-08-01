/**
 * Port Configuration for Wedding Website
 *
 * This file defines all ports used by the wedding website to avoid conflicts
 * with MCP servers and other services running on the system.
 *
 * MCP Servers typically use:
 * - 8080: MCP Filesystem/Git Server
 * - 27017: MongoDB
 * - Various other ports for different MCP services
 *
 * Wedding Website Port Allocation:
 */

export const PORTS = {
  // Frontend (Next.js)
  FRONTEND: 3005,

  // Backend (Express API)
  BACKEND: 3002,

  // Firebase Emulator
  FIRESTORE_EMULATOR: 8082,
  FIREBASE_UI: 4001,

  // Development Tools
  STORYBOOK: 6006,

  // Reserved for future use
  WEBHOOK_HANDLER: 3003,
  TESTING_SERVER: 3004,
};

export const HOSTS = {
  LOCAL: 'localhost',
  NETWORK: '0.0.0.0', // Allow network access if needed
};

export const CORS_ORIGINS = [
  `http://${HOSTS.LOCAL}:${PORTS.FRONTEND}`,
  `http://${HOSTS.LOCAL}:3000`, // Fallback for default Next.js port
  `http://${HOSTS.LOCAL}:${PORTS.STORYBOOK}`, // For Storybook integration
  'https://www.theporadas.com',
  'https://theporadas.com',
];

/**
 * Get the API base URL based on environment
 */
export function getApiBaseUrl() {
  return `http://${HOSTS.LOCAL}:${PORTS.BACKEND}/api`;
}

/**
 * Get Firebase emulator connection string
 */
export function getFirestoreEmulatorHost() {
  return `127.0.0.1:${PORTS.FIRESTORE_EMULATOR}`;
}

export default PORTS;
