import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  entry: './backend/app.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '.netlify/functions'),
    filename: 'api.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    // Exclude node_modules from bundle
    express: 'express',
    // mongoose removed
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
};

export default config;
