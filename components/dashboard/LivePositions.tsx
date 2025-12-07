"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, X, Activity } from "lucide-react";

interface Position {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  openTime: string;
}

const initialPositions: Position[] = [
  {
    id: "1",
    symbol: "EUR/USD",
    type: "BUY",
    volume: 0.1,
    entryPrice: 1.1045,
    currentPrice: 1.1067,
    profit: 22.5,
    openTime: "14:23",
  },
  {
    id: "2",
    symbol: "GBP/USD",
    type: "SELL",
    volume: 0.05,
    entryPrice: 1.2741,
    currentPrice: 1.2756,
    profit: -7.5,
    openTime: "13:47",
  },
  {
    id: "3",
    symbol: "USD/JPY",
    type: "BUY",
    volume: 0.08,
    entryPrice: 149.22,
    currentPrice: 149.48,
    profit: 17.3,
    openTime: "12:15",
  },
  {
    id: "4",
    symbol: "AUD/USD",
    type: "SELL",
    volume: 0.12,
    entryPrice: 0.6834,
    currentPrice: 0.6829,
    profit: 6.0,
    openTime: "11:52",
  },
  {
    id: "5",
    symbol: "USD/CAD",
    type: "BUY",
    volume: 0.06,
    entryPrice: 1.3567,
    currentPrice: 1.3578,
    profit: 4.87,
    openTime: "10:31",
  },
];

export default function LivePositions() {
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => ({
          ...pos,
          currentPrice: pos.currentPrice + (Math.random() - 0.5) * 0.001,
          profit: pos.profit + (Math.random() - 0.5) * 2,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const closePosition = (id: string) => {
    setPositions((prev) => prev.filter((pos) => pos.id !== id));
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Live Positions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time position tracking with AI insights
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-700">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
            LIVE UPDATES
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Symbol
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Type
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Volume
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Entry
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Current
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                P&L
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Time
              </th>
              <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800">
            {positions.map((position, index) => (
              <tr
                key={position.id}
                className={`border-b border-gray-100 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 ${
                  index % 2 === 0
                    ? "bg-gray-50/30 dark:bg-slate-800/50"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                <td className="py-5 px-6 font-bold text-gray-900 dark:text-gray-100">
                  {position.symbol}
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                      position.type === "BUY"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    }`}
                  >
                    {position.type === "BUY" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {position.type}
                  </span>
                </td>
                <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-medium">
                  {position.volume}
                </td>
                <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-mono">
                  {position.entryPrice.toFixed(4)}
                </td>
                <td className="py-5 px-6 text-gray-700 dark:text-gray-300 font-mono">
                  {position.currentPrice.toFixed(4)}
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`font-bold text-lg ${
                      position.profit > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {position.profit > 0 ? "+" : ""}$
                    {position.profit.toFixed(2)}
                  </span>
                </td>
                <td className="py-5 px-6 text-gray-500 dark:text-gray-400 font-medium">
                  {position.openTime}
                </td>
                <td className="py-5 px-6">
                  <button
                    onClick={() => closePosition(position.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                  >
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
