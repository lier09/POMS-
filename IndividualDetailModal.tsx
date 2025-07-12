
import React from 'react';
import { ProcessedResult, DimensionKey } from '../types';
import { DIMENSION_NAMES } from '../constants';
import MoodChart from './MoodChart';
import { CloseIcon } from './Icons';

interface IndividualDetailModalProps {
    participant: ProcessedResult;
    onClose: () => void;
}

const IndividualDetailModal: React.FC<IndividualDetailModalProps> = ({ participant, onClose }) => {
    const dimensionKeys = Object.keys(DIMENSION_NAMES) as DimensionKey[];
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <h2 id="modal-title" className="text-xl font-bold text-slate-800">
                        {participant.participantInfo.name} 的心境状态剖面图
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                        aria-label="关闭"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </header>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-96 min-h-[24rem] w-full">
                         <MoodChart results={[]} individualResult={participant} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-3">详细得分</h3>
                        <div className="flow-root">
                            <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                                {dimensionKeys.map(key => (
                                    <li key={key} className="px-4 py-3 flex justify-between items-center">
                                        <p className="text-sm font-medium text-slate-600">{DIMENSION_NAMES[key]}</p>
                                        <p className="text-sm font-mono font-semibold text-slate-800">{participant.scores[key]}</p>
                                    </li>
                                ))}
                                <li className="px-4 py-4 flex justify-between items-center bg-slate-50 rounded-b-lg">
                                    <p className="text-base font-bold text-primary-700">总心境困扰 (TMD)</p>
                                    <p className="text-base font-mono font-bold text-primary-700">{participant.scores.tmd}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndividualDetailModal;
