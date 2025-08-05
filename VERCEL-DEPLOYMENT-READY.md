# 🚀 Complete Vercel Deployment Guide

## Your Wedding Website is Fully Optimized for Vercel!

### 📋 **Pre-Deployment Checklist**

- [x] ✅ **Next.js Configuration**: Optimized for Vercel with serverless functions
- [x] ✅ **API Functions**: Express backend properly configured as `/api/index.js`
- [x] ✅ **Environment Variables**: Complete JSON file ready for upload
- [x] ✅ **Build Configuration**: `vercel.json` optimized for production
- [x] ✅ **Performance**: Image optimization, caching, and compression enabled
- [x] ✅ **Security**: CORS, headers, and rate limiting configured

---

## 🎯 **Deployment Steps**

### 1. **Install Vercel CLI** (if not already installed)

```bash
npm install -g vercel
```

### 2. **Login to Vercel**

```bash
vercel login
```

### 3. **Deploy Your Project**

```bash
# For preview deployment
npm run deploy:preview

# For production deployment
npm run deploy:prod

# Or use the deployment script
.\scripts\deploy-vercel.ps1 -Production
```

### 4. **Upload Environment Variables**

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Click "Import Environment Variables"
5. Upload the `vercel-env-variables.json` file
6. **IMPORTANT**: Update these values with your actual credentials:
   - `GCP_PRIVATE_KEY`: Your actual Google Cloud service account private key
   - `OPENAI_API_KEY`: Your actual OpenAI API key
   - `ADMIN_KEY`: Generate a secure random string
   - `SESSION_SECRET`: Generate a secure random string
   - `SENTRY_DSN`: Your actual Sentry DSN (if using)

---

## 🔑 **Critical Environment Variables to Update**

After uploading the JSON file, update these values in Vercel dashboard:

| Variable          | Where to Get                            | Example                            |
| ----------------- | --------------------------------------- | ---------------------------------- |
| `GCP_PRIVATE_KEY` | Google Cloud Console → Service Accounts | `-----BEGIN PRIVATE KEY-----\n...` |
| `OPENAI_API_KEY`  | OpenAI Platform → API Keys              | `sk-...`                           |
| `ADMIN_KEY`       | Generate secure random string           | Use password generator             |
| `SESSION_SECRET`  | Generate secure random string           | Use password generator             |
| `SENTRY_DSN`      | Sentry.io → Project Settings            | `https://...@sentry.io/...`        |

---

## 🧪 **Testing Your Deployment**

### 1. **Health Check**

```bash
curl https://www.theporadas.com/api/health
```

### 2. **AI Services**

```bash
curl -X POST https://www.theporadas.com/api/ai/moderate \
  -H "Content-Type: application/json" \
  -d '{"content": "test message", "type": "guestbook"}'
```

### 3. **Database Connection**

```bash
curl https://www.theporadas.com/api/guestbook/entries
```

---

## 🚀 **Vercel-Specific Optimizations Included**

✅ **Next.js Configuration**:

- SWC minification enabled
- Image optimization for Vercel
- Output file tracing for smaller bundles
- Production source maps for debugging

✅ **Serverless Functions**:

- 30-second timeout configured
- Proper CORS headers
- Express app wrapper for compatibility

✅ **Performance**:

- Compression enabled
- Security headers configured
- CDN optimization through Vercel Edge Network

✅ **Build Process**:

- Optimized dependency installation
- Vercel-specific ignore patterns
- Streamlined build command

---

## 📊 **Monitoring & Maintenance**

### Vercel Dashboard Monitoring

- Function execution times
- Error rates and logs
- Bandwidth usage
- Core Web Vitals

### Recommended Monitoring Setup

1. Enable Vercel Analytics in project settings
2. Set up deployment notifications
3. Monitor function logs for errors
4. Check Core Web Vitals regularly

---

## 🆘 **Troubleshooting**

### Common Issues:

**1. Function Timeout**

- Check function logs in Vercel dashboard
- Optimize database queries
- Enable caching for frequently accessed data

**2. Environment Variable Issues**

- Verify all variables are set in Vercel dashboard
- Check for typos in variable names
- Ensure secrets are properly escaped

**3. Build Failures**

- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Test build locally: `npm run build`

**4. API Routes Not Working**

- Verify `/api/index.js` exists and exports properly
- Check `vercel.json` rewrites configuration
- Test API endpoints after deployment

---

## 💰 **Cost Optimization**

### Vercel Pricing Considerations:

- **Hobby Plan**: 100GB bandwidth, 100 serverless functions/day
- **Pro Plan**: Unlimited bandwidth, faster functions, team features
- **Monitor usage** in Vercel dashboard to optimize costs

### Tips to Reduce Costs:

1. Enable caching to reduce function executions
2. Optimize image sizes before upload
3. Use Vercel's built-in image optimization
4. Monitor and optimize function execution times

---

## 🎉 **Your Wedding Website is Production-Ready!**

Your website is now fully optimized and configured for Vercel deployment with:

- ⚡ **High Performance**: Next.js + Vercel Edge Network
- 🔒 **Enterprise Security**: CORS, headers, rate limiting
- 🤖 **AI-Powered Features**: OpenAI moderation and smart features
- 📊 **Real-time Monitoring**: Health checks and error tracking
- 🌐 **Global CDN**: Fast loading worldwide via Vercel Edge

**Ready to deploy? Run: `npm run deploy:prod`**
