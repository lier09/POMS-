
import * as XLSX from 'xlsx';
import { ProcessedResult, MoodScores, DimensionKey, MoodStatistics, StatsKey } from '../types';
import { SCORE_MAP, DIMENSION_QUESTIONS, DIMENSION_NAMES } from '../constants';

// Helper to gracefully convert text to score
const getTextToScore = (text: string | undefined): number => {
    if (typeof text !== 'string' || !text.trim()) {
        return 0; // Default score for empty or non-string cells
    }
    const cleanText = text.trim();
    // Use find to allow for partial matches like "几乎没有一点" matching "几乎没有"
    const matchedKey = Object.keys(SCORE_MAP).find(key => cleanText.includes(key));
    return matchedKey ? SCORE_MAP[matchedKey] : 0; // Default to 0 if no match found
};

const calculateStatistics = (results: ProcessedResult[]): MoodStatistics => {
    const stats: Partial<MoodStatistics> = {};
    const keys: StatsKey[] = [...(Object.keys(DIMENSION_NAMES) as DimensionKey[]), 'tmd'];
    const n = results.length;

    if (n === 0) {
        // Return zero-filled stats if no results to avoid division by zero
        const zeroStats: any = {};
        for (const key of keys) {
            zeroStats[key] = { mean: 0, stdDev: 0 };
        }
        return zeroStats as MoodStatistics;
    }

    keys.forEach(key => {
        const scores = results.map(r => r.scores[key]);
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const mean = sum / n;

        // Calculate standard deviation
        const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
        const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / n;
        const stdDev = Math.sqrt(variance);

        stats[key] = { mean, stdDev };
    });

    return stats as MoodStatistics;
};


export const processExcelFile = (file: File): Promise<{ results: ProcessedResult[]; statistics: MoodStatistics }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            try {
                if (!event.target?.result) {
                    throw new Error("Failed to read file.");
                }

                const data = new Uint8Array(event.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                if (jsonData.length < 2) {
                    throw new Error("Excel file is empty or contains only a header row.");
                }

                const headerRow = jsonData[0];
                const dataRows = jsonData.slice(1);

                // Dynamically find column indices
                const nameColumnIndex = headerRow.findIndex(h => typeof h === 'string' && h.includes('姓名'));
                const idColumnIndex = headerRow.findIndex(h => typeof h === 'string' && h.includes('序号'));
                
                // Find the starting column of the questions by looking for a pattern like "1." or "1. "
                const questionStartColumnIndex = headerRow.findIndex(h => typeof h === 'string' && /^\s*1\s*\./.test(h));
                
                if (nameColumnIndex === -1) throw new Error("Could not find '姓名' column in the Excel file.");
                if (questionStartColumnIndex === -1) throw new Error("Could not find the first question column (e.g., '1. 紧张的'). Please ensure it's in the header.");


                const processedResults: ProcessedResult[] = dataRows.map((row, index) => {
                    const participantInfo = {
                        id: row[idColumnIndex] || index + 1,
                        name: row[nameColumnIndex] || `Participant ${index + 1}`,
                    };

                    const questionAnswers = row.slice(questionStartColumnIndex, questionStartColumnIndex + 40);
                    const questionScores = questionAnswers.map(answer => getTextToScore(answer));

                    const scores: Partial<MoodScores> = {};

                    let negativeSum = 0;
                    let positiveSum = 0;

                    Object.keys(DIMENSION_QUESTIONS).forEach(dim => {
                        const key = dim as DimensionKey;
                        const totalScore = DIMENSION_QUESTIONS[key].reduce((sum, qNum) => {
                            return sum + (questionScores[qNum - 1] || 0);
                        }, 0);
                        scores[key] = totalScore;

                        if (key === 'vigor' || key === 'esteem') {
                            positiveSum += totalScore;
                        } else {
                            negativeSum += totalScore;
                        }
                    });

                    scores.tmd = negativeSum - positiveSum + 100;

                    return {
                        participantInfo,
                        scores: scores as MoodScores,
                        originalRow: row,
                    };
                }).filter(r => r.participantInfo.name && !String(r.participantInfo.name).trim().startsWith('Participant')); // Filter out potentially empty rows

                const statistics = calculateStatistics(processedResults);
                
                resolve({ results: processedResults, statistics });

            } catch (error) {
                console.error("Error processing Excel file:", error);
                if (error instanceof Error) {
                    reject(new Error(`File processing failed: ${error.message}`));
                } else {
                    reject(new Error("An unknown error occurred during file processing."));
                }
            }
        };

        reader.onerror = (error) => {
            reject(new Error("Error reading file: " + error));
        };

        reader.readAsArrayBuffer(file);
    });
};
