# The Poradas Wedding Website

Welcome to Austin & [Partner's] wedding website! This full-stack application features:

## Features

- Photo album with Google Cloud Storage
- Interactive guestbook
- Wedding party information
- Map of important locations
- Admin dashboard for moderation
- Responsive design with accessibility features

## Tech Stack

- **Frontend**: React, React Router, CSS3
  **Backend**: Node.js, Express, Google Firestore
- **Cloud**: Google Cloud Storage
- **Testing**: Jest, React Testing Library
- **Deployment**: Netlify

## Production Setup

### Environment Variables

Set these in your Netlify environment:

```
NODE_ENV=production
GCS_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-service-account.json
SESSION_SECRET=your-session-secret-here
ADMIN_KEY=your-admin-key-here
BASE_URL=https://your-domain.com
API_URL=https://your-domain.com/api
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_BASE_URL=https://your-domain.com
```

### Domain Setup

- Domain: **www.theporadas.com** (managed via Porkbun)
- Hosting: Netlify
- Backend: Serverless functions via Netlify

### Deployment Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## Development

```bash
# Start frontend
npm start

# Start backend
cd backend && npm start

# Run all tests
npm test
```

## Admin Access

Access the admin dashboard at `/admin` with the admin key to:

- View all uploaded media
- Moderate content
- Manage guestbook entries

---

🎉 **Live at: https://www.theporadas.com** 🎉
