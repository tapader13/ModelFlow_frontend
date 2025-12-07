/**
 * QNEX 369 - AI Confidence Display Component
 * Real-time AI decision tracking and confidence visualization
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { TradeDecision } from "@/types/trading";

export interface AIConfidenceDisplayProps {
  decisions: TradeDecision[];
  isConnected: boolean;
  className?: string;
}

export const AIConfidenceDisplay: React.FC<AIConfidenceDisplayProps> = ({
  decisions,
  isConnected,
  className,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  // Extended decision interface for display purposes
  interface ExtendedDecision extends TradeDecision {
    id?: string;
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    riskReward?: number;
    reasoning?: string;
  }

  // Mock decisions for demo when no real data
  const mockDecisions: ExtendedDecision[] = [
    {
      id: "decision_1",
      symbol: "EUR/USD",
      direction: "buy",
      confidence: 78,
      timestamp: new Date(),
      reasoning:
        "Strong bullish momentum confirmed by multiple indicators. RSI oversold recovery, MACD bullish crossover, and fundamental EUR strength.",
      claudeReasoning:
        "Strong bullish momentum confirmed by multiple indicators.",
      entryPrice: 1.0872,
      stopLoss: 1.082,
      takeProfit: 1.092,
      riskReward: 2.3,
      engineVotes: [
        {
          engineName: "Technical Analysis",
          engine: "technical",
          vote: "buy",
          direction: "buy",
          confidence: 85,
          reasoning: "Bullish indicators",
          weight: 1.0,
        },
        {
          engineName: "Fundamental Analysis",
          engine: "fundamental",
          vote: "buy",
          direction: "buy",
          confidence: 72,
          reasoning: "EUR strength",
          weight: 0.8,
        },
        {
          engineName: "Sentiment Analysis",
          engine: "sentiment",
          vote: "buy",
          direction: "buy",
          confidence: 76,
          reasoning: "Positive sentiment",
          weight: 0.6,
        },
        {
          engineName: "Risk Assessment",
          engine: "risk",
          vote: "buy",
          direction: "buy",
          confidence: 68,
          reasoning: "Acceptable risk",
          weight: 0.9,
        },
      ],
      executed: false,
      sessionType: "london",
    },
    {
      id: "decision_2",
      symbol: "GBP/USD",
      direction: "sell",
      confidence: 65,
      timestamp: new Date(Date.now() - 300000),
      reasoning:
        "Bearish divergence on 4H chart. Brexit concerns weighing on GBP fundamentals.",
      claudeReasoning:
        "Bearish divergence detected with fundamental headwinds.",
      entryPrice: 1.2635,
      stopLoss: 1.268,
      takeProfit: 1.258,
      riskReward: 1.2,
      engineVotes: [
        {
          engineName: "Technical Analysis",
          engine: "technical",
          vote: "sell",
          direction: "sell",
          confidence: 70,
          reasoning: "Bearish divergence",
          weight: 1.0,
        },
        {
          engineName: "Fundamental Analysis",
          engine: "fundamental",
          vote: "sell",
          direction: "sell",
          confidence: 60,
          reasoning: "Brexit concerns",
          weight: 0.8,
        },
        {
          engineName: "Sentiment Analysis",
          engine: "sentiment",
          vote: "sell",
          direction: "sell",
          confidence: 58,
          reasoning: "Negative sentiment",
          weight: 0.6,
        },
        {
          engineName: "Risk Assessment",
          engine: "risk",
          vote: "sell",
          direction: "sell",
          confidence: 72,
          reasoning: "Good risk setup",
          weight: 0.9,
        },
      ],
      executed: false,
      sessionType: "london",
    },
  ];

  const recentDecisions: ExtendedDecision[] =
    decisions.length > 0
      ? (decisions.map((d, index) => ({
          ...d,
          id: d._id?.toString() || `decision_${index}`,
        })) as ExtendedDecision[])
      : mockDecisions;
  const latestDecision = recentDecisions[0];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-blue-600";
    return "text-amber-600";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80)
      return <Badge className="bg-green-500">High Confidence</Badge>;
    if (confidence >= 60)
      return <Badge className="bg-blue-500">Medium Confidence</Badge>;
    return <Badge variant="secondary">Low Confidence</Badge>;
  };

  const getDirectionIcon = (direction: "buy" | "sell") => {
    return direction === "buy" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getEngineColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">
              AI Decision Center
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
        {recentDecisions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Brain className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>No recent AI decisions</p>
            <p className="text-sm mt-1">AI analysis will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestDecision && (
              <>
                {/* Latest Decision Header */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getDirectionIcon(latestDecision.direction)}
                    <div>
                      <h4 className="font-semibold">
                        {latestDecision.symbol}{" "}
                        {latestDecision.direction.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          latestDecision.timestamp
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${getConfidenceColor(
                        latestDecision.confidence
                      )}`}
                    >
                      {latestDecision.confidence}%
                    </div>
                    {getConfidenceBadge(latestDecision.confidence)}
                  </div>
                </div>

                {/* Engine Votes */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">
                    Engine Analysis
                  </h5>
                  {latestDecision.engineVotes
                    ?.slice(0, 4)
                    .map((vote, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{vote.engineName}</span>
                          <span className="font-medium">
                            {vote.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getEngineColor(
                              vote.confidence
                            )}`}
                            style={{ width: `${vote.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>

                {/* Trade Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Entry Price</p>
                    <p className="font-semibold">
                      {latestDecision.entryPrice?.toFixed(4) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Risk:Reward</p>
                    <p className="font-semibold text-green-600">
                      1:{latestDecision.riskReward?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">
                    AI Analysis
                  </h5>
                  <p className="text-sm text-blue-800">
                    {latestDecision.reasoning || latestDecision.claudeReasoning}
                  </p>
                </div>

                {/* Recent History */}
                {recentDecisions.length > 1 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      Recent Decisions
                    </h5>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {recentDecisions.slice(1, 4).map((decision, index) => (
                        <div
                          key={decision.id || index}
                          className="flex items-center justify-between p-2 text-sm border rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-2">
                            {getDirectionIcon(decision.direction)}
                            <span className="font-medium">
                              {decision.symbol}{" "}
                              {decision.direction.toUpperCase()}
                            </span>
                          </div>
                          <div
                            className={`font-semibold ${getConfidenceColor(
                              decision.confidence
                            )}`}
                          >
                            {decision.confidence}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Real-time Status */}
        {isConnected && recentDecisions.length > 0 && (
          <div className="flex items-center justify-center space-x-2 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>AI actively monitoring markets</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIConfidenceDisplay;
