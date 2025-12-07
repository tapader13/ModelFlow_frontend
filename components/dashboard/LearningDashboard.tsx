// Learning Performance Dashboard Component
// Phase 3.1: Advanced Features & Learning

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Shield,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
} from "lucide-react";

interface LearningDashboardProps {
  className?: string;
}

interface LearningData {
  performanceInsights?: any;
  parameterOptimization?: any;
  strategyAdjustments?: any;
  learningState?: any;
  systemHealth?: any;
  recommendations?: string[];
  nextSteps?: string[];
}

interface LearningStatus {
  learningState?: any;
  currentAdjustments?: any;
  performanceStatus?: string;
  basicMetrics?: any;
  systemStatus?: any;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  className,
}) => {
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [learningStatus, setLearningStatus] = useState<LearningStatus | null>(
    null
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch learning status on component mount
  useEffect(() => {
    fetchLearningStatus();

    // Set up polling for status updates
    const statusInterval = setInterval(fetchLearningStatus, 30000); // Every 30 seconds

    return () => clearInterval(statusInterval);
  }, []);

  /**
   * Fetch current learning status
   */
  const fetchLearningStatus = async () => {
    try {
      const response = await fetch("/api/learning/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setLearningStatus(result.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(result.message || "Failed to fetch learning status");
      }
    } catch (err) {
      console.error("Error fetching learning status:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  /**
   * Trigger learning optimization
   */
  const triggerOptimization = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch("/api/learning/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forceOptimization: true,
          analysisDepth: "full",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setLearningData(result.data);
        setLastUpdate(new Date());

        // Refresh status after optimization
        await fetchLearningStatus();
      } else {
        setError(result.message || "Optimization failed");
      }
    } catch (err) {
      console.error("Error during optimization:", err);
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "needs_attention":
        return "text-red-600";
      case "stable":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "collecting":
        return "bg-blue-100 text-blue-800";
      case "analyzing":
        return "bg-yellow-100 text-yellow-800";
      case "optimizing":
        return "bg-purple-100 text-purple-800";
      case "implementing":
        return "bg-green-100 text-green-800";
      case "monitoring":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatMetric = (value: number, decimals = 1) => {
    return typeof value === "number" ? value.toFixed(decimals) : "0.0";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            Learning & Optimization
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered strategy adaptation and performance optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={triggerOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isOptimizing ? "animate-spin" : ""}`}
            />
            {isOptimizing ? "Optimizing..." : "Run Optimization"}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Learning Status Overview */}
      {learningStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning Phase</p>
                  <Badge
                    className={getPhaseColor(
                      learningStatus.learningState?.currentPhase || "collecting"
                    )}
                  >
                    {learningStatus.learningState?.currentPhase || "Collecting"}
                  </Badge>
                </div>
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              {learningStatus.learningState?.learningProgress !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${learningStatus.learningState.learningProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {learningStatus.learningState.learningProgress.toFixed(0)}%
                    complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Performance Status</p>
                  <p
                    className={`font-semibold capitalize ${getStatusColor(
                      learningStatus.performanceStatus || "stable"
                    )}`}
                  >
                    {learningStatus.performanceStatus || "Stable"}
                  </p>
                </div>
                {learningStatus.performanceStatus === "good" ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : learningStatus.performanceStatus === "needs_attention" ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : (
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                )}
              </div>
              {learningStatus.basicMetrics && (
                <div className="mt-2 text-sm text-gray-600">
                  Win Rate: {formatMetric(learningStatus.basicMetrics.winRate)}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Adjustments</p>
                  <p className="font-semibold">
                    {learningStatus.currentAdjustments ? "Yes" : "No"}
                  </p>
                </div>
                <Settings
                  className={`w-8 h-8 ${
                    learningStatus.currentAdjustments
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              {learningStatus.currentAdjustments && (
                <div className="mt-2 text-sm text-gray-600">
                  Confidence:{" "}
                  {learningStatus.currentAdjustments.confidenceThreshold}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="font-semibold">
                    {learningStatus.systemStatus?.needsAttention
                      ? "Attention"
                      : "Healthy"}
                  </p>
                </div>
                {learningStatus.systemStatus?.needsAttention ? (
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                ) : (
                  <Shield className="w-8 h-8 text-green-500" />
                )}
              </div>
              {learningStatus.basicMetrics && (
                <div className="mt-2 text-sm text-gray-600">
                  Trades: {learningStatus.basicMetrics.totalTrades}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {(learningStatus?.basicMetrics || learningData?.performanceInsights) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Win Rate */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatMetric(
                    learningData?.performanceInsights?.winRate ||
                      learningStatus?.basicMetrics?.winRate ||
                      0
                  )}
                  %
                </p>
                <p className="text-sm text-gray-600">Win Rate</p>
              </div>

              {/* Profit Factor */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatMetric(
                    learningData?.performanceInsights?.profitFactor ||
                      learningStatus?.basicMetrics?.profitFactor ||
                      0,
                    2
                  )}
                </p>
                <p className="text-sm text-gray-600">Profit Factor</p>
              </div>

              {/* Max Drawdown */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatMetric(
                    learningData?.performanceInsights?.maxDrawdown ||
                      learningStatus?.basicMetrics?.maxDrawdown ||
                      0
                  )}
                  %
                </p>
                <p className="text-sm text-gray-600">Max Drawdown</p>
              </div>

              {/* Total Trades */}
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {learningData?.performanceInsights?.totalTrades ||
                    learningStatus?.basicMetrics?.totalTrades ||
                    0}
                </p>
                <p className="text-sm text-gray-600">Total Trades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {learningData?.parameterOptimization && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Parameter Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Expected Improvement</span>
                  <Badge className="bg-green-100 text-green-800">
                    +
                    {formatMetric(
                      learningData.parameterOptimization.expectedImprovement
                    )}
                    %
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Optimization Confidence</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {formatMetric(
                      learningData.parameterOptimization.optimizationConfidence
                    )}
                    %
                  </Badge>
                </div>
                {learningData.parameterOptimization.confidenceThresholds && (
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium mb-2">Confidence Threshold</p>
                    <div className="flex justify-between text-sm">
                      <span>
                        Current:{" "}
                        {
                          learningData.parameterOptimization
                            .confidenceThresholds.current.preferred
                        }
                        %
                      </span>
                      <span>→</span>
                      <span className="text-green-600">
                        Recommended:{" "}
                        {
                          learningData.parameterOptimization
                            .confidenceThresholds.recommended.preferred
                        }
                        %
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategy Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningData.strategyAdjustments && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Risk Multiplier</span>
                      <span className="font-mono">
                        {formatMetric(
                          learningData.strategyAdjustments.riskMultiplier,
                          2
                        )}
                        x
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">
                        Implementation Duration
                      </span>
                      <span>
                        {learningData.strategyAdjustments.expectedDuration}h
                      </span>
                    </div>
                    {learningData.strategyAdjustments
                      .marketRegimeAdaptations?.[0] && (
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-medium mb-1">Market Regime</p>
                        <Badge className="capitalize">
                          {
                            learningData.strategyAdjustments
                              .marketRegimeAdaptations[0].regime
                          }
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          {
                            learningData.strategyAdjustments
                              .marketRegimeAdaptations[0].reasoning
                          }
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      {learningData?.recommendations &&
        learningData.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {learningData.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Next Steps */}
      {learningData?.nextSteps && learningData.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningData.nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      {learningData?.systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {learningData.systemHealth.learningEffectiveness}%
                </p>
                <p className="text-sm text-gray-600">Learning Effectiveness</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {learningData.systemHealth.adaptationSpeed}%
                </p>
                <p className="text-sm text-gray-600">Adaptation Speed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatMetric(
                    learningData.systemHealth.optimizationConfidence
                  )}
                  %
                </p>
                <p className="text-sm text-gray-600">Optimization Confidence</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  +{formatMetric(learningData.systemHealth.expectedImprovement)}
                  %
                </p>
                <p className="text-sm text-gray-600">Expected Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
