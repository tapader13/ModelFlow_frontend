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
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Target,
  RefreshCw,
  BarChart3,
  Zap,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Gauge,
  Lightbulb,
} from 'lucide-react';

interface SixEnginesData {
  success: boolean;
  data: {
    engines: Array<{
      name: string;
      weight: number;
      enabled: boolean;
    }>;
    systemStatus: string;
    phase: string;
    capabilities: string[];
  };
  timestamp: string;
}

interface RegimePrediction {
  currentRegime: string;
  confidence: number;
  transitionProbability: number;
  recommendedStrategy: string;
  prediction: {
    currentRegime: {
      type: string;
      strength: number;
      direction: string;
      volatility: string;
      characteristics: string[];
    };
    predictedRegime: {
      type: string;
      strength: number;
      direction: string;
      volatility: string;
      characteristics: string[];
    };
    reasoning: string;
  };
}

export default function MarketIntelligence() {
  const [sixEnginesData, setSixEnginesData] = useState<SixEnginesData | null>(
    null
  );
  const [regimePrediction, setRegimePrediction] =
    useState<RegimePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('EUR_USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('H1');

  const symbols = [
    'EUR_USD',
    'GBP_USD',
    'USD_JPY',
    'USD_CHF',
    'AUD_USD',
    'USD_CAD',
    'NZD_USD',
  ];
  const timeframes = ['M5', 'M15', 'H1', 'H4', 'D1'];

  const fetchMarketData = async () => {
    try {
      setLoading(true);

      const [sixEnginesResponse, regimeResponse] = await Promise.all([
        fetch('/api/analysis/six-engines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: selectedSymbol,
            timeframe: selectedTimeframe,
          }),
        }),
        fetch('/api/ai/advanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'predict_regime' }),
        }),
      ]);

      if (sixEnginesResponse.ok) {
        const sixEnginesResult = await sixEnginesResponse.json();
        if (sixEnginesResult.success) {
          setSixEnginesData(sixEnginesResult.data);
        }
      }

      if (regimeResponse.ok) {
        const regimeResult = await regimeResponse.json();
        if (regimeResult.success) {
          setRegimePrediction(regimeResult);
        }
      }

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch market data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymbol, selectedTimeframe]);

  const getSignalColor = (signal: string) => {
    switch (signal?.toLowerCase()) {
      case 'buy':
      case 'strong_buy':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'sell':
      case 'strong_sell':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'hold':
      case 'neutral':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700';
    }
  };

  const getRegimeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'trending':
        return <TrendingUp className='h-5 w-5' />;
      case 'ranging':
        return <Activity className='h-5 w-5' />;
      case 'volatile':
        return <Zap className='h-5 w-5' />;
      case 'breakout':
        return <ArrowUpRight className='h-5 w-5' />;
      case 'reversal':
        return <ArrowDownRight className='h-5 w-5' />;
      default:
        return <Eye className='h-5 w-5' />;
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Market Intelligence
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
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
  <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left'>
    Market Intelligence
  </h1>
  
  <div className='flex flex-col xs:flex-row items-stretch gap-2 w-full sm:w-auto'>
    <div className='flex flex-1 gap-2'>
      <select
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
        className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
      >
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
      
      <select
        value={selectedTimeframe}
        onChange={(e) => setSelectedTimeframe(e.target.value)}
        className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
      >
        {timeframes.map((tf) => (
          <option key={tf} value={tf}>
            {tf}
          </option>
        ))}
      </select>
    </div>
    
    <Button
      onClick={fetchMarketData}
      disabled={loading}
      size='sm'
      variant='outline'
      className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-sm px-3 py-2'
    >
      <RefreshCw
        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
      />
      <span className='ml-2 xs:ml-1'>Refresh</span>
    </Button>
  </div>
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

      <Tabs defaultValue='engines' className='space-y-4'>
        <div className='overflow-x-auto pb-2 hide-scrollbar'>
  <TabsList className='inline-flex w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 min-w-full sm:min-w-0'>
    <TabsTrigger
      value='engines'
      className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
    >
      <Brain className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
      <span className='hidden xs:inline'>AI Engines</span>
      <span className='xs:hidden'>AI</span>
      {sixEnginesData?.data?.engines && (
        <Badge className='ml-1 sm:ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs'>
          {sixEnginesData.data.engines.filter((e) => e.enabled).length}/
          {sixEnginesData.data.engines.length}
        </Badge>
      )}
    </TabsTrigger>
    
    <TabsTrigger
      value='regime'
      className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
    >
      <Gauge className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
      <span className='hidden xs:inline'>Market Regime</span>
      <span className='xs:hidden'>Regime</span>
      {regimePrediction && (
        <Badge className='ml-1 sm:ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs'>
          {regimePrediction.confidence}%
        </Badge>
      )}
    </TabsTrigger>
    
    <TabsTrigger
      value='insights'
      className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
    >
      <Lightbulb className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
      <span className='hidden xs:inline'>Key Insights</span>
      <span className='xs:hidden'>Insights</span>
    </TabsTrigger>
  </TabsList>
