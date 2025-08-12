// components/CSVUploader.tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa, { ParseResult, ParseError } from 'papaparse';
import * as XLSX from 'xlsx';
import { CSVData } from '../types/types';

interface CSVUploaderProps {
  onUpload: (data: CSVData) => void;
}

export default function CSVUploader({ onUpload }: CSVUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file as any, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<Record<string, string>>) => {
          const headers = results.meta.fields || [];
          const data = results.data.map((row: Record<string, string>) => 
            headers.map((header: string) => row[header] || '')
          );
          onUpload({ headers, data });
        },
      });
    } else if (fileName.endsWith('.xlsx')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) {
          alert('Error reading Excel file.');
          return;
        }
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = Array.isArray(jsonData[0]) ? (jsonData[0] as string[]) : [];
        const rows = jsonData.slice(1).map((row: unknown) =>
          headers.map((_, i) => Array.isArray(row) ? (row[i] || '') : '')
        );
        onUpload({ headers, data: rows });
      };
      reader.onerror = () => {
        alert('Error reading Excel file.');
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file type. Please upload a CSV or Excel (.xlsx) file.');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.csv', '.txt']
    },
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`
      border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
      transition-all duration-200
      ${isDragActive 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}
    `}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-medium text-blue-500">Drop the CSV or Excel file here</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700">Drag & drop a CSV or Excel (.xlsx) file</p>
            <p className="mt-1 text-gray-500">or click to browse files</p>
          </div>
        )}
        <p className="text-sm text-gray-400 mt-4">Supports .csv and .xlsx files up to 10MB</p>
      </div>
    </div>
  );
}
