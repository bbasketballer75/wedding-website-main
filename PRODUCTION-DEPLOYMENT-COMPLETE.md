# 🚀 Production Deployment Guide

## Complete Production Setup for Austin & Jordyn's Wedding Website

This guide covers the full deployment of your wedding website with all production features enabled:

### ✅ **Features Implemented**

1. **🔐 Enhanced Firestore Configuration** - Production-ready database with retry logic and connection pooling
2. **🤖 Real AI Services Integration** - OpenAI + Google AI for content moderation, caption generation, and smart search
3. **⚡ Real-time WebSocket Updates** - Live activity feeds and instant notifications
4. **🚀 Performance Optimization** - Multi-tier caching, compression, and rate limiting
5. **📊 Monitoring & Health Checks** - Comprehensive service monitoring and error tracking

---

## 📋 **Pre-Deployment Checklist**

### 1. **Environment Configuration**

Copy `.env.production.example` to `.env` and configure:

```bash
cp .env.production.example .env
```

**Required Configuration:**

- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_CLIENT_EMAIL` - Service account email
- `GCP_PRIVATE_KEY` - Service account private key
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `ADMIN_KEY` - Secure admin access key
- `SENTRY_DSN` - Error monitoring (optional but recommended)

### 2. **Google Cloud Platform Setup**

1. **Create a GCP Project:**

   ```bash
   gcloud projects create your-wedding-project-id
   gcloud config set project your-wedding-project-id
   ```

2. **Enable Required APIs:**

   ```bash
   gcloud services enable firestore.googleapis.com
   gcloud services enable storage.googleapis.com
   ```

3. **Create a Service Account:**

   ```bash
   gcloud iam service-accounts create wedding-website \
     --display-name="Wedding Website Service Account"
   ```

4. **Grant Permissions:**

   ```bash
   gcloud projects add-iam-policy-binding your-wedding-project-id \
     --member="serviceAccount:wedding-website@your-wedding-project-id.iam.gserviceaccount.com" \
     --role="roles/datastore.user"

   gcloud projects add-iam-policy-binding your-wedding-project-id \
     --member="serviceAccount:wedding-website@your-wedding-project-id.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

5. **Download Service Account Key:**

   ```bash
   gcloud iam service-accounts keys create service-account-key.json \
     --iam-account=wedding-website@your-wedding-project-id.iam.gserviceaccount.com
   ```

6. **Setup Firestore:**
   ```bash
   gcloud firestore databases create --location=us-central1
   ```

### 3. **AI Services Setup**

1. **OpenAI API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Add to your `.env` file as `OPENAI_API_KEY`

2. **Google AI (Optional):**
   - Visit https://makersuite.google.com/app/apikey
   - Create a Gemini API key
   - Add to your `.env` file as `GOOGLE_AI_API_KEY`

---

## 🚀 **Deployment Options**

### **Vercel Deployment (Current Setup) ✅**

Your project is currently configured for Vercel deployment with the following setup:

1. **Build Configuration (`vercel.json`):**

   ```json
   {
     "version": 2,
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "devCommand": "npm run dev",
     "regions": ["iad1"],
     "functions": {
       "api/*.js": {
         "runtime": "nodejs18.x"
       }
     },
     "redirects": [
       {
         "source": "/:path*",
         "destination": "https://www.theporadas.com/:path*",
         "has": [{ "type": "host", "value": "theporadas.com" }],
         "permanent": true,
         "statusCode": 301
       }
     ],
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/index"
       }
     ]
   }
   ```

2. **Deploy Commands:**

   ```bash
   # Production deployment
   npm run deploy:prod

   # Preview deployment
   npm run deploy:preview

   # Or use Vercel CLI directly
   vercel --prod
   ```

3. **Environment Variables:**
   Set all environment variables in Vercel dashboard:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add all variables from your `.env.production.example` file

### **Required Environment Variables for Vercel:**

```bash
# Google Cloud Platform
GCP_PROJECT_ID=your-wedding-project-id
GCP_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-key...\n-----END PRIVATE KEY-----\n"

# AI Services
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Security
ADMIN_KEY=your-secure-admin-key
SESSION_SECRET=your-session-secret

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://www.theporadas.com/api
```

### Option 2: **Netlify Deployment (Alternative)**

1. **Build Configuration (`netlify.toml`):**

   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
     functions = "backend"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/ws"
     to = "/.netlify/functions/websocket"
     status = 200

   [functions]
     node_bundler = "esbuild"
   ```

2. **Deploy:**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod
   ```

3. **Environment Variables:**
   Set all environment variables in Netlify dashboard under Site Settings > Environment Variables.

### Option 2: **Netlify Deployment (Alternative)**

1. **Build Configuration (`netlify.toml`):**

   ```toml
   [build]
     command = "npm run build"
     publish = "out"
     functions = "backend"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/ws"
     to = "/.netlify/functions/websocket"
     status = 200

   [functions]
     node_bundler = "esbuild"
   ```

