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

// Custom Progress Component with gradient support
const CustomProgress = ({
  value,
  max = 100,
  className = '',
  color = 'blue',
}: {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
  };

  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}
    >
      <div
        className={`h-2.5 rounded-full ${colorClasses[color]} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

import {
  Activity,
  Server,
  Database,
  Wifi,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  BarChart3,
  Zap,
  Eye,
  Monitor,
  Network,
  Gauge,
  TrendingUp,
  Cloud,
  Shield,
  Brain,
  Newspaper,
} from 'lucide-react';

interface SystemHealth {
  overall: {
    status: string;
    health: number;
    uptime: string;
    lastCheck: string;
  };
  components: {
    marketData: {
      status: string;
      lastUpdate: string;
      latency: number;
      feedsActive: number;
      feedsTotal: number;
      symbols: string[];
    };
    tradingEngine: {
      status: string;
      lastHeartbeat: string;
      activeStrategies: number;
      executionLatency: number;
      ordersProcessed: number;
      successRate: number;
    };
    aiAnalysis: {
      status: string;
      lastAnalysis: string;
      enginesOnline: number;
      claudeStatus: string;
      analysisQueue: number;
      avgResponseTime: number;
    };
    riskManagement: {
      status: string;
      lastCheck: string;
      portfolioHeat: string;
      marginLevel: string;
      activeAlerts: number;
      riskScore: string;
    };
    database: {
      status: string;
      lastPing: string;
      responseTime: number;
      connections: number;
      collections: number;
      documentsCount: number;
    };
    newsFeed: {
      status: string;
      lastFetch: string;
      articlesCount: number;
      highImpactEvents: number;
      sentimentScore: string;
    };
  };
  performance: {
    uptime: string;
    avgLatency: number;
    requestsPerMinute: number;
    errorRate: string;
    memoryUsage: number;
    cpuUsage: number;
  };
  realtime: {
    isStreaming: boolean;
    connectionCount: number;
    dataRate: string;
    latency: number;
  };
  alerts: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function SystemMonitoring() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);

      const [healthResponse, statusResponse] = await Promise.all([
        fetch('/api/system/health'),
        fetch('/api/realtime/status'),
      ]);

      if (healthResponse.ok) {
        const healthResult = await healthResponse.json();
        if (healthResult.success) {
          setSystemHealth(healthResult.data);
        }
      } else if (statusResponse.ok) {
        // Fallback to status if health is not available
        const statusResult = await statusResponse.json();
        if (statusResult.success) {
          setSystemHealth(statusResult.data);
        }
      }

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch system health'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'active':
      case 'connected':
      case 'optimal':
        return 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400';
      case 'degraded':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400';
      case 'error':
      case 'critical':
      case 'inactive':
        return 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'active':
      case 'connected':
      case 'optimal':
        return (
          <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
        );
      case 'degraded':
      case 'warning':
        return (
          <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
        );
      case 'error':
      case 'critical':
      case 'inactive':
        return (
          <AlertTriangle className='h-4 w-4 text-red-600 dark:text-red-400' />
        );
      default:
        return <Eye className='h-4 w-4 text-gray-600 dark:text-gray-400' />;
    }
  };

  if (loading) {
    return (
      <div className='relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
        {/* Dark-mode grid overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

        <div className='space-y-6 relative z-10'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                System Monitoring
              </h1>
              <p className='text-sm text-muted-foreground dark:text-gray-400 mt-1'>
                Real-time system health and performance metrics
              </p>
            </div>
            <RefreshCw className='h-6 w-6 animate-spin text-gray-700 dark:text-gray-300' />
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className='animate-pulse bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'
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
      </div>
    );
  }

  return (
    <div className='relative  bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
      {/* Dark-mode grid overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

      <div className='space-y-6 relative z-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              System Monitoring
            </h1>
            <p className='text-sm text-muted-foreground dark:text-gray-400 mt-1'>
              Real-time system health and performance metrics
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              className={`${getStatusColor(
                systemHealth?.overall?.status || 'unknown'
              )} px-3 py-1 font-medium`}
            >
              {systemHealth?.overall?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <Button
              onClick={fetchSystemHealth}
              disabled={loading}
              size='sm'
              variant='outline'
              className='border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50 backdrop-blur-sm'
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Card className='border-red-200 bg-red-50/80 dark:border-red-800/50 dark:bg-red-900/20 backdrop-blur-sm'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                <AlertTriangle className='h-5 w-5' />
                <span>Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Overview Cards */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                System Health
              </CardTitle>
              <Monitor className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2 mb-2'>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {systemHealth?.overall?.health || 0}%
                </div>
              </div>
              <CustomProgress
                value={systemHealth?.overall?.health || 0}
                color={
                  systemHealth?.overall?.health || 100 > 80
                    ? 'green'
                    : systemHealth?.overall?.health || 60 > 50
                    ? 'blue'
                    : 'yellow'
                }
                className='mb-2'
              />
              <p className='text-xs text-muted-foreground dark:text-gray-400 flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                Uptime: {systemHealth?.overall?.uptime || 'Unknown'}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Performance
              </CardTitle>
              <Gauge className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {systemHealth?.performance?.avgLatency || 0}ms
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                Error Rate: {systemHealth?.performance?.errorRate || '0.000'}%
              </p>
              <div className='mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400'>
                <TrendingUp className='h-3 w-3' />
                {systemHealth?.performance?.requestsPerMinute || 0} req/min
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Data Streaming
              </CardTitle>
              <Network className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2 mb-2'>
                {systemHealth?.realtime?.isStreaming ? (
                  <div className='flex items-center gap-2'>
                    <div className='relative'>
                      <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                      <div className='absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping'></div>
                    </div>
                    <span className='font-medium text-green-600 dark:text-green-400'>
                      Active
                    </span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <span className='font-medium text-red-600 dark:text-red-400'>
                      Inactive
                    </span>
                  </div>
                )}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                Rate: {systemHealth?.realtime?.dataRate || '0 KB/s'}
              </p>
              <div className='mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400'>
                <Wifi className='h-3 w-3' />
                {systemHealth?.realtime?.connectionCount || 0} connections
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Resource Usage
              </CardTitle>
              <Cpu className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-700 dark:text-gray-300'>CPU</span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {systemHealth?.performance?.cpuUsage || 0}%
                  </span>
                </div>
                <CustomProgress
                  value={systemHealth?.performance?.cpuUsage || 0}
                  color={
                    systemHealth?.performance?.cpuUsage || 0 < 70
                      ? 'blue'
                      : systemHealth?.performance?.cpuUsage || 0 < 90
                      ? 'yellow'
                      : 'red'
                  }
                />
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Memory
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {systemHealth?.performance?.memoryUsage || 0}%
                  </span>
                </div>
                <CustomProgress
                  value={systemHealth?.performance?.memoryUsage || 0}
                  color={
                    systemHealth?.performance?.memoryUsage || 0 < 70
                      ? 'blue'
                      : systemHealth?.performance?.memoryUsage || 0 < 90
                      ? 'yellow'
                      : 'red'
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Status */}
        {systemHealth?.components && (
          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Server className='h-5 w-5' />
                System Components Status
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Real-time status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Market Data */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <BarChart3 className='h-4 w-4' />
                      Market Data
                    </h4>
                    {getStatusIcon(systemHealth.components.marketData?.status)}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.marketData?.status
                    )}`}
                  >
                    {systemHealth.components.marketData?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Feeds:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.marketData?.feedsActive || 0}/
                        {systemHealth.components.marketData?.feedsTotal || 0}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Latency:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.marketData?.latency || 0}ms
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Last Update:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.marketData?.lastUpdate
                          ? new Date(
                              systemHealth.components.marketData.lastUpdate
                            ).toLocaleTimeString()
                          : 'Unknown'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Trading Engine */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <Zap className='h-4 w-4' />
                      Trading Engine
                    </h4>
                    {getStatusIcon(
                      systemHealth.components.tradingEngine?.status
                    )}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.tradingEngine?.status
                    )}`}
                  >
                    {systemHealth.components.tradingEngine?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Strategies:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.tradingEngine
                          ?.activeStrategies || 0}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Success Rate:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {(
                          (systemHealth.components.tradingEngine?.successRate ||
                            0) * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Orders:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.tradingEngine
                          ?.ordersProcessed || 0}
                      </span>
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <Brain className='h-4 w-4' />
                      AI Analysis
                    </h4>
                    {getStatusIcon(systemHealth.components.aiAnalysis?.status)}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.aiAnalysis?.status
                    )}`}
                  >
                    {systemHealth.components.aiAnalysis?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Engines:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.aiAnalysis?.enginesOnline || 0}
                        /6
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Claude:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.aiAnalysis?.claudeStatus ||
                          'Unknown'}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Queue:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.aiAnalysis?.analysisQueue || 0}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Risk Management */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <Shield className='h-4 w-4' />
                      Risk Management
                    </h4>
                    {getStatusIcon(
                      systemHealth.components.riskManagement?.status
                    )}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.riskManagement?.status
                    )}`}
                  >
                    {systemHealth.components.riskManagement?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Heat:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.riskManagement
                          ?.portfolioHeat || 'Unknown'}
                        %
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Margin:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.riskManagement?.marginLevel ||
                          'Unknown'}
                        %
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Alerts:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.riskManagement?.activeAlerts ||
                          0}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Database */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <Database className='h-4 w-4' />
                      Database
                    </h4>
                    {getStatusIcon(systemHealth.components.database?.status)}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.database?.status
                    )}`}
                  >
                    {systemHealth.components.database?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Connections:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.database?.connections || 0}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Response:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.database?.responseTime || 0}ms
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Documents:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {(
                          systemHealth.components.database?.documentsCount || 0
                        ).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* News Feed */}
                <div className='border rounded-xl p-4 space-y-3 border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm hover:shadow-sm transition-all'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                      <Newspaper className='h-4 w-4' />
                      News Feed
                    </h4>
                    {getStatusIcon(systemHealth.components.newsFeed?.status)}
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      systemHealth.components.newsFeed?.status
                    )}`}
                  >
                    {systemHealth.components.newsFeed?.status?.toUpperCase() ||
                      'UNKNOWN'}
                  </Badge>
                  <div className='space-y-1 text-sm text-muted-foreground dark:text-gray-400'>
                    <p className='flex justify-between'>
                      <span>Articles:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.newsFeed?.articlesCount || 0}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>High Impact:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.newsFeed?.highImpactEvents ||
                          0}
                      </span>
                    </p>
                    <p className='flex justify-between'>
                      <span>Sentiment:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {systemHealth.components.newsFeed?.sentimentScore ||
                          'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Activity className='h-5 w-5' />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Requests/Minute
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {systemHealth?.performance?.requestsPerMinute || 0}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Average Latency
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {systemHealth?.performance?.avgLatency || 0}ms
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Error Rate
                </span>
                <span className='font-medium text-green-600 dark:text-green-400'>
                  {systemHealth?.performance?.errorRate || '0.000'}%
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Uptime
                </span>
                <span className='font-medium text-green-600 dark:text-green-400'>
                  {systemHealth?.performance?.uptime || 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Cloud className='h-5 w-5' />
                Real-time Data
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Streaming Status
                </span>
                <div className='flex items-center gap-2'>
                  {systemHealth?.realtime?.isStreaming ? (
                    <div className='relative'>
                      <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                      <div className='absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping'></div>
                    </div>
                  ) : (
                    <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                  )}
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {systemHealth?.realtime?.isStreaming ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Connections
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {systemHealth?.realtime?.connectionCount || 0}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Data Rate
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {systemHealth?.realtime?.dataRate || '0 KB/s'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Latency
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {systemHealth?.realtime?.latency || 0}ms
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        {systemHealth?.alerts && systemHealth.alerts.length > 0 && (
          <Card className='bg-white/70 dark:bg-[#0f172a]/50 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <AlertTriangle className='h-5 w-5' />
                System Alerts
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Recent system notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {systemHealth.alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      alert.type === 'error'
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30'
                        : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
                    }`}
                  >
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        alert.type === 'error'
                          ? 'text-red-600 dark:text-red-400'
                          : alert.type === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {alert.message}
                      </p>
                      <p className='text-xs text-muted-foreground dark:text-gray-400'>
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant='outline'
                      className='capitalize bg-white/80 dark:bg-gray-800/80'
                    >
                      {alert.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
