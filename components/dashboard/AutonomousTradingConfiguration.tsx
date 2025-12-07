'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { AutonomousState } from './AutonomousTradingDashboard';

interface AutonomousTradingConfigurationProps {
  state: AutonomousState;
  onConfigUpdate: (config: any) => void;
}

export default function AutonomousTradingConfiguration({
  state,
  onConfigUpdate,
}: AutonomousTradingConfigurationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Local configuration state
  const [config, setConfig] = useState({
    // Risk Management
    maxDailyLoss: state.config.maxDailyLoss || 100,
    maxPositionSize: state.config.maxPositionSize || 0.02,
    stopLossPercentage: state.config.stopLossPercentage || 2.0,
    takeProfitPercentage: state.config.takeProfitPercentage || 3.0,
    maxConcurrentTrades: state.config.maxConcurrentTrades || 3,

    // Trading Parameters
    minConfidenceLevel: state.config.minConfidenceLevel || 75,
    tradingPairs: state.config.tradingPairs || [
      'EUR_USD',
      'GBP_USD',
      'USD_JPY',
    ],
    analysisInterval: state.config.analysisInterval || 300,

    // AI Parameters
    useAdvancedAI: state.config.useAdvancedAI || true,
    sentimentWeight: state.config.sentimentWeight || 0.3,
    technicalWeight: state.config.technicalWeight || 0.5,
    fundamentalWeight: state.config.fundamentalWeight || 0.2,

    // Emergency Settings
    emergencyStopEnabled: state.config.emergencyStopEnabled !== false,
    maxDrawdownStop: state.config.maxDrawdownStop || 10,

    // Notifications
    enableNotifications: state.config.enableNotifications !== false,
    notifyOnTrades: state.config.notifyOnTrades !== false,
    notifyOnErrors: state.config.notifyOnErrors !== false,
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/autonomous/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      const result = await response.json();
      onConfigUpdate(result.config);
      setShowDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConfig = () => {
    setConfig({
      maxDailyLoss: 100,
      maxPositionSize: 0.02,
      stopLossPercentage: 2.0,
      takeProfitPercentage: 3.0,
      maxConcurrentTrades: 3,
      minConfidenceLevel: 75,
      tradingPairs: ['EUR_USD', 'GBP_USD', 'USD_JPY'],
      analysisInterval: 300,
      useAdvancedAI: true,
      sentimentWeight: 0.3,
      technicalWeight: 0.5,
      fundamentalWeight: 0.2,
      emergencyStopEnabled: true,
      maxDrawdownStop: 10,
      enableNotifications: true,
      notifyOnTrades: true,
      notifyOnErrors: true,
    });
  };

  const availablePairs = [
    'EUR_USD',
    'GBP_USD',
    'USD_JPY',
    'USD_CHF',
    'AUD_USD',
    'USD_CAD',
    'NZD_USD',
    'EUR_GBP',
    'EUR_JPY',
    'GBP_JPY',
    'CHF_JPY',
    'AUD_JPY',
  ];

  return (
    <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between text-gray-900 dark:text-white'>
          <div className='flex items-center space-x-2'>
            <Settings className='h-5 w-5' />
            <span>Configuration</span>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
              >
                Edit Config
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
              <DialogHeader>
                <DialogTitle className='text-gray-900 dark:text-white'>
                  Trading Configuration
                </DialogTitle>
                <DialogDescription className='text-gray-600 dark:text-gray-400'>
                  Adjust autonomous trading parameters and risk management
                  settings
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
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

                {/* Risk Management */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Risk Management
                  </h4>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='maxDailyLoss'
                        className='text-gray-700 dark:text-gray-300'
                      >
                        Max Daily Loss ($)
                      </Label>
                      <Input
                        id='maxDailyLoss'
                        type='number'
                        value={config.maxDailyLoss}
                        onChange={(e) =>
                          handleConfigChange(
                            'maxDailyLoss',
                            Number(e.target.value)
                          )
                        }
                        className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='maxPositionSize'
                        className='text-gray-700 dark:text-gray-300'
                      >
                        Max Position Size
                      </Label>
                      <Input
                        id='maxPositionSize'
                        type='number'
                        step='0.01'
                        value={config.maxPositionSize}
                        onChange={(e) =>
                          handleConfigChange(
                            'maxPositionSize',
                            Number(e.target.value)
                          )
                        }
                        className='bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Stop Loss (%): {config.stopLossPercentage}
                      </Label>
                      <Slider
                        value={[config.stopLossPercentage]}
                        onValueChange={(value) =>
                          handleConfigChange('stopLossPercentage', value[0])
                        }
                        max={10}
                        min={0.5}
                        step={0.1}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Take Profit (%): {config.takeProfitPercentage}
                      </Label>
                      <Slider
                        value={[config.takeProfitPercentage]}
                        onValueChange={(value) =>
                          handleConfigChange('takeProfitPercentage', value[0])
                        }
                        max={15}
                        min={1}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Max Concurrent Trades: {config.maxConcurrentTrades}
                    </Label>
                    <Slider
                      value={[config.maxConcurrentTrades]}
                      onValueChange={(value) =>
                        handleConfigChange('maxConcurrentTrades', value[0])
                      }
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                {/* Trading Parameters */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Trading Parameters
                  </h4>

                  <div className='space-y-2'>
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Min Confidence Level (%): {config.minConfidenceLevel}
                    </Label>
                    <Slider
                      value={[config.minConfidenceLevel]}
                      onValueChange={(value) =>
                        handleConfigChange('minConfidenceLevel', value[0])
                      }
                      max={95}
                      min={50}
                      step={5}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Analysis Interval (seconds): {config.analysisInterval}
                    </Label>
                    <Slider
                      value={[config.analysisInterval]}
                      onValueChange={(value) =>
                        handleConfigChange('analysisInterval', value[0])
                      }
                      max={3600}
                      min={60}
                      step={60}
                    />
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                {/* AI Parameters */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    AI Analysis Weights
                  </h4>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      checked={config.useAdvancedAI}
                      onCheckedChange={(checked) =>
                        handleConfigChange('useAdvancedAI', checked)
                      }
                    />
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Use Advanced AI Analysis
                    </Label>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Technical: {config.technicalWeight.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.technicalWeight]}
                        onValueChange={(value) =>
                          handleConfigChange('technicalWeight', value[0])
                        }
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Sentiment: {config.sentimentWeight.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.sentimentWeight]}
                        onValueChange={(value) =>
                          handleConfigChange('sentimentWeight', value[0])
                        }
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Fundamental: {config.fundamentalWeight.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.fundamentalWeight]}
                        onValueChange={(value) =>
                          handleConfigChange('fundamentalWeight', value[0])
                        }
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                {/* Emergency Settings */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Emergency Settings
                  </h4>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      checked={config.emergencyStopEnabled}
                      onCheckedChange={(checked) =>
                        handleConfigChange('emergencyStopEnabled', checked)
                      }
                    />
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Emergency Stop Enabled
                    </Label>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-gray-700 dark:text-gray-300'>
                      Max Drawdown Stop (%): {config.maxDrawdownStop}
                    </Label>
                    <Slider
                      value={[config.maxDrawdownStop]}
                      onValueChange={(value) =>
                        handleConfigChange('maxDrawdownStop', value[0])
                      }
                      max={25}
                      min={5}
                      step={1}
                    />
                  </div>
                </div>

                <Separator className='dark:bg-gray-700' />

                {/* Notifications */}
                <div className='space-y-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Notifications
                  </h4>

                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={config.enableNotifications}
                        onCheckedChange={(checked) =>
                          handleConfigChange('enableNotifications', checked)
                        }
                      />
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Enable Notifications
                      </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={config.notifyOnTrades}
                        onCheckedChange={(checked) =>
                          handleConfigChange('notifyOnTrades', checked)
                        }
                      />
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Notify on Trades
                      </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={config.notifyOnErrors}
                        onCheckedChange={(checked) =>
                          handleConfigChange('notifyOnErrors', checked)
                        }
                      />
                      <Label className='text-gray-700 dark:text-gray-300'>
                        Notify on Errors
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={handleResetConfig}
                  className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                >
                  <RotateCcw className='h-4 w-4 mr-2' />
                  Reset
                </Button>
                <Button
                  onClick={handleSaveConfig}
                  disabled={isLoading}
                  className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                >
                  <Save className='h-4 w-4 mr-2' />
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Current trading configuration and parameters
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Current Configuration Display */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-900 dark:text-white'>
              Risk Management
            </h4>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Max Daily Loss:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  ${state.config.maxDailyLoss}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Position Size:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {state.config.maxPositionSize}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Stop Loss:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {state.config.stopLossPercentage}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Take Profit:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {state.config.takeProfitPercentage}%
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='font-semibold text-gray-900 dark:text-white'>
              Trading Parameters
            </h4>
            <div className='space-y-1'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Min Confidence:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {state.config.minConfidenceLevel}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Max Trades:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {state.config.maxConcurrentTrades}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Analysis Interval:
                </span>
                <span className='text-gray-900 dark:text-white'>
                  {Math.floor(state.config.analysisInterval / 60)}m
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground dark:text-gray-400'>
                  Advanced AI:
                </span>
                <Badge
                  variant={state.config.useAdvancedAI ? 'default' : 'secondary'}
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

        {/* Trading Pairs */}
        <div className='space-y-2'>
          <h4 className='font-semibold text-gray-900 dark:text-white'>
            Active Trading Pairs
          </h4>
          <div className='flex flex-wrap gap-1'>
            {state.config.tradingPairs?.map((pair) => (
              <Badge
                key={pair}
                variant='outline'
                className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
              >
                {pair}
              </Badge>
            ))}
          </div>
        </div>

        {/* Emergency Settings */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground dark:text-gray-400'>
            Emergency Stop:
          </span>
          <Badge
            variant={
              state.config.emergencyStopEnabled ? 'default' : 'secondary'
            }
            className={
              state.config.emergencyStopEnabled
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }
          >
            {state.config.emergencyStopEnabled ? 'ENABLED' : 'DISABLED'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
