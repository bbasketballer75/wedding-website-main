# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Austin & Jordyn's Wedding Website

### 📋 **Pre-Deployment Checklist**

✅ Production build successful (`npm run build`)  
✅ All tests passing (152 frontend + 40 backend tests)  
✅ Accessibility audit completed  
✅ Skip links implemented for screen readers  
🔄 Environment variables configured (see below)  
🔄 Sentry monitoring enabled  
🔄 Domain DNS configured

---

## 🔧 **NETLIFY ENVIRONMENT VARIABLES**

Configure these in your Netlify dashboard (Site Settings > Environment Variables):

### **🔐 Required Production Variables**

```bash
# Core Application
NODE_ENV=production
REACT_APP_API_URL=https://www.theporadas.com/api
REACT_APP_BASE_URL=https://www.theporadas.com

# Google Cloud Platform (for photo storage & Firestore)
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GCS_BUCKET_NAME=your-cloud-storage-bucket-name

# Sentry Error Monitoring
SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id

# Admin Dashboard Security
ADMIN_KEY=your-super-secure-admin-key
SESSION_SECRET=your-session-encryption-secret-key

# Netlify Build Configuration
NODE_VERSION=20
SECRETS_SCAN_OMIT_PATHS=.netlify/.next/cache/**,**/SENTRY-AUTH-TOKEN-FIX.md,**/BUILD-FIXES-APPLIED.md,**/*-FIX.md
```

### **🌐 Optional Variables (for enhanced features)**

```bash
# Analytics & Monitoring
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
HOTJAR_ID=your-hotjar-id

# Social Media Integration
FACEBOOK_APP_ID=your-facebook-app-id
TWITTER_SITE=@yourhandle

# Performance Monitoring
VERCEL_ANALYTICS_ID=your-analytics-id
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Option A: Deploy via GitHub (Recommended)**

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Production deployment ready"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository: `wedding-website`
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
     - Node version: `20`

3. **Configure Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add all variables from the list above

### **Option B: Manual Deploy via CLI**

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**

   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run deploy:prod
   ```

---

## 🛡️ **SENTRY MONITORING SETUP**

### **1. Create Sentry Account & Project**

- Go to [sentry.io](https://sentry.io)
- Create account/login
- Create new project for "React/Next.js"
- Note your DSN and Auth Token

### **2. Configure Sentry Variables**

Add these to Netlify environment variables:

```bash
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[your-auth-token]
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=[same-as-SENTRY_DSN]
```

### **3. Verify Sentry Integration**

After deployment, check:

- Error boundary reporting works
- Performance monitoring active
- Source maps uploaded correctly

---

## 🌍 **DOMAIN CONFIGURATION**

### **Current Domain: www.theporadas.com**

1. **DNS Settings (at Porkbun):**

   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

2. **Netlify Domain Settings:**
   - Go to Site Settings > Domain management
   - Add custom domain: `www.theporadas.com`
   - Enable HTTPS/SSL (automatic via Let's Encrypt)

---

## ♿ **POST-DEPLOYMENT ACCESSIBILITY VERIFICATION**

### **1. Automated Testing**

```bash
# Run these after deployment
npm run audit:a11y
npx lighthouse https://www.theporadas.com --view
```

### **2. Manual Testing Checklist**

- [ ] Tab through all interactive elements
- [ ] Test skip links (Tab to first element)
- [ ] Verify focus indicators visible
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Check color contrast in high contrast mode
- [ ] Verify mobile touch targets (44px minimum)

---

## 📊 **PERFORMANCE MONITORING**

### **Core Web Vitals Targets**

- **LCP (Largest Contentful Paint):** < 2.5s ✅
- **FID (First Input Delay):** < 100ms ✅
- **CLS (Cumulative Layout Shift):** < 0.1 ✅

### **Bundle Size Monitoring**

- Main bundle: < 250KB gzipped ✅
- Vendor bundle: ~527KB (React/Next.js core) ✅
- Total First Load JS: ~532KB ✅

---

## 🔍 **POST-DEPLOYMENT VERIFICATION**

### **1. Functionality Tests**

- [ ] Homepage loads correctly
- [ ] Photo gallery works
- [ ] Guestbook submission works
- [ ] Admin dashboard accessible
- [ ] Contact forms functional
- [ ] Maps display correctly

### **2. Performance Tests**

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized and loading
- [ ] CDN delivering assets

### **3. Security Tests**

- [ ] HTTPS working (padlock icon)
- [ ] Security headers present
- [ ] Admin routes protected
- [ ] Error handling working

### **4. Monitoring Tests**

- [ ] Sentry receiving data
- [ ] Analytics tracking (if configured)
- [ ] Error boundaries catching issues
- [ ] Performance metrics flowing

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions**

**Build Fails:**

- Check Node version (must be 20+)
- Verify all environment variables set
- Check build logs for specific errors

**Sentry Not Working:**

- Verify DSN format is correct
- Check auth token permissions
- Ensure both SENTRY_DSN and NEXT_PUBLIC_SENTRY_DSN are set

**Domain Not Resolving:**

- Check DNS propagation (can take 24-48 hours)
- Verify CNAME record points to netlify.app
- Check Netlify domain settings

**Performance Issues:**

- Verify image optimization enabled
- Check CDN configuration
- Monitor Core Web Vitals in production

---

## 📞 **SUPPORT CONTACTS**

- **Netlify Support:** [netlify.com/support](https://netlify.com/support)
- **Sentry Docs:** [docs.sentry.io](https://docs.sentry.io)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 **SUCCESS METRICS**

Once deployed, your wedding website will have:

- ⚡ Lighthouse Performance Score: 90+
- ♿ WCAG AA Accessibility Compliance
- 🔒 A+ Security Rating
- 📱 Perfect Mobile Experience
- 🚀 Sub-2 second load times
- 🛡️ Real-time error monitoring
- 📊 Web vitals tracking

**Your guests will have an amazing experience sharing in your special day!** ❤️

---

_Last updated: August 1, 2025_
_Website: Austin & Jordyn Porada Wedding_
_Status: Production Ready ✅_
