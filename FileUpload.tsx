
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
            onFileSelect(file);
        } else {
            alert("请上传一个有效的 Excel 文件 (.xlsx, .xls).");
        }
    }, [onFileSelect]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
            />
            <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-4 text-lg font-semibold text-slate-700">将 Excel 文件拖放到此处</p>
                <p className="mt-1 text-sm text-slate-500">或</p>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    选择文件
                </button>
                 <p className="mt-4 text-xs text-slate-400">支持 .xlsx 和 .xls 文件</p>
            </div>
        </div>
    );
};

export default FileUpload;
