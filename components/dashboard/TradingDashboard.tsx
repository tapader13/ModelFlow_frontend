/**
 * QNEX 369 - Phase 4.1 Real-time Trading Dashboard
 * Professional trading interface with real-time data streams
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { AccountSummary } from "./AccountSummary";
import { PositionsList } from "./PositionsList";
import { AIConfidenceDisplay } from "./AIConfidenceDisplay";
import { RiskMetrics } from "./RiskMetrics";
import { PerformanceCharts } from "./PerformanceCharts";
import { MarketOverview } from "./MarketOverview";
import { NewsAlerts } from "./NewsAlerts";
import { TradingControls } from "./TradingControls";

export interface TradingDashboardProps {
  className?: string;
}

export const TradingDashboard: React.FC<TradingDashboardProps> = ({
  className,
}) => {
  // Real-time data streams
  const {
    connected: isConnected,
    error: connectionError,
    analysisData,
    positionsData,
    decisionsData,
    lastUpdate,
  } = useRealtimeData("all", {
    autoConnect: true,
    reconnectAttempts: 5,
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                QNEX 369 Trading Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Professional Real-time Trading Interface
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span>{isConnected ? "Live" : "Disconnected"}</span>
              </Badge>

              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Connection Error Alert */}
          {connectionError && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>
                Connection Error: {connectionError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Top Row - Account & Market Overview */}
          <div className="col-span-12 lg:col-span-4">
            <AccountSummary
              data={undefined} // Will use mock data
              isConnected={isConnected}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <MarketOverview
              data={undefined} // Will use mock data
              isConnected={isConnected}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <TradingControls
              isConnected={isConnected}
              systemStatus={undefined} // Will use mock data
            />
          </div>

          {/* Second Row - Positions & AI Confidence */}
          <div className="col-span-12 lg:col-span-8">
            <PositionsList
              positions={positionsData}
              isConnected={isConnected}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <AIConfidenceDisplay
              decisions={decisionsData}
              isConnected={isConnected}
            />
          </div>

          {/* Third Row - Risk & News */}
          <div className="col-span-12 lg:col-span-6">
            <RiskMetrics
              data={undefined} // Will use mock data
              positions={positionsData}
              isConnected={isConnected}
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <NewsAlerts
              data={undefined} // Will use mock data
              isConnected={isConnected}
            />
          </div>

          {/* Bottom Row - Performance Charts */}
          <div className="col-span-12">
            <PerformanceCharts
              data={undefined} // Will use mock data
              decisions={decisionsData}
              positions={positionsData}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>QNEX 369 v4.1</span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              System Status:{" "}
              {analysisData?.confidence ? "Active" : "Loading..."}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>Active Positions: {positionsData?.length || 0}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Server Time: {new Date().toLocaleTimeString()}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Trading Session: London</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;