2. **Deploy:**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod
   ```

3. **Environment Variables:**
   Set all environment variables in Netlify dashboard under Site Settings > Environment Variables.

### Option 3: **Self-Hosted with Docker**

1. **Create Dockerfile:**

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3002
   CMD ["node", "backend/server-production.js"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t wedding-website .
   docker run -d -p 3002:3002 --env-file .env wedding-website
   ```

---

## 🔧 **Post-Deployment Configuration**

### 1. **Vercel-Specific Setup**

1. **Domain Configuration:**
   - In Vercel dashboard, go to "Domains"
   - Add your custom domain: `theporadas.com` and `www.theporadas.com`
   - Vercel will automatically generate SSL certificates
   - DNS will be configured automatically

2. **Function Configuration:**
   - Monitor function logs in Vercel dashboard
   - Set up function timeout if needed (default is 10s for hobby plan)
   - Enable edge caching for better performance

3. **Performance Monitoring:**
   - Enable Vercel Analytics in project settings
   - Monitor Core Web Vitals
   - Set up deployment notifications

### 2. **Domain and SSL Setup**

1. **Custom Domain:**
   - Point your domain to your hosting provider
   - Set up DNS records (A/CNAME)

2. **SSL Certificate:**
   - Most hosting providers (Netlify/Vercel) provide automatic SSL
   - For self-hosted: Use Let's Encrypt

### 2. **Database Security Rules**

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Guestbook entries - read by all, write with validation
    match /guestbook_entries/{document} {
      allow read: if true;
      allow create: if isValidGuestbookEntry();
    }

    // Activities - read by all, write by authenticated users
    match /activities/{document} {
      allow read: if true;
      allow create: if isAuthenticated();
    }

    // Reactions - read by all, write with validation
    match /reactions/{document} {
      allow read: if true;
      allow create: if isValidReaction();
    }

    // Admin collections - admin only
    match /{path=**} {
      allow read, write: if isAdmin();
    }

    function isValidGuestbookEntry() {
      return request.auth != null ||
             (resource == null &&
              request.resource.data.keys().hasAll(['name', 'message']) &&
              request.resource.data.message.size() <= 500);
    }

    function isValidReaction() {
      return resource == null &&
             request.resource.data.keys().hasAll(['photoId', 'type']);
    }

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }
  }
}
```

### 3. **Monitoring Setup**

1. **Sentry Error Tracking:**
   - Create account at https://sentry.io
   - Create new project
   - Add DSN to environment variables

2. **Performance Monitoring:**
   - Enable Sentry performance monitoring
   - Set up custom alerts for errors/performance issues

3. **Health Check Monitoring:**
   - Use services like UptimeRobot or Pingdom
   - Monitor `/api/health` endpoint

---

## 🧪 **Testing Your Vercel Deployment**

### 1. **Health Checks**

```bash
# Basic health check
curl https://www.theporadas.com/api/health

# Detailed status
curl https://www.theporadas.com/api/status

# AI services
curl -X POST https://www.theporadas.com/api/ai/moderate \
  -H "Content-Type: application/json" \
  -d '{"content": "test message", "type": "guestbook"}'
```

### 2. **Vercel Function Testing**

```bash
# Test serverless function response time
curl -w "@curl-format.txt" https://www.theporadas.com/api/health

# Test with Vercel CLI (local testing)
vercel dev
# Then test local endpoints at http://localhost:3000/api/health
```

### 3. **WebSocket Testing**

Note: WebSockets may have limitations on Vercel. Consider using alternative real-time solutions:

```javascript
// For production, consider using Vercel's recommended WebSocket alternatives
// or deploy WebSocket server separately
const ws = new WebSocket('wss://your-websocket-service.com/ws');
ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: 'subscribe',
      channel: 'activities',
    })
  );
};
```

### 4. **Performance Testing**

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Performance analysis
curl -w "@curl-format.txt" -o /dev/null https://your-domain.com/
```

---

## 📊 **Monitoring and Maintenance**

### 1. **Daily Checks**

- Monitor error rates in Sentry
- Check server health status
- Review performance metrics
- Monitor cache hit rates

### 2. **Weekly Tasks**

- Review AI service usage and costs
- Check Firestore usage and billing
- Update security patches
- Review and clear old logs

### 3. **Monthly Tasks**

- Security audit and dependency updates
- Performance optimization review
- Backup verification
- Cost optimization review

---

## 🆘 **Troubleshooting Guide**

### Vercel-Specific Issues

1. **Serverless Function Timeout:**

   ```
   Error: Function execution timed out after 10.00 seconds
   ```

   **Solution:** Optimize database queries and enable caching in your API routes.

2. **Environment Variable Issues:**

   ```
   Error: Environment variable not found
   ```

   **Solution:**
   - Check Vercel dashboard environment variables
   - Ensure all variables from `.env.production.example` are set
   - Redeploy after adding new environment variables

3. **API Route Not Found:**

   ```
   Error: 404 - Page not found
   ```

   **Solution:**
   - Verify `vercel.json` rewrites configuration
   - Check that `/api/index.js` file exists and exports properly
   - Ensure backend routes are properly imported

4. **Build Failures:**

   ```
   Error: Build failed with exit code 1
   ```

   **Solution:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Next.js configuration is correct

