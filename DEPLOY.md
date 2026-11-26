# Deploying TaskFlow on Vercel

Deploy as **two Vercel projects** from the same repo (backend first, then frontend).

## 0. Prereqs
- Push this folder to GitHub.
- MongoDB Atlas cluster → Network Access → allow `0.0.0.0/0` (Vercel IPs aren't fixed).

## 1. Backend (server)
Vercel → Add New Project → import repo
- **Root Directory:** `server`
- **Framework Preset:** Other
- **Environment Variables:**
  - `MONGO_URI` = your Atlas connection string
  - `JWT_SECRET` = long random string
  - `CLIENT_URL` = (fill in after step 2, e.g. `https://taskflow.vercel.app`)
- Deploy, then open `https://<server>.vercel.app/` → should show "To-Do API is running".

## 2. Frontend (client)
Add New Project → same repo
- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Environment Variable:** `VITE_API_URL` = `https://<server>.vercel.app/api`
- Deploy.

## 3. Finish
Go back to the server project → set `CLIENT_URL` to the frontend URL (no trailing slash) → Redeploy.

## Local dev
- `server/.env` from `.env.example`, then `npm run dev`
- `client/.env` from `.env.example`, then `npm run dev`
