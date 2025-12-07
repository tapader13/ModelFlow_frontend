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
import Link from 'next/link';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Brain,
  Newspaper,
  BarChart3,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Eye,
  Cpu,
  Database,
  Network,
  BarChart,
  PieChart,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardData {
  account?: {
    balance: number;
    nav: number;
    unrealizedPL: number;
    currency: string;
    status: string;
  };
  portfolio?: {
    portfolioScore: number;
    riskLevel: string;
    expectedImprovement: number;
  };
  market?: {
    currentRegime: string;
    confidence: number;
    overallSignal: string;
  };
  risk?: {
    level: string;
    score: number;
    var95: number;
  };
  news?: {
    sentiment: string;
    score: number;
    highImpactEvents: number;
  };
  system?: {
    status: string;
    health: number;
    uptime: string;
  };
}

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Only fetch essential account data for fast loading
      const accountRes = await fetch('/api/oanda/account');

      const data: DashboardData = {};

      // Process account data
      if (accountRes.ok) {
        const accountResult = await accountRes.json();
        if (accountResult.success) {
          data.account = accountResult.data.account;
        }
      }

      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'connected':
      case 'operational':
      case 'optimal':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'degraded':
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'error':
      case 'critical':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'high':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100'>
        {/* Dark-mode grid overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden pointer-events-none' />

        <div className='container mx-auto p-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                QNEX 369 Dashboard
              </h1>
              <p className='text-muted-foreground'>
                Advanced AI-powered trading intelligence platform
              </p>
            </div>
            <RefreshCw className='h-6 w-6 animate-spin text-gray-400' />
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className='animate-pulse bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'
              >
                <CardHeader className='pb-2'>
                  <div className='h-4 bg-gray-200 rounded-full w-3/4'></div>
                </CardHeader>
                <CardContent>
                  <div className='h-8 bg-gray-200 rounded-lg w-1/2 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded-full w-full'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100'>
      {/* Dark-mode grid overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden pointer-events-none' />

      <div className='container mx-auto p-6 space-y-6 relative z-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              QNEX 369 Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Advanced AI-powered trading intelligence platform
            </p>
          </div>
          <div className='flex flex-wrap items-center space-x-2'>
            <Badge
              className={`${getStatusColor(
                dashboardData.system?.status || 'unknown'
              )} border font-medium hover:text-white py-1 px-2 rounded-lg`}
            >
              {dashboardData.system?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              size='sm'
              variant='outline'
              className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all'
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant='destructive' className=''>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Overview */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700'>
                Account Balance
              </CardTitle>
              <div className='p-2 rounded-lg bg-blue-100/70'>
                <DollarSign className='h-4 w-4 text-blue-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {dashboardData.account
                  ? formatCurrency(
                      dashboardData.account.balance,
                      dashboardData.account.currency
                    )
                  : '--'}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                NAV:{' '}
                {dashboardData.account
                  ? formatCurrency(
                      dashboardData.account.nav,
                      dashboardData.account.currency
                    )
                  : '--'}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700'>
                Unrealized P&L
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  dashboardData.account &&
                  dashboardData.account.unrealizedPL >= 0
                    ? 'bg-emerald-100/70'
                    : 'bg-rose-100/70'
                }`}
              >
                {dashboardData.account &&
                dashboardData.account.unrealizedPL >= 0 ? (
                  <TrendingUp className='h-4 w-4 text-emerald-600' />
                ) : (
                  <TrendingDown className='h-4 w-4 text-rose-600' />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  dashboardData.account &&
                  dashboardData.account.unrealizedPL >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {dashboardData.account
                  ? formatCurrency(
                      dashboardData.account.unrealizedPL,
                      dashboardData.account.currency
                    )
                  : '--'}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Open positions performance
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700'>
                Portfolio Score
              </CardTitle>
              <div className='p-2 rounded-lg bg-purple-100/70'>
                <Target className='h-4 w-4 text-purple-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {dashboardData.portfolio
                  ? Math.round(dashboardData.portfolio.portfolioScore * 100)
                  : '--'}
                %
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Optimization level
              </p>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700'>
                System Health
              </CardTitle>
              <div className='p-2 rounded-lg bg-cyan-100/70'>
                <Activity className='h-4 w-4 text-cyan-600' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-cyan-600'>
                {dashboardData.system?.health || 0}%
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Uptime: {dashboardData.system?.uptime || 'Unknown'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Navigation Cards */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Account Management */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/account'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-blue-100/70'>
                    <DollarSign className='h-5 w-5 text-blue-600' />
                  </div>
                  Account Management
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  OANDA account overview and real-time status monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Status</span>
                    <Badge
                      className={`${getStatusColor(
                        dashboardData.account?.status || 'unknown'
                      )} border hover:text-white font-medium`}
                    >
                      {dashboardData.account?.status?.toUpperCase() ||
                        'UNKNOWN'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Balance</span>
                    <span className='font-medium text-gray-900'>
                      {dashboardData.account
                        ? formatCurrency(
                            dashboardData.account.balance,
                            dashboardData.account.currency
                          )
                        : '--'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Market Intelligence */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/market-intelligence'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-purple-100/70'>
                    <Brain className='h-5 w-5 text-purple-600' />
                  </div>
                  Market Intelligence
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  AI-powered market analysis and regime prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      Current Regime
                    </span>
                    <Badge
                      variant='outline'
                      className='bg-white/50 border-gray-200'
                    >
                      {dashboardData.market?.currentRegime?.toUpperCase() ||
                        'ANALYZING'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Confidence</span>
                    <span className='font-medium text-gray-900'>
                      {dashboardData.market?.confidence || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Portfolio Optimization */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/portfolio'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-emerald-100/70'>
                    <BarChart3 className='h-5 w-5 text-emerald-600' />
                  </div>
                  Portfolio Optimization
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Advanced portfolio analysis and rebalancing recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Risk Level</span>
                    <Badge
                      className={`${getRiskColor(
                        dashboardData.portfolio?.riskLevel || 'unknown'
                      )} border hover:text-white font-medium`}
                    >
                      {dashboardData.portfolio?.riskLevel?.toUpperCase() ||
                        'UNKNOWN'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      Expected Improvement
                    </span>
                    <span className='font-medium text-emerald-600'>
                      +
                      {dashboardData.portfolio
                        ? Math.round(
                            dashboardData.portfolio.expectedImprovement
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Risk Monitoring */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/risk-monitoring'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-rose-100/70'>
                    <Shield className='h-5 w-5 text-rose-600' />
                  </div>
                  Risk Monitoring
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Real-time risk analysis and portfolio protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Risk Level</span>
                    <Badge
                      className={`${getRiskColor(
                        dashboardData.risk?.level || 'unknown'
                      )} border hover:text-white font-medium`}
                    >
                      {dashboardData.risk?.level?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>VaR (95%)</span>
                    <span className='font-medium text-rose-600'>
                      {dashboardData.risk
                        ? formatCurrency(dashboardData.risk.var95)
                        : '--'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* News Intelligence */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/news-intelligence'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-amber-100/70'>
                    <Newspaper className='h-5 w-5 text-amber-600' />
                  </div>
                  News Intelligence
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Market news analysis and sentiment tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      Market Sentiment
                    </span>
                    <Badge
                      variant='outline'
                      className='bg-white/50 border-gray-200'
                    >
                      {dashboardData.news?.sentiment?.toUpperCase() ||
                        'NEUTRAL'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>
                      High Impact Events
                    </span>
                    <span className='font-medium text-gray-900'>
                      {dashboardData.news?.highImpactEvents || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* System Monitoring */}
          <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'>
            <Link href='/dashboard/system-monitoring'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-3 text-gray-900'>
                  <div className='p-2 rounded-lg bg-cyan-100/70'>
                    <Zap className='h-5 w-5 text-cyan-600' />
                  </div>
                  System Monitoring
                  <ChevronRight className='h-4 w-4 ml-auto text-gray-400' />
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  System health and performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>System Status</span>
                    <div className='flex items-center gap-1'>
                      {dashboardData.system?.status === 'optimal' ? (
                        <CheckCircle className='h-4 w-4 text-emerald-600' />
                      ) : (
                        <AlertTriangle className='h-4 w-4 text-amber-600' />
                      )}
                      <span className='text-sm text-gray-600 capitalize'>
                        {dashboardData.system?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-600'>Health</span>
                    <span className='font-medium text-gray-900'>
                      {dashboardData.system?.health || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className='bg-white/80 backdrop-blur-sm border-gray-200 shadow-md'>
          <CardHeader>
            <CardTitle className='text-gray-900'>System Overview</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Quick overview of all system components and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='text-center p-4 border rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm'>
                <div className='inline-flex items-center justify-center p-3 rounded-full bg-blue-100/70 mb-3'>
                  <Brain className='h-6 w-6 text-blue-600' />
                </div>
                <h3 className='font-medium text-gray-900'>AI Analysis</h3>
                <p className='text-sm text-muted-foreground'>
                  6 Engines Active
                </p>
              </div>
              <div className='text-center p-4 border rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm'>
                <div className='inline-flex items-center justify-center p-3 rounded-full bg-emerald-100/70 mb-3'>
                  <Shield className='h-6 w-6 text-emerald-600' />
                </div>
                <h3 className='font-medium text-gray-900'>Risk Management</h3>
                <p className='text-sm text-muted-foreground'>
                  Monitoring Active
                </p>
              </div>
              <div className='text-center p-4 border rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm'>
                <div className='inline-flex items-center justify-center p-3 rounded-full bg-purple-100/70 mb-3'>
                  <Activity className='h-6 w-6 text-purple-600' />
                </div>
                <h3 className='font-medium text-gray-900'>Real-time Data</h3>
                <p className='text-sm text-muted-foreground'>Live Streaming</p>
              </div>
              <div className='text-center p-4 border rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm'>
                <div className='inline-flex items-center justify-center p-3 rounded-full bg-amber-100/70 mb-3'>
                  <Newspaper className='h-6 w-6 text-amber-600' />
                </div>
                <h3 className='font-medium text-gray-900'>News Feed</h3>
                <p className='text-sm text-muted-foreground'>Auto-updating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
