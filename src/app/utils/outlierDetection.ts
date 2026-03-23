import { PerformanceEntry } from '../types/performance';

interface OutlierResult {
  isOutlier: boolean;
  message: string;
  standardDeviations: number;
}

export function detectOutlier(
  value: number,
  previousEntries: PerformanceEntry[],
  metricType: string
): OutlierResult {
  if (previousEntries.length < 3) {
    // Not enough data to determine outliers
    return {
      isOutlier: false,
      message: '',
      standardDeviations: 0,
    };
  }

  // Get all previous reps for this metric
  const allReps = previousEntries.flatMap(e => e.reps).filter(r => r > 0);
  
  if (allReps.length < 3) {
    return {
      isOutlier: false,
      message: '',
      standardDeviations: 0,
    };
  }

  // Calculate mean
  const mean = allReps.reduce((sum, val) => sum + val, 0) / allReps.length;

  // Calculate standard deviation
  const squaredDiffs = allReps.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / allReps.length;
  const stdDev = Math.sqrt(variance);

  // Calculate how many standard deviations away from mean
  const deviations = Math.abs((value - mean) / stdDev);

  // Flag if more than 3 standard deviations away (99.7% rule)
  const isOutlier = deviations > 3;

  let message = '';
  if (isOutlier) {
    const percentage = ((Math.abs(value - mean) / mean) * 100).toFixed(0);
    if (value > mean) {
      message = `This value is ${percentage}% higher than your average of ${mean.toFixed(1)}. This seems unusually high. Please verify.`;
    } else {
      message = `This value is ${percentage}% lower than your average of ${mean.toFixed(1)}. This seems unusually low. Please verify.`;
    }
  }

  return {
    isOutlier,
    message,
    standardDeviations: deviations,
  };
}
