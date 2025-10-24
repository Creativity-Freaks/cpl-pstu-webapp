Deployment to Vercel

This project is a Vite + React (TypeScript) static site. Below are step-by-step instructions to deploy it to Vercel (both through the web UI and via the Vercel CLI).

Required environment variables

If your app uses Supabase (recommended for dynamic data), set these in the Vercel project settings (Environment > Environment Variables):

- VITE_SUPABASE_URL — your Supabase project URL
- VITE_SUPABASE_ANON_KEY — your Supabase anon/public API key
- VITE_PROFILE_API — (optional) URL of any server endpoint used to create profiles (if used)
- VITE_SUPABASE_BUCKET or VITE_SUPABASE_AVATARS_BUCKET — (optional) storage bucket name for avatars

Vercel web UI (recommended)

1. Push your repository to GitHub (or GitLab/Bitbucket).
2. Open https://vercel.com and sign in.
3. Click "New Project" → Import Git Repository → select this repo.
4. In the Project Settings:
   - Framework Preset: Other (or Vite; Vercel often detects automatically)
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install (default)
5. Add the environment variables listed above under Settings → Environment Variables.
6. Deploy. Vercel will run `npm run build` and serve the resulting `dist` directory.

Vercel CLI (alternative)

1. Install Vercel CLI if you don't have it:

```bash
npm i -g vercel
```

2. From the project root run:

```bash
vercel login
vercel --prod
```

3. The CLI will prompt for project settings (build command, output directory); specify `npm run build` and `dist`.

Adding environment variables with the CLI:

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
# repeat for other envs
```

Notes & Troubleshooting

- SPA routing: `vercel.json` routes are configured to send all requests to `index.html` so client-side routing (react-router) works.
- If your Supabase keys are not set, the app will use local fallbacks. To see live data, set the `VITE_` environment variables.
- If the build fails on Vercel, check the Build Logs for missing dependencies or TypeScript errors; you can reproduce locally with `npm run build`.

If you'd like, I can:

- Add a `workflow` or GitHub Action to automatically deploy on push to `main`.
- Configure Vercel realtime subscriptions or serverless endpoints if you need server-side logic.

\*\*\* End of file
