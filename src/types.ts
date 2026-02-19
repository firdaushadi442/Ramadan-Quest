export type FastType = 'full' | 'half' | null;

export interface DailyRecord {
  date: string;
  dayIndex: number; // 1-30
  fast: FastType;
  tarawih: boolean;
}

export interface ProfileData {
  id: string;
  records: Record<string, DailyRecord>; // Keyed by date string YYYY-MM-DD
}

export interface AppState {
  profiles: Record<string, ProfileData>;
}
