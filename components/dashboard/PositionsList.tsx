/**
 * QNEX 369 - Positions List Component
 * Real-time trading positions with P&L and management controls
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  X,
  Edit,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import type { PositionUpdate } from "@/types/trading";

export interface PositionsListProps {
  positions: PositionUpdate[];
  isConnected: boolean;
  className?: string;
}

// Extended position interface for display purposes
interface ExtendedPosition extends PositionUpdate {
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence?: number;
  source?: "AI_ENGINE" | "MANUAL";
}

export const PositionsList: React.FC<PositionsListProps> = ({
  positions,
  isConnected,
  className,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Extended position interface for display purposes
  interface ExtendedPosition extends PositionUpdate {
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    confidence?: number;
    source?: "AI_ENGINE" | "MANUAL";
  }

  // Mock positions for demo when no real data
  const mockPositions: ExtendedPosition[] = [
    {
      id: "pos_1",
      symbol: "EUR/USD",
      side: "buy",
      size: 10000,
      entryPrice: 1.085,
      currentPrice: 1.0872,
      unrealizedPL: 22.0,
      timestamp: new Date(),
      stopLoss: 1.082,
      takeProfit: 1.092,
      confidence: 75,
      source: "AI_ENGINE",
    },
    {
      id: "pos_2",
      symbol: "GBP/USD",
      side: "sell",
      size: 5000,
      entryPrice: 1.265,
      currentPrice: 1.2635,
      unrealizedPL: 7.5,
      timestamp: new Date(Date.now() - 300000),
      stopLoss: 1.268,
      takeProfit: 1.258,
      confidence: 68,
      source: "MANUAL",
    },
    {
      id: "pos_3",
      symbol: "USD/JPY",
      side: "buy",
      size: 8000,
      entryPrice: 149.5,
      currentPrice: 149.25,
      unrealizedPL: -13.33,
      timestamp: new Date(Date.now() - 600000),
      stopLoss: 148.8,
      takeProfit: 150.5,
      confidence: 82,
      source: "AI_ENGINE",
    },
  ];

  const activePositions: ExtendedPosition[] =
    positions.length > 0
      ? (positions.map((pos) => ({
          ...pos,
          entryPrice: pos.currentPrice * 0.999,
        })) as ExtendedPosition[])
      : mockPositions;

  const formatCurrency = (amount: number, symbol: string) => {
    const currency = symbol.split("/")[1] || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "JPY" ? "JPY" : "USD",
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  };

  const formatPrice = (price: number, symbol: string) => {
    const isJPY = symbol.includes("JPY");
    return price.toFixed(isJPY ? 2 : 4);
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return "text-green-600";
    if (pnl < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getSideIcon = (side: "buy" | "sell") => {
    return side === "buy" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return <Badge variant="secondary">N/A</Badge>;
    if (confidence >= 80)
      return (
        <Badge variant="default" className="bg-green-500">
          High
        </Badge>
      );
    if (confidence >= 60)
      return (
        <Badge variant="default" className="bg-blue-500">
          Medium
        </Badge>
      );
    return <Badge variant="secondary">Low</Badge>;
  };

  const handleClosePosition = (positionId: string) => {
    // TODO: Implement position closing logic
    console.log("Closing position:", positionId);
  };

  const handleEditPosition = (positionId: string) => {
    setSelectedPosition(positionId);
    // TODO: Open position edit modal
    console.log("Editing position:", positionId);
  };

  const totalUnrealizedPnL = activePositions.reduce(
    (sum, pos) => sum + pos.unrealizedPL,
    0
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Active Positions ({activePositions.length})
            </CardTitle>
            {!isConnected && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div
                className={`text-sm font-semibold ${getPnLColor(
                  totalUnrealizedPnL
                )}`}
              >
                Total P&L: {totalUnrealizedPnL >= 0 ? "+" : ""}$
                {totalUnrealizedPnL.toFixed(2)}
              </div>
            </div>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="text-xs"
            >
              {isConnected ? "Live" : "Cached"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activePositions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No active positions</p>
            <p className="text-sm mt-1">
              Positions will appear here when trades are opened
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>SL/TP</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activePositions.map((position) => (
                  <TableRow
                    key={position.id}
                    className={
                      selectedPosition === position.id ? "bg-blue-50" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{position.symbol}</span>
                        {position.source === "AI_ENGINE" && (
                          <Badge variant="outline" className="text-xs">
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getSideIcon(position.side)}
                        <span className="capitalize text-sm">
                          {position.side}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {position.size.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-sm font-mono">
                      {formatPrice(
                        position.entryPrice || position.currentPrice,
                        position.symbol
                      )}
                    </TableCell>

                    <TableCell className="text-sm font-mono">
                      {formatPrice(position.currentPrice, position.symbol)}
                    </TableCell>

                    <TableCell>
                      <div
                        className={`text-sm font-semibold ${getPnLColor(
                          position.unrealizedPL
                        )}`}
                      >
                        {position.unrealizedPL >= 0 ? "+" : ""}$
                        {position.unrealizedPL.toFixed(2)}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div>
                        SL:{" "}
                        {formatPrice(position.stopLoss || 0, position.symbol)}
                      </div>
                      <div>
                        TP:{" "}
                        {formatPrice(position.takeProfit || 0, position.symbol)}
                      </div>
                    </TableCell>

                    <TableCell>
                      {getConfidenceBadge(position.confidence)}
                    </TableCell>

                    <TableCell className="text-xs text-gray-500">
                      {new Date(position.timestamp).toLocaleTimeString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPosition(position.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleClosePosition(position.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Refresh indicator */}
        {isConnected && activePositions.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Live updates active</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionsList;