</div>

        <TabsContent value='engines' className='space-y-4'>
          {/* Overall Signal */}
          {sixEnginesData && (
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <Brain className='h-5 w-5' />
                  Overall Market Signal - EUR/USD
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Six AI engines comprehensive analysis for M15 timeframe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <Badge
                      className={`px-4 py-2 text-lg font-semibold ${getSignalColor(
                        'buy'
                      )}`}
                    >
                      BUY
                    </Badge>
                    <div className='flex items-center gap-2'>
                      <Target className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
                      <span className='text-sm text-muted-foreground dark:text-gray-400'>
                        Confidence: 78%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Engine Analysis Grid */}
          {sixEnginesData && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {sixEnginesData.data?.engines?.map((engine, index) => (
                <Card
                  key={engine.name}
                  className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'
                >
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-base capitalize text-gray-900 dark:text-white'>
                      {engine.name} Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Status
                      </span>
                      <Badge
                        className={`${
                          engine.enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {engine.enabled ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Weight
                      </span>
                      <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {engine.weight}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Strength
                      </span>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(engine.weight * 2.5) // Convert weight to 5-star scale
                                ? 'bg-blue-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className='text-xs text-muted-foreground dark:text-gray-400 border-t pt-2 dark:border-gray-700'>
                      <p className='truncate'>
                        {engine.name === 'Technical' &&
                          'RSI, MACD, Bollinger, EMA indicators'}
                        {engine.name === 'Pattern' &&
                          'Classical & Harmonic pattern recognition'}
                        {engine.name === 'Structure' &&
                          'Trend, Support/Resistance analysis'}
                        {engine.name === 'Gann' &&
                          'Square of Nine, Sacred Geometry'}
                        {engine.name === 'Fibonacci' &&
                          'Retracement & Extension levels'}
                        {engine.name === 'Fractal' &&
                          'Bill Williams Method detection'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='regime' className='space-y-4'>
          {regimePrediction && (
            <>
              {/* Current Regime */}
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    {getRegimeIcon(
                      regimePrediction?.prediction?.currentRegime?.type
                    )}
                    Current Market Regime
                  </CardTitle>
                  <CardDescription className='text-gray-600 dark:text-gray-400'>
                    Real-time market condition analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Regime Type
                      </label>
                      <p className='text-lg font-semibold capitalize text-gray-900 dark:text-white'>
                        {regimePrediction?.prediction?.currentRegime?.type}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Direction
                      </label>
                      <div className='flex items-center gap-2'>
                        {regimePrediction?.prediction?.currentRegime
                          ?.direction === 'bullish' ? (
                          <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                        ) : regimePrediction?.prediction?.currentRegime
                            ?.direction === 'bearish' ? (
                          <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                        ) : (
                          <Activity className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                        )}
                        <span className='capitalize text-gray-900 dark:text-white'>
                          {
                            regimePrediction?.prediction?.currentRegime
                              ?.direction
                          }
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Strength
                      </label>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-blue-500 h-2 rounded-full'
                            style={{
                              width: `${regimePrediction?.prediction?.currentRegime?.strength}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {
                            regimePrediction?.prediction?.currentRegime
                              ?.strength
                          }
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Volatility
                      </label>
                      <Badge
                        variant='outline'
                        className='capitalize dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                      >
                        {
                          regimePrediction?.prediction?.currentRegime
                            ?.volatility
                        }
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                      Characteristics
                    </label>
                    <div className='flex flex-wrap gap-2 mt-1'>
                      {regimePrediction?.prediction?.currentRegime?.characteristics.map(
                        (char, i) => (
                          <Badge
                            key={i}
                            variant='secondary'
                            className='text-xs dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                          >
                            {char.replace(/_/g, ' ')}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Predicted Regime */}
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    {getRegimeIcon(
                      regimePrediction?.prediction?.predictedRegime?.type
                    )}
                    Predicted Market Regime
                  </CardTitle>
                  <CardDescription className='text-gray-600 dark:text-gray-400'>
                    Expected regime transition with{' '}
                    {regimePrediction?.transitionProbability}% probability
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Expected Type
                      </label>
                      <p className='text-lg font-semibold capitalize text-gray-900 dark:text-white'>
                        {regimePrediction?.prediction?.predictedRegime?.type}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Expected Direction
                      </label>
                      <div className='flex items-center gap-2'>
                        {regimePrediction?.prediction?.predictedRegime
                          ?.direction === 'bullish' ? (
                          <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                        ) : regimePrediction?.prediction?.predictedRegime
                            ?.direction === 'bearish' ? (
                          <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                        ) : (
                          <Activity className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                        )}
                        <span className='capitalize text-gray-900 dark:text-white'>
                          {
                            regimePrediction?.prediction?.predictedRegime
                              ?.direction
                          }
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Transition Probability
                      </label>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-orange-500 h-2 rounded-full'
                            style={{
                              width: `${regimePrediction?.transitionProbability}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {regimePrediction?.transitionProbability}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                        Overall Confidence
                      </label>
                      <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {regimePrediction?.confidence}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground dark:text-gray-400'>
                      Expected Characteristics
                    </label>
                    <div className='flex flex-wrap gap-2 mt-1'>
                      {regimePrediction?.prediction?.predictedRegime?.characteristics?.map(
                        (char, i) => (
                          <Badge
                            key={i}
                            variant='outline'
                            className='text-xs dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                          >
                            {char.replace(/_/g, ' ')}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Strategy */}
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Target className='h-5 w-5' />
                    Recommended Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div>
                      <Badge className='text-base px-4 py-2 dark:bg-blue-600 dark:text-white'>
                        {regimePrediction?.recommendedStrategy
                          ?.replace(/_/g, ' ')
                          .toUpperCase() || 'MAINTAIN'}
                      </Badge>
                    </div>
                    <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                      <h4 className='font-medium mb-2 text-gray-900 dark:text-white'>
                        Analysis Reasoning
                      </h4>
                      <p className='text-sm text-muted-foreground dark:text-gray-400 leading-relaxed'>
                        {regimePrediction?.prediction?.reasoning}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value='insights' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <BarChart3 className='h-5 w-5' />
                  Key Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    AI engines consensus suggests current market conditions
                  </span>
                </div>
                <div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    High confidence regime prediction available
                  </span>
                </div>
                <div className='flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    Monitor for potential regime transition signals
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <AlertTriangle className='h-5 w-5' />
                  Risk Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    Market volatility may increase during regime transitions
                  </span>
                </div>
                <div className='flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    Adjust position sizes based on confidence levels
                  </span>
                </div>
                <div className='flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    Consider correlation analysis for portfolio exposure
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
