
export interface MetricValue {
  month1: number;
  month2: number;
}

export interface UserData {
  id: string;
  name: string;
  company: string;
  weight: MetricValue;
  bmi: MetricValue;
  fat: MetricValue;
  sFat: MetricValue; // Subcutaneous Fat
  muscle: MetricValue;
  vFat: MetricValue; // Visceral Fat
  // Removed bodyAge and rm to satisfy user request
}

export type MetricKey = 'weight' | 'bmi' | 'fat' | 'sFat' | 'muscle' | 'vFat';

export interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  isLowerBetter: boolean; // For color coding
  calculation?: 'diff' | 'average'; // Default is 'diff'
}
