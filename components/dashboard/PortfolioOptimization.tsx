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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Target,
  RefreshCw,
  DollarSign,
  Activity,
  Zap,
  ArrowRightLeft,
} from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Info } from 'lucide-react';
import { Globe } from 'lucide-react';

interface PortfolioAnalysis {
  portfolioScore: number;
  riskLevel: string;
  correlationAnalysis: string;
  hedgingOpportunities: Array<{
    primarySymbol: string;
    hedgeSymbol: string;
    hedgeRatio: number;
    effectiveness: number;
    cost: number;
    reasoning: string;
  }>;
  recommendations: Array<{
    symbol: string;
    currentSize: number;
    suggestedSize: number;
    reasoning: string;
    priority: string;
    expectedImpact: number;
  }>;
  analysis: {
    currentPositions: Array<{
      id: string;
      symbol: string;
      side: string;
      size: number;
      entryPrice: number;
      currentPrice: number;
      unrealizedPnL: number;
      timestamp: string;
    }>;
    exposure: {
      currentExposure: Record<string, number>;
      suggestedExposure: Record<string, number>;
      currencyExposure: Record<string, number>;
      sectorExposure: Record<string, number>;
      recommendations: string[];
    };
    expectedImprovement: number;
    confidence: number;
  };
}

interface StrategyOptimization {
  optimizationScore: number;
  recommendations: Array<{
    category: string;
    suggestion: string;
    impact: string;
    confidence: number;
  }>;
  riskWarnings: string[];
  expectedImprovement: number;
}

