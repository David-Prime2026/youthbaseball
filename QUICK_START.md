# ⚡ Quick Start - 5 Minutes to Deploy

## Fastest Path to Live Site

### Option A: I Have GitHub (Recommended)

```bash
# 1. Download all files from Figma Make to a folder

# 2. Open terminal in that folder and run:
git init
git add .
git commit -m "Initial commit"

# 3. Create repo on GitHub.com (name it premier-select-baseball)

# 4. Push code (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/premier-select-baseball.git
git branch -M main
git push -u origin main

# 5. Go to vercel.com/new
# - Click "Import Git Repository"
# - Select your repo
# - Click "Deploy"
# - ✅ DONE! Live in 2 minutes
```

---

### Option B: No GitHub? Use Vercel CLI

```bash
# 1. Download files, open terminal in folder

# 2. Install Vercel CLI:
npm install -g vercel

# 3. Login:
vercel login

# 4. Deploy:
vercel

# 5. Deploy to production:
vercel --prod

# ✅ DONE! Live in 3 minutes
```

---

### Option C: Absolute Fastest (No Setup)

```bash
# 1. In your project folder:
npm install
npm run build

# 2. Go to vercel.com/new
# 3. Drag the "dist" folder onto the page
# ✅ DONE! Live in 1 minute
```

---

## After Deployment

Your app will be at: `https://premier-select-baseball.vercel.app`

### Want a Custom Domain?
1. Buy domain (Namecheap, Google Domains, etc.)
2. In Vercel → Settings → Domains
3. Add your domain
4. Update DNS records (Vercel gives you exact instructions)
5. ✅ Live at `yoursite.com` in 10 minutes

---

## Files You Need

✅ All these files are ready in your project:
- `vercel.json` - Deployment config
- `package.json` - Dependencies
- `.gitignore` - Git config
- `README.md` - Documentation
- All `/src` files - Your app code

---

## Updating Your Live Site

**If using GitHub:**
```bash
# Make changes, then:
git add .
git commit -m "Update stats display"
git push
# ✅ Auto-deploys in 2 minutes
```

**If using Vercel CLI:**
```bash
# Make changes, then:
vercel --prod
# ✅ Deploys in 1 minute
```

---

## Help Needed?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

**Ready?** Pick an option above and go! 🚀
