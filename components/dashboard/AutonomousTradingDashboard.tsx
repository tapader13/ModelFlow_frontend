'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Activity,
  TrendingUp,
  Settings,
  Play,
  Square,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DecisionAnalysisViewer from './DecisionAnalysisViewer';
import DecisionReasoningDisplay from './DecisionReasoningDisplay';
import PositionsDisplay from './PositionsDisplay';
import TradeExecutionHistory from './TradeExecutionHistory';
import AutonomousTradingControls from './AutonomousTradingControls';
import AutonomousTradingStatus from './AutonomousTradingStatus';
import AutonomousTradingConfiguration from './AutonomousTradingConfiguration';
import AutonomousTradingAnalytics from './AutonomousTradingAnalytics';

export interface AutonomousState {
  isRunning: boolean;
  emergencyMode: boolean;
  connectionStatus: string;
  startTime: string | null;
  lastActivity: string | null;
  uptime: number | null;
  lastActivityAgo: number | null;
  statistics: {
    tradesExecutedToday: number;
    activePositions: number;
    dailyPnL: number;
    winRate: number;
    totalTrades: number;
    currentDrawdown: number;
  };
  configuration: {
    activeSymbols: string[];
    minConfidenceThreshold: number;
    maxRiskPerTrade: number;
    maxPortfolioHeat: number;
    maxDailyTrades: number;
    maxSimultaneousPositions: number;
    claudeValidationRequired: boolean;
    engineConsensusRequired: number;
  };
  config: {
    maxDailyLoss: number;
    maxPositionSize: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
    maxConcurrentTrades: number;
    minConfidenceLevel: number;
    tradingPairs: string[];
    analysisInterval: number;
    useAdvancedAI: boolean;
    sentimentWeight: number;
    technicalWeight: number;
    fundamentalWeight: number;
    emergencyStopEnabled: boolean;
    maxDrawdownStop: number;
    enableNotifications: boolean;
    notifyOnTrades: boolean;
    notifyOnErrors: boolean;
  };
  health: {
    status: string;
    uptime: number;
    errors: number;
  };
  analysis: {
    lastAnalysisTime: string | null;
    pendingSignalsCount: number;
    pendingSignals: Array<{
      symbol: string;
      direction: string;
      confidence: number;
      timestamp: string;
    }>;
  };
  errors: {
    lastError: string | null;
  };
}

