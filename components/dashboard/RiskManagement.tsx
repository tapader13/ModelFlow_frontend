"use client";

import React, { useState } from "react";
import { Shield, AlertTriangle, Activity, Settings } from "lucide-react";

export default function RiskManagement() {
  const [portfolioHeat, setPortfolioHeat] = useState(75);
  const [systemMode, setSystemMode] = useState("normal");
  const [dailyTrades, setDailyTrades] = useState(8);
  const [dailyLoss, setDailyLoss] = useState(1.2);
  const [activePositions, setActivePositions] = useState(8);
  const [marginLevel, setMarginLevel] = useState(245);

  const riskLevel =
    portfolioHeat > 80 ? "high" : portfolioHeat > 60 ? "medium" : "low";
  const riskColor =
    riskLevel === "high" ? "red" : riskLevel === "medium" ? "orange" : "green";

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Risk Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced portfolio protection and monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            PROTECTED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Heat & Position Limits */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Portfolio Heat
              </h3>
              <span
                className={`text-sm font-medium ${
                  riskColor === "red"
                    ? "text-red-600 dark:text-red-400"
                    : riskColor === "orange"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {portfolioHeat}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  riskColor === "red"
                    ? "bg-red-500"
                    : riskColor === "orange"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${portfolioHeat}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>Max: 85%</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Position Limits
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Positions
                </span>
                <span className="text-sm font-medium dark:text-gray-300">
                  {activePositions}/25
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Available
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {25 - activePositions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Margin Level
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {marginLevel}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Limits & Emergency Controls */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Daily Limits
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Trades
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(dailyTrades / 15) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {dailyTrades}/15
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Loss Limit
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${(dailyLoss / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {dailyLoss}%/5%
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Risk per Trade
                </span>
                <span className="text-sm font-medium dark:text-gray-300">
                  2.4%
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              System Mode
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  🟢 Normal Mode
                </span>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                All systems operational
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                Conservative Mode
              </button>
              <button className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                Emergency Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
