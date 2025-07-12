
import React from 'react';
import { MoodStatistics, StatsKey } from '../types';
import { DIMENSION_NAMES } from '../constants';

interface StatisticsTableProps {
    statistics: MoodStatistics;
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ statistics }) => {
    // Ensure a specific order: dimensions first, then TMD
    const orderedKeys: StatsKey[] = [
        ...(Object.keys(DIMENSION_NAMES) as StatsKey[]),
        'tmd'
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="w-1/2 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            维度
                        </th>
                        <th scope="col" className="w-1/2 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            平均值 ± 标准差
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {orderedKeys.map(key => {
                        const stat = statistics[key];
                        if (!stat) return null; // Gracefully handle if a key is missing

                        const name = key === 'tmd' ? '总心境困扰 (TMD)' : DIMENSION_NAMES[key];
                        
                        return (
                            <tr key={key} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                    {name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                                    {`${stat.mean.toFixed(2)} ± ${stat.stdDev.toFixed(2)}`}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StatisticsTable;