export default function AutonomousTradingDashboard() {
  const [state, setState] = useState<AutonomousState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [decisionAnalysis, setDecisionAnalysis] = useState<any>(null);
  const [analyzingDecisions, setAnalyzingDecisions] = useState(false);

  // Fetch autonomous trading status
  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/autonomous/status');
      const data = await response.json();

      if (data.success) {
        setState(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Start autonomous trading
  const startTrading = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/autonomous/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (data.success) {
        await fetchStatus(); // Refresh status after starting
      } else {
        setError(data.error || 'Failed to start trading');
      }
    } catch (err) {
      setError('Failed to start autonomous trading');
      console.error('Error starting trading:', err);
    } finally {
      setLoading(false);
    }
  };

  // Stop autonomous trading
  const stopTrading = async (reason = 'Manual stop') => {
    try {
      setLoading(true);
      const response = await fetch('/api/autonomous/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();

      if (data.success) {
        await fetchStatus(); // Refresh status after stopping
      } else {
        setError(data.error || 'Failed to stop trading');
      }
    } catch (err) {
      setError('Failed to stop autonomous trading');
      console.error('Error stopping trading:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update configuration
  const handleConfigUpdate = (newConfig: any) => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            configuration: { ...prev.configuration, ...newConfig },
          }
        : null
    );
  };

  // Analyze trading decisions
  const analyzeDecisions = async (symbol = 'EUR_USD', forceAnalysis = true) => {
    try {
      setAnalyzingDecisions(true);
      setError(null);

      const response = await fetch('/api/autonomous/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, forceAnalysis }),
      });

      const data = await response.json();

      if (data.success) {
        setDecisionAnalysis(data.data);
      } else {
        setError(data.error || 'Failed to analyze decisions');
      }
    } catch (err) {
      setError('Failed to perform decision analysis');
      console.error('Error analyzing decisions:', err);
    } finally {
      setAnalyzingDecisions(false);
    }
  };

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format time utilities
  const formatUptime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatLastActivity = (seconds: number | null) => {
    if (!seconds) return 'Never';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (loading && !state) {
    return (
      <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f]'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />
        <div className='container mx-auto p-6'>
          <div className='flex items-center justify-center h-64'>
            <RefreshCw className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading autonomous trading status...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f]'>
      {/* Dark-mode grid overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

      <div className='container mx-auto p-6 space-y-6 relative z-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0'>
  <div>
    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
      Autonomous Trading
    </h1>
    <p className='text-muted-foreground dark:text-gray-400'>
      AI-powered autonomous forex trading system
    </p>
  </div>
  <div className='flex flex-wrap items-center space-x-2'>
    <Button
      variant='outline'
      size='sm'
      onClick={() => analyzeDecisions()}
      disabled={analyzingDecisions}
      className='dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:text-blue-200 dark:border-blue-700'
    >
      <TrendingUp
        className={`h-4 w-4 mr-2 ${
          analyzingDecisions ? 'animate-pulse' : ''
        }`}
      />
      {analyzingDecisions ? 'Analyzing...' : 'Analyze Decisions'}
    </Button>
    <Button
      variant='outline'
      size='sm'
      onClick={fetchStatus}
      disabled={refreshing}
      className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
    >
      <RefreshCw
        className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
      />
      Refresh
    </Button>
    <Badge
      variant={state?.isRunning ? 'default' : 'secondary'}
      className={
        state?.isRunning
          ? 'bg-green-600 mt-2 md:mt-0 hover:bg-green-700'
          : 'bg-red-600 hover:bg-red-700'
      }
    >
      {state?.isRunning ? 'RUNNING' : 'STOPPED'}
    </Badge>
  </div>
</div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant='destructive'
            className='dark:bg-red-950/50 dark:border-red-800'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='dark:text-red-200'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Status Cards */}
        {state && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Status
                </CardTitle>
                <Activity className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {state.isRunning ? 'RUNNING' : 'STOPPED'}
                </div>
                <p className='text-xs text-muted-foreground dark:text-gray-400'>
                  Uptime: {formatUptime(state.uptime)}
                </p>
              </CardContent>
            </Card>

            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Trades Today
                </CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground dark:text-green-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {state.statistics.tradesExecutedToday}
                </div>
                <p className='text-xs text-muted-foreground dark:text-gray-400'>
                  Win Rate: {state.statistics.winRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Daily P&L
                </CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground dark:text-green-400' />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    state.statistics.dailyPnL >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  ${state.statistics.dailyPnL.toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground dark:text-gray-400'>
                  Drawdown:{' '}
                  {(state.statistics.currentDrawdown * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Active Signals
                </CardTitle>
                <Settings className='h-4 w-4 text-muted-foreground dark:text-purple-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {state.analysis.pendingSignalsCount}
                </div>
                <p className='text-xs text-muted-foreground dark:text-gray-400'>
                  Last Activity: {formatLastActivity(state.lastActivityAgo)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Controls */}
        {state && (
          <AutonomousTradingControls
            isRunning={state.isRunning}
            onStart={startTrading}
            onStop={stopTrading}
            loading={loading}
          />
        )}

        <Separator className='dark:bg-gray-700' />

        {/* Detailed Status and Configuration */}
        {state && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <AutonomousTradingStatus state={state} />
            <AutonomousTradingConfiguration
              state={state}
              onConfigUpdate={handleConfigUpdate}
            />
          </div>
        )}

        <Separator className='dark:bg-gray-700' />

        {/* Open Positions */}
        <PositionsDisplay />

        <Separator className='dark:bg-gray-700' />

        {/* Trade Execution History */}
        <TradeExecutionHistory />

        <Separator className='dark:bg-gray-700' />

        {/* Analytics */}
        {state && <AutonomousTradingAnalytics state={state} />}

        <Separator className='dark:bg-gray-700' />

        {/* Decision Analysis */}
        <DecisionAnalysisViewer />

        <Separator className='dark:bg-gray-700' />

        {/* Decision Reasoning Display */}
        <div>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Decision Reasoning & Transparency
          </h2>
          <DecisionReasoningDisplay
            analysis={decisionAnalysis?.decision || decisionAnalysis}
            isLoading={analyzingDecisions}
          />
        </div>
      </div>
    </div>
  );
}
