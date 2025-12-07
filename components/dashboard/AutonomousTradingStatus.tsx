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
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { AutonomousState } from './AutonomousTradingDashboard';

interface AutonomousTradingStatusProps {
  state: AutonomousState;
}

export default function AutonomousTradingStatus({
  state,
}: AutonomousTradingStatusProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatUptime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400';
      case 'disconnected':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getConnectionIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
        );
      case 'disconnected':
        return (
          <AlertCircle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
        );
      case 'error':
        return <XCircle className='h-4 w-4 text-red-600 dark:text-red-400' />;
      default:
        return (
          <AlertCircle className='h-4 w-4 text-gray-600 dark:text-gray-400' />
        );
    }
  };

  return (
    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
          <Activity className='h-5 w-5' />
          <span>System Status</span>
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Real-time autonomous trading system status and health
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Trading Status */}
        <div className='space-y-2'>
          <h4 className='font-semibold text-gray-900 dark:text-white'>
            Trading Status
          </h4>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 dark:text-gray-300'>
              System State
            </span>
            <Badge
              variant={state.isRunning ? 'default' : 'secondary'}
              className={
                state.isRunning
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {state.isRunning ? 'RUNNING' : 'STOPPED'}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 dark:text-gray-300'>
              Emergency Mode
            </span>
            <Badge
              variant={state.emergencyMode ? 'destructive' : 'secondary'}
              className={
                state.emergencyMode
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }
            >
              {state.emergencyMode ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 dark:text-gray-300'>
              Connection Status
            </span>
            <div className='flex items-center space-x-2'>
              {getConnectionIcon(state.connectionStatus)}
              <span
                className={getConnectionStatusColor(state.connectionStatus)}
              >
                {state.connectionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <Separator className='dark:bg-gray-700' />

        {/* Timing Information */}
        <div className='space-y-2'>
          <h4 className='font-semibold flex items-center space-x-2 text-gray-900 dark:text-white'>
            <Clock className='h-4 w-4' />
            <span>Timing</span>
          </h4>
          <div className='grid grid-cols-1 gap-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-gray-400'>
                Start Time:
              </span>
              <span className='text-gray-900 dark:text-white'>
                {formatDate(state.startTime)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-gray-400'>
                Last Activity:
              </span>
              <span className='text-gray-900 dark:text-white'>
                {formatDate(state.lastActivity)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-gray-400'>
                Uptime:
              </span>
              <span className='text-gray-900 dark:text-white'>
                {formatUptime(state.uptime)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-gray-400'>
                Last Analysis:
              </span>
              <span className='text-gray-900 dark:text-white'>
                {formatDate(state.analysis.lastAnalysisTime)}
              </span>
            </div>
          </div>
        </div>

        <Separator className='dark:bg-gray-700' />

        {/* Trading Statistics */}
        <div className='space-y-2'>
          <h4 className='font-semibold flex items-center space-x-2 text-gray-900 dark:text-white'>
            <TrendingUp className='h-4 w-4' />
            <span>Performance</span>
          </h4>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Trades Today:
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {state.statistics.tradesExecutedToday}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Active Positions:
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {state.statistics.activePositions}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Total Trades:
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {state.statistics.totalTrades}
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Daily P&L:
                </span>
                <span
                  className={`font-medium ${
                    state.statistics.dailyPnL >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  ${state.statistics.dailyPnL.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Win Rate:
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {state.statistics.winRate.toFixed(1)}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Drawdown:
                </span>
                <span className='font-medium text-red-600 dark:text-red-400'>
                  {(state.statistics.currentDrawdown * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className='dark:bg-gray-700' />

        {/* System Health */}
        <div className='space-y-2'>
          <h4 className='font-semibold text-gray-900 dark:text-white'>
            System Health
          </h4>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 dark:text-gray-300'>
              Health Status
            </span>
            <Badge
              variant={
                state.health.status === 'healthy' ? 'default' : 'destructive'
              }
              className={
                state.health.status === 'healthy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {state.health.status.toUpperCase()}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-700 dark:text-gray-300'>
              Error Count
            </span>
            <span
              className={
                state.health.errors > 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }
            >
              {state.health.errors}
            </span>
          </div>
        </div>

        {/* Error Information */}
        {state.errors.lastError && (
          <>
            <Separator className='dark:bg-gray-700' />
            <div className='space-y-2'>
              <h4 className='font-semibold text-red-600 dark:text-red-400'>
                Last Error
              </h4>
              <p className='text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/30 p-2 rounded'>
                {state.errors.lastError}
              </p>
            </div>
          </>
        )}

        {/* Pending Signals */}
        {state.analysis.pendingSignalsCount > 0 && (
          <>
            <Separator className='dark:bg-gray-700' />
            <div className='space-y-2'>
              <h4 className='font-semibold text-gray-900 dark:text-white'>
                Pending Signals ({state.analysis.pendingSignalsCount})
              </h4>
              <div className='space-y-1'>
                {state.analysis.pendingSignals.map((signal, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between text-sm bg-blue-50 dark:bg-blue-950/30 p-2 rounded'
                  >
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {signal.symbol}
                    </span>
                    <div className='flex items-center space-x-2'>
                      <Badge
                        variant={
                          signal.direction === 'buy' ? 'default' : 'destructive'
                        }
                        className={
                          signal.direction === 'buy'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }
                      >
                        {signal.direction.toUpperCase()}
                      </Badge>
                      <span className='text-muted-foreground dark:text-gray-400'>
                        {signal.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
