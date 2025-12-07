/**
 * POSITIONS DISPLAY COMPONENT
 * Shows all open positions with real-time data
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress-simple';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  Clock,
  Target,
  Shield,
  X,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  entry: number;
  current: number;
  profit: number;
  time: string;
  openTime: string;
  instrument: string;
  units: string;
  financing: number;
  dividendAdjustment: number;
}

interface PositionsSummary {
  totalPositions: number;
  totalProfit: number;
  profitablePositions: number;
  losingPositions: number;
}

interface PositionsData {
  positions: Position[];
  summary: PositionsSummary;
  timestamp: string;
}

const PositionsDisplay: React.FC = () => {
  const [positionsData, setPositionsData] = useState<PositionsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch positions data
  const fetchPositions = async () => {
    try {
      setError(null);
      const response = await fetch('/api/oanda/positions');
      const data = await response.json();

      if (data.success) {
        setPositionsData(data.data);
      } else {
        setError(data.error || 'Failed to fetch positions');
      }
    } catch (err) {
      setError('Network error occurred while fetching positions');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto refresh positions every 5 seconds
  useEffect(() => {
    fetchPositions();

    if (autoRefresh) {
      const interval = setInterval(fetchPositions, 5000);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [autoRefresh]);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPositions();
  };

  // Close position
  const closePosition = async (positionId: string, symbol: string) => {
    try {
      const response = await fetch('/api/oanda/trades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId: positionId, action: 'close' }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchPositions(); // Refresh after closing
      } else {
        setError(`Failed to close position ${symbol}: ${data.error}`);
      }
    } catch (err) {
      setError(`Error closing position ${symbol}`);
    }
  };

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

  // Calculate position duration
  const getPositionDuration = (openTime: string): string => {
    const now = new Date();
    const opened = new Date(openTime);
    const diff = now.getTime() - opened.getTime();

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

  // Get profit background color
  const getProfitBgColor = (profit: number): string => {
    if (profit > 0)
      return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    if (profit < 0)
      return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    return 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
            <Activity className='h-5 w-5 animate-pulse' />
            Loading Positions...
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
            Open Positions
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Real-time view of all active trading positions
          </p>
        </div>
        <div className='flex flex-wrap items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setAutoRefresh(!autoRefresh)}
            className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`}
            />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={refreshing}
            className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant='destructive'
          className='dark:bg-red-950/50 dark:border-red-800'
        >
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription className='dark:text-red-200'>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      {positionsData && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Total Positions
              </CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {positionsData.summary.totalPositions}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Active trades
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
                  positionsData.summary.totalProfit
                )}`}
              >
                {formatCurrency(positionsData.summary.totalProfit)}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Unrealized profit/loss
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Profitable
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {positionsData.summary.profitablePositions}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Winning positions
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Losing
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
                {positionsData.summary.losingPositions}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Losing positions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Positions List */}
      {positionsData?.positions.length === 0 ? (
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardContent className='text-center py-8'>
            <Target className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-300'>
              No Open Positions
            </h3>
            <p className='text-gray-500 dark:text-gray-400'>
              No active trading positions found. The system is ready to trade
              when opportunities arise.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {positionsData?.positions.map((position) => (
            <Card
              key={position.id}
              className={`border-2 ${getProfitBgColor(
                position.profit
              )} backdrop-blur-sm shadow-md`}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                      {position.type === 'BUY' ? (
                        <TrendingUp className='h-5 w-5 text-green-600 dark:text-green-400' />
                      ) : (
                        <TrendingDown className='h-5 w-5 text-red-600 dark:text-red-400' />
                      )}
                      <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {position.symbol}
                      </span>
                    </div>
                    <Badge
                      variant={
                        position.type === 'BUY' ? 'default' : 'destructive'
                      }
                      className={
                        position.type === 'BUY'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }
                    >
                      {position.type}
                    </Badge>
                    <Badge
                      variant='outline'
                      className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                    >
                      {position.volume.toFixed(2)} lots
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() =>
                        closePosition(position.id, position.symbol)
                      }
                      className='bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                    >
                      <X className='h-4 w-4 mr-1' />
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Price Information */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Entry Price
                    </p>
                    <p className='text-lg font-bold text-gray-900 dark:text-white'>
                      {formatPrice(position.entry, position.symbol)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Current Price
                    </p>
                    <p className='text-lg font-bold text-gray-900 dark:text-white'>
                      {formatPrice(position.current, position.symbol)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Price Change
                    </p>
                    <p
                      className={`text-lg font-bold ${getProfitColor(
                        position.current - position.entry
                      )}`}
                    >
                      {position.type === 'BUY'
                        ? (position.current - position.entry >= 0 ? '+' : '') +
                          formatPrice(
                            position.current - position.entry,
                            position.symbol
                          )
                        : (position.entry - position.current >= 0 ? '+' : '') +
                          formatPrice(
                            position.entry - position.current,
                            position.symbol
                          )}
                    </p>
                  </div>
                </div>

                {/* Profit & Loss */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Unrealized P&L
                    </p>
                    <p
                      className={`text-xl font-bold ${getProfitColor(
                        position.profit
                      )}`}
                    >
                      {formatCurrency(position.profit)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Duration
                    </p>
                    <p className='text-lg font-semibold flex items-center gap-1 text-gray-900 dark:text-white'>
                      <Clock className='h-4 w-4' />
                      {getPositionDuration(position.openTime)}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                  <div>
                    <p className='font-medium text-gray-500 dark:text-gray-400'>
                      Position ID
                    </p>
                    <p className='font-mono text-gray-900 dark:text-white'>
                      {position.id}
                    </p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-500 dark:text-gray-400'>
                      Units
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {Math.abs(parseFloat(position.units)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-500 dark:text-gray-400'>
                      Open Time
                    </p>
                    <p className='text-gray-900 dark:text-white'>
                      {new Date(position.openTime).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Financing & Dividends (if any) */}
                {(position.financing !== 0 ||
                  position.dividendAdjustment !== 0) && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-2 dark:border-gray-700'>
                    {position.financing !== 0 && (
                      <div>
                        <p className='font-medium text-gray-500 dark:text-gray-400'>
                          Financing
                        </p>
                        <p className={getProfitColor(position.financing)}>
                          {formatCurrency(position.financing)}
                        </p>
                      </div>
                    )}
                    {position.dividendAdjustment !== 0 && (
                      <div>
                        <p className='font-medium text-gray-500 dark:text-gray-400'>
                          Dividend Adjustment
                        </p>
                        <p
                          className={getProfitColor(
                            position.dividendAdjustment
                          )}
                        >
                          {formatCurrency(position.dividendAdjustment)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Profit Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Position Performance
                    </span>
                    <span className={getProfitColor(position.profit)}>
                      {position.profit > 0 ? '+' : ''}
                      {(
                        (position.profit /
                          (position.entry * position.volume * 10000)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      Math.max(
                        (position.profit /
                          (position.entry * position.volume * 10000)) *
                          100 +
                          50,
                        0
                      ),
                      100
                    )}
                    className='h-2'
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Last Updated */}
      {positionsData && (
        <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
          Last updated: {new Date(positionsData.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PositionsDisplay;
