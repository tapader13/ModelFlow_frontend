/**
 * MINIMAL AUTONOMOUS TRADING DASHBOARD
 * Simplified version to fix webpack errors
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  Play,
  Square,
  DollarSign
} from 'lucide-react';

interface AutonomousState {
  isRunning: boolean;
  statistics: {
    activePositions: number;
    dailyPnL: number;
    tradesExecutedToday: number;
  };
}

export default function AutonomousTradingDashboard() {
  const [state, setState] = useState<AutonomousState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch status
  const fetchStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/autonomous/status');
      const data = await response.json();

      if (data.success) {
        setState(data.data);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start trading
  const startTrading = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/autonomous/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchStatus();
      } else {
        setError(data.error || 'Failed to start trading');
      }
    } catch (err) {
      setError('Failed to start autonomous trading');
    } finally {
      setLoading(false);
    }
  };

  // Stop trading
  const stopTrading = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/autonomous/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Manual stop' })
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchStatus();
      } else {
        setError(data.error || 'Failed to stop trading');
      }
    } catch (err) {
      setError('Failed to stop autonomous trading');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading && !state) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading autonomous trading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autonomous Trading</h1>
          <p className="text-muted-foreground">
            AI-powered autonomous forex trading system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge variant={state?.isRunning ? "default" : "secondary"}>
            {state?.isRunning ? "RUNNING" : "STOPPED"}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Status Cards */}
      {state && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {state.isRunning ? "RUNNING" : "STOPPED"}
              </div>
              <p className="text-xs text-muted-foreground">
                System status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {state.statistics.activePositions}
              </div>
              <p className="text-xs text-muted-foreground">
                Open trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${state.statistics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${state.statistics.dailyPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Today's profit/loss
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      {state && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {state.isRunning ? (
                <Square className="h-5 w-5 text-red-500" />
              ) : (
                <Play className="h-5 w-5 text-green-500" />
              )}
              Trading Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {!state.isRunning ? (
                <Button
                  onClick={startTrading}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? 'Starting...' : 'Start Trading'}
                </Button>
              ) : (
                <Button
                  onClick={stopTrading}
                  disabled={loading}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  {loading ? 'Stopping...' : 'Stop Trading'}
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {state.isRunning ? (
                <p>⚡ Autonomous trading is active. The system is monitoring markets and executing trades.</p>
              ) : (
                <p>⏸️ Autonomous trading is stopped. Click "Start Trading" to begin automated trading.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Notice */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              🚀 <strong>Positions Display:</strong> Real-time view of all open positions with P&L tracking
            </p>
            <p className="text-sm text-gray-600">
              📊 <strong>Trade History:</strong> Complete execution history and performance analytics
            </p>
            <p className="text-sm text-gray-600">
              🧠 <strong>Decision Analysis:</strong> Transparent AI decision-making with full reasoning
            </p>
            <p className="text-sm text-gray-600">
              ⚙️ <strong>Configuration:</strong> Advanced risk management and trading parameters
            </p>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh to Load Full Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
