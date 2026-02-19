export const CONFIG = {
  START_DATE: '2026-02-19', // 1 Ramadan 1447H
  TOTAL_DAYS: 30,
  PROFILES: [
    { id: 'naufal', name: 'Naufal', color: 'blue' },
    { id: 'fateh', name: 'Fateh', color: 'orange' },
  ] as const,
  REWARDS: {
    FAST_FULL: 1.00,
    FAST_HALF: 0.50,
    TARAWIH: 1.00,
  },
  MAX_TICKS: 60, // 30 days * 2 max ticks per day (Fast + Tarawih)
};

export const SOUNDS = {
  COIN: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Placeholder or use a generated beep
  POP: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
};
