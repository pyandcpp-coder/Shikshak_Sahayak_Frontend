"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Globe, Play, FileText, CheckCircle } from "lucide-react";

interface SourceInputProps {
  onProcessingSuccess: (sessionId: string) => void;
}

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SourceInput({ onProcessingSuccess }: SourceInputProps) {
  const [activeTab, setActiveTab] = useState("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for each input type
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };
  
  const getApiEndpoint = () => {
    if (!API_URL) return null;
    switch (activeTab) {
      case "pdf": return `${API_URL}/process-pdf`;
      case "url": return `${API_URL}/process-url`;
      case "youtube": return `${API_URL}/process-youtube`;
      default: return null;
    }
  };

  const getRequestBody = () => {
    const formData = new FormData();
    switch (activeTab) {
      case "pdf":
        if(file) formData.append('file', file);
        return formData;
      case "url":
        return JSON.stringify({ url });
      case "youtube":
        return JSON.stringify({ url: youtubeUrl });
      default:
        return null;
    }
  };
  
  const getRequestHeaders = () => {
      if (activeTab === 'pdf') return {}; // FormData sets its own content-type
      return { 'Content-Type': 'application/json' };
  }

  const handleSubmit = async () => {
    const endpoint = getApiEndpoint();
    const body = getRequestBody();
    if (!endpoint || !body) {
        setError("API endpoint is not configured correctly.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: body,
      });

      const data = await response.json();
      if (data.status === 'success') {
        onProcessingSuccess(data.session_id);
      } else {
        throw new Error(data.message || "An unknown error occurred.");
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    switch (activeTab) {
      case "pdf": return !file;
      case "url": return !url.trim();
      case "youtube": return !youtubeUrl.trim();
      default: return true;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Choose Your Learning Source
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select the type of content you'd like to learn from
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 dark:bg-slate-700 rounded-2xl">
            <TabsTrigger 
              value="pdf" 
              className="flex items-center gap-2 rounded-xl py-3 px-4 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400"
            >
              <FileText className="w-4 h-4" />
              PDF Document
            </TabsTrigger>
            <TabsTrigger 
              value="url" 
              className="flex items-center gap-2 rounded-xl py-3 px-4 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400"
            >
              <Globe className="w-4 h-4" />
              Web Page
            </TabsTrigger>
            <TabsTrigger 
              value="youtube" 
              className="flex items-center gap-2 rounded-xl py-3 px-4 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400"
            >
              <Play className="w-4 h-4" />
              YouTube
            </TabsTrigger>
          </TabsList>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-400 transition-colors duration-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <Input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                />
                <label 
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Drop your PDF here or click to browse
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Supports PDF files up to 10MB
                </p>
                {file && (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* URL Tab */}
          <TabsContent value="url" className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Enter Website URL
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Paste any article, blog post, or webpage URL
                </p>
              </div>
              <Input 
                type="url" 
                placeholder="https://example.com/article" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                className="h-14 text-lg rounded-xl border-2 focus:border-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              />
            </div>
          </TabsContent>

          {/* YouTube Tab */}
          <TabsContent value="youtube" className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  YouTube Video URL
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn from any YouTube video content
                </p>
              </div>
              <Input 
                type="url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={youtubeUrl} 
                onChange={e => setYoutubeUrl(e.target.value)}
                className="h-14 text-lg rounded-xl border-2 focus:border-red-400 dark:focus:border-red-400 transition-colors duration-200"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="mt-8 space-y-4">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitDisabled()}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Processing your content...
              </>
            ) : (
              <>
                <CheckCircle className="mr-3 h-5 w-5" />
                Start Learning Session
              </>
            )}
          </Button>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-slate-700/50">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Smart Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            AI-powered content understanding and summarization
          </p>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-slate-700/50">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Interactive Q&A</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ask questions and get instant, contextual answers
          </p>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-slate-700/50">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Multi-Format</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Support for PDFs, websites, and YouTube videos
          </p>
        </div>
      </div>
    </div>
  );
}