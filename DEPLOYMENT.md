# Deployment Guide

## Required Environment Variables

Make sure to set these environment variables in your deployment platform:

### Required
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/database`)
- `NEXT_PUBLIC_TMDB_API_KEY` - Your TMDb API key

### Optional
- `NEXT_PUBLIC_OMDB_API_KEY` - OMDb API key
- `NEXT_PUBLIC_PRIMARY_PROVIDER` - Default: `tmdb`
- `NEXT_PUBLIC_ENABLE_TELEMETRY` - Default: `false`

## Platform-Specific Instructions

### Vercel
1. Go to your project settings → Environment Variables
2. Add `DATABASE_URL` and other required variables
3. Make sure to add them to all environments (Production, Preview, Development)
4. Redeploy

### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add `DATABASE_URL` and other required variables
3. Redeploy

### Railway / Render
1. Add a PostgreSQL database service
2. Copy the DATABASE_URL connection string
3. Add it to your environment variables
4. Redeploy

## Common Issues

### Error: "Command npx prisma generate && npm run build exited with 1"

**Solutions:**

1. **Missing DATABASE_URL**: Ensure `DATABASE_URL` is set in your deployment environment variables
   
2. **Binary compatibility**: The Prisma schema now includes multiple binary targets for better compatibility

3. **Build timeout**: If build takes too long, consider using a larger instance or optimizing dependencies

4. **Database not accessible during build**: Some platforms require the database to be accessible during build. Use a dummy DATABASE_URL if needed:
   ```
   DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
   ```

### Testing locally
```bash
# Set DATABASE_URL in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Run build
npm run build
```

## Build Process

The build now automatically runs `prisma generate`:
- `postinstall`: Runs after dependencies are installed
- `build`: Explicitly runs before Next.js build

This ensures Prisma Client is always generated before building your app.
