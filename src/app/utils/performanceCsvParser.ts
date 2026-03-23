import { PerformanceEntry } from '../types/performance';

/**
 * CSV Format for Performance/Drill Data:
 * 
 * Player Name, Date, Drill Type, Metric Type, Rep 1, Rep 2, Rep 3, Rep 4, Rep 5, Notes, Age Group
 * John Doe, 2026-03-15, Exit Velocity, Exit Velocity, 75, 78, 76, 80, , Great session!, 12U
 * 
 * OR simplified with multiple rows per player:
 * 
 * Player Name, Date, Metric, Value 1, Value 2, Value 3, Value 4, Value 5, Notes
 */

export interface PerformanceCSVRow {
  playerName: string;
  date: string;
  drillType: string;
  metricType: string;
  reps: number[];
  notes?: string;
  ageGroup?: string;
}

export function parsePerformanceCSV(
  csvText: string, 
  category: 'Batting' | 'Pitching' | 'Running' | 'Strength'
): PerformanceCSVRow[] {
  const lines = csvText.split('\n');
  
  console.log('=== PERFORMANCE CSV PARSER START ===');
  console.log('Category:', category);
  console.log('Total lines:', lines.length);
  
  // Find header (first non-empty line)
  const headerIndex = lines.findIndex(line => line.trim().length > 0);
  if (headerIndex === -1) {
    throw new Error('CSV file is empty');
  }

  const headers = parseCSVLine(lines[headerIndex]).map(h => h.toLowerCase().trim());
  console.log('Headers found:', headers);

  // Detect column indices
  const nameCol = headers.findIndex(h => 
    h.includes('player') || h.includes('name')
  );
  const dateCol = headers.findIndex(h => 
    h.includes('date')
  );
  const drillCol = headers.findIndex(h => 
    h.includes('drill') || h.includes('exercise') || h.includes('type')
  );
  const metricCol = headers.findIndex(h => 
    h.includes('metric') && !h.includes('value')
  );
  const notesCol = headers.findIndex(h => 
    h.includes('note')
  );
  const ageGroupCol = headers.findIndex(h => 
    h.includes('age') && h.includes('group')
  );

  // Find value columns (Rep 1, Rep 2, Value 1, Value 2, etc.)
  const valueColumns: number[] = [];
  headers.forEach((h, idx) => {
    if (
      h.includes('rep') || 
      h.includes('value') || 
      h.includes('attempt') ||
      h.match(/^(r|v|attempt)\s*\d+$/)
    ) {
      valueColumns.push(idx);
    }
  });

  console.log('Column mapping:', {
    name: nameCol,
    date: dateCol,
    drill: drillCol,
    metric: metricCol,
    notes: notesCol,
    ageGroup: ageGroupCol,
    values: valueColumns,
  });

  if (nameCol === -1) {
    throw new Error('Could not find "Player Name" column in CSV');
  }

  if (valueColumns.length === 0) {
    throw new Error('Could not find any value columns (Rep 1, Rep 2, etc.) in CSV');
  }

  const results: PerformanceCSVRow[] = [];

  // Parse data rows
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      console.log(`Line ${i}: Skipped (empty)`);
      continue;
    }

    const values = parseCSVLine(line);
    if (values.length < 2) {
      console.log(`Line ${i}: Skipped (not enough values)`);
      continue;
    }

    const playerName = values[nameCol]?.trim();
    if (!playerName) {
      console.log(`Line ${i}: Skipped (no player name)`);
      continue;
    }

    const date = dateCol >= 0 && values[dateCol] 
      ? values[dateCol].trim() 
      : new Date().toISOString().split('T')[0];

    const drillType = drillCol >= 0 && values[drillCol]
      ? values[drillCol].trim()
      : 'General Drill';

    const metricType = metricCol >= 0 && values[metricCol]
      ? values[metricCol].trim()
      : drillType; // Use drill type as metric if not specified

    const notes = notesCol >= 0 && values[notesCol]
      ? values[notesCol].trim()
      : '';

    const ageGroup = ageGroupCol >= 0 && values[ageGroupCol]
      ? values[ageGroupCol].trim()
      : '12U';

    // Extract rep values
    const reps: number[] = [];
    valueColumns.forEach(colIdx => {
      const val = values[colIdx];
      if (val && val.trim()) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          reps.push(num);
        }
      }
    });

    if (reps.length === 0) {
      console.log(`Line ${i}: Skipped (no valid rep values)`);
      continue;
    }

    console.log(`✅ Line ${i}: ${playerName} - ${drillType} - ${reps.length} reps`);

    results.push({
      playerName,
      date,
      drillType,
      metricType,
      reps,
      notes,
      ageGroup,
    });
  }

  console.log('=== PERFORMANCE CSV PARSER COMPLETE ===');
  console.log(`✅ Parsed ${results.length} entries`);
  console.log('========================================\n');

  return results;
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

/**
 * Convert parsed CSV rows to PerformanceEntry objects
 */
export function convertToPerformanceEntries(
  csvRows: PerformanceCSVRow[],
  category: 'Batting' | 'Pitching' | 'Running' | 'Strength',
  players: Array<{ id: string; name: string }>
): Omit<PerformanceEntry, 'id'>[] {
  return csvRows.map(row => {
    // Find matching player by name
    const player = players.find(p => 
      p.name.toLowerCase() === row.playerName.toLowerCase() ||
      p.name.toLowerCase().includes(row.playerName.toLowerCase()) ||
      row.playerName.toLowerCase().includes(p.name.toLowerCase().split(' ')[1] || '')
    );

    const playerId = player?.id || `player-${Date.now()}-${Math.random()}`;
    const playerName = player?.name || row.playerName;

    return {
      playerId,
      playerName,
      ageGroup: row.ageGroup as any || '12U',
      category,
      drillType: row.drillType,
      metricType: row.metricType,
      reps: row.reps,
      notes: row.notes || '',
      date: row.date,
      season: determineSeason(row.date),
    };
  });
}

function determineSeason(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();

  if (month >= 3 && month <= 5) return `Spring ${year}`;
  if (month >= 6 && month <= 8) return `Summer ${year}`;
  if (month >= 9 && month <= 11) return `Fall ${year}`;
  return `Winter ${year}`;
}
