/**
 * OMNI System Status Dashboard Component
 * Displays real-time system status and Phase 1 functionality
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Database,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3,
} from "lucide-react";

interface SystemStatus {
  environment: string;
  trading: boolean;
  oandaEnvironment: string;
  riskMode: string;
  symbols: number;
  configValid: boolean;
}

interface ConfigData {
  system: SystemStatus;
  validation: {
    valid: boolean;
    errors: string[];
  };
  database: {
    connected: boolean;
  };
}

interface OandaData {
  connection: string;
  environment: string;
  account: {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    currency: string;
    openPositions: number;
    unrealizedPL: number;
  };
  availableInstruments: number;
}

interface RiskData {
  account: {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    openPositions: number;
  };
  risk: {
    parameters: any;
    portfolioHeat: {
      current: number;
      percentage: string;
      maxAllowed: string;
      status: string;
    };
    margin: {
      current: number;
      level: number;
      safe: boolean;
      status: string;
    };
    emergencyMode: boolean;
  };
}

export default function SystemStatusDashboard() {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [oandaData, setOandaData] = useState<OandaData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initStatus, setInitStatus] = useState<any>(null);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch configuration status
      const configResponse = await fetch("/api/config");
      const configResult = await configResponse.json();

      if (configResult.success) {
        setConfigData(configResult.data);
      }

      // Fetch OANDA status
      try {
        const oandaResponse = await fetch("/api/oanda/test");
        const oandaResult = await oandaResponse.json();

        if (oandaResult.success) {
          setOandaData(oandaResult.data);
        }
      } catch (oandaError) {
        console.error("OANDA test failed:", oandaError);
      }

      // Fetch risk status
      try {
        const riskResponse = await fetch("/api/risk");
        const riskResult = await riskResponse.json();

        if (riskResult.success) {
          setRiskData(riskResult.data);
        }
      } catch (riskError) {
        console.error("Risk status failed:", riskError);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch system status"
      );
    } finally {
      setLoading(false);
    }
  };

  const initializeSystem = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/system/init", { method: "POST" });
      const result = await response.json();
      setInitStatus(result);

      // Refresh status after initialization
      await fetchSystemStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "System initialization failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? label : "Error"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
              QNEX 369
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base leading-relaxed">
              Professional Trading System - Core Infrastructure Status
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:flex-shrink-0">
            <Button
              onClick={initializeSystem}
              variant="outline"
              className="w-full sm:w-auto text-sm"
            >
              <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Initialize System</span>
            </Button>
            <Button
              onClick={fetchSystemStatus}
              variant="outline"
              className="w-full sm:w-auto text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Initialization Status */}
      {initStatus && (
        <Alert variant={initStatus.success ? "default" : "destructive"}>
          <Activity className="h-4 w-4" />
          <AlertTitle>System Initialization</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {initStatus.data?.initializationSteps?.map(
                (step: string, index: number) => (
                  <div key={index} className="text-sm">
                    {step}
                  </div>
                )
              )}
              {initStatus.data?.errors?.map((error: string, index: number) => (
                <div key={index} className="text-sm text-red-600">
                  ❌ {error}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto min-w-fit">
            <TabsTrigger
              value="overview"
              className="text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="oanda"
              className="text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              OANDA
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Risk Management</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="text-xs sm:text-sm px-2 sm:px-4 py-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Configuration</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {getStatusIcon(configData?.system?.configValid || false)}
                  <span className="ml-2">
                    {configData?.system?.configValid ? "Online" : "Offline"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Environment: {configData?.system?.environment || "Unknown"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {getStatusIcon(configData?.database?.connected || false)}
                  <span className="ml-2">
                    {configData?.database?.connected
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">MongoDB</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trading</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {getStatusIcon(configData?.system?.trading || false)}
                  <span className="ml-2">
                    {configData?.system?.trading ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {configData?.system?.symbols || 0} symbols
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Mode</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {getStatusIcon(!riskData?.risk?.emergencyMode)}
                  <span className="ml-2">
                    {configData?.system?.riskMode || "Unknown"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {riskData?.risk?.emergencyMode
                    ? "Emergency Active"
                    : "Normal"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OANDA Tab */}
        <TabsContent value="oanda" className="space-y-4">
          {oandaData ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-sm">
                    OANDA {oandaData.environment} account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Balance:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {oandaData.account.balance.toFixed(2)}{" "}
                        {oandaData.account.currency}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Equity:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {oandaData.account.equity.toFixed(2)}{" "}
                        {oandaData.account.currency}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Free Margin:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {oandaData.account.freeMargin.toFixed(2)}{" "}
                        {oandaData.account.currency}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Margin Level:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {oandaData.account.marginLevel.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Open Positions:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {oandaData.account.openPositions}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Unrealized P&L:
                      </span>
                      <span
                        className={`font-semibold text-sm sm:text-base ${
                          oandaData.account.unrealizedPL >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {oandaData.account.unrealizedPL.toFixed(2)}{" "}
                        {oandaData.account.currency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Trading Instruments
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Available for trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold mb-2">
                      {oandaData.availableInstruments}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total instruments available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>OANDA Connection</AlertTitle>
              <AlertDescription>
                Unable to connect to OANDA. Please check your API credentials.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Risk Management Tab */}
        <TabsContent value="risk" className="space-y-4">
          {riskData ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Portfolio Risk
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Current risk exposure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Portfolio Heat:
                      </span>
                      <span
                        className={`font-semibold text-sm sm:text-base ${
                          riskData.risk.portfolioHeat.status === "safe"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {riskData.risk.portfolioHeat.percentage}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Max Allowed:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {riskData.risk.portfolioHeat.maxAllowed}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Emergency Mode:
                      </span>
                      <div className="flex justify-start sm:justify-end">
                        {getStatusBadge(!riskData.risk.emergencyMode, "Normal")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Risk Parameters
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Current configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Max Risk/Trade:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {(
                          riskData.risk.parameters.maxRiskPerTrade * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Max Positions:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {riskData.risk.parameters.maxPositions}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Min Confidence:
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {riskData.risk.parameters.minConfidenceThreshold}%
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-muted-foreground">
                        Conservative Mode:
                      </span>
                      <div className="flex justify-start sm:justify-end">
                        {getStatusBadge(
                          riskData.risk.parameters.conservativeMode,
                          "On"
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Risk Data</AlertTitle>
              <AlertDescription>
                Unable to load risk management data.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Configuration Validation
              </CardTitle>
              <CardDescription className="text-sm">
                System configuration status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configData?.validation?.valid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Configuration Valid</AlertTitle>
                  <AlertDescription>
                    All configuration parameters are correct.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Configuration Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1">
                      {configData?.validation?.errors?.map((error, index) => (
                        <li key={index} className="text-sm">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
