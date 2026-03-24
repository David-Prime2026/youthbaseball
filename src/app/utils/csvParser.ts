import { GameStats } from '../types/gameStats';

export function parseGameStatsCSV(csvText: string, season: string): Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>[] {
  const lines = csvText.split('\n');

  console.log('=== CSV PARSER START ===');
  console.log('Total lines in CSV:', lines.length);

  const headerIndex = lines.findIndex(line => line.includes('Number') && line.includes('Last') && line.includes('First'));
  if (headerIndex === -1) {
    throw new Error('Invalid CSV format: Cannot find header row');
  }

  const headers = parseCSVLine(lines[headerIndex]);
  console.log('Header found at line:', headerIndex, '- Total columns:', headers.length);

  const playerStats: any[] = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.toLowerCase().includes('totals') || line.toLowerCase().includes('glossary')) continue;

    const values = parseCSVLine(line);
    if (values.length < 3) continue;

    const playerNumber = values[0] || 'N/A';
    const lastName = values[1]?.trim();
    const firstName = values[2]?.trim();

    if (!firstName || !lastName) continue;

    console.log('Processing ' + firstName + ' ' + lastName + ' (#' + playerNumber + ')');

    const playerId = (firstName.toLowerCase() + '-' + lastName.toLowerCase()).replace(/\\s+/g, '-');
    const gameDate = new Date().toISOString().split('T')[0];

    // Build raw batting object (columns 3-53)
    const rawBatting: Record<string, any> = {};
    const battingHeaders = ['GP','PA','AB','AVG','OBP','OPS','SLG','H','1B','2B','3B','HR','RBI','R','BB','SO','K-L','HBP','SAC','SF','ROE','FC','SB','SB%','CS','PIK','QAB','QAB%','PA/BB','BB/K','C%','HHB','LD%','FB%','GB%','BABIP','BA/RISP','LOB','2OUTRBI','XBH','TB','PS','PS/PA','2S+3','2S+3%','6+','6+%','AB/HR','GIDP','GITP','CI'];
    battingHeaders.forEach((h, idx) => {
      const val = values[3 + idx];
      if (val && val !== '-' && val !== 'N/A' && val !== '') {
        const num = parseFloat(val);
        rawBatting[h] = isNaN(num) ? val : num;
      }
    });

    // Build raw pitching object (columns 54-143)
    const rawPitching: Record<string, any> = {};
    const pitchingHeaders = ['IP','GP','GS','BF','#P','W','L','SV','SVO','BS','SV%','H','R','ER','BB','SO','K-L','HBP','ERA','WHIP','LOB','BK','PIK','CS','SB','SB%','WP','BAA','MPHFB','MPHCT','MPHCB','MPHSL','MPHCH','MPHOS','P/IP','P/BF','<3%','LOO','1ST2OUT','123INN','<13','FIP','S%','FPS%','FPSO%','FPSW%','FPSH%','BB/INN','0BBINN','BBS','LOBB','LOBBS','SM%','K/BF','K/BB','WEAK%','HHB%','GO/AO','HR','LD%','FB%','GB%','BABIP','BA/RISP','FB','FBS','FBS%','FBSW%','FBSM%','CT','CTS','CTS%','CTSW%','CTSM%','CB','CBS','CBS%','CBSW%','CBSM%','SL','SLS','SLS%','SLSW%','SLSM%','CH','CHS','CHS%','CHSW%','CHSM%','OS','OSS','OSS%','OSSW%','OSSM%'];
    pitchingHeaders.forEach((h, idx) => {
      const val = values[54 + idx];
      if (val && val !== '-' && val !== 'N/A' && val !== '') {
        const num = parseFloat(val);
        rawPitching[h] = isNaN(num) ? val : num;
      }
    });

    // Build raw fielding object (columns 148+)
    const rawFielding: Record<string, any> = {};
    const fieldingHeaders = ['TC','A','PO','FPCT','E','DP','TP','INN','PB','SB','SB-ATT','CS','CS%','PIK','CI','P','C','1B','2B','3B','SS','LF','CF','RF','SF','Total'];
    fieldingHeaders.forEach((h, idx) => {
      const val = values[148 + idx];
      if (val && val !== '-' && val !== 'N/A' && val !== '') {
        const num = parseFloat(val);
        rawFielding[h] = isNaN(num) ? val : num;
      }
    });

    const stats: any = {
      playerId,
      playerNumber,
      lastName,
      firstName,
      season,
      gameDate,
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
      totalChances: parseFloat(values[148]) || undefined,
      assists: parseFloat(values[149]) || undefined,
      putouts: parseFloat(values[150]) || undefined,
      fieldingPercentage: parseFloat(values[151]) || undefined,
      errors: parseFloat(values[152]) || undefined,
      // Raw JSONB data - ALL columns
      rawBatting,
      rawPitching,
      rawFielding,
    };

    playerStats.push(stats);
  }

  console.log('=== CSV PARSER COMPLETE ===');
  console.log('Parsed ' + playerStats.length + ' players');
  return playerStats;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

