export interface ShiftRecord {
  id: string;
  date: string;
  rate: number;
  opening: number;
  closing: number;
  volume: number;
  expected: number;
  collected: number;
  difference: number;
}

export interface Stats {
  numRate: number;
  numOpening: number;
  numClosing: number;
  numCollected: number;
  volume: number;
  expected: number;
  difference: number;
  totalVolumeToday: number;
  totalRevenueToday: number;
  isValid: boolean;
}
