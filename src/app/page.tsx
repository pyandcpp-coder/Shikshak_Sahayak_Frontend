// src/app/page.tsx
"use client";

import { useState } from "react";
import SourceInput from "./components/SourceInput";
import ChatDashboard from "./components/ChatDashboard";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleProcessingSuccess = (newSessionId: string) => {
    setSessionId(newSessionId);
  };
  const handleResetSession = () => {
    setSessionId(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Shiksha Sahayak
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Transform any content into an interactive learning experience
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Upload PDFs, paste URLs, or share YouTube videos to get started
          </p>
        </div>
        
        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {!sessionId ? (
            <SourceInput onProcessingSuccess={handleProcessingSuccess} />
          ) : (
            // ✅ UPDATED: Pass the new onReset function to the ChatDashboard
            <ChatDashboard sessionId={sessionId} onReset={handleResetSession} />
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Powered by AI • Built for learners • Made with ❤️
          </p>
        </div>
      </div>
    </main>
  );
}