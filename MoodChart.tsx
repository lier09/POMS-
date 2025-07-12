
import React from 'react';
import { ProcessedResult, DimensionKey } from '../types';
import { DIMENSION_NAMES, DIMENSION_MAX_SCORES } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

interface MoodChartProps {
    results: ProcessedResult[];
    individualResult?: ProcessedResult | null;
}

const MoodChart: React.FC<MoodChartProps> = ({ results, individualResult = null }) => {

    // Logic for individual chart
    if (individualResult) {
        const individualChartData = (Object.keys(DIMENSION_NAMES) as DimensionKey[]).map(key => ({
            subject: DIMENSION_NAMES[key],
            '个人得分': individualResult.scores[key],
            fullMark: DIMENSION_MAX_SCORES[key],
        }));
        
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={individualChartData}>
                     <defs>
                        <radialGradient id="colorInd">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </radialGradient>
                    </defs>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 2']} tick={{ fill: '#64748b', fontSize: 12 }}/>
                    <Radar name={`${individualResult.participantInfo.name} 得分`} dataKey="个人得分" stroke="#dc2626" fill="url(#colorInd)" fillOpacity={0.7} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </RadarChart>
            </ResponsiveContainer>
        );
    }

    // Existing logic for average chart
    const calculateAverages = (data: ProcessedResult[]) => {
        if (!data.length) return [];
        
        const totals: { [key in DimensionKey]: number } = {
            tension: 0, anger: 0, fatigue: 0, depression: 0, 
            vigor: 0, confusion: 0, esteem: 0
        };

        data.forEach(res => {
            (Object.keys(totals) as DimensionKey[]).forEach(key => {
                totals[key] += res.scores[key];
            });
        });

        const numParticipants = data.length;
        const chartData = (Object.keys(DIMENSION_NAMES) as DimensionKey[]).map(key => ({
            subject: DIMENSION_NAMES[key],
            '平均分': parseFloat((totals[key] / numParticipants).toFixed(2)),
            fullMark: DIMENSION_MAX_SCORES[key],
        }));

        return chartData;
    };

    const chartData = calculateAverages(results);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <defs>
                    <radialGradient id="colorAvg">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </radialGradient>
                </defs>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 2']} tick={{ fill: '#64748b', fontSize: 12 }}/>
                <Radar name="平均分" dataKey="平均分" stroke="#2563eb" fill="url(#colorAvg)" fillOpacity={0.6} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                    }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default MoodChart;
