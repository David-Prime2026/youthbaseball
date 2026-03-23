import { GameStats } from '../types/gameStats';

export function parseGameStatsCSV(csvText: string, season: string): Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>[] {
  const lines = csvText.split('\n');
  
  console.log('=== CSV PARSER START ===');
  console.log('Total lines in CSV:', lines.length);
  
  // Find the header row (row 2 in the provided format)
  const headerIndex = lines.findIndex(line => line.includes('Number') && line.includes('Last') && line.includes('First'));
  if (headerIndex === -1) {
    throw new Error('Invalid CSV format: Cannot find header row');
  }

  console.log('Header found at line:', headerIndex);
  const headers = lines[headerIndex].split(',').map(h => h.replace(/"/g, '').trim());
  const playerStats: Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Check if there's a Game Date column
  const gameDateIndex = headers.findIndex(h => h.toLowerCase().includes('date') || h.toLowerCase() === 'game');
  console.log('Game Date column index:', gameDateIndex, gameDateIndex >= 0 ? `(${headers[gameDateIndex]})` : '(not found - will use sequential dates)');

  // Process player rows (skip header, glossary, and totals)
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.toLowerCase().includes('totals') || line.toLowerCase().includes('glossary')) {
      console.log(`Line ${i}: Skipped (totals/glossary/empty)`);
      continue;
    }

    const values = parseCSVLine(line);
    if (values.length < 3) {
      console.log(`Line ${i}: Skipped - not enough values (${values.length})`);
      continue;
    }

    const playerNumber = values[0] || 'N/A'; // Allow empty player numbers
    const lastName = values[1];
    const firstName = values[2];

    if (!firstName || !lastName) {
      console.log(`Line ${i}: Skipped - missing name (firstName: "${firstName}", lastName: "${lastName}")`);
      continue;
    }
    
    // Skip if firstName or lastName are empty strings after trimming
    if (!firstName.trim() || !lastName.trim()) {
      console.log(`Line ${i}: Skipped - empty name after trim (firstName: "${firstName}", lastName: "${lastName}")`);
      continue;
    }

    console.log(`✅ Line ${i}: Processing ${firstName} ${lastName} (#${playerNumber})`);

    const playerId = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/\s+/g, '-');
    const gameDate = gameDateIndex >= 0 ? values[gameDateIndex] : new Date().toISOString().split('T')[0];

    const stats: Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'> = {
      playerId,
      playerNumber,
      lastName,
      firstName,
      season,
      gameDate,
      
      // Batting stats (columns 3-53)
      gamesPlayed: parseFloat(values[3]) || undefined,
      plateAppearances: parseFloat(values[4]) || undefined,
      atBats: parseFloat(values[5]) || undefined,
      average: parseFloat(values[6]) || undefined,
      onBasePercentage: parseFloat(values[7]) || undefined,
      onBasePlusSlugging: parseFloat(values[8]) || undefined,
      sluggingPercentage: parseFloat(values[9]) || undefined,
      hits: parseFloat(values[10]) || undefined,
      singles: parseFloat(values[11]) || undefined,
      doubles: parseFloat(values[12]) || undefined,
      triples: parseFloat(values[13]) || undefined,
      homeRuns: parseFloat(values[14]) || undefined,
      rbi: parseFloat(values[15]) || undefined,
      runs: parseFloat(values[16]) || undefined,
      walks: parseFloat(values[17]) || undefined,
      strikeouts: parseFloat(values[18]) || undefined,
      stolenBases: parseFloat(values[25]) || undefined,
      caughtStealing: parseFloat(values[27]) || undefined,
      
      // Pitching stats (columns 54-106)
      inningsPitched: parseFloat(values[54]) || undefined,
      battersFaced: parseFloat(values[57]) || undefined,
      pitchCount: parseFloat(values[58]) || undefined,
      wins: parseFloat(values[59]) || undefined,
      losses: parseFloat(values[60]) || undefined,
      saves: parseFloat(values[61]) || undefined,
      earnedRuns: parseFloat(values[66]) || undefined,
      era: parseFloat(values[68]) || undefined,
      whip: parseFloat(values[69]) || undefined,
      strikeoutsPitching: parseFloat(values[67]) || undefined,
      walksPitching: parseFloat(values[65]) || undefined,
      hitsAllowed: parseFloat(values[63]) || undefined,
      
      // Fielding stats (columns 135+)
      totalChances: parseFloat(values[135]) || undefined,
      assists: parseFloat(values[136]) || undefined,
      putouts: parseFloat(values[137]) || undefined,
      fieldingPercentage: parseFloat(values[138]) || undefined,
      errors: parseFloat(values[139]) || undefined,
    };

    playerStats.push(stats);
  }

  console.log('=== CSV PARSER COMPLETE ===');
  console.log(`✅ Successfully parsed ${playerStats.length} players:`);
  playerStats.forEach((stat, idx) => {
    console.log(`  ${idx + 1}. ${stat.firstName} ${stat.lastName} (#${stat.playerNumber}) - playerId: ${stat.playerId}`);
  });
  console.log('=========================\n');
  
  return playerStats;
}

// Helper to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}