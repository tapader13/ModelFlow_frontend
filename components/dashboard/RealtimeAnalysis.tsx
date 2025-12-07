/**
 * Real-time Analysis Dashboard Component
 * QNEX 369 Phase 2 Implementation - Live Updates
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

// Simple Progress Component replacement for build fix
const SimpleProgress = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <div className={`bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import { useAnalysisUpdates } from "@/hooks/use-realtime-data";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Brain,
  Target,
  Wifi,
  WifiOff,
} from "lucide-react";

interface EngineStatus {
  name: string;
  confidence: number;
  signal: "buy" | "sell" | "hold";
  lastUpdate: Date;
  status: "active" | "inactive" | "error";
}

export default function RealtimeAnalysisDashboard() {
  const {
    connected,
    connecting,
    error,
    analysisData,
    engineResults,
    lastUpdate,
    requestAnalysis,
  } = useAnalysisUpdates();

  const [selectedSymbol, setSelectedSymbol] = useState("EUR_USD");
  const [engineStatuses, setEngineStatuses] = useState<EngineStatus[]>([
    {
      name: "Technical",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
    {
      name: "Pattern",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
    {
      name: "Structure",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
    {
      name: "Gann",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
    {
      name: "Fibonacci",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
    {
      name: "Fractal",
      confidence: 0,
      signal: "hold",
      lastUpdate: new Date(),
      status: "inactive",
    },
  ]);

  const [overallConsensus, setOverallConsensus] = useState<{
    signal: "buy" | "sell" | "hold";
    confidence: number;
    agreement: number;
  }>({
    signal: "hold",
    confidence: 0,
    agreement: 0,
  });

  // Update engine statuses when new engine results arrive
  useEffect(() => {
    if (Object.keys(engineResults).length > 0) {
      setEngineStatuses((prev) =>
        prev.map((engine) => {
          const result = engineResults[engine.name];
          if (result) {
            return {
              ...engine,
              confidence: result.confidence,
              signal: result.signal,
              lastUpdate: new Date(),
              status: "active" as const,
            };
          }
          return engine;
        })
      );
    }
  }, [engineResults]);

  // Update consensus when analysis data changes
  useEffect(() => {
    if (analysisData) {
      setOverallConsensus({
        signal: analysisData.recommendation,
        confidence: analysisData.confidence,
        agreement: calculateAgreement(engineStatuses),
      });
    }
  }, [analysisData, engineStatuses]);

  const calculateAgreement = (engines: EngineStatus[]): number => {
    const activeEngines = engines.filter((e) => e.status === "active");
    if (activeEngines.length === 0) return 0;

    const signals = activeEngines.map((e) => e.signal);
    const dominantSignal = signals.reduce((a, b) =>
      signals.filter((s) => s === a).length >=
      signals.filter((s) => s === b).length
        ? a
        : b
    );

    const agreement =
      signals.filter((s) => s === dominantSignal).length / signals.length;
    return Math.round(agreement * 100);
  };

  const getSignalIcon = (signal: "buy" | "sell" | "hold") => {
    switch (signal) {
      case "buy":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "sell":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSignalColor = (signal: "buy" | "sell" | "hold") => {
    switch (signal) {
      case "buy":
        return "bg-green-500";
      case "sell":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const symbols = [
    "EUR_USD",
    "GBP_USD",
    "USD_JPY",
    "AUD_USD",
    "USD_CAD",
    "USD_CHF",
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Real-time Analysis Engine</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {connected ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : connecting ? (
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-600"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Connecting...
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-600"
                >
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Last: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          {error && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
            <Button
              onClick={() => requestAnalysis(selectedSymbol)}
              disabled={!connected}
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Trigger Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Consensus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>AI Consensus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getSignalIcon(overallConsensus.signal)}
                <span className="text-lg font-semibold capitalize">
                  {overallConsensus.signal}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`${getSignalColor(
                  overallConsensus.signal
                )} text-white border-none`}
              >
                Signal: {overallConsensus.signal.toUpperCase()}
              </Badge>
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getConfidenceColor(
                  overallConsensus.confidence
                )}`}
              >
                {overallConsensus.confidence}%
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
              <SimpleProgress
                value={overallConsensus.confidence}
                className="mt-2 h-2"
              />
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getConfidenceColor(
                  overallConsensus.agreement
                )}`}
              >
                {overallConsensus.agreement}%
              </div>
              <div className="text-sm text-gray-600">Engine Agreement</div>
              <SimpleProgress
                value={overallConsensus.agreement}
                className="mt-2 h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle>6-Engine Real-time Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engineStatuses.map((engine) => (
              <div
                key={engine.name}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  engine.status === "active"
                    ? "border-green-200 bg-green-50"
                    : engine.status === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{engine.name}</h4>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      engine.status === "active"
                        ? "bg-green-500"
                        : engine.status === "error"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSignalIcon(engine.signal)}
                    <span className="text-sm capitalize">{engine.signal}</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${getConfidenceColor(
                      engine.confidence
                    )}`}
                  >
                    {engine.confidence}%
                  </span>
                </div>

                <SimpleProgress
                  value={engine.confidence}
                  className="h-1 mb-2"
                />

                <div className="text-xs text-gray-500">
                  {engine.status === "active"
                    ? `Updated: ${engine.lastUpdate.toLocaleTimeString()}`
                    : "Waiting for data..."}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Analysis Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Symbol</h4>
                  <p className="text-gray-600">{analysisData.symbol}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timestamp</h4>
                  <p className="text-gray-600">
                    {analysisData.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>

              {analysisData.consensus && (
                <div>
                  <h4 className="font-semibold mb-2">Consensus Details</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      {JSON.stringify(analysisData.consensus, null, 2)}
                    </p>
                  </div>
                </div>
              )}

              {analysisData.claudeAnalysis && (
                <div>
                  <h4 className="font-semibold mb-2">AI Analysis</h4>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm">
                      {analysisData.claudeAnalysis.reasoning}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Market Regime:{" "}
                        {analysisData.claudeAnalysis.marketRegime}
                      </span>
                      <span className="text-xs text-gray-600">
                        Confidence: {analysisData.claudeAnalysis.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === "development" && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              <div>Connected: {connected.toString()}</div>
              <div>
                Engine Results Count: {Object.keys(engineResults).length}
              </div>
              <div>Analysis Data: {analysisData ? "Available" : "None"}</div>
              <div>Last Update: {lastUpdate?.toISOString() || "Never"}</div>
              {error && <div className="text-red-600">Error: {error}</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
