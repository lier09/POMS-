
import React, { useState, useCallback, useMemo } from 'react';
import { ProcessedResult, MoodStatistics } from './types';
import { processExcelFile } from './services/excelProcessor';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import MoodChart from './components/MoodChart';
import Instructions from './components/Instructions';
import Spinner from './components/Spinner';
import StatisticsTable from './components/StatisticsTable';
import IndividualDetailModal from './components/IndividualDetailModal';
import SortControls from './components/SortControls';

const App: React.FC = () => {
    const [results, setResults] = useState<ProcessedResult[] | null>(null);
    const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [selectedParticipant, setSelectedParticipant] = useState<ProcessedResult | null>(null);
    const [customSortOrder, setCustomSortOrder] = useState<string[]>([]);

    const handleFileProcess = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        setStatistics(null);
        setCustomSortOrder([]);
        setFileName(file.name);
        try {
            const { results: processedData, statistics: calculatedStats } = await processExcelFile(file);
            if (processedData.length === 0) {
              setError("No valid data found in the Excel file. Please check the file format and content.");
            } else {
              setResults(processedData);
              setStatistics(calculatedStats);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred during file processing.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = () => {
        setResults(null);
        setStatistics(null);
        setError(null);
        setIsLoading(false);
        setFileName('');
        setSelectedParticipant(null);
        setCustomSortOrder([]);
    };

    const handleSelectParticipant = (participant: ProcessedResult) => {
        setSelectedParticipant(participant);
    };

    const handleCloseModal = () => {
        setSelectedParticipant(null);
    };

    const handleApplySort = (names: string[]) => {
        setCustomSortOrder(names);
    };

    const handleClearSort = () => {
        setCustomSortOrder([]);
    };

    const sortedResults = useMemo(() => {
        if (!results) return null;
        if (customSortOrder.length === 0) {
            return results;
        }

        const nameToResultMap = new Map(results.map(r => [r.participantInfo.name.trim(), r]));
        const orderedResults: ProcessedResult[] = [];
        const remainingResults = new Set(results);

        customSortOrder.forEach(name => {
            const trimmedName = name.trim();
            if (nameToResultMap.has(trimmedName)) {
                const result = nameToResultMap.get(trimmedName)!;
                orderedResults.push(result);
                remainingResults.delete(result);
            }
        });

        return [...orderedResults, ...Array.from(remainingResults)];
    }, [results, customSortOrder]);


    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 text-center tracking-tight">心境状态 (POMS) 分析器</h1>
                    <p className="text-center text-slate-500 mt-2">上传您的 POMS 调查问卷 Excel 文件以进行自动计分和可视化分析。</p>
                </header>

                <main className="space-y-8">
                    {!results && !isLoading && <Instructions />}
                    
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 w-full">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-48">
                                <Spinner />
                                <p className="mt-4 text-slate-600 font-medium">正在处理文件: {fileName}...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center">
                                <p className="text-red-600 font-bold mb-4">{error}</p>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    重试
                                </button>
                            </div>
                        ) : results ? (
                             <div className="text-center">
                                <p className="text-green-700 font-bold mb-4">成功处理文件: {fileName}</p>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    分析另一个文件
                                </button>
                            </div>
                        ) : (
                           <FileUpload onFileSelect={handleFileProcess} />
                        )}
                    </div>

                    {sortedResults && statistics && (
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">平均心境状态剖面图</h2>
                                <div className="h-96 w-full">
                                   <MoodChart results={sortedResults} />
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">统计摘要 (平均值 ± 标准差)</h2>
                                <StatisticsTable statistics={statistics} />
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">详细得分结果</h2>
                                <SortControls onApplySort={handleApplySort} onClearSort={handleClearSort} />
                                <p className="text-sm text-slate-500 mb-4">点击任意一行以查看个人详细图表。</p>
                                <ResultsTable results={sortedResults} onRowClick={handleSelectParticipant} />
                            </div>
                        </div>
                    )}
                </main>
                 <footer className="text-center mt-12 text-sm text-slate-400">
                    <p>POMS Analyzer v1.2.</p>
                    <p className="mt-1">Developed by Dr. Hu from Capital University of Physical Education and Sports.</p>
                </footer>
            </div>
            {selectedParticipant && (
                <IndividualDetailModal 
                    participant={selectedParticipant} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};

export default App;
