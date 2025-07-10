// --- FIXED (v2): src/app/components/ChatDashboard.tsx ---

"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  MessageCircle,
  FileText,
  HelpCircle,
  Loader2,
  BookOpen,
  Brain,
  Target,
  Lightbulb,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

interface ChatDashboardProps {
  sessionId: string;
  onReset: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  userAnswers: string[];
  showResults: boolean;
  score: number;
}

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatDashboard({ sessionId, onReset }: ChatDashboardProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [summary, setSummary] = useState("");
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    userAnswers: [],
    showResults: false,
    score: 0
  });
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !API_URL) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          query: currentMessage
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.status === 'success' ? data.response : `Error: ${data.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (_err) { // FIXED: err changed to _err as it's not used
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = useCallback(async () => {
    if (!API_URL) return;
    setIsGeneratingSummary(true);
    try {
      const response = await fetch(`${API_URL}/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [sessionId]);

  const generateQuiz = async () => {
    if (!API_URL) return;
    setIsGeneratingQuiz(true);
    try {
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();
      if (data.status === 'success') {
        const questions = JSON.parse(data.quiz_data);
        setQuizState({
          questions,
          currentQuestion: 0,
          userAnswers: [],
          showResults: false,
          score: 0
        });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizState.userAnswers, answer];

    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        userAnswers: newAnswers
      }));
    } else {
      // Calculate final score
      const score = newAnswers.reduce((acc, ans, idx) => {
        return acc + (ans === quizState.questions[idx].correct_answer ? 1 : 0);
      }, 0);

      setQuizState(prev => ({
        ...prev,
        userAnswers: newAnswers,
        showResults: true,
        score
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      userAnswers: [],
      showResults: false,
      score: 0
    });
  };

  useEffect(() => {
    // Auto-generate summary when component mounts
    generateSummary();
  }, [generateSummary]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                onClick={onReset} 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Learning Session</h2>
                <p className="text-indigo-100 text-sm">Session ID: {sessionId.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-slate-700 border-b">
            <TabsTrigger value="chat" className="flex items-center gap-2 py-3">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2 py-3">
              <FileText className="w-4 h-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2 py-3">
              <HelpCircle className="w-4 h-4" />
              Quiz
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="p-6">
            <div className="flex flex-col h-[600px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 dark:bg-slate-700 rounded-2xl p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Start Your Learning Journey
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ask me anything about your content. I'm here to help you learn!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-3 bg-white dark:bg-slate-700 rounded-2xl p-3 border border-gray-200 dark:border-slate-600">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything about your content..."
                  className="flex-1 border-none bg-transparent focus:ring-0 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Content Summary</h3>
                    <p className="text-gray-600 dark:text-gray-300">Key insights from your content</p>
                  </div>
                </div>
                <Button
                  onClick={generateSummary}
                  disabled={isGeneratingSummary}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                >
                  {isGeneratingSummary ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Regenerate
                </Button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border border-blue-200 dark:border-slate-500">
                {isGeneratingSummary ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-blue-600 dark:text-blue-400">Generating summary...</span>
                  </div>
                ) : summary ? (
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                      {summary}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Click "Regenerate" to create a summary</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Knowledge Quiz</h3>
                    <p className="text-gray-600 dark:text-gray-300">Test your understanding</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={generateQuiz}
                    disabled={isGeneratingQuiz}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    {isGeneratingQuiz ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Generate Quiz
                  </Button>
                  {quizState.questions.length > 0 && (
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border border-green-200 dark:border-slate-500">
                {isGeneratingQuiz ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    <span className="ml-3 text-green-600 dark:text-green-400">Generating quiz...</span>
                  </div>
                ) : quizState.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Click "Generate Quiz" to create questions</p>
                  </div>
                ) : quizState.showResults ? (
                  <div className="text-center space-y-6">
                    <div className="text-6xl font-bold text-green-600 dark:text-green-400">
                      {Math.round((quizState.score / quizState.questions.length) * 100)}%
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Complete!</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        You scored {quizState.score} out of {quizState.questions.length} questions correctly.
                      </p>
                    </div>
                    <Button
                      onClick={resetQuiz}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                    >
                      Take Quiz Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Question {quizState.currentQuestion + 1} of {quizState.questions.length}
                      </span>
                      <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((quizState.currentQuestion + 1) / quizState.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-600">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        {quizState.questions[quizState.currentQuestion]?.question}
                      </h4>

                      <div className="space-y-3">
                        {quizState.questions[quizState.currentQuestion]?.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(option)}
                            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-slate-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-gray-800 dark:text-gray-200">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}