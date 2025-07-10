// --- FIXED: src/app/components/FileUpload.tsx ---

"use client";

import { useState } from 'react';

interface FileUploadProps {
  onUploadSuccess: (sessionId: string) => void;
}

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    if (!API_URL) {
        setError("API endpoint is not configured correctly.");
        return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/process-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed. Please check the server.');
      }

      const data = await response.json();

      if (data.status === 'success') {
        onUploadSuccess(data.session_id);
      } else {
        throw new Error(data.message || 'An error occurred during processing.');
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Upload Your Document</h2>
      <p className="text-sm text-center text-gray-500">Upload a PDF to start your interactive learning session.</p>
      
      <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
          </label>
      </div> 
      
      {file && <p className="text-sm text-center text-gray-600">Selected file: {file.name}</p>}

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="w-full px-4 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {uploading ? 'Processing...' : 'Start Learning'}
      </button>

      {error && <div className="p-3 mt-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">Error: {error}</div>}
    </div>
  );
}