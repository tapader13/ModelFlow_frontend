'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress-simple';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { AutonomousState } from './AutonomousTradingDashboard';

interface AutonomousTradingAnalyticsProps {
  state: AutonomousState;
}

export default function AutonomousTradingAnalytics({
  state,
}: AutonomousTradingAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  // Calculate performance metrics
  const profitabilityScore = state.statistics.winRate;
  const riskScore = state.statistics.currentDrawdown * 100;
  const activityScore = Math.min(
    (state.statistics.tradesExecutedToday / 10) * 100,
    100
  );

  const getScoreColor = (score: number, isRisk = false) => {
    if (isRisk) {
      if (score <= 2) return 'text-green-600 dark:text-green-400';
      if (score <= 5) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (score >= 70) return 'text-green-600 dark:text-green-400';
      if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    }
  };

  const getProgressColor = (score: number, isRisk = false) => {
    if (isRisk) {
      if (score <= 2) return 'bg-green-500';
      if (score <= 5) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (score >= 70) return 'bg-green-500';
      if (score >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };
  console.log(state);
  const types = ['technical', 'sentiment', 'fundamental'] as const;
  return (
    <div className='space-y-6'>
      {/* Performance Overview */}
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-white'>
            <BarChart3 className='h-5 w-5' />
            <span>Performance Analytics</span>
          </CardTitle>
          <CardDescription className='text-gray-600 dark:text-gray-400'>
            Real-time trading performance and risk metrics
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Key Metrics */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {/** Profitability Score */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Profitability Score
                </span>
                <span
                  className={`text-sm font-bold ${getScoreColor(
                    profitabilityScore
                  )}`}
                >
                  {formatPercentage(profitabilityScore)}
                </span>
              </div>
              <Progress value={profitabilityScore} className='h-2' />
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Based on win rate and consistency
              </p>
            </div>

            {/** Risk Score */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Risk Level
                </span>
                <span
                  className={`text-sm font-bold ${getScoreColor(
                    riskScore,
                    true
                  )}`}
                >
                  {formatPercentage(riskScore)}
                </span>
              </div>
              <Progress value={Math.min(riskScore * 4, 100)} className='h-2' />
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Current drawdown level
              </p>
            </div>

            {/** Activity Score */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Activity Level
                </span>
                <span
                  className={`text-sm font-bold ${getScoreColor(
                    activityScore
                  )}`}
                >
                  {formatPercentage(activityScore)}
                </span>
              </div>
              <Progress value={activityScore} className='h-2' />
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Trading frequency today
              </p>
            </div>
          </div>

          <Separator className='dark:bg-gray-700' />

          {/* Performance Statistics */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/** Trading Performance */}
            <div className='space-y-4'>
              <h4 className='font-semibold flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-white'>
                <TrendingUp className='h-4 w-4' />
                <span>Trading Performance</span>
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Daily P&L
                  </span>
                  <div className='flex items-center space-x-2'>
                    {state.statistics.dailyPnL >= 0 ? (
                      <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                    ) : (
                      <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                    )}
                    <span
                      className={`font-semibold ${
                        state.statistics.dailyPnL >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {formatCurrency(state.statistics.dailyPnL)}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Win Rate
                  </span>
                  <Badge
                    variant={
                      state.statistics.winRate >= 60 ? 'default' : 'secondary'
                    }
                    className={
                      state.statistics.winRate >= 60
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }
                  >
                    {formatPercentage(state.statistics.winRate)}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Total Trades
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {state.statistics.totalTrades}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Trades Today
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {state.statistics.tradesExecutedToday}
                  </span>
                </div>
              </div>
            </div>

            {/** Risk Management */}
            <div className='space-y-4'>
              <h4 className='font-semibold flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-white'>
                <Target className='h-4 w-4' />
                <span>Risk Management</span>
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Active Positions
                  </span>
                  <Badge
                    variant={
                      state.statistics.activePositions > 0
                        ? 'default'
                        : 'secondary'
                    }
                    className={
                      state.statistics.activePositions > 0
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }
                  >
                    {state.statistics.activePositions}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Current Drawdown
                  </span>
                  <span
                    className={`font-semibold ${
                      state.statistics.currentDrawdown > 0.05
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {formatPercentage(state.statistics.currentDrawdown * 100)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Max Daily Loss
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {formatCurrency(state.config.maxDailyLoss)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground dark:text-gray-400'>
                    Position Size
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {state.config.maxPositionSize}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-white'>
            <Activity className='h-5 w-5' />
            <span>System Health</span>
          </CardTitle>
          <CardDescription className='text-gray-600 dark:text-gray-400'>
            System performance and operational metrics
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {/** System Status */}
            <div className='text-center space-y-2'>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {state.health.status === 'healthy' ? '✓' : '⚠'}
              </div>
              <div className='text-sm'>
                <div className='font-semibold text-gray-900 dark:text-white'>
                  System Status
                </div>
                <div className='text-muted-foreground dark:text-gray-400'>
                  {state.health.status.charAt(0).toUpperCase() +
                    state.health.status.slice(1)}
                </div>
              </div>
            </div>

            {/** Error Count */}
            <div className='text-center space-y-2'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {state.health.errors}
              </div>
              <div className='text-sm'>
                <div className='font-semibold text-gray-900 dark:text-white'>
                  Error Count
                </div>
                <div className='text-muted-foreground dark:text-gray-400'>
                  {state.health.errors === 0 ? 'No errors' : 'Errors detected'}
                </div>
              </div>
            </div>

            {/** Uptime */}
            <div className='text-center space-y-2'>
              <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                {Math.floor(state.health.uptime / 3600)}h
              </div>
              <div className='text-sm'>
                <div className='font-semibold text-gray-900 dark:text-white'>
                  Uptime
                </div>
                <div className='text-muted-foreground dark:text-gray-400'>
                  {Math.floor((state.health.uptime % 3600) / 60)}m
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <Separator className='dark:bg-gray-700' />
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0'>
            <span className='font-semibold text-gray-900 dark:text-white'>
              Connection Status
            </span>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-2 h-2 rounded-full ${
                  state.connectionStatus === 'connected'
                    ? 'bg-green-500'
                    : state.connectionStatus === 'disconnected'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <span className='text-sm text-gray-900 dark:text-white'>
                {state.connectionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Configuration Summary */}
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-white'>
            <PieChart className='h-5 w-5' />
            <span>Configuration Overview</span>
          </CardTitle>
          <CardDescription className='text-gray-600 dark:text-gray-400'>
            Current AI and risk management settings
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/** AI Analysis Weights */}
            <div className='space-y-3'>
              <h4 className='font-semibold text-gray-900 dark:text-white'>
                AI Analysis Weights
              </h4>
              <div className='space-y-2'>
                {types.map((type) => {
                  const key = `${type}Weight` as keyof typeof state.config;
                  const value = (state.config[key] as number) * 100;
                  return (
                    <div
                      key={type}
                      className='flex items-center justify-between w-full'
                    >
                      <span className='text-sm text-muted-foreground dark:text-gray-400'>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
                      </span>
                      <div className='flex items-center space-x-2 w-full sm:w-24'>
                        <Progress value={value} className='h-2 flex-1' />
                        <span className='text-xs text-gray-900 dark:text-white'>
                          {formatPercentage(value, 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/** Trading Parameters */}
            <div className='space-y-3'>
              <h4 className='font-semibold text-gray-900 dark:text-white'>
                Trading Parameters
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground dark:text-gray-400'>
                    Min Confidence:
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {state.config.minConfidenceLevel}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground dark:text-gray-400'>
                    Analysis Interval:
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {Math.floor(state.config.analysisInterval / 60)}m
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground dark:text-gray-400'>
                    Active Pairs:
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {state.config.tradingPairs.length}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground dark:text-gray-400'>
                    Advanced AI:
                  </span>
                  <Badge
                    variant={
                      state.config.useAdvancedAI ? 'default' : 'secondary'
                    }
                    className={
                      state.config.useAdvancedAI
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }
                  >
                    {state.config.useAdvancedAI ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