export default function PortfolioOptimization() {
  const [portfolioAnalysis, setPortfolioAnalysis] =
    useState<PortfolioAnalysis | null>(null);
  const [strategyOptimization, setStrategyOptimization] =
    useState<StrategyOptimization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('positions');

  // Lazy loading states for each tab
  const [loadingStates, setLoadingStates] = useState({
    positions: false,
    rebalancing: false,
    hedging: false,
    strategy: false,
  });

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the fast portfolio API for better performance
      const portfolioResponse = await fetch('/api/portfolio/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze_portfolio' }),
      });

      if (portfolioResponse.ok) {
        const portfolioResult = await portfolioResponse.json();
        if (portfolioResult.success) {
          setPortfolioAnalysis(portfolioResult);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch portfolio data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch strategy data only when strategy tab is accessed
  const fetchStrategyData = async () => {
    if (strategyOptimization || loadingStates.strategy) return;

    setLoadingStates((prev) => ({ ...prev, strategy: true }));

    try {
      // Use the fast strategy API
      const strategyResponse = await fetch('/api/portfolio/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize_strategy' }),
      });

      if (strategyResponse.ok) {
        const strategyResult = await strategyResponse.json();
        if (strategyResult.success) {
          setStrategyOptimization(strategyResult);
        }
      }
    } catch (error) {
      console.error('Failed to fetch strategy data:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, strategy: false }));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Lazy load strategy data only when needed
    if (value === 'strategy') {
      fetchStrategyData();
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Portfolio Optimization
          </h1>
          <RefreshCw className='h-6 w-6 animate-spin text-gray-900 dark:text-white' />
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className='animate-pulse bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'
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
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Portfolio Optimization
        </h1>
        <Button
          onClick={fetchPortfolioData}
          disabled={loading}
          size='sm'
          variant='outline'
          className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh Analysis
        </Button>
      </div>

      {error && (
        <Card className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
              <AlertTriangle className='h-5 w-5' />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Overview Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Portfolio Score
            </CardTitle>
            <Target className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {portfolioAnalysis
                ? Math.round(portfolioAnalysis.portfolioScore * 100)
                : '--'}
              %
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Overall optimization level
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Risk Level
            </CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground dark:text-purple-400' />
          </CardHeader>
          <CardContent>
            <Badge
              className={`${getRiskColor(
                portfolioAnalysis?.riskLevel || 'unknown'
              )}`}
            >
              {portfolioAnalysis?.riskLevel?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <p className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
              Current portfolio risk
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Expected Improvement
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              +
              {portfolioAnalysis
                ? Math.round(portfolioAnalysis.analysis.expectedImprovement)
                : '--'}
              %
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Potential performance gain
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Confidence Level
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {portfolioAnalysis
                ? Math.round(portfolioAnalysis.analysis.confidence * 100)
                : '--'}
              %
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Analysis confidence
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='space-y-4'
      >
        <div className='overflow-x-auto pb-2 hide-scrollbar'>
          <TabsList className='inline-flex w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 min-w-full sm:min-w-0'>
            <TabsTrigger
              value='positions'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <PieChart className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden xs:inline'>Positions</span>
              <span className='xs:hidden'>Pos</span>
              {activeTab === 'positions' && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='rebalancing'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <BarChart3 className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden xs:inline'>Rebalancing</span>
              <span className='xs:hidden'>Rebal</span>
              {activeTab === 'rebalancing' && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='hedging'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <ArrowRightLeft className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden xs:inline'>Hedging</span>
              <span className='xs:hidden'>Hedge</span>
              {activeTab === 'hedging' && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='strategy'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <Zap className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden xs:inline'>Strategy</span>
              <span className='xs:hidden'>Strat</span>
              {loadingStates.strategy && (
                <RefreshCw className='ml-1 sm:ml-2 h-3 w-3 animate-spin flex-shrink-0' />
              )}
              {activeTab === 'strategy' && !loadingStates.strategy && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='positions' className='space-y-4'>
          {portfolioAnalysis?.analysis.currentPositions && (
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <PieChart className='h-5 w-5 text-blue-500' />
                  Current Portfolio Positions
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Active positions and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {portfolioAnalysis.analysis.currentPositions.map(
                    (position) => (
                      <div
                        key={position.id}
                        className='flex flex-col sm:flex-row sm:items-center  gap-5 sm:gap-0 justify-between p-4 border rounded-xl border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200'
                      >
                        <div className='flex items-center sm:justify-start gap-4  justify-between'>
                          <div className='p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg'>
                            {position.side === 'buy' ? (
                              <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                            ) : (
                              <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                            )}
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 dark:text-white'>
                              {position.symbol}
                            </h4>
                            <div className='flex items-center gap-2 mt-1'>
                              <Badge
                                variant='outline'
                                className={`text-xs ${
                                  position.side === 'buy'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
                                }`}
                              >
                                {position.side.toUpperCase()}
                              </Badge>
                              <span className='text-sm text-muted-foreground dark:text-gray-400'>
                                {position.size.toLocaleString()} units
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className='text-right'>
                          <div className='flex items-center  justify-between sm:justify-start gap-3'>
                            <div className='text-sm text-muted-foreground dark:text-gray-400 text-left'>
                              <div>Entry: {position.entryPrice}</div>
                              <div>Current: {position.currentPrice}</div>
                            </div>
                            <div className='text-center'>
                              <p
                                className={`text-lg font-bold ${
                                  position.unrealizedPnL >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {formatCurrency(position.unrealizedPnL)}
                              </p>
                              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                                {new Date(
                                  position.timestamp
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exposure Analysis */}
          {portfolioAnalysis?.analysis.exposure && (
            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Globe className='h-5 w-5 text-blue-500' />
                    Currency Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {Object.entries(
                      portfolioAnalysis.analysis.exposure.currencyExposure
                    ).map(([currency, exposure]) => (
                      <div
                        key={currency}
                        className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'
                      >
                        <span className='font-medium text-gray-900 dark:text-white'>
                          {currency}
                        </span>
                        <span
                          className={`font-semibold ${
                            exposure >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {formatCurrency(exposure as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Lightbulb className='h-5 w-5 text-yellow-500' />
                    Exposure Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {portfolioAnalysis.analysis.exposure.recommendations.map(
                      (rec, i) => (
                        <div
                          key={i}
                          className='flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800'
                        >
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                          <span className='text-sm text-gray-900 dark:text-white leading-relaxed'>
                            {rec}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value='rebalancing' className='space-y-4'>
          {portfolioAnalysis?.recommendations && (
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <BarChart3 className='h-5 w-5 text-blue-500' />
                  Rebalancing Recommendations
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Suggested position adjustments for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {portfolioAnalysis.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className='border rounded-xl p-4 space-y-4 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg'>
                            <TrendingUp className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                          </div>
                          <h4 className='font-semibold text-gray-900 dark:text-white'>
                            {rec.symbol}
                          </h4>
                        </div>
                        <Badge
                          className={`${getPriorityColor(
                            rec.priority
                          )} px-3 py-1 font-medium`}
                        >
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <div className='grid gap-4 md:grid-cols-3'>
                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Current Size
                          </label>
                          <p className='text-lg font-bold text-gray-900 dark:text-white mt-1'>
                            {rec.currentSize.toLocaleString()}
                          </p>
                        </div>

                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Suggested Size
                          </label>
                          <p className='text-lg font-bold text-gray-900 dark:text-white mt-1'>
                            {rec.suggestedSize.toLocaleString()}
                          </p>
                        </div>

                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Expected Impact
                          </label>
                          <p className='text-lg font-bold text-green-600 dark:text-green-400 mt-1'>
                            +{(rec.expectedImpact * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800'>
                        <h5 className='font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2'>
                          <Lightbulb className='h-4 w-4 text-blue-500' />
                          Recommendation Reasoning
                        </h5>
                        <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                          {rec.reasoning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='hedging' className='space-y-4'>
          {portfolioAnalysis?.hedgingOpportunities && (
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <ArrowRightLeft className='h-5 w-5 text-blue-500' />
                  Hedging Opportunities
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Risk mitigation strategies for current positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {portfolioAnalysis.hedgingOpportunities.map((hedge, i) => (
                    <div
                      key={i}
                      className='border rounded-xl p-4 space-y-4 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg'>
                            <ArrowRightLeft className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 dark:text-white'>
                              {hedge.primarySymbol}
                            </h4>
                            <p className='text-sm text-muted-foreground dark:text-gray-400'>
                              Hedge with {hedge.hedgeSymbol}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            hedge.effectiveness >= 0.8
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                              : hedge.effectiveness >= 0.6
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                          } border font-medium`}
                        >
                          {(hedge.effectiveness * 100).toFixed(0)}% Effective
                        </Badge>
                      </div>

                      <div className='grid gap-4 md:grid-cols-3'>
                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Hedge Ratio
                          </label>
                          <p className='text-lg font-bold text-gray-900 dark:text-white mt-1'>
                            {hedge.hedgeRatio.toFixed(3)}
                          </p>
                          <p className='text-xs text-muted-foreground dark:text-gray-400 mt-1'>
                            Optimal ratio
                          </p>
                        </div>

                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Effectiveness
                          </label>
                          <div className='flex items-center justify-center gap-2 mt-1'>
                            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full ${
                                  hedge.effectiveness >= 0.8
                                    ? 'bg-green-500'
                                    : hedge.effectiveness >= 0.6
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{
                                  width: `${hedge.effectiveness * 100}%`,
                                }}
                              />
                            </div>
                            <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                              {(hedge.effectiveness * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className='text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                          <label className='text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide'>
                            Estimated Cost
                          </label>
                          <p
                            className={`text-lg font-bold ${
                              hedge.cost > 0
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            } mt-1`}
                          >
                            {hedge.cost > 0 ? '+' : ''}
                            {formatCurrency(hedge.cost)}
                          </p>
                          <p className='text-xs text-muted-foreground dark:text-gray-400 mt-1'>
                            Monthly cost
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Reasoning Section */}
                      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800'>
                        <div className='flex items-start gap-3'>
                          <div className='flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg'>
                            <Lightbulb className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                          </div>
                          <div className='flex-1'>
                            <h5 className='font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2'>
                              Strategy Rationale
                              <Badge
                                variant='outline'
                                className='text-xs bg-white dark:bg-gray-800'
                              >
                                AI Recommended
                              </Badge>
                            </h5>
                            <div className='prose prose-sm dark:prose-invert max-w-none'>
                              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                                {hedge.reasoning}
                              </p>
                            </div>
                            <div className='flex items-center gap-4 mt-3 pt-3 border-t border-blue-100 dark:border-blue-800'>
                              <div className='flex items-center gap-1.5'>
                                <Clock className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
                                <span className='text-xs text-muted-foreground dark:text-gray-400'>
                                  Updated just now
                                </span>
                              </div>
                              <div className='flex items-center gap-1.5'>
                                <TrendingUp className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
                                <span className='text-xs text-muted-foreground dark:text-gray-400'>
                                  High confidence
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800'>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-xs h-8'
                          >
                            <Plus className='h-3 w-3 mr-1' />
                            Implement Hedge
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-xs h-8'
                          >
                            <Info className='h-3 w-3 mr-1' />
                            Details
                          </Button>
                        </div>
                        <div className='text-xs text-muted-foreground dark:text-gray-400'>
                          Recommended priority:{' '}
                          <span className='font-medium text-green-600 dark:text-green-400'>
                            High
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='strategy' className='space-y-4'>
          {strategyOptimization && (
            <>
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Zap className='h-5 w-5 text-yellow-500' />
                    Strategy Optimization Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center gap-6'>
                    <div className='text-center'>
                      <div className='text-4xl font-bold text-gray-900 dark:text-white'>
                        {Math.round(
                          strategyOptimization.optimizationScore * 100
                        )}
                        %
                      </div>
                      <div className='text-sm text-muted-foreground dark:text-gray-400 mt-1'>
                        Current Score
                      </div>
                    </div>

                    <div className='flex-1'>
                      <div className='flex justify-between text-sm text-muted-foreground dark:text-gray-400 mb-1'>
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                      <div className='bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                        <div
                          className='bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out'
                          style={{
                            width: `${
                              strategyOptimization.optimizationScore * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                        +{strategyOptimization.expectedImprovement.toFixed(1)}%
                      </div>
                      <div className='text-sm text-muted-foreground dark:text-gray-400'>
                        Expected Gain
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                      <Lightbulb className='h-5 w-5 text-blue-500' />
                      Optimization Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {strategyOptimization.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className='border rounded-xl p-4 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <span className='font-semibold text-gray-900 dark:text-white'>
                            {rec.category}
                          </span>
                          <Badge
                            className={`${
                              rec.confidence >= 0.8
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                                : rec.confidence >= 0.6
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                            } border font-medium`}
                          >
                            {(rec.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>

                        <p className='text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed'>
                          {rec.suggestion}
                        </p>

                        <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800'>
                          <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                            {rec.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                      <AlertTriangle className='h-5 w-5 text-red-500' />
                      Risk Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    {strategyOptimization.riskWarnings.map((warning, i) => (
                      <div
                        key={i}
                        className='flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors duration-200'
                      >
                        <div className='flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2'></div>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            {warning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
