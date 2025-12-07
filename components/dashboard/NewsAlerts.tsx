/**
 * QNEX 369 - News Alerts Component
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, AlertTriangle } from "lucide-react";

export interface NewsAlertsProps {
  data?: any;
  isConnected: boolean;
  className?: string;
}

export const NewsAlerts: React.FC<NewsAlertsProps> = ({
  data,
  isConnected,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg font-semibold">News Alerts</CardTitle>
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
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              ECB Meeting Today
            </p>
            <p className="text-xs text-blue-700">
              High impact - EUR volatility expected
            </p>
          </div>
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Loading latest news...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsAlerts;
