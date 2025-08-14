# Copilot Instructions for Austin's Wedding Website Project

## Project Overview & Current Status (July 2025)

**PROJECT:** Full-stack wedding website for Austin & Jordyn Porada (née Pringle)
**STATUS:** Production-ready, live at www.theporadas.com
**LAST MAJOR UPDATE:** Complete migration from React Router to Next.js App Router, accessibility overhaul, CI/CD optimization

### Key Features

- Photo album with Google Cloud Storage integration
- Interactive guestbook with Firestore backend
- Wedding party information with photo galleries
- Interactive maps for venue locations
- Admin dashboard for content moderation
- Responsive design with comprehensive accessibility features
- Real-time error monitoring with Sentry
- Performance optimization with Core Web Vitals monitoring

## Tech Stack & Architecture

### Frontend (Primary Codebase)

- **Framework:** Next.js 15 with App Router architecture
- **UI Library:** React 18.2.0 with TypeScript support
- **Styling:** TailwindCSS 4.1.11 + custom CSS modules
- **Build Tool:** Next.js with SWC compiler (disabled Babel for performance)
- **Bundle Analysis:** @next/bundle-analyzer with optimization monitoring

### Backend (API Layer)

- **Runtime:** Node.js with Express 4.19.2
- **Database:** Google Firestore (NoSQL document store)
- **File Storage:** Google Cloud Storage for media uploads
- **API Documentation:** Swagger/OpenAPI with swagger-ui-express
- **Security:** Helmet, CORS, XSS protection, rate limiting
- **Media Processing:** Sharp for image optimization, FFmpeg for video

### Testing Infrastructure

- **Frontend Testing:** Vitest 3.2.4 (fast Vite-based test runner)
- **Backend Testing:** Jest 30.0.5 with Supertest for API testing
- **E2E Testing:** Cypress 14.5.3 for full user workflows
- **Component Testing:** Storybook 9.0.18 with accessibility addon
- **Coverage:** Comprehensive coverage reporting with jest-axe for a11y

### Deployment & Infrastructure

- **Primary Hosting:** Vercel with serverless functions
- **Domain:** www.theporadas.com (Porkbun DNS management)
- **SSL:** Automatic HTTPS via Vercel/Let's Encrypt
- **CDN:** Vercel Edge Network for global content delivery
- **CI/CD:** GitHub Actions with automated testing and deployment

### Monitoring & Analytics

- **Error Tracking:** Sentry integration with performance monitoring
- **Web Vitals:** Real-time Core Web Vitals monitoring
- **Accessibility:** Automated axe-core testing in CI pipeline
- **Performance:** Lighthouse CI integration for continuous auditing

## Critical Project Architecture Details

### Directory Structure (IMPORTANT - Follow Exactly)

```
/                              # Root - Next.js configuration
├── src/                       # Main application source
│   ├── app/                   # Next.js App Router (pages & layouts)
│   ├── components/            # Reusable UI components
│   ├── page-components/       # Page-specific components
│   ├── services/              # API clients and external services
│   └── utils/                 # Utility functions and helpers
├── backend/                   # Express API server
│   ├── routes/                # API route definitions
│   ├── controllers/           # Business logic handlers
│   ├── models/                # Firestore data models
│   ├── services/              # External service integrations
│   └── config/                # Database and service configurations
├── public/                    # Static assets (images, icons, etc.)
├── scripts/                   # Build and deployment automation
└── cypress/                   # End-to-end test specifications
```

### Key Configuration Files (NEVER MODIFY WITHOUT UNDERSTANDING)

- `next.config.ts` - Next.js optimization settings (bundle analyzer, Sentry, security headers)
- `babel.config.js` - TEST ONLY (SWC disabled for Jest compatibility)
- `vitest.config.ts` - Frontend test runner configuration
- `vercel.json` - Deployment and function configuration
- `jest.config.js` - Backend testing configuration

## Developer Workflows & Commands

### ⚠️ CRITICAL: Commands That Work vs. Don't Work

**✅ WORKING COMMANDS:**

```bash
# Development
npm run dev                    # Start Next.js dev server (port 3000)
cd backend && npm start       # Start Express API server (port 5000)
npm run dev:full              # Start both servers + Firebase emulator

# Testing (ALL TESTS PASS - 158/158)
npm run test:frontend         # Vitest frontend tests
npm run test:backend          # Jest backend tests
npm test                      # Run both test suites
npm run test:coverage         # Generate coverage reports

# Building & Deployment
npm run build                 # Production build (works perfectly)
vercel --prod                 # Deploy to Vercel production
npm run build:analyze         # Analyze bundle size

# Optimization & Monitoring
npm run audit:a11y            # Accessibility audit
npm run validate:optimizations # Performance validation
npm run deploy:validate       # Full production validation suite
```

