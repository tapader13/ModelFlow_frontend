/**
 * DECISION REASONING DISPLAY COMPONENT
 * Shows comprehensive decision analysis with full transparency
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress-simple';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  Target,
  Shield,
} from 'lucide-react';

interface DecisionAnalysis {
  symbol: string;
  decision: 'buy' | 'sell' | 'hold' | 'close';
  finalConfidence: number;
  primaryReasons: string[];
  warningFlags: string[];
  technicalAnalysis: {
    overallScore: number;
    reasoning: string;
    indicators: any[];
    patterns: string[];
    support: number;
    resistance: number;
    trend: 'bullish' | 'bearish' | 'sideways';
  };
  sentimentAnalysis: {
    overallScore: number;
    reasoning: string;
    newsScore: number;
    socialScore: number;
    economicEvents: any[];
    marketSentiment: 'bullish' | 'bearish' | 'neutral';
  };
  fundamentalAnalysis: {
    overallScore: number;
    reasoning: string;
    economicIndicators: any[];
    centralBankPolicy: string;
    geopoliticalFactors: string[];
  };
  claudeAnalysis: {
    confidence: number;
    reasoning: string;
    factors: string[];
    recommendation: string;
    riskAssessment: string;
  };
  riskAnalysis: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    reasoning: string;
    portfolioHeat: number;
    correlationRisk: number;
    volatilityRisk: number;
    positionSizing: number;
    stopLoss: number;
    takeProfit: number;
  };
  weightedScores: {
    technical: number;
    sentiment: number;
    fundamental: number;
    claude: number;
    risk: number;
  };
  timestamp: string;
}

interface DecisionReasoningDisplayProps {
  analysis?: DecisionAnalysis;
  isLoading?: boolean;
}

const DecisionReasoningDisplay: React.FC<DecisionReasoningDisplayProps> = ({
  analysis,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
              <Brain className='h-5 w-5 animate-pulse' />
              Analyzing Market Conditions...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4'></div>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
            <Brain className='h-5 w-5' />
            Decision Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500 dark:text-gray-400'>
            No recent decision analysis available. Run analysis to see decision
            reasoning.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'buy':
        return (
          <TrendingUp className='h-5 w-5 text-green-500 dark:text-green-400' />
        );
      case 'sell':
        return (
          <TrendingDown className='h-5 w-5 text-red-500 dark:text-red-400' />
        );
      case 'close':
        return <Target className='h-5 w-5 text-blue-500 dark:text-blue-400' />;
      default:
        return <Shield className='h-5 w-5 text-gray-500 dark:text-gray-400' />;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'buy':
        return 'bg-green-500 dark:bg-green-600';
      case 'sell':
        return 'bg-red-500 dark:bg-red-600';
      case 'close':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Decision Summary */}
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-gray-900 dark:text-white'>
            <div className='flex items-center gap-2'>
              {getDecisionIcon(analysis.decision)}
              Decision Analysis - {analysis.symbol}
            </div>
            <Badge className={getDecisionColor(analysis.decision)}>
              {analysis.decision.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Final Confidence
              </p>
              <p
                className={`text-2xl font-bold ${getConfidenceColor(
                  typeof analysis.finalConfidence === 'number'
                    ? analysis.finalConfidence
                    : 0
                )}`}
              >
                {typeof analysis.finalConfidence === 'number'
                  ? analysis.finalConfidence.toFixed(1)
                  : 'N/A'}
                %
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Risk Level
              </p>
              <p
                className={`text-lg font-semibold ${getRiskColor(
                  analysis.riskAnalysis.overallRisk
                )}`}
              >
                {analysis.riskAnalysis.overallRisk.toUpperCase()}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Analysis Time
              </p>
              <p className='text-lg font-medium text-gray-900 dark:text-white'>
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Primary Reasons */}
          <div>
            <p className='font-medium mb-2 text-gray-900 dark:text-white'>
              Primary Decision Reasons:
            </p>
            <ul className='space-y-1'>
              {analysis.primaryReasons.map((reason, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <span className='text-green-500 dark:text-green-400 mt-1'>
                    ✓
                  </span>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Flags */}
          {analysis.warningFlags.length > 0 && (
            <div>
              <p className='font-medium mb-2 text-orange-600 dark:text-orange-400'>
                Warning Flags:
              </p>
              <ul className='space-y-1'>
                {analysis.warningFlags.map((flag, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <AlertTriangle className='h-4 w-4 text-orange-500 dark:text-orange-400 mt-0.5' />
                    <span className='text-sm text-orange-700 dark:text-orange-300'>
                      {flag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Breakdown */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Technical Analysis */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-900 dark:text-white'>
              Technical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Score:
              </span>
              <span
                className={`font-bold ${getConfidenceColor(
                  typeof analysis.technicalAnalysis.overallScore === 'number'
                    ? analysis.technicalAnalysis.overallScore
                    : 0
                )}`}
              >
                {typeof analysis.technicalAnalysis.overallScore === 'number'
                  ? analysis.technicalAnalysis.overallScore.toFixed(1)
                  : 'N/A'}
                %
              </span>
            </div>
            <Progress
              value={
                typeof analysis.technicalAnalysis.overallScore === 'number'
                  ? analysis.technicalAnalysis.overallScore
                  : 0
              }
              className='h-2'
            />
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {analysis.technicalAnalysis.reasoning}
            </p>

            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                Key Levels:
              </p>
              <div className='grid grid-cols-2 gap-2 text-xs text-gray-900 dark:text-white'>
                <div>
                  Support:{' '}
                  {typeof analysis.technicalAnalysis.support === 'number'
                    ? analysis.technicalAnalysis.support.toFixed(5)
                    : 'N/A'}
                </div>
                <div>
                  Resistance:{' '}
                  {typeof analysis.technicalAnalysis.resistance === 'number'
                    ? analysis.technicalAnalysis.resistance.toFixed(5)
                    : 'N/A'}
                </div>
              </div>
              <Badge
                variant='outline'
                className={`${
                  analysis.technicalAnalysis.trend === 'bullish'
                    ? 'text-green-600 dark:text-green-400'
                    : analysis.technicalAnalysis.trend === 'bearish'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                } dark:bg-gray-800 dark:border-gray-600`}
              >
                {analysis.technicalAnalysis.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-900 dark:text-white'>
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Score:
              </span>
              <span
                className={`font-bold ${getConfidenceColor(
                  typeof analysis.sentimentAnalysis.overallScore === 'number'
                    ? analysis.sentimentAnalysis.overallScore
                    : 0
                )}`}
              >
                {typeof analysis.sentimentAnalysis.overallScore === 'number'
                  ? analysis.sentimentAnalysis.overallScore.toFixed(1)
                  : 'N/A'}
                %
              </span>
            </div>
            <Progress
              value={
                typeof analysis.sentimentAnalysis.overallScore === 'number'
                  ? analysis.sentimentAnalysis.overallScore
                  : 0
              }
              className='h-2'
            />
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {analysis.sentimentAnalysis.reasoning}
            </p>

            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-2 text-xs text-gray-900 dark:text-white'>
                <div>
                  News:{' '}
                  {typeof analysis.sentimentAnalysis.newsScore === 'number'
                    ? analysis.sentimentAnalysis.newsScore.toFixed(1)
                    : 'N/A'}
                  %
                </div>
                <div>
                  Social:{' '}
                  {typeof analysis.sentimentAnalysis.socialScore === 'number'
                    ? analysis.sentimentAnalysis.socialScore.toFixed(1)
                    : 'N/A'}
                  %
                </div>
              </div>
              <Badge
                variant='outline'
                className={`${
                  analysis.sentimentAnalysis.marketSentiment === 'bullish'
                    ? 'text-green-600 dark:text-green-400'
                    : analysis.sentimentAnalysis.marketSentiment === 'bearish'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                } dark:bg-gray-800 dark:border-gray-600`}
              >
                {analysis.sentimentAnalysis.marketSentiment}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Claude AI Analysis */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-900 dark:text-white'>
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Confidence:
              </span>
              <span
                className={`font-bold ${getConfidenceColor(
                  typeof analysis.claudeAnalysis.confidence === 'number'
                    ? analysis.claudeAnalysis.confidence
                    : 0
                )}`}
              >
                {typeof analysis.claudeAnalysis.confidence === 'number'
                  ? analysis.claudeAnalysis.confidence.toFixed(1)
                  : 'N/A'}
                %
              </span>
            </div>
            <Progress
              value={
                typeof analysis.claudeAnalysis.confidence === 'number'
                  ? analysis.claudeAnalysis.confidence
                  : 0
              }
              className='h-2'
            />
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {analysis.claudeAnalysis.reasoning}
            </p>
            <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              {analysis.claudeAnalysis.recommendation}
            </p>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-900 dark:text-white'>
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-900 dark:text-white'>
                Risk Level:
              </span>
              <span
                className={`font-bold ${getRiskColor(
                  analysis.riskAnalysis.overallRisk
                )}`}
              >
                {analysis.riskAnalysis.overallRisk.toUpperCase()}
              </span>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {analysis.riskAnalysis.reasoning}
            </p>

            <div className='space-y-2 text-xs text-gray-900 dark:text-white'>
              <div className='flex justify-between'>
                <span>Portfolio Heat:</span>
                <span
                  className={
                    (typeof analysis.riskAnalysis.portfolioHeat === 'number'
                      ? analysis.riskAnalysis.portfolioHeat
                      : 0) > 15
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }
                >
                  {typeof analysis.riskAnalysis.portfolioHeat === 'number'
                    ? analysis.riskAnalysis.portfolioHeat.toFixed(1)
                    : 'N/A'}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Position Size:</span>
                <span>
                  {typeof analysis.riskAnalysis.positionSizing === 'number'
                    ? analysis.riskAnalysis.positionSizing.toFixed(1)
                    : 'N/A'}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Stop Loss:</span>
                <span>
                  {typeof analysis.riskAnalysis.stopLoss === 'number'
                    ? analysis.riskAnalysis.stopLoss.toFixed(5)
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Take Profit:</span>
                <span>
                  {typeof analysis.riskAnalysis.takeProfit === 'number'
                    ? analysis.riskAnalysis.takeProfit.toFixed(5)
                    : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weighted Scores Summary */}
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='text-lg text-gray-900 dark:text-white'>
            Decision Weight Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[
              {
                name: 'Technical',
                score:
                  typeof analysis.weightedScores.technical === 'number'
                    ? analysis.weightedScores.technical
                    : 0,
                weight: 30,
              },
              {
                name: 'Sentiment',
                score:
                  typeof analysis.weightedScores.sentiment === 'number'
                    ? analysis.weightedScores.sentiment
                    : 0,
                weight: 20,
              },
              {
                name: 'Fundamental',
                score:
                  typeof analysis.weightedScores.fundamental === 'number'
                    ? analysis.weightedScores.fundamental
                    : 0,
                weight: 20,
              },
              {
                name: 'AI Analysis',
                score:
                  typeof analysis.weightedScores.claude === 'number'
                    ? analysis.weightedScores.claude
                    : 0,
                weight: 20,
              },
              {
                name: 'Risk Factor',
                score:
                  typeof analysis.weightedScores.risk === 'number'
                    ? analysis.weightedScores.risk
                    : 0,
                weight: 10,
              },
            ].map((item) => (
              <div key={item.name} className='space-y-1'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-900 dark:text-white'>
                    {item.name} ({item.weight}% weight)
                  </span>
                  <span className={getConfidenceColor(item.score)}>
                    {item.score.toFixed(1)}%
                  </span>
                </div>
                <Progress value={item.score} className='h-1.5' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionReasoningDisplay;
