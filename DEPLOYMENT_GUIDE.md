# 🚀 Deploy Premier Select to Vercel

## Step-by-Step Deployment Guide

### Prerequisites
- A GitHub account
- A Vercel account (free) - sign up at https://vercel.com

---

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Download Your Code
1. In Figma Make, click the **Export** button or download all files
2. Create a folder on your computer called `premier-select-baseball`
3. Save all your project files there

### Step 2: Set Up Git & GitHub
```bash
# Open terminal/command prompt in your project folder
cd premier-select-baseball

# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - Premier Select Baseball App"
```

### Step 3: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `premier-select-baseball`
3. Keep it **Private** (recommended)
4. Click **Create repository**
5. Copy the commands shown and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/premier-select-baseball.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `premier-select-baseball` repository
4. Vercel will auto-detect settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**
6. ✅ Done! Your app is live in ~2 minutes

### Step 5: Add Custom Domain (Optional)
1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `premierselect.com`)
4. Follow DNS configuration instructions

---

## Method 2: Quick Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project folder
cd premier-select-baseball

# Deploy to Vercel
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? premier-select-baseball
# - In which directory is your code located? ./
# - Want to modify settings? N
```

### Step 4: Production Deployment
```bash
vercel --prod
```

---

## Method 3: Drag & Drop (Easiest, No Git)

### Step 1: Build Locally
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### Step 2: Deploy
1. Go to https://vercel.com/new
2. Click the **Deploy** tab
3. Drag the entire **dist** folder into the upload area
4. ✅ Deployed instantly!

**⚠️ Note:** This method doesn't auto-update. You'll need to rebuild and re-upload for changes.

---

## Environment Variables (If Needed Later)

If you add API keys or external services:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add variables like:
   - `VITE_API_KEY=your-key-here`
   - `VITE_SUPABASE_URL=your-url`

---

## Automatic Deployments

With GitHub method:
- Every `git push` to `main` = **automatic deployment**
- Vercel builds and deploys automatically
- Get preview URLs for branches

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build
```

### React Router 404 Errors
✅ Already fixed! The `vercel.json` file handles this.

### Environment Issues
Make sure all environment variables in Vercel match your local setup.

---

## Your App URLs

After deployment, you'll get:
- **Production**: `https://premier-select-baseball.vercel.app`
- **Custom Domain**: `https://yoursite.com` (if configured)
- **Preview Deployments**: Unique URLs for each branch/PR

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel.com/status

---

## Next Steps

1. ✅ Deploy to Vercel
2. 🔐 Add authentication (if needed)
3. 💾 Connect database (Supabase for persistence)
4. 📧 Set up custom domain
5. 📊 Enable Vercel Analytics
6. 🔔 Set up deployment notifications

---

**Ready to deploy?** Start with Method 1 for the best workflow! 🚀
