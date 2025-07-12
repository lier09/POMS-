
import React, { useState } from 'react';

interface SortControlsProps {
    onApplySort: (names: string[]) => void;
    onClearSort: () => void;
}

const SortControls: React.FC<SortControlsProps> = ({ onApplySort, onClearSort }) => {
    const [nameList, setNameList] = useState('');

    const handleApply = () => {
        const names = nameList
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        onApplySort(names);
    };

    const handleClear = () => {
        setNameList('');
        onClearSort();
    };

    return (
        <details className="bg-slate-50 border border-slate-200 rounded-lg mb-4">
            <summary className="cursor-pointer p-4 font-semibold text-slate-700 hover:bg-slate-100 rounded-t-lg transition-colors">
                自定义结果排序
            </summary>
            <div className="p-4 border-t border-slate-200">
                <label htmlFor="name-order" className="block text-sm font-medium text-slate-600 mb-2">
                    在此处粘贴姓名列表，每行一个，以按所需顺序对下面的结果进行排序。
                </label>
                <textarea
                    id="name-order"
                    rows={6}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono"
                    placeholder={"张三\n李四\n王五"}
                    value={nameList}
                    onChange={(e) => setNameList(e.target.value)}
                    aria-label="Custom sort order name list"
                />
                <div className="mt-4 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleApply}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        应用排序
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        清除排序
                    </button>
                </div>
            </div>
        </details>
    );
};

export default SortControls;
