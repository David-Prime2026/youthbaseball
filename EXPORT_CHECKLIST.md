# 📋 Export Checklist - What to Download

## Essential Files to Export from Figma Make

### ✅ Core Application Files
- [ ] `/src/app/App.tsx` - Main app component
- [ ] `/src/app/routes.ts` - Router configuration
- [ ] `/src/main.tsx` - App entry point
- [ ] `/index.html` - HTML template

### ✅ Components (All files in `/src/app/components/`)
- [ ] `/src/app/components/Dashboard.tsx`
- [ ] `/src/app/components/PlayerList.tsx`
- [ ] `/src/app/components/TrainingTab.tsx`
- [ ] `/src/app/components/GameStatsTab.tsx`
- [ ] `/src/app/components/GameStatsDisplay.tsx`
- [ ] `/src/app/components/PlayerCard.tsx`
- [ ] `/src/app/components/PlayerProfileEditor.tsx`
- [ ] `/src/app/components/PlayerConflictResolver.tsx`
- [ ] `/src/app/components/PhotoVerificationModal.tsx`
- [ ] `/src/app/components/PerformanceChart.tsx`
- [ ] `/src/app/components/OutlierDetectionModal.tsx`
- [ ] `/src/app/components/AIInsightsPanel.tsx`
- [ ] `/src/app/components/OfflineSyncIndicator.tsx`
- [ ] All UI components in `/src/app/components/ui/`

### ✅ Hooks (All files in `/src/app/hooks/`)
- [ ] `/src/app/hooks/usePlayerData.ts`
- [ ] `/src/app/hooks/useTrainingData.ts`
- [ ] `/src/app/hooks/useGameStats.ts`
- [ ] `/src/app/hooks/useOfflineSync.ts`

### ✅ Types (All files in `/src/app/types/`)
- [ ] `/src/app/types/player.ts`
- [ ] `/src/app/types/training.ts`
- [ ] `/src/app/types/gameStats.ts`

### ✅ Utils (All files in `/src/app/utils/`)
- [ ] `/src/app/utils/benchmarks.ts`
- [ ] `/src/app/utils/csvParser.ts`
- [ ] `/src/app/utils/photoValidation.ts`
- [ ] `/src/app/utils/aiInsights.ts`

### ✅ Styles (All files in `/src/styles/`)
- [ ] `/src/styles/theme.css`
- [ ] `/src/styles/fonts.css`
- [ ] `/src/index.css`

### ✅ Configuration Files (Root level)
- [ ] `/package.json` - Dependencies & scripts
- [ ] `/vite.config.ts` - Vite configuration
- [ ] `/tsconfig.json` - TypeScript config
- [ ] `/vercel.json` - Vercel deployment config
- [ ] `/.gitignore` - Git ignore rules
- [ ] `/README.md` - Project documentation
- [ ] `/DEPLOYMENT_GUIDE.md` - This guide!
- [ ] `/QUICK_START.md` - Quick deploy guide

### ✅ Import Files (Optional - your CSV data)
- [ ] `/src/imports/*.csv` - Your CSV files

---

## Quick Export in Figma Make

### Method 1: Export All
Look for **"Export Code"** or **"Download"** button in Figma Make interface.

### Method 2: Manual Copy
1. Click on each file
2. Copy the contents
3. Paste into corresponding file on your computer

---

## After Export - File Structure

Your folder should look like this:

```
premier-select-baseball/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── .gitignore
├── README.md
├── DEPLOYMENT_GUIDE.md
├── QUICK_START.md
└── src/
    ├── main.tsx
    ├── index.css
    ├── app/
    │   ├── App.tsx
    │   ├── routes.ts
    │   ├── components/
    │   │   ├── Dashboard.tsx
    │   │   ├── PlayerList.tsx
    │   │   ├── GameStatsTab.tsx
    │   │   ├── GameStatsDisplay.tsx
    │   │   ├── ... (all other components)
    │   │   └── ui/
    │   │       └── ... (all UI components)
    │   ├── hooks/
    │   │   └── ... (all hooks)
    │   ├── types/
    │   │   └── ... (all type files)
    │   └── utils/
    │       └── ... (all utilities)
    ├── styles/
    │   ├── theme.css
    │   └── fonts.css
    └── imports/
        └── ... (CSV files)
```

---

## Verify Your Export

```bash
# Navigate to your folder
cd premier-select-baseball

# Install dependencies
npm install

# Test locally
npm run dev

# Should open at http://localhost:5173
# ✅ If it works locally, it will work on Vercel!
```

---

## Missing Files?

If you're missing any files, you can:
1. Go back to Figma Make
2. Look in the file explorer
3. Export the missing files
4. Add them to your local folder

---

## Ready to Deploy?

Once all files are exported and tested locally:
→ See **QUICK_START.md** for deployment steps
→ See **DEPLOYMENT_GUIDE.md** for detailed guide

---

**Pro Tip:** Keep your Figma Make project as backup until deployment is successful!
