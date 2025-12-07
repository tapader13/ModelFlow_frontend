"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Shield,
} from "lucide-react";

interface AccountData {
  account: {
    id: string;
    currency: string;
    balance: number;
    nav: number;
    unrealizedPL: number;
    marginUsed: number;
    marginAvailable: number;
    positionValue: number;
    marginCloseoutPercent: number;
    openTradeCount: number;
    openPositionCount: number;
    lastTransactionID: string;
  };
  environment: string;
  status: string;
  timestamp: string;
}

interface RealtimeStatus {
  overall: {
    status: string;
    health: number;
    uptime: string;
    lastCheck: string;
  };
  components: any;
  performance: any;
  realtime: {
    isStreaming: boolean;
    connectionCount: number;
    dataRate: string;
    latency: number;
  };
}

export default function AccountManagement() {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const [accountResponse, statusResponse] = await Promise.all([
        fetch("/api/oanda/account"),
        fetch("/api/realtime/status"),
      ]);

      if (accountResponse.ok) {
        const accountResult = await accountResponse.json();
        if (accountResult.success) {
          setAccountData(accountResult.data);
        }
      }

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        if (statusResult.success) {
          setRealtimeStatus(statusResult.data);
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAccountData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
      case "operational":
      case "optimal":
        return "bg-green-500";
      case "degraded":
      case "warning":
        return "bg-yellow-500";
      case "error":
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Management</h1>
          <RefreshCw className="h-6 w-6 animate-spin text-gray-900 dark:text-white" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Management</h1>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              accountData?.status === "connected" ? "default" : "destructive"
            }
            className={accountData?.status === "connected" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {accountData?.environment || "DEMO"} Environment
          </Badge>
          <Button
            onClick={fetchAccountData}
            disabled={loading}
            size="sm"
            variant="outline"
            className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {accountData
                ? formatCurrency(
                    accountData.account.balance,
                    accountData.account.currency
                  )
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Account ID: {accountData?.account.id || "--"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Net Asset Value
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {accountData
                ? formatCurrency(
                    accountData.account.nav,
                    accountData.account.currency
                  )
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Current portfolio value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unrealized P&L
            </CardTitle>
            {accountData && accountData.account.unrealizedPL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                accountData && accountData.account.unrealizedPL >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {accountData
                ? formatCurrency(
                    accountData.account.unrealizedPL,
                    accountData.account.currency
                  )
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Open positions P&L</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Margin Usage
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {accountData
                ? `${accountData.account.marginCloseoutPercent.toFixed(1)}%`
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Used:{" "}
              {accountData
                ? formatCurrency(
                    accountData.account.marginUsed,
                    accountData.account.currency
                  )
                : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Position Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Position Summary</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Current trading positions overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Open Trades</span>
              <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
                {accountData?.account.openTradeCount || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Open Positions</span>
              <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
                {accountData?.account.openPositionCount || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Position Value</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {accountData
                  ? formatCurrency(
                      accountData.account.positionValue,
                      accountData.account.currency
                    )
                  : "--"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Margin</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {accountData
                  ? formatCurrency(
                      accountData.account.marginAvailable,
                      accountData.account.currency
                    )
                  : "--"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">System Status</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Real-time system health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Status</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    realtimeStatus?.overall.status || "unknown"
                  )}`}
                ></div>
                <span className="capitalize text-gray-900 dark:text-white">
                  {realtimeStatus?.overall.status || "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Health</span>
              <Badge variant="outline" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
                {realtimeStatus?.overall.health || 0}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Streaming</span>
              <div className="flex items-center gap-2">
                {realtimeStatus?.realtime.isStreaming ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-gray-900 dark:text-white">
                  {realtimeStatus?.realtime.isStreaming ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Connection Count</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {realtimeStatus?.realtime.connectionCount || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {realtimeStatus?.realtime.dataRate || "0 KB/s"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latency</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {realtimeStatus?.realtime.latency || 0}ms
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      {accountData && (
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Account Details</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Complete account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Account ID
                </label>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{accountData.account.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Base Currency
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{accountData.account.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Environment
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{accountData.environment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Last Transaction
                </label>
                <p className="text-sm font-mono text-gray-900 dark:text-white">
                  {accountData.account.lastTransactionID}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      accountData.status
                    )}`}
                  ></div>
                  <p className="text-sm capitalize text-gray-900 dark:text-white">{accountData.status}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(accountData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}