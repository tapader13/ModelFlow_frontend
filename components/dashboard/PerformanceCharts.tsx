/**
 * QNEX 369 - Performance Charts Component
 * Real-time performance visualization and analytics
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import type { PositionUpdate, TradeDecision } from "@/types/trading";

export interface PerformanceData {
  dailyPnL: number[];
  hourlyPnL: number[];
  winRate: number;
  averageReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  profitFactor: number;
}

export interface PerformanceChartsProps {
  data?: PerformanceData;
  decisions: TradeDecision[];
  positions: PositionUpdate[];
  isConnected: boolean;
  className?: string;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  data,
  decisions,
  positions,
  isConnected,
  className,
}) => {
  // Mock performance data
  const mockData: PerformanceData = {
    dailyPnL: [100, 150, -50, 200, 300, 250, 400],
    hourlyPnL: [10, 15, -5, 20, 30, 25, 40],
    winRate: 68.5,
    averageReturn: 1.2,
    sharpeRatio: 1.8,
    maxDrawdown: 5.8,
    totalTrades: 47,
    profitFactor: 2.4,
  };

  const performanceData = data || mockData;
  const totalPnL = performanceData.dailyPnL.reduce((sum, pnl) => sum + pnl, 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">
              Performance Analytics
            </CardTitle>
            {!isConnected && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="text-xs"
          >
            {isConnected ? "Live" : "Cached"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalPnL.toFixed(0)}
            </div>
            <p className="text-sm text-gray-600">Total P&L</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {performanceData.winRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Win Rate</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {performanceData.sharpeRatio.toFixed(1)}
            </div>
            <p className="text-sm text-gray-600">Sharpe Ratio</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">
              {performanceData.totalTrades}
            </div>
            <p className="text-sm text-gray-600">Total Trades</p>
          </div>
        </div>

        {/* Simple P&L Chart Representation */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Daily P&L Trend</h4>
          <div className="flex items-end space-x-1 h-24">
            {performanceData.dailyPnL.map((pnl, index) => {
              const height =
                (Math.abs(pnl) /
                  Math.max(...performanceData.dailyPnL.map(Math.abs))) *
                80;
              return (
                <div key={index} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full ${
                      pnl >= 0 ? "bg-green-500" : "bg-red-500"
                    } rounded-t`}
                    style={{ height: `${height}px` }}
                  />
                  <div className="text-xs text-center mt-1 text-gray-500">
                    Day {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Return</span>
              <span className="font-medium">
                {performanceData.averageReturn.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Drawdown</span>
              <span className="font-medium text-red-600">
                {performanceData.maxDrawdown.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Factor</span>
              <span className="font-medium text-green-600">
                {performanceData.profitFactor.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Positions</span>
              <span className="font-medium">{positions.length}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>Performance tracking active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCharts;
