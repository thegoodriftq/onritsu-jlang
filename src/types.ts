export interface StrokeMarker {
  strokeNumber: number;
  x: number; // 0 to 100 relative positioning
  y: number; // 0 to 100 relative positioning
  directionArrow?: string; // e.g. "↘", "→", "↓", etc.
  description?: string; // short text description, e.g. "Horizontal stroke"
}

export interface JapaneseCharacter {
  char: string;
  romaji: string;
  strokes: number;
  type: 'hiragana' | 'katakana';
  row: string; // e.g. "a", "ka", "sa"
  markers: StrokeMarker[];
  mnemonic?: string; // aesthetic learning helper
}

export interface StudentProgress {
  character: string;
  mastered: boolean;
  attempts: number;
  successes: number;
  bestScore: number; // percentage accuracy
  lastPracticed: string; // ISO date
}

export interface AppStats {
  hiraganaMastered: number;
  katakanaMastered: number;
  streak: number;
  totalAttempts: number;
  beginnerSeals?: string[]; // Array of mastered row IDs (e.g. "hira_a", "kata_ka")
  intermediateWins?: number; // Complete Hiragana tests passed (requires 2 for red title)
  masterSealEarned?: boolean; // Combined Hiragana & Katakana exam passed (black title)
  practiceDetails?: Record<string, { 
    attempts: number; 
    bestScore: number; 
    dateStr?: string; 
    wrongAttempts?: number;
    testAttempts?: number;
    testWrongAttempts?: number;
    testBestScore?: number;
  }>; // for consistency heatmap
  lastIntermediateAttemptTime?: number;
  lastMasterAttemptTime?: number;
  intermediateSeals?: string[];
  dailyLogs?: Record<string, { accuratePractices: string[]; inaccuratePractices: string[] }>;
}
