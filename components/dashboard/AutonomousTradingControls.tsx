'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AutonomousTradingControlsProps {
  isRunning: boolean;
  onStart: () => Promise<void>;
  onStop: (reason?: string) => Promise<void>;
  loading: boolean;
}

export default function AutonomousTradingControls({
  isRunning,
  onStart,
  onStop,
  loading,
}: AutonomousTradingControlsProps) {
  const [stopReason, setStopReason] = useState('');
  const [stopDialogOpen, setStopDialogOpen] = useState(false);

  const handleStop = async () => {
    await onStop(stopReason || 'Manual stop');
    setStopDialogOpen(false);
    setStopReason('');
  };

  return (
    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2 text-gray-900 dark:text-white'>
          <span>Trading Controls</span>
          <Badge
            variant={isRunning ? 'default' : 'secondary'}
            className={
              isRunning
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }
          >
            {isRunning ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Start or stop the autonomous trading system
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center space-x-4'>
          {!isRunning ? (
            <Button
              onClick={onStart}
              disabled={loading}
              className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              size='lg'
            >
              {loading ? (
                <RefreshCw className='h-4 w-4 animate-spin' />
              ) : (
                <Play className='h-4 w-4' />
              )}
              <span>Start Autonomous Trading</span>
            </Button>
          ) : (
            <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='destructive'
                  disabled={loading}
                  className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                  size='lg'
                >
                  {loading ? (
                    <RefreshCw className='h-4 w-4 animate-spin' />
                  ) : (
                    <Square className='h-4 w-4' />
                  )}
                  <span>Stop Trading</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
                <DialogHeader>
                  <DialogTitle className='text-gray-900 dark:text-white'>
                    Stop Autonomous Trading
                  </DialogTitle>
                  <DialogDescription className='text-gray-600 dark:text-gray-400'>
                    Are you sure you want to stop the autonomous trading system?
                    This will halt all automated analysis and trading
                    activities.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='stopReason'
                      className='text-gray-700 dark:text-gray-300'
                    >
                      Reason (optional)
                    </Label>
                    <Input
                      id='stopReason'
                      placeholder='e.g., Market conditions, manual intervention...'
                      value={stopReason}
                      onChange={(e) => setStopReason(e.target.value)}
                      className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setStopDialogOpen(false)}
                    className='border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={handleStop}
                    disabled={loading}
                    className='bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                  >
                    {loading ? (
                      <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <Square className='h-4 w-4 mr-2' />
                    )}
                    Stop Trading
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isRunning && (
          <Alert className='bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'>
            <AlertTriangle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <AlertDescription className='text-blue-800 dark:text-blue-300'>
              Autonomous trading is currently active. The system is analyzing
              markets and may execute trades based on AI consensus and risk
              parameters.
            </AlertDescription>
          </Alert>
        )}

        {!isRunning && (
          <Alert className='bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'>
            <AlertDescription className='text-gray-700 dark:text-gray-300'>
              Autonomous trading is stopped. Click &quot;Start Autonomous
              Trading&quot; to begin automated market analysis and trading
              operations.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
