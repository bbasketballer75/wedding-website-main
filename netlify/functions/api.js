import serverless from 'serverless-http';
import app from '../../backend/app.js';

// Create serverless handler from Express app
const handler = serverless(app);

export { handler };
