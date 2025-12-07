/**
 * QNEX 369 - Market Overview Component
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertTriangle } from "lucide-react";

export interface MarketOverviewProps {
  data?: any;
  isConnected: boolean;
  className?: string;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  data,
  isConnected,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg font-semibold">
              Market Overview
            </CardTitle>
            {!isConnected && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="text-xs"
          >
            {isConnected ? "Live" : "Cached"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Session</p>
              <p className="font-semibold">London Open</p>
            </div>
            <div>
              <p className="text-gray-600">Volatility</p>
              <p className="font-semibold text-amber-600">Medium</p>
            </div>
          </div>
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Market data loading...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