**❌ BROKEN/DEPRECATED COMMANDS:**

```bash
npm start                     # OLD - use npm run dev instead
react-scripts build           # OLD - migrated to Next.js
any React Router commands     # REMOVED - migrated to Next.js App Router
```

### Development Environment Setup

1. **Node.js:** Version 18+ required (Vercel compatibility)
2. **Environment:** Set `NODE_ENV=development` for local development
3. **Ports:** Frontend (3000), Backend (5000), Storybook (6006)
4. **Database:** Use Firebase emulator for local Firestore testing

## Environment Variables & Configuration

### Required Production Environment Variables (Vercel)

```bash
# Security & Authentication
ADMIN_KEY=your-admin-dashboard-key
SESSION_SECRET=your-session-encryption-secret

# Google Cloud Platform (SPLIT FOR SECURITY)
GCP_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GCP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GCP_PROJECT_ID=your-gcp-project-id
GCS_BUCKET_NAME=your-cloud-storage-bucket

# Sentry Error Monitoring
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-sentry-build-token
SENTRY_ENVIRONMENT=production

# Application URLs
NODE_ENV=production
REACT_APP_API_URL=https://www.theporadas.com/api
REACT_APP_BASE_URL=https://www.theporadas.com
```

## Project-Specific Coding Conventions & Rules

### 🚨 CRITICAL RULES - NEVER BREAK THESE:

1. **Next.js App Router ONLY** - No React Router imports anywhere
2. **TypeScript Strict Mode** - All new files must use .tsx/.ts extensions
3. **Accessibility First** - Every component needs ARIA labels, alt text, keyboard navigation
4. **No Direct DOM Manipulation** - Use React state and refs properly
5. **Error Boundaries Required** - Wrap all major components in error boundaries

### File Naming Conventions

- **Components:** PascalCase (e.g., `PhotoGallery.tsx`)
- **Pages:** lowercase with hyphens (e.g., `wedding-party/page.tsx`)
- **Tests:** Match component name + `.test.tsx` (e.g., `PhotoGallery.test.tsx`)
- **Utilities:** camelCase (e.g., `webVitals.js`)

### Code Quality Standards

- **ESLint:** `npm run lint` must pass before commits
- **Prettier:** Auto-formatting enabled (4-space indentation)
- **TypeScript:** Strict mode enabled, no `any` types allowed
- **Testing:** Minimum 80% coverage required for new code

## Database & API Patterns

### Firestore Data Models

```javascript
// Guestbook Entry
{
  id: string,
  name: string,
  message: string,
  timestamp: Timestamp,
  approved: boolean,
  photo?: string
}

// Photo Album Entry
{
  id: string,
  filename: string,
  url: string,
  caption?: string,
  uploadedAt: Timestamp,
  category: string
}
```

### API Endpoint Patterns

- **Base URL:** `/api/{resource}`
- **Authentication:** Admin endpoints require `Authorization: Bearer ${ADMIN_KEY}`
- **Validation:** All inputs validated with express-validator
- **Error Handling:** Consistent JSON error responses with proper HTTP status codes

## Testing Strategy & Requirements

### Test Coverage Requirements

- **Unit Tests:** All utility functions and isolated components
- **Integration Tests:** API endpoints and component interactions
- **Accessibility Tests:** jest-axe validation for all user-facing components
- **E2E Tests:** Critical user journeys (guestbook submission, photo viewing)

### Current Test Status

- ✅ **158 tests passing** (100% pass rate)
- ✅ All React Router dependencies removed
- ✅ Accessibility tests integrated
- ✅ Web Vitals mocking implemented

## Performance & Optimization Standards

### Bundle Size Targets

- **Main Bundle:** < 250KB gzipped
- **Vendor Bundle:** < 700KB (React, Next.js core)
- **Page Bundles:** < 100KB each (code splitting enforced)

### Image Optimization

- **Format:** WebP with AVIF fallback
- **Sizes:** Responsive breakpoints (640, 750, 828, 1080, 1200, 1920, 2048, 3840)
- **Compression:** 85% quality for photos, 95% for graphics

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100 milliseconds
- **CLS (Cumulative Layout Shift):** < 0.1

