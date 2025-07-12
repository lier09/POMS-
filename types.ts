
export interface ParticipantData {
  id: number;
  name: string;
  [key: string]: any; // To hold all original data from Excel
}

export interface MoodScores {
  tension: number;
  anger: number;
  fatigue: number;
  depression: number;
  vigor: number;
  confusion: number;
  esteem: number;
  tmd: number;
}

export interface ProcessedResult {
  participantInfo: {
    id: number;
    name: string;
  };
  scores: MoodScores;
  originalRow: any;
}

export type DimensionKey = 'tension' | 'anger' | 'fatigue' | 'depression' | 'vigor' | 'confusion' | 'esteem';

export type StatsKey = DimensionKey | 'tmd';

export type MoodStatistics = {
    [key in StatsKey]: {
        mean: number;
        stdDev: number;
    };
};
