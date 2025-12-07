'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      className='bg-blue-600 h-2 rounded-full transition-all'
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Activity,
  Target,
  RefreshCw,
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  Clock,
} from 'lucide-react';

interface RiskData {
  overallRisk: {
    level: string;
    score: number;
    status: string;
  };
  portfolioRisk: {
    var95: number;
    var99: number;
    expectedShortfall: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
  };
  positionRisk: Array<{
    symbol: string;
    exposure: number;
    riskContribution: number;
    stopLoss: number;
    riskReward: number;
  }>;
  correlationRisk: {
    highCorrelations: Array<{
      pair: string;
      correlation: number;
      risk: string;
    }>;
    diversificationRatio: number;
  };
  marketRisk: {
    volatilityRegime: string;
    newsImpact: string;
    economicEvents: Array<{
      event: string;
      impact: string;
      timeToEvent: string;
    }>;
  };
  recommendations: Array<{
    type: string;
    description: string;
    priority: string;
    impact: string;
  }>;
}

export default function RiskMonitoring() {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiskData = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/risk');

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRiskData(result.data);
        }
      }

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch risk data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchRiskData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400';
      case 'critical':
        return 'text-red-800 bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  console.log(riskData);
  if (loading) {
    return (
      <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
        {/* Dark-mode grid overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

        <div className='space-y-6 relative z-10'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Risk Monitoring
            </h1>
            <RefreshCw className='h-6 w-6 animate-spin text-gray-700 dark:text-gray-300' />
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className='animate-pulse bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'
              >
                <CardHeader className='pb-2'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                </CardHeader>
                <CardContent>
                  <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
      {/* Dark-mode grid overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

      <div className='space-y-6 relative z-10'>
        <div className='flex flex-col sm:flex-row xs:items-center justify-between gap-3'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center xs:text-left'>
            Risk Monitoring
          </h1>

          <div className='flex flex-row items-center gap-2'>
            <div className='flex justify-center xs:justify-start w-full sm:w-auto'>
              <Badge
                variant={
                  riskData?.overallRisk.status === 'normal'
                    ? 'default'
                    : 'destructive'
                }
                className='dark:bg-opacity-20 text-sm py-1 px-3'
              >
                {riskData?.overallRisk.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>

            <Button
              onClick={fetchRiskData}
              disabled={loading}
              size='sm'
              variant='outline'
              className='border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 w-full sm:w-auto px-3 py-1.5 text-sm'
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className='ml-2'>Refresh</span>
            </Button>
          </div>
        </div>

        {error && (
          <Card className='border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                <AlertTriangle className='h-5 w-5' />
                <span>Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Overview Cards */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Overall Risk Level
              </CardTitle>
              <Shield className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Badge
                  className={`${getRiskColor(
                    riskData?.overallRisk.level || 'unknown'
                  )}`}
                >
                  {riskData?.overallRisk.level?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                Risk Score: {riskData?.overallRisk.score || '--'}/100
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Portfolio VaR (95%)
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
                {riskData && riskData.portfolioRisk
                  ? formatCurrency(riskData.portfolioRisk.var95)
                  : '--'}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Maximum expected loss (1 day)
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Max Drawdown
              </CardTitle>
              <BarChart3 className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                {riskData && riskData.portfolioRisk
                  ? formatPercentage(riskData.portfolioRisk.maxDrawdown)
                  : '--'}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Historical maximum loss
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Sharpe Ratio
              </CardTitle>
              <Target className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {riskData && riskData.portfolioRisk.sharpeRatio
                  ? riskData.portfolioRisk.sharpeRatio.toFixed(2)
                  : '--'}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Risk-adjusted return
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Position Risk Analysis */}
        {riskData?.positionRisk && (
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='p-4 sm:p-6'>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl'>
                <Activity className='h-5 w-5' />
                Position Risk Analysis
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400 text-sm'>
                Individual position risk contributions
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 sm:p-6 pt-0'>
              <div className='space-y-3'>
                {riskData.positionRisk.map((position, i) => (
                  <div
                    key={i}
                    className='flex flex-col p-4 border rounded-lg border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
                  >
                    {/* Header with symbol and exposure */}
                    <div className='flex items-center justify-between mb-3'>
                      <div>
                        <h4 className='font-medium text-gray-900 dark:text-white text-base'>
                          {position.symbol}
                        </h4>
                        <p className='text-sm text-muted-foreground dark:text-gray-400'>
                          Exposure:{' '}
                          {position.exposure
                            ? formatCurrency(position.exposure)
                            : '--'}
                        </p>
                      </div>
                    </div>

                    {/* Risk metrics - stacked on mobile */}
                    <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4'>
                      {/* Risk Contribution */}
                      <div className='text-center'>
                        <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Risk Contribution
                        </p>
                        <div className='flex flex-col xs:flex-row items-center justify-center gap-2'>
                          <SimpleProgress
                            value={(position.riskContribution || 0) * 100}
                            className='w-12 xs:w-16'
                          />
                          <span className='text-sm text-gray-900 dark:text-white'>
                            {formatPercentage(position.riskContribution || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Risk/Reward */}
                      <div className='text-center'>
                        <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Risk/Reward
                        </p>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {position.riskReward
                            ? position.riskReward.toFixed(2)
                            : '--'}
                        </p>
                      </div>

                      {/* Stop Loss */}
                      <div className='text-center'>
                        <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Stop Loss
                        </p>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {position.stopLoss
                            ? formatCurrency(position.stopLoss)
                            : '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Metrics and Correlations */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <BarChart3 className='h-5 w-5' />
                Portfolio Risk Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  VaR (99%)
                </span>
                <span className='font-medium text-red-600 dark:text-red-400'>
                  {riskData && riskData.portfolioRisk
                    ? formatCurrency(riskData.portfolioRisk.var99)
                    : '--'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Expected Shortfall
                </span>
                <span className='font-medium text-red-600 dark:text-red-400'>
                  {riskData && riskData.portfolioRisk
                    ? formatCurrency(riskData.portfolioRisk.expectedShortfall)
                    : '--'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Portfolio Volatility
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {riskData && riskData.portfolioRisk
                    ? formatPercentage(riskData.portfolioRisk.volatility)
                    : '--'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Diversification Ratio
                </span>
                <span className='font-medium text-green-600 dark:text-green-400'>
                  {riskData &&
                  riskData.correlationRisk &&
                  riskData.correlationRisk.diversificationRatio
                    ? riskData.correlationRisk.diversificationRatio.toFixed(2)
                    : '--'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Zap className='h-5 w-5' />
                Correlation Risk
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {riskData?.correlationRisk?.highCorrelations?.map((corr, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 border rounded border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
                >
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {corr.pair}
                    </p>
                    <p className='text-sm text-muted-foreground dark:text-gray-400'>
                      Correlation:{' '}
                      {corr.correlation ? corr.correlation.toFixed(2) : '--'}
                    </p>
                  </div>
                  <Badge className={`${getRiskColor(corr.risk)}`}>
                    {corr.risk.toUpperCase()}
                  </Badge>
                </div>
              )) || (
                <p className='text-sm text-muted-foreground dark:text-gray-400'>
                  No high correlation risks detected
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Risk and Economic Events */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Eye className='h-5 w-5' />
                Market Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Volatility Regime
                </span>
                <Badge
                  variant='outline'
                  className='dark:border-gray-600 dark:text-gray-300'
                >
                  {riskData?.marketRisk.volatilityRegime?.toUpperCase() ||
                    'NORMAL'}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  News Impact
                </span>
                <Badge
                  className={`${getRiskColor(
                    riskData?.marketRisk.newsImpact || 'low'
                  )}`}
                >
                  {riskData?.marketRisk.newsImpact?.toUpperCase() || 'LOW'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Clock className='h-5 w-5' />
                Upcoming Economic Events
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {riskData?.marketRisk?.economicEvents?.map((event, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 border rounded border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
                >
                  <div>
                    <p className='font-medium text-sm text-gray-900 dark:text-white'>
                      {event.event}
                    </p>
                    <p className='text-xs text-muted-foreground dark:text-gray-400'>
                      {event.timeToEvent}
                    </p>
                  </div>
                  <Badge className={`${getRiskColor(event.impact)}`}>
                    {event.impact.toUpperCase()}
                  </Badge>
                </div>
              )) || (
                <p className='text-sm text-muted-foreground dark:text-gray-400'>
                  No major events scheduled
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Recommendations */}
        {riskData?.recommendations && (
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Target className='h-5 w-5' />
                Risk Management Recommendations
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Suggested actions to optimize risk exposure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {riskData.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className='border rounded-lg p-4 border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {rec.type}
                      </span>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className='dark:border-gray-600 dark:text-gray-300'
                        >
                          {rec.impact}
                        </Badge>
                        <Badge className={`${getRiskColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground dark:text-gray-400'>
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
