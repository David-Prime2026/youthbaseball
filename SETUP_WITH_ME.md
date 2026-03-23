# 🤝 Let's Deploy Together - Step by Step

## What We're Going to Do

We'll get your Premier Select app live on the internet with a URL you can share with coaches, parents, and players!

---

## 🎯 Choose Your Path

### Path 1: GitHub + Vercel (Best for Updates)
**Best if:** You want to make updates easily in the future  
**Time:** 10 minutes  
**Difficulty:** Beginner-friendly

### Path 2: Vercel CLI (Quick & Simple)
**Best if:** You want it live fast and don't mind using terminal  
**Time:** 5 minutes  
**Difficulty:** Easy

### Path 3: Direct Upload (Fastest)
**Best if:** You just want it live RIGHT NOW  
**Time:** 2 minutes  
**Difficulty:** Super easy (but manual updates later)

---

## Let's Start! Tell Me Which Path You Want

### I'll choose **Path 1** (Recommended)

Great! Here's what we'll do:

#### Step 1: Export Your Code from Figma Make
1. Look for an **"Export"** or **"Download"** button in Figma Make
2. Download all files to a folder called `premier-select-baseball`
3. Tell me when done → **"Code downloaded"**

#### Step 2: Install Git (if you don't have it)
1. Go to: https://git-scm.com/downloads
2. Download for your OS (Windows/Mac)
3. Install with default settings
4. Tell me when done → **"Git installed"**

#### Step 3: Set Up GitHub
1. Go to: https://github.com/signup
2. Create a free account (or log in if you have one)
3. Tell me when done → **"GitHub ready"**

#### Step 4: Create Your Repository
1. Go to: https://github.com/new
2. Repository name: `premier-select-baseball`
3. Make it **Private** ✅
4. Click **Create repository**
5. **Leave this page open** - we'll need it
6. Tell me when done → **"Repo created"**

#### Step 5: Push Your Code
Now open Terminal (Mac) or Command Prompt (Windows):

```bash
# Go to your project folder
cd premier-select-baseball

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Connect to GitHub (REPLACE with YOUR username)
git remote add origin https://github.com/YOUR_USERNAME/premier-select-baseball.git

# Push!
git branch -M main
git push -u origin main
```

Tell me when done → **"Code pushed"**

#### Step 6: Deploy to Vercel
1. Go to: https://vercel.com
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel
4. Click **New Project**
5. Find `premier-select-baseball`
6. Click **Import**
7. Click **Deploy** (don't change anything)
8. Wait 2 minutes... ☕
9. 🎉 **YOU'RE LIVE!**

Copy your URL and tell me → **"Live at: [your-url]"**

---

### I'll choose **Path 2** (Vercel CLI)

Perfect! Faster but uses terminal.

#### Step 1: Export Code
1. Download all files from Figma Make
2. Put them in a folder called `premier-select-baseball`
3. Tell me when done → **"Code downloaded"**

#### Step 2: Install Node.js (if needed)
1. Check if you have it: open terminal and type `node -v`
2. If you see a version number (like v18.x.x), you're good!
3. If not, go to: https://nodejs.org
4. Download and install the LTS version
5. Tell me when done → **"Node installed"**

#### Step 3: Install Vercel CLI
Open terminal in your project folder:

```bash
cd premier-select-baseball
npm install -g vercel
```

Tell me when done → **"Vercel installed"**

#### Step 4: Login to Vercel
```bash
vercel login
```

This will open your browser. Create account or log in.  
Tell me when done → **"Logged in"**

#### Step 5: Deploy!
```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? (pick your account)
- Link to existing? **N**
- Project name? **premier-select-baseball**
- Directory? **./  (just press Enter)**
- Modify settings? **N**

Then deploy to production:
```bash
vercel --prod
```

🎉 **YOU'RE LIVE!**  
Copy your URL and tell me → **"Live at: [your-url]"**

---

### I'll choose **Path 3** (Direct Upload)

The absolute fastest!

#### Step 1: Export & Install Dependencies
1. Download all files from Figma Make
2. Put in folder `premier-select-baseball`
3. Open terminal in that folder:

```bash
cd premier-select-baseball
npm install
```

Tell me when done → **"Installed"**

#### Step 2: Build Your App
```bash
npm run build
```

This creates a `dist` folder with your production-ready app.  
Tell me when done → **"Built"**

#### Step 3: Sign Up for Vercel
1. Go to: https://vercel.com/signup
2. Create free account
3. Tell me when done → **"Account created"**

#### Step 4: Deploy!
1. Go to: https://vercel.com/new
2. Find the `dist` folder in your project
3. **Drag the ENTIRE `dist` folder** onto the Vercel page
4. Wait 30 seconds... ☕
5. 🎉 **YOU'RE LIVE!**

Copy your URL and tell me → **"Live at: [your-url]"**

---

## After Deployment - Next Steps

### Your App is Live! Now What?

✅ **Share your URL** with your team  
✅ **Test it** - upload CSV, add players  
✅ **Bookmark it** for easy access

### Want a Custom Domain?

Instead of `premier-select-baseball.vercel.app`, you could have:
- `premierselect.com`
- `premierbaseballstats.com`
- `yourteamname.com`

**How?**
1. Buy domain ($10-15/year) from Namecheap, Google Domains, etc.
2. In Vercel → Project → Settings → Domains
3. Add your domain
4. Follow DNS instructions (copy/paste some records)
5. ✅ Live at your domain in 10 minutes!

---

## Troubleshooting

### "Command not found: git"
→ Install Git: https://git-scm.com/downloads

### "Command not found: npm"
→ Install Node.js: https://nodejs.org

### Build fails on Vercel
→ Make sure all files were exported correctly  
→ Check `package.json` exists  
→ Try building locally first: `npm run build`

### "Permission denied"
→ Windows: Run terminal as Administrator  
→ Mac: Use `sudo` before command

---

## Need Help? Tell Me:

- **"Code downloaded"** - when you have files
- **"Git installed"** - when Git is ready
- **"Stuck on [step]"** - where you need help
- **"Error: [message]"** - if something breaks
- **"Live at: [url]"** - when successful! 🎉

---

## Ready? Pick your path and let's go! 🚀

Which path do you want to take? Reply with:
- **"Path 1"** for GitHub + Vercel
- **"Path 2"** for Vercel CLI  
- **"Path 3"** for Direct Upload

Or tell me: **"I'm stuck at [step]"** if you need help!
