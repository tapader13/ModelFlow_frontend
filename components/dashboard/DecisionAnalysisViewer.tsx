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
import { Progress } from '@/components/ui/progress-simple';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  TrendingUp,
  Newspaper,
  DollarSign,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';

interface TradingDecision {
  _id: string;
  timestamp: string;
  symbol: string;
  decision: 'buy' | 'sell' | 'hold' | 'close';
  executed: boolean;
  finalConfidence: number;

  technicalAnalysis: {
    indicators: {
      rsi: { value: number; signal: string; weight: number };
      macd: { value: number; signal: string; weight: number };
      bollinger: { position: string; signal: string; weight: number };
      ema: { trend: string; signal: string; weight: number };
      volume: { level: string; signal: string; weight: number };
    };
    patterns: { name: string; confidence: number; signal: string }[];
    support: number;
    resistance: number;
    trend: string;
    overallScore: number;
    reasoning: string;
  };

  sentimentAnalysis: {
    newsScore: number;
    socialScore: number;
    economicEvents: {
      event: string;
      impact: string;
      expected: string;
      actual?: string;
      sentiment: string;
    }[];
    marketSentiment: string;
    overallScore: number;
    reasoning: string;
  };

  fundamentalAnalysis: {
    economicIndicators: {
      gdp: { value: number; trend: string; impact: number };
      inflation: { value: number; trend: string; impact: number };
      employment: { value: number; trend: string; impact: number };
      interestRates: { value: number; trend: string; impact: number };
    };
    centralBankPolicy: {
      stance: string;
      nextMeeting: string;
      expectedAction: string;
      impact: number;
    };
    geopoliticalFactors: {
      factor: string;
      impact: string;
      sentiment: string;
    }[];
    overallScore: number;
    reasoning: string;
  };

  claudeAnalysis: {
    prompt: string;
    response: string;
    confidence: number;
    reasoning: string;
    factors: string[];
    recommendation: string;
    riskAssessment: {
      level: string;
      factors: string[];
      mitigation: string[];
    };
  };

  riskAnalysis: {
    portfolioHeat: number;
    correlationRisk: number;
    volatilityRisk: number;
    drawdownRisk: number;
    positionSizing: {
      recommended: number;
      rationale: string;
      maxAllowed: number;
    };
    stopLoss: { level: number; reasoning: string };
    takeProfit: { level: number; reasoning: string };
    overallRisk: string;
    reasoning: string;
  };

  weightedScores: {
    technical: number;
    sentiment: number;
    fundamental: number;
    claude: number;
    risk: number;
  };

  primaryReasons: string[];
  warningFlags: string[];
  overrideReasons?: string[];

  tradeDetails?: {
    entryPrice: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
    expectedReturn: number;
    maxRisk: number;
  };

  outcome?: {
    exitPrice?: number;
    exitTime?: string;
    profit?: number;
    success?: boolean;
    lessons?: string[];
  };

  sessionId: string;
  marketSession: string;
  marketConditions: string;
}

