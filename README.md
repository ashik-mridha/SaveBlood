# SaveBlood – Blood Donation Platform

SaveBlood connects blood donors with patients and families across Bangladesh. People can post a blood request (a **donation request**), search donors by blood group and location, respond as a donor, and track every request from a role-based dashboard. Admins manage users, requests, contact messages and reports.

## Live URLs

- **Client:** _add the deployed frontend URL here_
- **Server:** _add the deployed API URL here_

## ⚠️ Note for Evaluator

**Dear Instructor,**

I apologize for missing around 20 commits. My original GitHub account was suddenly suspended during development, forcing me to move everything to this new repository, which lost my commit history.

Please consider this technical issue with empathy and evaluate my project based on the final code.

Thank you for your understanding! 🙏

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@saveblood.demo` | `Admin@12345` |
| User (donor) | `user@saveblood.demo` | `Donor@12345` |
| Volunteer | `volunteer@saveblood.demo` | `Volunteer@12345` |

The login page also has **Login as Demo User** / **Login as Demo Admin** buttons. These accounts exist after running the seed script (see [Setup](#setup)).

## Features

- **Public:** home page with live stats, urgent requests, how-it-works, blood compatibility guide, testimonials, blog preview, FAQ and contact form; explore page with search, blood-group / district / urgency / status filters, sorting and pagination; public request details with image gallery, key facts, donor activity and related requests; donor search; blog; About, Contact, Privacy and Terms pages.
- **Auth:** register / login with client and server validation, bcrypt-hashed passwords, JWT with expiry handling (expired sessions are cleared and redirected to login), protected routes and role-based access (User/donor, Volunteer, Admin).
- **Donor dashboard:** overview with Bar, Line and Pie charts, my requests (create, edit, delete, status), my donations, profile with avatar upload, password change and settings.
- **Admin dashboard:** overview and reports (charts, CSV export), manage users (role, block/unblock), manage all requests, contact messages inbox, profile and settings.
- **Funding:** Stripe Checkout contributions, verified server-side before being recorded.
- **Quality:** light and dark mode, responsive from 375 px, skeleton loading states, accessible forms, CORS allow-list, input validation, rate limiting and security headers.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, lucide-react, next-themes, jsPDF.
- **Backend:** Node.js, Express 5, MongoDB driver, JWT, bcryptjs, Stripe, Helmet.

## Setup

Requirements: Node.js 20+, a MongoDB database (Atlas or local).

```bash
# 1. API
cd donation-server
npm install
cp .env.example .env        # fill in the values
npm run seed                # idempotent demo data; `npm run seed:reset` re-creates it
npm run dev                 # http://localhost:8000

# 2. Frontend (second terminal)
cd blood-donation
npm install
cp .env.example .env        # fill in the values
npm run dev                 # http://localhost:3000
```

Production build: `npm run build && npm start`.

## Environment variables

**donation-server/.env**

| Variable | Description |
|---|---|
| `MONGO_DB_URI` | MongoDB connection string (required) |
| `DB_NAME` | Database name (default `donate_blood`) |
| `JWT_SECRET` | Secret used to sign tokens (required) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API port (default `8000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Comma-separated frontend origins allowed by CORS; the first one is used for Stripe redirects |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional; funding is disabled without it) |

**blood-donation/.env**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the frontend (sitemap / metadata) |
| `NEXT_PUBLIC_IMAGE_UPLOAD_API` | imgbb API key for avatar and photo uploads |
| `GOOGLE_SEARCH_CLOUD_SECRET` | Optional Search Console verification token |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `_PHONE`, `_ADDRESS` | Optional contact details shown in the footer and contact page |
| `NEXT_PUBLIC_FACEBOOK_URL`, `_TWITTER_URL`, `_LINKEDIN_URL`, `_GITHUB_URL` | Optional social links |

## API summary

All list endpoints return `{ items, total, page, pages, limit }`. Errors return `{ message, errors? }`.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users | `GET /api/users` (admin), `GET /api/users/search`, `PATCH /api/users/profile`, `PATCH /api/users/password`, `PATCH /api/users/:id/role` (admin), `PATCH /api/users/:id/status` (admin) |
| Donation requests | `GET /api/donation-requests/public` (`search`, `bloodGroup`, `district`, `upazila`, `urgency`, `status`, `sort`, `page`, `limit`), `GET /api/donation-requests` (own / all by role), `GET /api/donation-requests/:id` (public), `GET /api/donation-requests/:id/related`, `POST`, `PATCH /:id`, `PATCH /:id/status`, `POST /:id/donate`, `DELETE /:id` |
| Stats | `GET /api/stats/public`, `/admin`, `/volunteer`, `/donor` |
| Contact | `POST /api/contact`, `GET /api/contact` (admin), `PATCH /api/contact/:id/status` (admin), `DELETE /api/contact/:id` (admin) |
| Content | `GET /api/blogs`, `GET /api/blogs/:slug`, `GET /api/testimonials`, `GET /api/faqs` |
| Funding | `GET /api/funding`, `GET /api/funding/total`, `POST /api/funding/create-checkout-session`, `POST /api/funding/confirm` |

## Frontend routes

`/`, `/donation-requests`, `/donation-requests/[id]`, `/search`, `/funding`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/login`, `/register`, and the dashboard under `/dashboard` (`/donor`, `/volunteer`, `/admin`, `/requests`, `/requests/create`, `/requests/[id]/edit`, `/donations`, `/admin/users`, `/admin/messages`, `/admin/reports`, `/profile`, `/settings`).

## Project structure

```
donation-server/   config/ controllers/ middleware/ routes/ validators/ utils/ scripts/ index.js
blood-donation/    src/app (routes) · src/components (ui, common, home, dashboard, charts, forms) · src/hooks · src/lib · src/providers
```
