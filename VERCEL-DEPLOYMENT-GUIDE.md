# Vercel Deployment Guide

## ✅ Code Ready for Production

All fixes are complete. The application is ready to deploy to Vercel.

---

## Required Environment Variables for Vercel

### Add these in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

### 1. **TMDB_API_KEY** (PRIVATE - Required for movies)

```
Variable Name: TMDB_API_KEY
Value: [Your TMDb API key]
Environments: ✅ Production ✅ Preview ✅ Development
```

**How to get it:**
1. Go to https://www.themoviedb.org/settings/api
2. Copy your API Key (v3 auth)
3. Paste into Vercel

**Type:** PRIVATE (server-only, never exposed to browser)

---

### 2. **DATABASE_URL** (PRIVATE - Required for database)

```
Variable Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database
Environments: ✅ Production ✅ Preview ✅ Development
```

**How to get it:**
- **Option A:** Add Vercel Postgres (recommended)
  - Vercel Dashboard → Storage → Create Database → Postgres
  - Connection string auto-populated
  
- **Option B:** Use external database
  - Supabase: https://supabase.com (free tier available)
  - Railway: https://railway.app
  - Render: https://render.com
  - Copy the connection string

**Type:** PRIVATE (contains credentials)

---

### 3. **Firebase Variables** (OPTIONAL - For authentication)

Only add these if you want Firebase authentication enabled:

#### Client Variables (PUBLIC):
```
NEXT_PUBLIC_FIREBASE_API_KEY=[from Firebase Console]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[your-project-id.firebaseapp.com]
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[your-project-id]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[your-project-id.appspot.com]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[sender-id]
NEXT_PUBLIC_FIREBASE_APP_ID=[app-id]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[measurement-id]
```

**How to get these:**
1. Go to Firebase Console → Your Project
2. Project Settings → General
3. Your apps → Web app → SDK setup and configuration
4. Copy the config values

#### Server Variable (PRIVATE):
```
FIREBASE_SERVICE_ACCOUNT=[JSON string of service account]
```

**How to get it:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Stringify it to single line (remove line breaks)
5. Paste the entire JSON string into Vercel

**Type:** PUBLIC for NEXT_PUBLIC_*, PRIVATE for FIREBASE_SERVICE_ACCOUNT

---

## Minimal Deployment (Movies Only)

If you want to deploy quickly with just movies working:

**Required:**
```
DATABASE_URL=postgresql://...
TMDB_API_KEY=...
```

**Result:** 
- ✅ Movies load
- ✅ Search works
- ✅ Actor pages work
- ⚠️ Firebase auth disabled (shows warning)

---

## Full Feature Deployment

For all features including authentication:

**Required:**
```
DATABASE_URL=postgresql://...
TMDB_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

**Result:**
- ✅ Movies load
- ✅ Search works
- ✅ Actor pages work
- ✅ Firebase auth enabled
- ✅ User accounts work

---

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "fix: move TMDB API key to server-side"
git push origin main
```

### 2. Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable one by one
5. For each variable, select which environments: **Production**, **Preview**, **Development**
6. Click **Save**

### 3. Deploy

- Vercel will auto-deploy when you push to GitHub
- Or manually trigger: **Deployments** → **Redeploy**

### 4. Verify Deployment

1. Build succeeds ✅
2. Visit your deployment URL
3. Check movies load
4. Check no errors in browser console
5. **Security check:** Open DevTools → Network → Verify `TMDB_API_KEY` is NOT visible in any request

---

## Security Verification

After deployment, verify TMDB API key is protected:

1. Open your deployed site
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Browse some movies
5. Check all network requests
6. **Verify:** `TMDB_API_KEY` does NOT appear anywhere
7. Go to **Sources** or **Debugger** tab
8. Search JavaScript files for "TMDB"
9. **Verify:** The actual API key is NOT in any bundle

If the API key appears anywhere in the browser, **DO NOT continue** - report immediately.

---

## Troubleshooting

### Build fails with "TMDB_API_KEY not found"

**Solution:** Add `TMDB_API_KEY` to Vercel environment variables and redeploy

### Movies don't load / show mock data

**Solution:** Verify `TMDB_API_KEY` is set correctly in Vercel (no quotes, no spaces)

### "Invalid API key" error

**Solution:** Check the API key value is correct. Get a new one from TMDB if needed.

### Firebase warning appears

**This is normal** if you haven't added Firebase variables. Authentication is optional.

### Database errors

**Solution:** Verify `DATABASE_URL` is set and the database is accessible from Vercel

---

## Build Configuration

The `vercel.json` is already configured:

```json
{
  "installCommand": "npm install --legacy-peer-deps",
  "buildCommand": "npx prisma generate && npm run build"
}
```

No changes needed.

---

## What Changed (Technical)

### Security Fix Summary

**Changed:** All TMDB API key references from `NEXT_PUBLIC_TMDB_API_KEY` to `TMDB_API_KEY`

**Files Modified:**
- `src/config/tmdb.ts`
- `src/providers/tmdb/config.ts`
- `src/providers/tmdb/TMDbProvider.ts`
- `src/lib/data/serverActions.ts`
- `scripts/test-tmdb-api.ts`
- `.env.local.example`

**Impact:**
- ✅ TMDB API key now server-only
- ✅ Never exposed to browser
- ✅ Protected from extraction
- ✅ All functionality preserved
- ✅ UI unchanged
- ✅ Build succeeds

---

## Final Checklist

Before deploying:

- [x] Code changes committed
- [x] Code pushed to GitHub
- [ ] `DATABASE_URL` added to Vercel
- [ ] `TMDB_API_KEY` added to Vercel
- [ ] Firebase variables added (optional)
- [ ] Deployment triggered
- [ ] Build succeeded
- [ ] Site loads correctly
- [ ] Movies work
- [ ] API key not visible in browser

---

## Support

If deployment fails:
1. Check Vercel build logs for the exact error
2. Verify all required environment variables are set
3. Verify environment variable values are correct (no typos)
4. Check the DEPLOYMENT.md file for additional troubleshooting

**The application is ready for production deployment.**

