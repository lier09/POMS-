
import React from 'react';
import { ProcessedResult, DimensionKey } from '../types';
import { DIMENSION_NAMES } from '../constants';

interface ResultsTableProps {
    results: ProcessedResult[];
    onRowClick: (result: ProcessedResult) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onRowClick }) => {
    const dimensionKeys = Object.keys(DIMENSION_NAMES) as DimensionKey[];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">姓名</th>
                        {dimensionKeys.map(key => (
                            <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {DIMENSION_NAMES[key]}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-bold">TMD</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {results.map((result) => (
                        <tr 
                            key={result.participantInfo.id} 
                            className="hover:bg-slate-100 cursor-pointer transition-colors duration-150"
                            onClick={() => onRowClick(result)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{result.participantInfo.name}</td>
                            {dimensionKeys.map(key => (
                                <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{result.scores[key]}</td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700">{result.scores.tmd}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
