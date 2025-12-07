/**
 * QNEX 369 - Account Summary Component
 * Real-time account balance, equity, and portfolio metrics
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export interface AccountData {
  balance: number;
  equity: number;
  marginUsed: number;
  marginAvailable: number;
  portfolioHeat: number;
  dailyPnL: number;
  dailyChange: number;
  weeklyPnL: number;
  monthlyPnL: number;
  totalTrades: number;
  winRate: number;
  lastUpdate: string;
  currency: string;
  trend: "up" | "down" | "neutral";
}

export interface AccountSummaryProps {
  data?: AccountData;
  isConnected: boolean;
  className?: string;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({
  data,
  isConnected,
  className,
}) => {
  // Mock data for demo when no real data available
  const mockData: AccountData = {
    balance: 25000.0,
    equity: 24750.5,
    marginUsed: 15.5,
    marginAvailable: 21000.0,
    portfolioHeat: 8.2,
    dailyPnL: 125.75,
    dailyChange: 0.51,
    weeklyPnL: 456.2,
    monthlyPnL: 1234.8,
    totalTrades: 47,
    winRate: 68.5,
    lastUpdate: new Date().toISOString(),
    currency: "USD",
    trend: "up",
  };

  const accountData = data || mockData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: accountData.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Account Overview
          </CardTitle>
          <div className="flex items-center space-x-2">
            {!isConnected && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="text-xs"
            >
              {isConnected ? "Live" : "Cached"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance & Equity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Account Balance</p>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">
                {formatCurrency(accountData.balance)}
              </span>
              {getTrendIcon(accountData.trend)}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">Equity</p>
            <div className="text-xl font-bold">
              {formatCurrency(accountData.equity)}
            </div>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily P&L</span>
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${getChangeColor(
                  accountData.dailyPnL
                )}`}
              >
                {accountData.dailyPnL >= 0 ? "+" : ""}
                {formatCurrency(accountData.dailyPnL)}
              </div>
              <div
                className={`text-sm ${getChangeColor(accountData.dailyChange)}`}
              >
                {formatPercentage(accountData.dailyChange)}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Weekly P&L</p>
            <p
              className={`font-semibold ${getChangeColor(
                accountData.weeklyPnL
              )}`}
            >
              {accountData.weeklyPnL >= 0 ? "+" : ""}
              {formatCurrency(accountData.weeklyPnL)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Monthly P&L</p>
            <p
              className={`font-semibold ${getChangeColor(
                accountData.monthlyPnL
              )}`}
            >
              {accountData.monthlyPnL >= 0 ? "+" : ""}
              {formatCurrency(accountData.monthlyPnL)}
            </p>
          </div>
        </div>

        {/* Margin & Risk */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Margin Used</span>
            <span className="font-semibold">
              {accountData.marginUsed.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                accountData.marginUsed > 80
                  ? "bg-red-500"
                  : accountData.marginUsed > 50
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(accountData.marginUsed, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Portfolio Heat</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                {accountData.portfolioHeat.toFixed(1)}%
              </span>
              {accountData.portfolioHeat > 12 && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Trades</p>
              <p className="font-semibold">{accountData.totalTrades}</p>
            </div>
            <div>
              <p className="text-gray-600">Win Rate</p>
              <p className="font-semibold text-green-600">
                {accountData.winRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center pt-2">
          Last updated: {new Date(accountData.lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