export default function DecisionAnalysisViewer() {
  const [decisions, setDecisions] = useState<TradingDecision[]>([]);
  const [selectedDecision, setSelectedDecision] =
    useState<TradingDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDecisions = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        '/api/autonomous/decisions?action=recent&limit=100'
      );
      const data = await response.json();

      if (data.success) {
        setDecisions(data.data);
        if (data.data.length > 0 && !selectedDecision) {
          setSelectedDecision(data.data[0]);
        }
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch decisions');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching decisions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
    const interval = setInterval(fetchDecisions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'close':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-600 dark:text-green-400';
      case 'sell':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading decision analysis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant='destructive'
        className='dark:bg-red-950/50 dark:border-red-800'
      >
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription className='dark:text-red-200'>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Decision Analysis
          </h2>
          <p className='text-muted-foreground dark:text-gray-400'>
            Complete AI reasoning and decision-making transparency
          </p>
        </div>
        <Button
          onClick={fetchDecisions}
          disabled={refreshing}
          variant='outline'
          size='sm'
          className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Decision List */}
        <Card className='lg:col-span-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader>
            <CardTitle className='text-gray-900 dark:text-white'>
              Recent Decisions
            </CardTitle>
            <CardDescription className='text-gray-600 dark:text-gray-400'>
              {decisions.length} decisions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-96'>
              <div className='space-y-2'>
                {decisions.map((decision) => (
                  <div
                    key={decision._id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDecision?._id === decision._id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedDecision(decision)}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-semibold text-gray-900 dark:text-white'>
                        {decision.symbol}
                      </span>
                      <Badge className={getDecisionColor(decision.decision)}>
                        {decision.decision.toUpperCase()}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground dark:text-gray-400'>
                      {formatDate(decision.timestamp)}
                    </div>
                    <div className='flex items-center justify-between mt-1'>
                      <span
                        className={`text-sm font-medium ${getConfidenceColor(
                          decision.finalConfidence
                        )}`}
                      >
                        {decision.finalConfidence}% confidence
                      </span>
                      {decision.executed && (
                        <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Decision Details */}
        {selectedDecision && (
          <Card className='lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader className='p-4 sm:p-6'>
              <CardTitle className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-900 dark:text-white'>
                <span className='text-lg sm:text-xl'>
                  Decision Analysis: {selectedDecision.symbol}
                </span>
                <div className='flex items-center space-x-2'>
                  <Badge
                    className={getDecisionColor(selectedDecision.decision)}
                  >
                    {selectedDecision.decision.toUpperCase()}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-xs'
                  >
                    {selectedDecision.finalConfidence}% confidence
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400 text-sm'>
                {formatDate(selectedDecision.timestamp)} • Session:{' '}
                {selectedDecision.marketSession}
              </CardDescription>
            </CardHeader>

            <CardContent className='p-4 sm:p-6'>
              <Tabs defaultValue='overview' className='w-full'>
                {/* Mobile-optimized tabs with horizontal scrolling */}
                <div className='overflow-x-auto pb-2 hide-scrollbar'>
                  <TabsList className='grid w-max grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <TabsTrigger
                      value='overview'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <BarChart3 className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Overview
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>

                    <TabsTrigger
                      value='technical'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <TrendingUp className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Technical
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>

                    <TabsTrigger
                      value='sentiment'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <Newspaper className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Sentiment
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>

                    <TabsTrigger
                      value='fundamental'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <DollarSign className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Fundamental
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>

                    <TabsTrigger
                      value='claude'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <Brain className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Claude AI
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>

                    <TabsTrigger
                      value='risk'
                      className='relative px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-xs'
                    >
                      <Shield className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500' />
                      Risk
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value='overview' className='space-y-4 mt-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                      <CardHeader className='pb-3 p-4'>
                        <CardTitle className='text-sm text-gray-900 dark:text-white'>
                          Weighted Analysis Scores
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3 p-4 pt-0'>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-700 dark:text-gray-300'>
                              Technical Analysis
                            </span>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {selectedDecision.weightedScores.technical}%
                            </span>
                          </div>
                          <Progress
                            value={selectedDecision.weightedScores.technical}
                            className='h-2'
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-700 dark:text-gray-300'>
                              Sentiment Analysis
                            </span>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {selectedDecision.weightedScores.sentiment}%
                            </span>
                          </div>
                          <Progress
                            value={selectedDecision.weightedScores.sentiment}
                            className='h-2'
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-700 dark:text-gray-300'>
                              Fundamental Analysis
                            </span>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {selectedDecision.weightedScores.fundamental}%
                            </span>
                          </div>
                          <Progress
                            value={selectedDecision.weightedScores.fundamental}
                            className='h-2'
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-700 dark:text-gray-300'>
                              Claude AI Analysis
                            </span>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {selectedDecision.weightedScores.claude}%
                            </span>
                          </div>
                          <Progress
                            value={selectedDecision.weightedScores.claude}
                            className='h-2'
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-700 dark:text-gray-300'>
                              Risk Assessment
                            </span>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {selectedDecision.weightedScores.risk}%
                            </span>
                          </div>
                          <Progress
                            value={selectedDecision.weightedScores.risk}
                            className='h-2'
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                      <CardHeader className='pb-3 p-4'>
                        <CardTitle className='text-sm text-gray-900 dark:text-white'>
                          Primary Decision Factors
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-4 pt-0'>
                        <div className='space-y-2'>
                          {selectedDecision.primaryReasons.map(
                            (reason, index) => (
                              <div
                                key={index}
                                className='flex items-center space-x-2'
                              >
                                <Lightbulb className='h-4 w-4 text-yellow-500 flex-shrink-0' />
                                <span className='text-sm text-gray-900 dark:text-white break-words'>
                                  {reason}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedDecision.warningFlags.length > 0 && (
                    <Alert
                      variant='destructive'
                      className='dark:bg-red-950/50 dark:border-red-800'
                    >
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription className='dark:text-red-200 text-sm'>
                        <strong>Warning Flags:</strong>{' '}
                        {selectedDecision.warningFlags.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedDecision.tradeDetails && (
                    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                      <CardHeader className='p-4'>
                        <CardTitle className='text-sm text-gray-900 dark:text-white'>
                          Trade Execution Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-4 pt-0'>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 text-sm'>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Entry Price:
                            </span>
                            <div className='font-medium text-gray-900 dark:text-white text-sm'>
                              {selectedDecision.tradeDetails.entryPrice}
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Position Size:
                            </span>
                            <div className='font-medium text-gray-900 dark:text-white text-sm'>
                              {selectedDecision.tradeDetails.positionSize}
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Stop Loss:
                            </span>
                            <div className='font-medium text-gray-900 dark:text-white text-sm'>
                              {selectedDecision.tradeDetails.stopLoss}
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Take Profit:
                            </span>
                            <div className='font-medium text-gray-900 dark:text-white text-sm'>
                              {selectedDecision.tradeDetails.takeProfit}
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Expected Return:
                            </span>
                            <div className='font-medium text-green-600 dark:text-green-400 text-sm'>
                              {selectedDecision.tradeDetails.expectedReturn}%
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                              Max Risk:
                            </span>
                            <div className='font-medium text-red-600 dark:text-red-400 text-sm'>
                              {selectedDecision.tradeDetails.maxRisk}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Technical Analysis Tab */}
                <TabsContent value='technical' className='space-y-4 mt-4'>
                  <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                    <CardHeader className='p-4'>
                      <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
                        <TrendingUp className='h-5 w-5' />
                        <span className='text-lg'>Technical Analysis</span>
                        <Badge
                          variant='outline'
                          className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                        >
                          {selectedDecision.technicalAnalysis.overallScore}%
                          score
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 p-4 pt-0'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
                        <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                          Analysis Reasoning:
                        </h4>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {selectedDecision.technicalAnalysis.reasoning}
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Technical Indicators
                          </h4>
                          <div className='space-y-3'>
                            {Object.entries(
                              selectedDecision.technicalAnalysis.indicators
                            ).map(([indicator, data]) => {
                              const getValue = () => {
                                if ('value' in data) return data.value;
                                if ('position' in data) return data.position;
                                if ('trend' in data) return data.trend;
                                if ('level' in data) return data.level;
                                return 'N/A';
                              };

                              return (
                                <div
                                  key={indicator}
                                  className='flex items-center justify-between py-1'
                                >
                                  <span className='text-sm capitalize text-gray-900 dark:text-white break-words max-w-[40%]'>
                                    {indicator.toUpperCase()}
                                  </span>
                                  <div className='flex items-center space-x-2'>
                                    <span className='text-sm text-gray-900 dark:text-white'>
                                      {getValue()}
                                    </span>
                                    <Badge
                                      variant='outline'
                                      className={`${getSignalColor(
                                        data.signal
                                      )} dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                    >
                                      {data.signal}
                                    </Badge>
                                    <span className='text-xs text-muted-foreground dark:text-gray-400'>
                                      {(data.weight * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Market Structure
                          </h4>
                          <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-gray-900 dark:text-white'>
                                Trend:
                              </span>
                              <Badge
                                variant='outline'
                                className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-xs'
                              >
                                {selectedDecision.technicalAnalysis.trend}
                              </Badge>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-900 dark:text-white'>
                                Support:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {selectedDecision.technicalAnalysis.support}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-900 dark:text-white'>
                                Resistance:
                              </span>
                              <span className='font-medium text-gray-900 dark:text-white'>
                                {selectedDecision.technicalAnalysis.resistance}
                              </span>
                            </div>
                          </div>

                          {selectedDecision.technicalAnalysis.patterns.length >
                            0 && (
                            <div className='mt-4'>
                              <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                                Detected Patterns
                              </h4>
                              {selectedDecision.technicalAnalysis.patterns.map(
                                (pattern, index) => (
                                  <div
                                    key={index}
                                    className='flex items-center justify-between text-sm py-1'
                                  >
                                    <span className='text-gray-900 dark:text-white max-w-[50%] break-words'>
                                      {pattern.name}
                                    </span>
                                    <div className='flex items-center space-x-1'>
                                      <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                                        {pattern.confidence}%
                                      </span>
                                      <Badge
                                        variant='outline'
                                        className={`${getSignalColor(
                                          pattern.signal
                                        )} dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                      >
                                        {pattern.signal}
                                      </Badge>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Continue with other tabs... */}
                {/* Sentiment Analysis Tab */}
                <TabsContent value='sentiment' className='space-y-4 mt-4'>
                  <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                    <CardHeader className='p-4'>
                      <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
                        <Newspaper className='h-5 w-5' />
                        <span className='text-lg'>Sentiment Analysis</span>
                        <Badge
                          variant='outline'
                          className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                        >
                          {selectedDecision.sentimentAnalysis.overallScore}%
                          score
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 p-4 pt-0'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
                        <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                          Analysis Reasoning:
                        </h4>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {selectedDecision.sentimentAnalysis.reasoning}
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Sentiment Scores
                          </h4>
                          <div className='space-y-3'>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  News Sentiment
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {selectedDecision.sentimentAnalysis.newsScore}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.sentimentAnalysis.newsScore
                                }
                                className='h-2'
                              />
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  Social Sentiment
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {
                                    selectedDecision.sentimentAnalysis
                                      .socialScore
                                  }
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.sentimentAnalysis.socialScore
                                }
                                className='h-2'
                              />
                            </div>
                            <div className='flex justify-between text-sm'>
                              <span className='text-gray-900 dark:text-white'>
                                Market Sentiment:
                              </span>
                              <Badge
                                variant='outline'
                                className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-xs'
                              >
                                {
                                  selectedDecision.sentimentAnalysis
                                    .marketSentiment
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Economic Events
                          </h4>
                          <div className='space-y-2'>
                            {selectedDecision.sentimentAnalysis.economicEvents.map(
                              (event, index) => (
                                <div
                                  key={index}
                                  className='p-2 border rounded text-sm border-gray-200 dark:border-gray-700'
                                >
                                  <div className='font-medium text-gray-900 dark:text-white'>
                                    {event.event}
                                  </div>
                                  <div className='flex items-center justify-between mt-1'>
                                    <span className='text-muted-foreground dark:text-gray-400 text-xs'>
                                      Impact: {event.impact}
                                    </span>
                                    <Badge
                                      variant='outline'
                                      className={`${
                                        event.sentiment === 'positive'
                                          ? 'text-green-600 dark:text-green-400'
                                          : event.sentiment === 'negative'
                                          ? 'text-red-600 dark:text-red-400'
                                          : 'text-gray-600 dark:text-gray-400'
                                      } dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                    >
                                      {event.sentiment}
                                    </Badge>
                                  </div>
                                  <div className='text-xs text-muted-foreground dark:text-gray-400 mt-1'>
                                    Expected: {event.expected}
                                    {event.actual &&
                                      ` | Actual: ${event.actual}`}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Fundamental Analysis Tab */}
                <TabsContent value='fundamental' className='space-y-4 mt-4'>
                  <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                    <CardHeader className='p-4'>
                      <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
                        <DollarSign className='h-5 w-5' />
                        <span className='text-lg'>Fundamental Analysis</span>
                        <Badge
                          variant='outline'
                          className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                        >
                          {selectedDecision.fundamentalAnalysis.overallScore}%
                          score
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 p-4 pt-0'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
                        <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                          Analysis Reasoning:
                        </h4>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {selectedDecision.fundamentalAnalysis.reasoning}
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Economic Indicators
                          </h4>
                          <div className='space-y-3'>
                            {Object.entries(
                              selectedDecision.fundamentalAnalysis
                                .economicIndicators
                            ).map(([indicator, data]) => (
                              <div
                                key={indicator}
                                className='p-2 border rounded border-gray-200 dark:border-gray-700'
                              >
                                <div className='flex justify-between items-center mb-1'>
                                  <span className='text-sm font-medium capitalize text-gray-900 dark:text-white'>
                                    {indicator.replace(/([A-Z])/g, ' $1')}
                                  </span>
                                  <Badge
                                    variant='outline'
                                    className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-xs'
                                  >
                                    {data.trend}
                                  </Badge>
                                </div>
                                <div className='flex justify-between text-sm'>
                                  <span className='text-gray-900 dark:text-white'>
                                    Value: {data.value}
                                  </span>
                                  <span
                                    className={
                                      data.impact > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }
                                  >
                                    Impact: {data.impact}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Central Bank Policy
                          </h4>
                          <div className='p-2 border rounded border-gray-200 dark:border-gray-700 space-y-2'>
                            <div className='flex justify-between'>
                              <span className='text-sm text-gray-900 dark:text-white'>
                                Policy Stance:
                              </span>
                              <Badge
                                variant='outline'
                                className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-xs'
                              >
                                {
                                  selectedDecision.fundamentalAnalysis
                                    .centralBankPolicy.stance
                                }
                              </Badge>
                            </div>
                            <div className='text-sm text-gray-900 dark:text-white'>
                              <div>
                                Next Meeting:{' '}
                                {
                                  selectedDecision.fundamentalAnalysis
                                    .centralBankPolicy.nextMeeting
                                }
                              </div>
                              <div>
                                Expected:{' '}
                                {
                                  selectedDecision.fundamentalAnalysis
                                    .centralBankPolicy.expectedAction
                                }
                              </div>
                              <div className='flex justify-between mt-1'>
                                <span>Impact Score:</span>
                                <span
                                  className={
                                    selectedDecision.fundamentalAnalysis
                                      .centralBankPolicy.impact > 0
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }
                                >
                                  {
                                    selectedDecision.fundamentalAnalysis
                                      .centralBankPolicy.impact
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          {selectedDecision.fundamentalAnalysis
                            .geopoliticalFactors.length > 0 && (
                            <div className='mt-4'>
                              <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                                Geopolitical Factors
                              </h4>
                              <div className='space-y-2'>
                                {selectedDecision.fundamentalAnalysis.geopoliticalFactors.map(
                                  (factor, index) => (
                                    <div
                                      key={index}
                                      className='p-2 border rounded border-gray-200 dark:border-gray-700 text-sm'
                                    >
                                      <div className='font-medium text-gray-900 dark:text-white'>
                                        {factor.factor}
                                      </div>
                                      <div className='flex justify-between mt-1'>
                                        <span className='text-gray-900 dark:text-white'>
                                          Impact: {factor.impact}
                                        </span>
                                        <Badge
                                          variant='outline'
                                          className={`${
                                            factor.sentiment === 'positive'
                                              ? 'text-green-600 dark:text-green-400'
                                              : factor.sentiment === 'negative'
                                              ? 'text-red-600 dark:text-red-400'
                                              : 'text-gray-600 dark:text-gray-400'
                                          } dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                        >
                                          {factor.sentiment}
                                        </Badge>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Claude AI Analysis Tab */}
                <TabsContent value='claude' className='space-y-4 mt-4'>
                  <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                    <CardHeader className='p-4'>
                      <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
                        <Brain className='h-5 w-5' />
                        <span className='text-lg'>Claude AI Analysis</span>
                        <Badge
                          variant='outline'
                          className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                        >
                          {selectedDecision.claudeAnalysis.confidence}%
                          confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 p-4 pt-0'>
                      <div className='grid grid-cols-1 gap-4'>
                        <div>
                          <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                            AI Prompt
                          </h4>
                          <div className='bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm font-mono text-gray-900 dark:text-white'>
                            {selectedDecision.claudeAnalysis.prompt}
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                            Claude Response
                          </h4>
                          <div className='bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-gray-900 dark:text-white break-words whitespace-pre-wrap'>
                            {selectedDecision.claudeAnalysis.response}
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                            AI Reasoning
                          </h4>
                          <div className='bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-sm text-gray-900 dark:text-white'>
                            {selectedDecision.claudeAnalysis.reasoning}
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                              Key Factors
                            </h4>
                            <div className='space-y-1'>
                              {selectedDecision.claudeAnalysis.factors.map(
                                (factor, index) => (
                                  <div
                                    key={index}
                                    className='flex items-center space-x-2'
                                  >
                                    <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0' />
                                    <span className='text-sm text-gray-900 dark:text-white break-words'>
                                      {factor}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                              Risk Assessment
                            </h4>
                            <div className='space-y-2'>
                              <div className='flex justify-between'>
                                <span className='text-sm text-gray-900 dark:text-white'>
                                  Risk Level:
                                </span>
                                <Badge
                                  variant='outline'
                                  className={`${
                                    selectedDecision.claudeAnalysis
                                      .riskAssessment.level === 'low'
                                      ? 'text-green-600 dark:text-green-400'
                                      : selectedDecision.claudeAnalysis
                                          .riskAssessment.level === 'medium'
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-red-600 dark:text-red-400'
                                  } dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                >
                                  {
                                    selectedDecision.claudeAnalysis
                                      .riskAssessment.level
                                  }
                                </Badge>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-sm text-gray-900 dark:text-white'>
                                  Recommendation:
                                </span>
                                <Badge
                                  variant='outline'
                                  className={`${getSignalColor(
                                    selectedDecision.claudeAnalysis
                                      .recommendation
                                  )} dark:bg-gray-800 dark:border-gray-600 text-xs`}
                                >
                                  {
                                    selectedDecision.claudeAnalysis
                                      .recommendation
                                  }
                                </Badge>
                              </div>
                            </div>

                            <div className='mt-3'>
                              <h5 className='text-sm font-medium mb-1 text-gray-900 dark:text-white'>
                                Risk Factors:
                              </h5>
                              {selectedDecision.claudeAnalysis.riskAssessment.factors.map(
                                (factor, index) => (
                                  <div
                                    key={index}
                                    className='text-xs text-muted-foreground dark:text-gray-400'
                                  >
                                    • {factor}
                                  </div>
                                )
                              )}
                            </div>

                            <div className='mt-3'>
                              <h5 className='text-sm font-medium mb-1 text-gray-900 dark:text-white'>
                                Risk Mitigation:
                              </h5>
                              {selectedDecision.claudeAnalysis.riskAssessment.mitigation.map(
                                (mitigation, index) => (
                                  <div
                                    key={index}
                                    className='text-xs text-muted-foreground dark:text-gray-400'
                                  >
                                    • {mitigation}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Risk Analysis Tab */}
                <TabsContent value='risk' className='space-y-4 mt-4'>
                  <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                    <CardHeader className='p-4'>
                      <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
                        <Shield className='h-5 w-5' />
                        <span className='text-lg'>Risk Analysis</span>
                        <Badge
                          variant='outline'
                          className={`${
                            selectedDecision.riskAnalysis.overallRisk === 'low'
                              ? 'text-green-600 dark:text-green-400'
                              : selectedDecision.riskAnalysis.overallRisk ===
                                'medium'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          } dark:bg-gray-800 dark:border-gray-600`}
                        >
                          {selectedDecision.riskAnalysis.overallRisk} risk
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 p-4 pt-0'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
                        <h4 className='font-medium mb-2 text-gray-900 dark:text-white text-sm'>
                          Risk Assessment Reasoning:
                        </h4>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {selectedDecision.riskAnalysis.reasoning}
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Risk Metrics
                          </h4>
                          <div className='space-y-3'>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  Portfolio Heat
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {selectedDecision.riskAnalysis.portfolioHeat}%
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.riskAnalysis.portfolioHeat
                                }
                                className='h-2'
                              />
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  Correlation Risk
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {
                                    selectedDecision.riskAnalysis
                                      .correlationRisk
                                  }
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.riskAnalysis.correlationRisk
                                }
                                className='h-2'
                              />
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  Volatility Risk
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {selectedDecision.riskAnalysis.volatilityRisk}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.riskAnalysis.volatilityRisk
                                }
                                className='h-2'
                              />
                            </div>
                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span className='text-gray-900 dark:text-white'>
                                  Drawdown Risk
                                </span>
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {selectedDecision.riskAnalysis.drawdownRisk}%
                                </span>
                              </div>
                              <Progress
                                value={
                                  selectedDecision.riskAnalysis.drawdownRisk
                                }
                                className='h-2'
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className='font-medium mb-3 text-gray-900 dark:text-white text-sm'>
                            Position Management
                          </h4>
                          <div className='space-y-3'>
                            <div className='p-2 border rounded border-gray-200 dark:border-gray-700'>
                              <h5 className='text-sm font-medium mb-2 text-gray-900 dark:text-white'>
                                Position Sizing
                              </h5>
                              <div className='text-sm space-y-1'>
                                <div className='flex justify-between'>
                                  <span className='text-gray-900 dark:text-white'>
                                    Recommended:
                                  </span>
                                  <span className='font-medium text-gray-900 dark:text-white'>
                                    {
                                      selectedDecision.riskAnalysis
                                        .positionSizing.recommended
                                    }
                                  </span>
                                </div>
                                <div className='flex justify-between'>
                                  <span className='text-gray-900 dark:text-white'>
                                    Max Allowed:
                                  </span>
                                  <span className='font-medium text-gray-900 dark:text-white'>
                                    {
                                      selectedDecision.riskAnalysis
                                        .positionSizing.maxAllowed
                                    }
                                  </span>
                                </div>
                                <div className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                                  {
                                    selectedDecision.riskAnalysis.positionSizing
                                      .rationale
                                  }
                                </div>
                              </div>
                            </div>

                            <div className='p-2 border rounded border-gray-200 dark:border-gray-700'>
                              <h5 className='text-sm font-medium mb-2 text-gray-900 dark:text-white'>
                                Stop Loss
                              </h5>
                              <div className='text-sm space-y-1'>
                                <div className='flex justify-between'>
                                  <span className='text-gray-900 dark:text-white'>
                                    Level:
                                  </span>
                                  <span className='font-medium text-gray-900 dark:text-white'>
                                    {
                                      selectedDecision.riskAnalysis.stopLoss
                                        .level
                                    }
                                  </span>
                                </div>
                                <div className='text-xs text-muted-foreground dark:text-gray-400'>
                                  {
                                    selectedDecision.riskAnalysis.stopLoss
                                      .reasoning
                                  }
                                </div>
                              </div>
                            </div>

                            <div className='p-2 border rounded border-gray-200 dark:border-gray-700'>
                              <h5 className='text-sm font-medium mb-2 text-gray-900 dark:text-white'>
                                Take Profit
                              </h5>
                              <div className='text-sm space-y-1'>
                                <div className='flex justify-between'>
                                  <span className='text-gray-900 dark:text-white'>
                                    Level:
                                  </span>
                                  <span className='font-medium text-gray-900 dark:text-white'>
                                    {
                                      selectedDecision.riskAnalysis.takeProfit
                                        .level
                                    }
                                  </span>
                                </div>
                                <div className='text-xs text-muted-foreground dark:text-gray-400'>
                                  {
                                    selectedDecision.riskAnalysis.takeProfit
                                      .reasoning
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
