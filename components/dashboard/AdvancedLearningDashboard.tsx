/**
 * Advanced Learning Dashboard - Phase 3.1 Implementation
 * QNEX 369 Trading System - Real-time Learning Monitoring
 *
 * This component provides comprehensive monitoring and control
 * of the autonomous learning system.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Eye,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface MonitorStatus {
  isRunning: boolean;
  config: any;
  metrics: {
    totalOptimizations: number;
    lastOptimizationTime: Date;
    adaptationsApplied: number;
    performanceImprovement: number;
    learningEfficiency: number;
    systemStability: number;
  };
  lastSnapshot: any;
  uptime: number;
}

interface LearningMetric {
  timestamp: string;
  winRate: number;
  profitFactor: number;
  drawdown: number;
  optimizations: number;
}

interface PerformanceAlert {
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: Date;
  action: string;
}

// ============================================================================
// Advanced Learning Dashboard Component
// ============================================================================

export default function AdvancedLearningDashboard() {
  const [monitorStatus, setMonitorStatus] = useState<MonitorStatus | null>(
    null
  );
  const [learningHistory, setLearningHistory] = useState<LearningMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  const fetchMonitorStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/learning/monitor?action=status");
      const result = await response.json();

      if (result.success) {
        setMonitorStatus(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch monitor status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningHistory = async () => {
    try {
      // Generate mock data - in real implementation, fetch from API
      const mockHistory: LearningMetric[] = Array.from(
        { length: 24 },
        (_, i) => ({
          timestamp: new Date(
            Date.now() - (23 - i) * 60 * 60 * 1000
          ).toISOString(),
          winRate: 65 + Math.random() * 20,
          profitFactor: 1.2 + Math.random() * 0.8,
          drawdown: Math.random() * 15,
          optimizations: Math.floor(Math.random() * 5),
        })
      );

      setLearningHistory(mockHistory);
    } catch (error) {
      console.error("Failed to fetch learning history:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      // Generate mock alerts - in real implementation, fetch from API
      const mockAlerts: PerformanceAlert[] = [
        {
          type: "info",
          message: "Learning optimization completed successfully",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          action: "none",
        },
        {
          type: "warning",
          message: "Win rate decreased by 3.2% - optimization triggered",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          action: "optimization",
        },
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  // ============================================================================
  // Monitor Control Functions
  // ============================================================================

  const startMonitoring = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/learning/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchMonitorStatus();
      }
    } catch (error) {
      console.error("Failed to start monitoring:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopMonitoring = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/learning/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchMonitorStatus();
      }
    } catch (error) {
      console.error("Failed to stop monitoring:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceOptimization = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/learning/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimize",
          reason: "Manual trigger from dashboard",
        }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchMonitorStatus();
      }
    } catch (error) {
      console.error("Failed to trigger optimization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    fetchMonitorStatus();
    fetchLearningHistory();
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchMonitorStatus();
        fetchLearningHistory();
        fetchAlerts();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (isRunning: boolean) => (isRunning ? "green" : "red");

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
      default:
        return "default";
    }
  };

  // ============================================================================
  // Render Functions
  // ============================================================================

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monitor Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge
              variant={monitorStatus?.isRunning ? "default" : "destructive"}
            >
              {monitorStatus?.isRunning ? "Running" : "Stopped"}
            </Badge>
            {monitorStatus?.isRunning && (
              <span className="text-xs text-muted-foreground">
                {formatUptime(monitorStatus.uptime)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Optimizations
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitorStatus?.metrics.totalOptimizations || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Last:{" "}
            {monitorStatus?.metrics.lastOptimizationTime
              ? new Date(
                  monitorStatus.metrics.lastOptimizationTime
                ).toLocaleTimeString()
              : "Never"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Learning Efficiency
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitorStatus?.metrics.learningEfficiency?.toFixed(2) || "0.00"}%
          </div>
          <p className="text-xs text-muted-foreground">
            Performance improvement per optimization
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            System Stability
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitorStatus?.metrics.systemStability?.toFixed(1) || "0.0"}%
          </div>
          <p className="text-xs text-muted-foreground">
            Inverse of maximum drawdown
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderControls = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Learning Monitor Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={
              monitorStatus?.isRunning ? stopMonitoring : startMonitoring
            }
            disabled={isLoading}
            variant={monitorStatus?.isRunning ? "destructive" : "default"}
          >
            {monitorStatus?.isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>

          <Button
            onClick={forceOptimization}
            disabled={isLoading || !monitorStatus?.isRunning}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Force Optimization
          </Button>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <label htmlFor="auto-refresh" className="text-sm">
              Auto Refresh (30s)
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPerformanceCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="winRate"
                stroke="#8884d8"
                name="Win Rate %"
              />
              <Line
                type="monotone"
                dataKey="profitFactor"
                stroke="#82ca9d"
                name="Profit Factor"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={learningHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Bar
                dataKey="optimizations"
                fill="#8884d8"
                name="Optimizations"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts & Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <Alert key={index} variant={getAlertColor(alert.type) as any}>
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No recent alerts
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Advanced Learning Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring and control of the autonomous learning system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Phase 3.1
          </Badge>
          {isLoading && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {renderOverviewCards()}
      {renderControls()}

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Events</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {renderPerformanceCharts()}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {renderAlerts()}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitor Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configuration settings will be displayed here.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  {JSON.stringify(monitorStatus?.config, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
