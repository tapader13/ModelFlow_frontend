/**
 * QNEX 369 - Trading Controls Component
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Play, Pause, AlertTriangle } from "lucide-react";

export interface TradingControlsProps {
  isConnected: boolean;
  systemStatus?: any;
  className?: string;
}

export const TradingControls: React.FC<TradingControlsProps> = ({
  isConnected,
  systemStatus,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold">
              Trading Controls
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
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-green-600">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">System: Active</p>
            <p className="text-xs text-green-600">All engines operational</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingControls;
