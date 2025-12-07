"use client";

import React from "react";
import {
  TrendingUp,
  Target,
  Activity,
  Zap,
  DollarSign,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const kpis = [
  {
    title: "Total P&L",
    value: "+$247.43",
    subtitle: "+2.4%",
    change: "+5.2%",
    changeType: "positive",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    title: "Active Trades",
    value: "8",
    subtitle: "of 15 daily",
    change: "+3",
    changeType: "positive",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    title: "Win Rate",
    value: "73.3%",
    subtitle: "Success Rate",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    title: "Open Positions",
    value: "8",
    subtitle: "Active",
    change: "-1",
    changeType: "neutral",
    icon: Activity,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    title: "Portfolio Heat",
    value: "75%",
    subtitle: "Risk Level",
    change: "-3%",
    changeType: "positive",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    title: "AI Confidence",
    value: "88%",
    subtitle: "Model Accuracy",
    change: "+1.2%",
    changeType: "positive",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 ${kpi.borderColor} dark:border-slate-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden`}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 ${kpi.bgColor} dark:bg-slate-700 opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${kpi.bgColor} dark:bg-slate-700 border ${kpi.borderColor} dark:border-slate-600 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <kpi.icon
                  className={`w-6 h-6 ${kpi.iconColor} dark:text-slate-300`}
                />
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-black ${kpi.color} dark:text-slate-200 mb-1 tracking-tight`}
                >
                  {kpi.value}
                </div>
                <div className="flex items-center justify-end space-x-1">
                  {kpi.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  ) : kpi.changeType === "negative" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                  ) : null}
                  <span
                    className={`text-sm font-bold ${
                      kpi.changeType === "positive"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : kpi.changeType === "negative"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {kpi.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {kpi.subtitle}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
