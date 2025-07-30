# Netlify Environment Variable Update Guide

## Step 1: Install Netlify CLI (if not already installed)

```bash
npm install -g netlify-cli
netlify login
netlify link
```

## Step 2: Remove Large/Duplicate Variables

Run these commands in your terminal:

```bash
netlify env:unset GCP_SERVICE_ACCOUNT_JSON_BASE64
netlify env:unset API_URL
netlify env:unset BASE_URL
netlify env:unset GOOGLE_APPLICATION_CREDENTIALS
netlify env:unset ADMIN_SECRET_KEY
```

## Step 3: Add Optimized Variables

⚠️ **IMPORTANT**: Replace the placeholder values with your actual credentials

```bash
netlify env:set GCP_PROJECT_ID "your-gcp-project-id"
netlify env:set GCP_PRIVATE_KEY "your-gcp-private-key"
netlify env:set GCP_CLIENT_EMAIL "your-gcp-service-account-email"
netlify env:set SENTRY_DSN "your-sentry-dsn-url"
```

## Step 4: Verify Environment Variables

```bash
netlify env:list
```

You should see these variables and their sizes should be much smaller:

- ✅ ADMIN_KEY
- ✅ GCS_BUCKET_NAME
- ✅ GCP_PROJECT_ID (new)
- ✅ GCP_PRIVATE_KEY (new)
- ✅ GCP_CLIENT_EMAIL (new)
- ✅ NODE_ENV
- ✅ REACT_APP_API_URL
- ✅ REACT_APP_BASE_URL
- ✅ SENTRY_DSN (new)
- ✅ SENTRY_AUTH_TOKEN
- ✅ SENTRY_ENVIRONMENT
- ✅ SESSION_SECRET

## Alternative: Manual Update via Netlify Dashboard

1. Go to https://app.netlify.com/sites/[your-site]/settings/env
2. Delete the large variables listed in Step 2
3. Add the new optimized variables from Step 3

## Where to Find Your Credential Values

If you have your original GCP service account JSON file, extract these values:

- `GCP_PROJECT_ID` = `project_id` field
- `GCP_PRIVATE_KEY` = `private_key` field
- `GCP_CLIENT_EMAIL` = `client_email` field
- `SENTRY_DSN` = Your Sentry project DSN URL

## Step 5: Redeploy

```bash
netlify deploy --prod
```

This should reduce your environment variables from ~4KB to under 1KB and resolve the AWS Lambda limit error.
