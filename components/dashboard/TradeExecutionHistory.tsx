/**
 * TRADE EXECUTION HISTORY COMPONENT
 * Shows recent executed trades and their outcomes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
} from 'lucide-react';

interface ExecutedTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  entry: number;
  current: number;
  profit: number;
  time: string;
  openTime: string;
  status: 'open' | 'closed';
  duration?: string;
  closeTime?: string;
  closePrice?: number;
  commission?: number;
}

interface TradeHistory {
  trades: ExecutedTrade[];
  summary: {
    totalTrades: number;
    profitableTrades: number;
    losingTrades: number;
    totalProfit: number;
    winRate: number;
  };
}

const TradeExecutionHistory: React.FC = () => {
  const [openTrades, setOpenTrades] = useState<ExecutedTrade[]>([]);
  const [closedTrades, setClosedTrades] = useState<ExecutedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  // Fetch trade data
  const fetchTrades = async (type: 'open' | 'closed') => {
    try {
      setError(null);
      const response = await fetch(`/api/oanda/trades?type=${type}`);
      const data = await response.json();

      if (data.success) {
        if (type === 'open') {
          setOpenTrades(data.data.trades || []);
        } else {
          setClosedTrades(data.data.trades || []);
        }
      } else {
        setError(data.error || `Failed to fetch ${type} trades`);
      }
    } catch (err) {
      setError(`Network error occurred while fetching ${type} trades`);
      console.error(`Error fetching ${type} trades:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Load all trades on component mount
  useEffect(() => {
    const loadAllTrades = async () => {
      setLoading(true);
      await Promise.all([fetchTrades('open'), fetchTrades('closed')]);
      setLoading(false);
    };

    loadAllTrades();
  }, []);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format price with appropriate precision
  const formatPrice = (price: number, symbol: string): string => {
    const isJPY = symbol.includes('JPY');
    const decimals = isJPY ? 3 : 5;
    return price.toFixed(decimals);
  };

  // Calculate trade duration
  const getTradeDuration = (openTime: string, closeTime?: string): string => {
    const start = new Date(openTime);
    const end = closeTime ? new Date(closeTime) : new Date();
    const diff = end.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Get profit color
  const getProfitColor = (profit: number): string => {
    if (profit > 0) return 'text-green-600 dark:text-green-400';
    if (profit < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Calculate summary statistics
  const calculateSummary = (trades: ExecutedTrade[]) => {
    const closedProfitableTrades = trades.filter(
      (t) => t.status === 'closed' && t.profit > 0
    );
    const closedLosingTrades = trades.filter(
      (t) => t.status === 'closed' && t.profit < 0
    );
    const totalClosedTrades =
      closedProfitableTrades.length + closedLosingTrades.length;
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winRate =
      totalClosedTrades > 0
        ? (closedProfitableTrades.length / totalClosedTrades) * 100
        : 0;

    return {
      totalTrades: trades.length,
      profitableTrades: closedProfitableTrades.length,
      losingTrades: closedLosingTrades.length,
      totalProfit,
      winRate,
    };
  };

  const currentTrades = activeTab === 'open' ? openTrades : closedTrades;
  const summary = calculateSummary([...openTrades, ...closedTrades]);

  if (loading) {
    return (
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
            <Activity className='h-5 w-5 animate-pulse' />
            Loading Trade History...
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
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Trade Execution History
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Track all executed trades and their performance
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            setLoading(true);
            Promise.all([fetchTrades('open'), fetchTrades('closed')]).finally(
              () => setLoading(false)
            );
          }}
          className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant='destructive'
          className='dark:bg-red-950/50 dark:border-red-800'
        >
          <XCircle className='h-4 w-4' />
          <AlertDescription className='dark:text-red-200'>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Total Trades
            </CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {summary.totalTrades}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              All executed trades
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Win Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {summary.winRate.toFixed(1)}%
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Closed trades only
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Profitable
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {summary.profitableTrades}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Winning trades
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Losing
            </CardTitle>
            <XCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
              {summary.losingTrades}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Losing trades
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Total P&L
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getProfitColor(
                summary.totalProfit
              )}`}
            >
              {formatCurrency(summary.totalProfit)}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Combined profit/loss
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className='flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700'>
        <Button
          variant={activeTab === 'open' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setActiveTab('open')}
          className={`relative flex-1 transition-all duration-200 ${
            activeTab === 'open'
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-sm'
              : 'dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className='flex items-center justify-center gap-2'>
            <span className='w-2 h-2 bg-green-400 rounded-full'></span>
            Open Trades
            <Badge className='ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
              {openTrades.length}
            </Badge>
          </span>
          {activeTab === 'open' && (
            <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full'></div>
          )}
        </Button>
        <Button
          variant={activeTab === 'closed' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setActiveTab('closed')}
          className={`relative flex-1 transition-all duration-200 ${
            activeTab === 'closed'
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-sm'
              : 'dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className='flex items-center justify-center gap-2'>
            <span className='w-2 h-2 bg-gray-400 rounded-full'></span>
            Closed Trades
            <Badge className='ml-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'>
              {closedTrades.length}
            </Badge>
          </span>
          {activeTab === 'closed' && (
            <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full'></div>
          )}
        </Button>
      </div>

      {/* Trades List */}
      {currentTrades.length === 0 ? (
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardContent className='text-center py-8'>
            <Activity className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-300'>
              No {activeTab} Trades
            </h3>
            <p className='text-gray-500 dark:text-gray-400'>
              {activeTab === 'open'
                ? 'No currently open trades. The system is monitoring for opportunities.'
                : 'No closed trades found. Trade history will appear here once positions are closed.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {currentTrades.map((trade) => (
            <Card
              key={trade.id}
              className='border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md'
            >
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  {/* Trade Info */}
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      {trade.type === 'BUY' ? (
                        <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-400' />
                      ) : (
                        <TrendingDown className='h-5 w-5 text-red-600 dark:text-red-400' />
                      )}
                      <span className='font-semibold text-lg text-gray-900 dark:text-white'>
                        {trade.symbol}
                      </span>
                    </div>
                    <Badge
                      variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                      className={
                        trade.type === 'BUY'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }
                    >
                      {trade.type}
                    </Badge>
                    <Badge
                      variant='outline'
                      className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                    >
                      {trade.volume.toFixed(2)} lots
                    </Badge>
                    <Badge
                      variant={
                        trade.status === 'open' ? 'default' : 'secondary'
                      }
                      className={
                        trade.status === 'open'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }
                    >
                      {trade.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Profit & Time */}
                  <div className='text-right'>
                    <div
                      className={`text-lg font-bold ${getProfitColor(
                        trade.profit
                      )}`}
                    >
                      {formatCurrency(trade.profit)}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {getTradeDuration(trade.openTime, trade.closeTime)}
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className='mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-500 dark:text-gray-400'>
                      Entry Price
                    </p>
                    <p className='font-semibold text-gray-900 dark:text-white'>
                      {formatPrice(trade.entry, trade.symbol)}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500 dark:text-gray-400'>
                      {trade.status === 'closed'
                        ? 'Close Price'
                        : 'Current Price'}
                    </p>
                    <p className='font-semibold text-gray-900 dark:text-white'>
                      {formatPrice(trade.current, trade.symbol)}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500 dark:text-gray-400'>
                      Open Time
                    </p>
                    <p className='font-semibold text-gray-900 dark:text-white'>
                      {new Date(trade.openTime).toLocaleString()}
                    </p>
                  </div>
                  {trade.status === 'closed' && trade.closeTime && (
                    <div>
                      <p className='text-gray-500 dark:text-gray-400'>
                        Close Time
                      </p>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        {new Date(trade.closeTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Trade ID */}
                <div className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
                  Trade ID: {trade.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeExecutionHistory;