## Deployment & CI/CD Pipeline

### GitHub Actions Workflow

1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Test Suite** - Frontend (Vitest) + Backend (Jest) tests
3. **Build Validation** - Production build test
4. **Accessibility Audit** - Automated axe-core testing
5. **Deploy to Netlify** - Automatic deployment on `main` branch

### Production Deployment Checklist

- [ ] All tests passing locally
- [ ] Environment variables configured in Netlify
- [ ] Lighthouse audit score > 90
- [ ] Accessibility audit passing
- [ ] Sentry error monitoring active
- [ ] Web Vitals monitoring configured

## Accessibility Implementation Requirements

### Mandatory Accessibility Features

- **ARIA Labels:** All interactive elements must have proper labels
- **Alt Text:** All images require descriptive alt attributes
- **Keyboard Navigation:** Full tab order and focus management
- **Screen Reader:** Semantic HTML with proper heading hierarchy
- **Color Contrast:** WCAG AA compliance (4.5:1 ratio minimum)
- **Skip Links:** Navigation bypass for keyboard users

### Testing Tools Used

- **jest-axe:** Automated accessibility testing in unit tests
- **Storybook a11y addon:** Component-level accessibility validation
- **Lighthouse:** CI integration for accessibility scoring
- **Manual Testing:** Screen reader validation (NVDA/VoiceOver)

## Error Handling & Monitoring

### Sentry Integration

- **Error Boundaries:** React error boundaries with Sentry reporting
- **Performance Monitoring:** Core Web Vitals and bundle performance
- **User Context:** Error reports include user session data
- **Release Tracking:** Deployment-based error analysis

### Error Response Patterns

```javascript
// API Error Response
{
  success: false,
  error: {
    message: "Human-readable error description",
    code: "ERROR_TYPE_CODE",
    details: {} // Additional context if needed
  }
}
```

## Security Implementation

### Security Headers (Implemented)

- **CSP (Content Security Policy):** Strict policy for XSS prevention
- **HSTS:** Force HTTPS connections
- **X-Frame-Options:** Prevent clickjacking
- **Rate Limiting:** API endpoint protection (100 requests/15 minutes)

### Data Validation

- **Input Sanitization:** XSS protection on all user inputs
- **File Upload Security:** Type validation and size limits
- **API Authentication:** Bearer token validation for admin functions

## Common Issues & Solutions

### Known Working Solutions

1. **Babel vs SWC:** Babel config only used for testing, SWC for production builds
2. **Image Optimization:** Sharp handles all image processing, not browser-based
3. **Test Environment:** JSDOM with proper Next.js environment simulation
4. **Error Boundaries:** Proper React 18 error boundary implementation with Sentry

### Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check build issues
npm run build 2>&1 | tee build-log.txt

# Validate environment
npm run validate:optimizations
```

## Development Guidelines for AI Agents

### When Adding New Features:

1. **Check accessibility first** - Add ARIA labels, alt text, keyboard support
2. **Write tests immediately** - Unit tests + accessibility tests required
3. **Follow TypeScript patterns** - Proper typing, no `any` usage
4. **Validate with real data** - Test with actual Firestore data
5. **Check bundle impact** - Run `npm run build:analyze` for size impact

### When Debugging Issues:

1. **Check test suite first** - `npm test` should always pass
2. **Validate environment** - Ensure env vars are properly set
3. **Review error boundaries** - Check Sentry for production errors
4. **Test accessibility** - Run `npm run audit:a11y` for validation

### Before Deploying:

1. **Full test suite** - All 158 tests must pass
2. **Build validation** - `npm run build` must succeed
3. **Lighthouse audit** - Score > 90 required
4. **Environment check** - All production env vars configured

---

## Project Context for AI Agents

**User Experience Level:** Beginner (requires detailed guidance and validation)
**Project Phase:** Production-ready with ongoing optimization
**Primary Goals:** Maintain stability, improve performance, ensure accessibility
**Current Focus:** Post-deployment monitoring and incremental improvements

**Key Success Metrics:**

- 100% test pass rate (currently achieved)
- Lighthouse performance score > 90
- Zero accessibility violations
- < 2.5s page load times
- < 1% error rate in production

This project represents a complete, production-ready wedding website with enterprise-level optimization, monitoring, and accessibility features. Always prioritize stability and user experience in any modifications.
