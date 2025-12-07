"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, Download } from "lucide-react";

interface ChartData {
  time: string;
  value: number;
}

export default function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState("1D");

  useEffect(() => {
    // Generate sample data
    const generateData = () => {
      const data: ChartData[] = [];
      let baseValue = 12000;

      for (let i = 0; i < 24; i++) {
        baseValue += (Math.random() - 0.5) * 100;
        data.push({
          time: `${i}:00`,
          value: baseValue,
        });
      }
      return data;
    };

    setChartData(generateData());
  }, [timeframe]);

  const sessionPerformance = [
    { session: "Asian", winRate: 67, trades: "3/2", color: "bg-blue-500" },
    { session: "London", winRate: 78, trades: "7/2", color: "bg-green-500" },
    { session: "NY", winRate: 71, trades: "5/2", color: "bg-purple-500" },
    { session: "Overlap", winRate: 85, trades: "4/1", color: "bg-indigo-500" },
  ];

  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 100;
  const minValue = chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Performance Analytics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time equity curve and trading metrics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setTimeframe("1D")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                timeframe === "1D"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              1D
            </button>
            <button
              onClick={() => setTimeframe("1W")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                timeframe === "1W"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              1W
            </button>
            <button
              onClick={() => setTimeframe("1M")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                timeframe === "1M"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              1M
            </button>
          </div>
          <button className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Equity Curve
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +2.4%
              </span>
            </div>
          </div>

          <div className="h-48 relative">
            {chartData.length > 0 ? (
              <svg className="w-full h-full">
                <defs>
                  <linearGradient
                    id="equityGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#3b82f6", stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>

                {/* Chart area */}
                <path
                  d={`M 0,${100} ${chartData
                    .map(
                      (d, i) =>
                        `L ${(i / (chartData.length - 1)) * 100},${
                          100 -
                          ((d.value - minValue) / (maxValue - minValue)) * 80
                        }`
                    )
                    .join(" ")}`}
                  fill="url(#equityGradient)"
                  transform="scale(4.8,1.92)"
                />

                {/* Chart line */}
                {chartData.length > 0 && chartData[0] && (
                  <path
                    d={`M 0,${
                      100 -
                      ((chartData[0].value - minValue) / (maxValue - minValue)) *
                        80
                    } ${chartData
                      .map(
                        (d, i) =>
                          `L ${(i / (chartData.length - 1)) * 100},${
                            100 -
                            ((d.value - minValue) / (maxValue - minValue)) * 80
                          }`
                      )
                      .join(" ")}`}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                    fill="none"
                    transform="scale(4.8,1.92)"
                  />
                )}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Session Performance */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Session Performance
          </h3>
          <div className="space-y-3">
            {sessionPerformance.map((session, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.session}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {session.trades}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${session.color}`}
                      style={{ width: `${session.winRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {session.winRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
