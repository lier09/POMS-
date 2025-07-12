
import React from 'react';
import { InfoIcon } from './Icons';

const Instructions: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <InfoIcon className="h-6 w-6 mr-3 text-primary-600" />
                使用说明
            </h2>
            <div className="space-y-4 text-slate-600">
                <p>
                    本工具用于分析《简式心境量表》(POMS) 的数据。请上传包含问卷回答的 Excel 文件，系统将自动计算七个维度的得分以及总心境困扰 (TMD) 指数。
                </p>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-700 mb-2">计分规则:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>紧张 (Tension)</strong>: 题目 1, 8, 15, 21, 28, 35</li>
                        <li><strong>愤怒 (Anger)</strong>: 题目 2, 9, 16, 22, 29, 36, 37</li>
                        <li><strong>疲劳 (Fatigue)</strong>: 题目 3, 10, 17, 23, 30</li>
                        <li><strong>抑郁 (Depression)</strong>: 题目 4, 11, 18, 24, 31, 38</li>
                        <li><strong>精力 (Vigor)</strong>: 题目 5, 12, 19, 25, 32, 39</li>
                        <li><strong>慌乱 (Confusion)</strong>: 题目 6, 13, 20, 26, 33</li>
                        <li><strong>自尊感 (Esteem-related mood)</strong>: 题目 7, 14, 27, 34, 40</li>
                    </ul>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-700 mb-2">TMD 计算公式:</h3>
                    <p className="text-sm font-mono bg-slate-200 text-slate-800 p-2 rounded">
                        TMD = (紧张 + 愤怒 + 疲劳 + 抑郁 + 慌乱) - (精力 + 自尊感) + 100
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Excel 文件格式要求:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>第一行为表头。</li>
                        <li>必须包含一列标题为 "姓名" 的列。</li>
                        <li>必须包含从 "1. 紧张的" 开始的40个问题列。</li>
                        <li>答案文本应为 "几乎没有", "有一点", "适中", "相当多", "非常地" 或相似的词语。</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
