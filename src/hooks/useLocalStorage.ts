import { useState, useEffect } from 'react';
import { AppState, ProfileData, DailyRecord } from '../types';
import { CONFIG } from '../constants';

const STORAGE_KEY = 'ramadan-quest-v2';

const getInitialState = (): AppState => ({
  profiles: {
    naufal: { id: 'naufal', records: {} },
    fateh: { id: 'fateh', records: {} },
  },
});

export function useLocalStorage() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : getInitialState();
    } catch (error) {
      console.error('Error reading localStorage', error);
      return getInitialState();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing localStorage', error);
    }
  }, [state]);

  const updateRecord = (profileId: string, date: string, dayIndex: number, updates: Partial<DailyRecord>) => {
    setState((prev) => {
      const profile = prev.profiles[profileId];
      const currentRecord = profile.records[date] || { date, dayIndex, fast: null, tarawih: false };
      
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [profileId]: {
            ...profile,
            records: {
              ...profile.records,
              [date]: { ...currentRecord, ...updates },
            },
          },
        },
      };
    });
  };

  const resetData = () => {
    if (confirm('Adakah anda pasti mahu reset semua data? Semua progress akan hilang!')) {
      window.localStorage.removeItem(STORAGE_KEY);
      const newState = getInitialState();
      setState(newState);
      window.location.reload();
    }
  };

  return { state, updateRecord, resetData };
}