### Common Issues and Solutions

1. **Firestore Connection Errors:**

   ```
   Error: No valid Google Cloud credentials found
   ```

   **Solution:** Verify service account key is properly formatted in environment variables. For Vercel, ensure the private key is properly escaped with newlines.

2. **AI Service Rate Limits:**

   ```
   Error: Rate limit exceeded
   ```

   **Solution:** Check API usage in OpenAI dashboard, upgrade plan if needed.

3. **WebSocket Connection Issues:**

   ```
   Error: WebSocket connection failed
   ```

   **Solution:** Ensure hosting provider supports WebSockets, check firewall settings.

4. **High Memory Usage:**
   ```
   Warning: High memory usage detected
   ```
   **Solution:** Check cache settings, restart server, monitor for memory leaks.

### Emergency Contacts

- **Technical Issues:** Check logs in hosting provider dashboard
- **Database Issues:** Google Cloud Console > Firestore
- **AI Service Issues:** OpenAI Status Page
- **Domain Issues:** DNS provider support

---

## 💰 **Cost Estimation**

### Monthly Costs (Estimated)

| Service                  | Cost Range  | Notes                        |
| ------------------------ | ----------- | ---------------------------- |
| Hosting (Netlify/Vercel) | $0-20       | Free tier usually sufficient |
| Google Firestore         | $0-10       | Pay per usage                |
| Google Cloud Storage     | $0-5        | Photo storage                |
| OpenAI API               | $5-50       | Depends on AI usage          |
| Domain Registration      | $10-15      | Annual cost                  |
| **Total Monthly**        | **$15-100** | Varies by traffic            |

### Cost Optimization Tips

1. **Use caching effectively** to reduce API calls
2. **Monitor AI usage** and set up billing alerts
3. **Optimize image sizes** to reduce storage costs
4. **Use free tiers** where available

---

## 🔒 **Security Best Practices**

### 1. **Environment Security**

- Never commit `.env` files to version control
- Use secure random strings for secrets
- Rotate API keys regularly
- Enable 2FA on all accounts

### 2. **API Security**

- Implement rate limiting (already configured)
- Use HTTPS everywhere
- Validate all inputs
- Monitor for suspicious activity

### 3. **Database Security**

- Configure proper Firestore rules
- Enable audit logging
- Regular backup verification
- Monitor access patterns

---

## 📞 **Support and Updates**

For technical support or questions about this deployment:

1. **Check the logs** in your hosting provider dashboard
2. **Review monitoring alerts** in Sentry
3. **Test individual services** using the health check endpoints
4. **Consult documentation** for specific services (OpenAI, Google Cloud, etc.)

**Remember:** This is a production-ready system with enterprise-level features. Take time to understand each component before making changes.

---

---

## ✅ **Vercel Deployment Checklist**

### Pre-Deployment Steps:

- [ ] **Vercel Configuration**: `vercel.json` is properly configured with serverless functions
- [ ] **Next.js Configuration**: `next.config.ts` has static export disabled for Vercel
- [ ] **API Functions**: `/api/index.js` exists and properly exports the Express app
- [ ] **Environment Variables**: All production env vars are set in Vercel dashboard
- [ ] **Domain Setup**: Custom domain is configured in Vercel dashboard
- [ ] **Build Test**: `npm run build` completes successfully locally

### Post-Deployment Steps:

- [ ] **Health Check**: Test `/api/health` endpoint
- [ ] **AI Services**: Test AI moderation endpoints
- [ ] **Database**: Verify Firestore connection
- [ ] **Performance**: Monitor function execution times
- [ ] **Analytics**: Enable Vercel Analytics
- [ ] **Monitoring**: Set up error tracking with Sentry

### Common Vercel Issues Fixed:

✅ **Next.js Static Export**: Removed `output: 'export'` for serverless functions  
✅ **API Routing**: Created `/api/index.js` for proper serverless function handling  
✅ **CORS Configuration**: Added proper CORS headers for Vercel environment  
✅ **Environment Variables**: Updated guide with Vercel-specific env var setup  
✅ **Image Optimization**: Enabled Next.js image optimization for Vercel  
✅ **API Route Conflicts**: Removed conflicting Next.js API routes from `src/app/api`

### ⚠️ **Important Vercel Limitations:**

**WebSocket Support**: Vercel has limited WebSocket support. For real-time features, consider:

- Using Vercel's Edge Functions for lightweight real-time features
- Deploying WebSocket server separately (Railway, Heroku, etc.)
- Using alternative real-time solutions (Server-Sent Events, polling)

**Function Timeout**: Hobby plan has 10-second timeout. Optimize database queries and enable caching.

**Cold Starts**: Serverless functions may have cold start delays. Consider upgrading to Pro plan for better performance.

### 🚀 **Quick Deploy Command:**

````bash
# Run the deployment script
.\scripts\deploy-vercel.ps1 -Production

# Or manually with Vercel CLI
npm run deploy:prod
```**🎉 Congratulations! Your wedding website is now ready for Vercel deployment! 🎉**
````
