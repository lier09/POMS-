
import { DimensionKey } from './types';

// Mapping from text answers to scores
export const SCORE_MAP: { [key: string]: number } = {
    '几乎没有': 0,
    '有一点': 1,
    '适中': 2,
    '差不多多': 2, // Handling variation from example
    '相当多': 3,
    '非常地': 4,
};

// Mapping dimensions to their corresponding question numbers (1-based index)
export const DIMENSION_QUESTIONS: { [key in DimensionKey]: number[] } = {
    tension: [1, 8, 15, 21, 28, 35],
    anger: [2, 9, 16, 22, 29, 36, 37],
    fatigue: [3, 10, 17, 23, 30],
    depression: [4, 11, 18, 24, 31, 38],
    vigor: [5, 12, 19, 25, 32, 39],
    confusion: [6, 13, 20, 26, 33],
    esteem: [7, 14, 27, 34, 40],
};

// Map dimension keys to Chinese names for display
export const DIMENSION_NAMES: { [key in DimensionKey]: string } = {
    tension: '紧张 (T)',
    anger: '愤怒 (A)',
    fatigue: '疲劳 (F)',
    depression: '抑郁 (D)',
    vigor: '精力 (V)',
    confusion: '慌乱 (C)',
    esteem: '自尊感 (E)',
};

// Max possible score for each dimension, used in RadarChart
export const DIMENSION_MAX_SCORES: { [key in DimensionKey]: number } = {
    tension: DIMENSION_QUESTIONS.tension.length * 4,
    anger: DIMENSION_QUESTIONS.anger.length * 4,
    fatigue: DIMENSION_QUESTIONS.fatigue.length * 4,
    depression: DIMENSION_QUESTIONS.depression.length * 4,
    vigor: DIMENSION_QUESTIONS.vigor.length * 4,
    confusion: DIMENSION_QUESTIONS.confusion.length * 4,
    esteem: DIMENSION_QUESTIONS.esteem.length * 4,
};
