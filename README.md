# Augusta Noobies

A browsing/reference webapp for a private annual golf tournament among friends — history, past
winners, player progress, and tournament details. No live scoring; content is entirely
admin-managed. Not affiliated with Augusta National Golf Club or The Masters.

## Stack

- **Backend**: Java 21, Spring Boot, deployed to Render (`/backend`)
- **Frontend**: React + TypeScript (Vite), deployed to Vercel (`/frontend`)
- **Data**: Firestore (Firebase)
- **Photos**: Cloudinary (not Firebase Storage — Firebase now requires the paid Blaze plan just
  to provision a Storage bucket on a new project; Cloudinary's free tier needs no billing setup
  at all)
- **Admin auth**: Firebase Auth (email/password) + a Firestore allowlist — no public accounts

---

## 1. Local development

You need: Java 21, Maven (or use the included `./mvnw`), Node 20+, a Firebase project, and a
Cloudinary account (see step 2 below — you need both even for local dev, since there's no offline
database or photo storage).

### Backend

```bash
cd backend
# Drop your Firebase service account key here (see step 2) — it's gitignored.
# backend/firebase-service-account.json
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name> ./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. `GET /health` should return `ok`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in the Firebase web config from step 2
npm run dev
```

The site starts on `http://localhost:5173` (or the next free port) and talks to the backend at
`VITE_API_BASE_URL` (defaults to `http://localhost:8080`).

### Adding yourself as the first admin

There's deliberately no in-app "manage admins" screen (keeps the admin surface minimal). To make
someone an admin:

1. In the Firebase console → **Authentication** → **Users** → add a user with their email +
   a password (or have them set one via "forgot password" once you wire that up — for the MVP,
   just set one yourself and share it with them).
2. In **Firestore** → create a document in the `admins` collection whose **document ID is their
   lowercased email** (e.g. `admins/jane@example.com`) — the document's contents don't matter,
   its existence is the allowlist check.

They can now log in at `/admin/login` on the frontend.

---

## 2. Setting up Firebase and Cloudinary from scratch

### Firebase (Firestore + Auth)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** →
   name it (e.g. "augusta-noobies") → you can decline Google Analytics, it's not needed.
2. **Build → Firestore Database** → Create database → start in **production mode** → pick a
   region close to Norway (e.g. `eur3` / `europe-west`).
3. **Build → Authentication** → Get started → enable the **Email/Password** sign-in provider.
4. **Project settings (gear icon) → Service accounts** → **Generate new private key** → this
   downloads a JSON file.
   - **Locally**: save it as `backend/firebase-service-account.json` (already gitignored).
   - **For Render**: base64-encode it and store the result as an env var (see step 3 of
     deploying, below).
     ```bash
     base64 -i path/to/downloaded-key.json | pbcopy   # macOS, copies to clipboard
     ```
5. **Project settings → General → Your apps** → add a **Web app** (the `</>` icon) → copy the
   resulting config values into `frontend/.env` (see `.env.example` for the exact variable
   names).

Note: we deliberately do **not** use Firebase Storage — as of late 2024, Google requires the
paid Blaze plan just to provision a Storage bucket on a new project. Photos go to Cloudinary
instead (free, no billing setup required).

### Cloudinary (photo storage)

1. Sign up free at [cloudinary.com](https://cloudinary.com).
2. Dashboard home page shows your **Cloud name**, **API Key**, and **API Secret**, plus a ready
   -made `CLOUDINARY_URL` value (`cloudinary://<api_key>:<api_secret>@<cloud_name>`) — copy that
   whole string, it's the only env var the backend needs for photos.

You'll also want to seed a `courses` and a `tournaments` document or two via the Firestore
console (or via the admin UI once both apps are running) to have something to look at.

---

## 3. Deploying

### Backend → Render

1. Push this repo to GitHub.
2. [render.com](https://render.com) → **New → Web Service** → connect the repo.
3. Set:
   - **Root directory**: `backend`
   - **Runtime**: Docker (Render will pick up `backend/Dockerfile` automatically)
   - **Health check path**: `/health`
4. Environment variables (Render dashboard → Environment):
   - `FIREBASE_SERVICE_ACCOUNT_B64` — the base64 string from the Firebase setup above
   - `CLOUDINARY_URL` — the full `cloudinary://...` string from the Cloudinary setup above
   - `FRONTEND_ORIGIN` — your Vercel URL once you have it (comma-separate multiple origins, e.g.
     for a preview + production URL); can be updated after the first deploy
5. Deploy. Render's free tier spins the service down when idle — the first request after a quiet
   period will be slow (~30-60s) while it wakes up. That's expected and fine for this use case.

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the same repo.
2. Set **Root Directory** to `frontend`. Vercel auto-detects Vite (`vercel.json` in `frontend/`
   handles the SPA rewrite).
3. Environment variables (Project Settings → Environment Variables) — same names as
   `frontend/.env.example`:
   `VITE_API_BASE_URL` (your Render service URL), `VITE_FIREBASE_API_KEY`,
   `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
4. Deploy. Then go back to Render and set `FRONTEND_ORIGIN` to the Vercel URL you were given, so
   the browser's CORS check passes.

---

## Data model (Firestore collections)

`players`, `tournaments` (doc ID = year, e.g. `"2026"`), `results`, `sidePrizes`, `photos`,
`highlights`, `courses`, `admins` (allowlist). See `backend/src/main/java/no/augustanoobies/dto`
for the exact fields, or the plan history for the original design.

## GDPR / privacy

See the `/personvern` page on the site for the participant-facing notice. Short version: names,
photos, and scores of this closed friend group are shown on an unlisted, non-indexed
(`robots.txt` + `noindex`) URL; scores/names rest on legitimate interest within the group, photos
should have informed consent from the people in them before an admin uploads them. Get informed
consent (a quick "ok to post this?") before adding anyone's photo.

## Out of scope (MVP)

Player login/self-service editing, live/real-time scoring, ELO-style ranking, payments/email/
messaging, native mobile apps.
