#!/bin/bash
# Netlify Environment Variable Update Script
# Run this with: netlify env:set KEY VALUE

echo "🔧 Removing large/duplicate environment variables..."

# Remove the large base64 variable (main culprit)
netlify env:unset GCP_SERVICE_ACCOUNT_JSON_BASE64

# Remove duplicate variables
netlify env:unset API_URL
netlify env:unset BASE_URL
netlify env:unset GOOGLE_APPLICATION_CREDENTIALS

# Optional: Remove if not used
netlify env:unset ADMIN_SECRET_KEY

echo "✅ Removed large environment variables"
echo ""
echo "📝 Now you need to add these optimized variables:"
echo ""
echo "netlify env:set GCP_PROJECT_ID 'your-gcp-project-id'"
echo "netlify env:set GCP_PRIVATE_KEY 'your-gcp-private-key'"
echo "netlify env:set GCP_CLIENT_EMAIL 'your-gcp-service-account-email'"
echo "netlify env:set SENTRY_DSN 'your-sentry-dsn-url'"
echo ""
echo "🎯 Replace the placeholder values above with your actual credentials"
echo "💡 Get these values from your original GCP service account JSON file"
