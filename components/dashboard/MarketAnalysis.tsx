"use client";

import React, { useState, useEffect } from "react";
import { Brain, Clock, TrendingUp, AlertCircle } from "lucide-react";

interface EngineScore {
  name: string;
  score: number;
  color: string;
}

const initialEngineScores: EngineScore[] = [
  { name: "Technical", score: 85, color: "bg-blue-500" },
  { name: "Pattern", score: 78, color: "bg-green-500" },
  { name: "Gann", score: 92, color: "bg-purple-500" },
  { name: "Fibonacci", score: 71, color: "bg-yellow-500" },
  { name: "Fractal", score: 83, color: "bg-red-500" },
  { name: "Confluence", score: 88, color: "bg-indigo-500" },
];

export default function MarketAnalysis() {
  const [engineScores, setEngineScores] =
    useState<EngineScore[]>(initialEngineScores);
  const [currentSession, setCurrentSession] = useState("London");
  const [sessionTime, setSessionTime] = useState("2h 15m remaining");

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineScores((prev) =>
        prev.map((engine) => ({
          ...engine,
          score: Math.max(
            0,
            Math.min(100, engine.score + (Math.random() - 0.5) * 5)
          ),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const averageScore = Math.round(
    engineScores.reduce((sum, engine) => sum + engine.score, 0) /
      engineScores.length
  );

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI Market Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              6-Engine scoring system with real-time insights
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
            AI POWERED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6 Engine Scores */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              6 Engine Scores
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {averageScore}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {engineScores.map((engine) => (
              <div
                key={engine.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${engine.color}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {engine.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${engine.color}`}
                      style={{ width: `${engine.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-10 text-right">
                    {engine.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Session */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Market Session
            </h3>
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800 dark:text-green-400">
                  Current: {currentSession}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs text-green-700 dark:text-green-400">
                Active • {sessionTime}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Next Session
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  New York in 1h 45m
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Volatility
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Medium
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                  High Impact News
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-400">
                USD NFP Report in 3h 20m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
