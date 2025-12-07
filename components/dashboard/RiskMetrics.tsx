/**
 * QNEX 369 - Risk Metrics Component
 * Real-time risk monitoring and portfolio management
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react";
import type { PositionUpdate } from "@/types/trading";

export interface RiskData {
  portfolioHeat: number;
  maxDrawdown: number;
  currentDrawdown: number;
  riskRewardRatio: number;
  exposureBySymbol: Record<string, number>;
  marginUsed: number;
  marginAvailable: number;
  dailyRiskLimit: number;
  dailyRiskUsed: number;
  volatilityIndex: number;
  correlationRisk: number;
}

export interface RiskMetricsProps {
  data?: RiskData;
  positions: PositionUpdate[];
  isConnected: boolean;
  className?: string;
}

export const RiskMetrics: React.FC<RiskMetricsProps> = ({
  data,
  positions,
  isConnected,
  className,
}) => {
  // Mock risk data for demo
  const mockRiskData: RiskData = {
    portfolioHeat: 8.2,
    maxDrawdown: 5.8,
    currentDrawdown: 2.1,
    riskRewardRatio: 2.4,
    exposureBySymbol: {
      "EUR/USD": 35,
      "GBP/USD": 25,
      "USD/JPY": 40,
    },
    marginUsed: 15.5,
    marginAvailable: 84.5,
    dailyRiskLimit: 2.0,
    dailyRiskUsed: 1.2,
    volatilityIndex: 6.7,
    correlationRisk: 4.2,
  };

  const riskData = data || mockRiskData;

  const getRiskLevel = (
    value: number,
    thresholds: { low: number; medium: number }
  ) => {
    if (value <= thresholds.low)
      return { level: "low", color: "text-green-600", bg: "bg-green-500" };
    if (value <= thresholds.medium)
      return { level: "medium", color: "text-amber-600", bg: "bg-amber-500" };
    return { level: "high", color: "text-red-600", bg: "bg-red-500" };
  };

  const portfolioHeatRisk = getRiskLevel(riskData.portfolioHeat, {
    low: 5,
    medium: 10,
  });
  const drawdownRisk = getRiskLevel(riskData.currentDrawdown, {
    low: 2,
    medium: 5,
  });
  const marginRisk = getRiskLevel(riskData.marginUsed, { low: 25, medium: 50 });
  const dailyRiskUsage =
    (riskData.dailyRiskUsed / riskData.dailyRiskLimit) * 100;

  const totalPositionValue = positions.reduce(
    (sum, pos) => sum + Math.abs(pos.unrealizedPL),
    0
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">
              Risk Management
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

      <CardContent className="space-y-4">
        {/* Risk Alerts */}
        {(riskData.portfolioHeat > 10 ||
          riskData.currentDrawdown > 5 ||
          dailyRiskUsage > 80) && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {riskData.portfolioHeat > 10 && "High portfolio heat detected. "}
              {riskData.currentDrawdown > 5 &&
                "Significant drawdown in progress. "}
              {dailyRiskUsage > 80 && "Daily risk limit nearly reached. "}
              Consider reducing position sizes.
            </AlertDescription>
          </Alert>
        )}

        {/* Portfolio Heat */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span>Portfolio Heat</span>
            </span>
            <span className={`font-semibold ${portfolioHeatRisk.color}`}>
              {riskData.portfolioHeat.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${portfolioHeatRisk.bg}`}
              style={{
                width: `${Math.min((riskData.portfolioHeat / 15) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Risk threshold: 12% | Current: {portfolioHeatRisk.level} risk
          </p>
        </div>

        {/* Margin Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Margin Usage</span>
            </span>
            <span className={`font-semibold ${marginRisk.color}`}>
              {riskData.marginUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${marginRisk.bg}`}
              style={{ width: `${Math.min(riskData.marginUsed, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Available: ${riskData.marginAvailable.toFixed(0)}k
          </p>
        </div>

        {/* Daily Risk Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Daily Risk Used</span>
            </span>
            <span
              className={`font-semibold ${
                dailyRiskUsage > 80
                  ? "text-red-600"
                  : dailyRiskUsage > 60
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              {riskData.dailyRiskUsed.toFixed(1)}% /{" "}
              {riskData.dailyRiskLimit.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                dailyRiskUsage > 80
                  ? "bg-red-500"
                  : dailyRiskUsage > 60
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(dailyRiskUsage, 100)}%` }}
            />
          </div>
        </div>

        {/* Current Drawdown */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm">Current Drawdown</span>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${drawdownRisk.color}`}>
              {riskData.currentDrawdown.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              Max: {riskData.maxDrawdown.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-gray-600">Risk:Reward Ratio</p>
            <p className="font-semibold text-green-600">
              1:{riskData.riskRewardRatio.toFixed(1)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600">Volatility Index</p>
            <p className="font-semibold">
              {riskData.volatilityIndex.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Symbol Exposure */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Symbol Exposure</h4>
          <div className="space-y-2">
            {Object.entries(riskData.exposureBySymbol).map(
              ([symbol, exposure]) => (
                <div
                  key={symbol}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{symbol}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          exposure > 40
                            ? "bg-red-500"
                            : exposure > 25
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(exposure, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">
                      {exposure}%
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Active Positions Summary */}
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Active Positions</p>
              <p className="font-semibold">{positions.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Exposure</p>
              <p className="font-semibold">${totalPositionValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Risk Status */}
        <div className="flex items-center justify-center pt-2 text-xs">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                portfolioHeatRisk.level === "low" &&
                drawdownRisk.level === "low" &&
                marginRisk.level === "low"
                  ? "bg-green-500"
                  : portfolioHeatRisk.level === "high" ||
                    drawdownRisk.level === "high" ||
                    marginRisk.level === "high"
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-gray-600">
              Overall Risk:{" "}
              {portfolioHeatRisk.level === "low" &&
              drawdownRisk.level === "low" &&
              marginRisk.level === "low"
                ? "Low"
                : portfolioHeatRisk.level === "high" ||
                  drawdownRisk.level === "high" ||
                  marginRisk.level === "high"
                ? "High"
                : "Medium"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskMetrics;
