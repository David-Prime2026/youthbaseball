# 🔍 CSV Import Debug Instructions

## What We're Testing

We need to figure out why only 1 player is being created when importing a CSV with 10+ players.

## How to Test

### Step 1: Open Browser Console
1. Press **F12** (Windows) or **Cmd+Option+I** (Mac)
2. Click the **Console** tab
3. Keep it open for the entire test

### Step 2: Upload CSV
1. Go to the **Game Stats** tab
2. Select season: **Spring 2026**
3. Click **Choose File** and upload your CSV
4. Watch the console output

### Step 3: What to Look For

The console will now show detailed logging in 4 phases:

#### Phase 1: CSV Parser
```
=== CSV PARSER START ===
Total lines in CSV: 16
Header found at line: 1
Line 2: Skipped (totals/glossary/empty)
✅ Line 3: Processing Owen Nye (#11)
✅ Line 4: Processing Justin Ryan (#12)
✅ Line 5: Processing James Brooks (#15)
... (should see ALL players)
=== CSV PARSER COMPLETE ===
✅ Successfully parsed 10 players:
  1. Owen Nye (#11) - playerId: owen-nye
  2. Justin Ryan (#12) - playerId: justin-ryan
  ...
=========================
```

**CHECK:** Are all players being parsed? If not, which ones are skipped?

#### Phase 2: Conflict Detection
```
Checking player: Owen Nye
  → New player
Checking player: Justin Ryan
  → New player
... (should see ALL 10 players)
Total matches created: 10
```

**CHECK:** Are all parsed players showing up here? Count should match Phase 1.

#### Phase 3: Conflict Resolver UI
- Modal should pop up showing ALL players
- Top should say: "10 players found • 0 exact matches • 0 possible duplicates • 10 new"

**CHECK:** Does the modal show all players? Can you scroll through all of them?

#### Phase 4: Import Execution (after clicking "Confirm & Import")
```
=== PLAYER CONFLICT RESOLVER - CONFIRM ===
Total matches to resolve: 10
  1. Owen Nye - Action: create_new
  2. Justin Ryan - Action: create_new
  ...
==========================================

=== HANDLE RESOLVE CONFLICTS START ===
Total resolutions received: 10

Processing resolution 1/10:
  Player: Owen Nye
  Action: create_new
  → Creating new player profile...
  ✅ Created new player: {...}
  ✅ Added game stats for new player: player-123

Processing resolution 2/10:
... (should process ALL 10)

=== SUMMARY ===
New game stats to add: 10
Created count: 10
Merged count: 0
Skipped: 0
==================
```

**CHECK:** Are all 10 players being processed? Where does it stop?

---

## 🎯 Expected Results

- **Phase 1:** 10 players parsed ✅
- **Phase 2:** 10 matches created ✅
- **Phase 3:** Modal shows all 10 players ✅
- **Phase 4:** 10 players created, 10 stats added ✅
- **Final:** Alert says "10 new players created" ✅

---

## 🐛 What to Report

Please copy the ENTIRE console output and send it to me, especially:

1. The Phase 1 summary (how many players parsed?)
2. Phase 2 total matches count
3. Phase 3 - can you see all players in the modal?
4. Phase 4 - which resolution # does it stop at?
5. Any red error messages

---

## Common Issues to Check

### Issue: Parser stops early
- Look for "Line X: Skipped" messages
- Check what's different about skipped lines
- Could be missing names, empty cells, etc.

### Issue: Conflict detection loses players
- Check if "Total matches created" < "Successfully parsed" count
- The map() function should preserve all players

### Issue: Modal doesn't show all players
- Check browser inspector for DOM elements
- Modal might be cutting off content (scroll issue)

### Issue: Resolution stops partway through
- Look for which resolution # stops
- Check for errors during player creation
- Could be localStorage full, quota exceeded, etc.

---

## Quick Test

If you want to test with fewer players first:
1. Open the CSV in Excel/Numbers
2. Keep ONLY rows 1-4 (header + 2 players)
3. Save as new CSV
4. Import and check if 2 players work correctly

This will help us isolate if it's a volume issue or data issue.

---

Ready? Open that console (F12) and upload the CSV! 📊
