# Copilot Instructions for AI Coding Agents

## Project Overview

This is a full-stack wedding website for Austin & Jordyn Porada (née Pringle), featuring:
- Photo album (Google Cloud Storage)
- Interactive guestbook (Firestore)
- Wedding party info, maps, admin dashboard
- Responsive, accessible design

**Tech stack:**  
Frontend: React (Next.js for prod), React Router, CSS3  
Backend: Node.js, Express, Firestore  
Cloud: Google Cloud Storage, Netlify serverless  
Testing: Jest, React Testing Library, Cypress  
Deployment: Netlify

## Architecture & Patterns

- **Frontend:** `src/` (main app), `src/app/components/`, `src/app/page-components/`
- **Backend:** `backend/` (Express app), `backend/routes/`, `backend/controllers/`, `backend/models/`
- **Cloud integration:** File uploads via `backend/services/cloudStorage.js`
- **Admin dashboard:** `/admin` route, admin key required (see env vars)
- **Testing:**  
  - Unit/integration: `npm test` (Jest)  
  - E2E: Cypress specs in `cypress/e2e/`
- **Environment:** See `README-PRODUCTION.md` for required env vars (Netlify, GCP, admin key, etc.)

## Developer Workflows

- **Start frontend:** `npm start` (root)
- **Start backend:** `cd backend && npm start`
- **Run all tests:** `npm test`
- **Build frontend:** `npm run build`
- **Deploy:** `netlify deploy --prod`
- **Local dev server:** `npm run dev` (Next.js, port 3000)
- **Production deploy:** Netlify auto-builds from `main`

## Project-Specific Conventions

- **Media uploads:** Always use Google Cloud Storage, not local disk.
- **API endpoints:** All backend APIs under `/api`, routed via Express in `backend/routes/`.
- **Guestbook & album:** Data in Firestore, models in `backend/models/`.
- **Error handling:** Use `backend/utils/errorHandler.js` and `asyncHandler.js` for Express.
- **Authentication:** Admin access via key, checked in middleware.

## Integration Points

- **Frontend-backend:** REST API endpoints (`/api/...`)
- **Cloud:** Credentials/bucket info must be set in env vars for uploads.
- **Netlify:** Handles static frontend and serverless backend.

## Examples

- Add API route: create in `backend/routes/`, logic in `backend/controllers/`, register in `backend/app.js`
- Add frontend page: add to `src/app/page-components/`, route via Next.js/React Router

## References

- See `README.md` and `README-PRODUCTION.md` for setup and deployment.
- See `backend/` for backend structure, `src/` for frontend.

---

If any section is unclear or missing details, please specify so I can refine these instructions!
