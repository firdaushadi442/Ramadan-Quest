import { CONFIG } from '../constants';
import { DailyRecord, ProfileData } from '../types';

export function calculateStats(profile: ProfileData) {
  let totalMoney = 0;
  let totalTicks = 0;
  let fullFasts = 0;
  let halfFasts = 0;
  let tarawihs = 0;
  let completedDays = 0;

  Object.values(profile.records).forEach((record: DailyRecord) => {
    if (record.fast === 'full') {
      totalMoney += CONFIG.REWARDS.FAST_FULL;
      fullFasts++;
      totalTicks++;
    } else if (record.fast === 'half') {
      totalMoney += CONFIG.REWARDS.FAST_HALF;
      halfFasts++;
      totalTicks++; // Half fast still counts as a "tick" for growth? The prompt says "Setiap tick (puasa atau tarawih)". Assuming half fast counts.
    }

    if (record.tarawih) {
      totalMoney += CONFIG.REWARDS.TARAWIH;
      tarawihs++;
      totalTicks++;
    }

    if (record.fast === 'full' && record.tarawih) {
      completedDays++;
    }
  });

  return {
    totalMoney,
    totalTicks,
    fullFasts,
    halfFasts,
    tarawihs,
    completedDays
  };
}

export function getDayStatus(date: string, currentDateStr: string) {
  const targetDate = new Date(date);
  const currentDate = new Date(currentDateStr);

  if (date === currentDateStr) return 'today';
  if (targetDate < currentDate) return 'past';
  return 'future';
}
