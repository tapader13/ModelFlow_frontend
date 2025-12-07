/**
 * News Dashboard Component - Phase 3.2 Advanced News Integration
 * Real-time news analysis and economic calendar display with pagination and filtering
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Newspaper,
  Target,
  Shield,
  Zap,
  RefreshCw,
  BarChart3,
  Filter,
} from "lucide-react";
import { NewsPagination } from "@/components/news/NewsPagination";
import { AutoFetcherControl } from "@/components/news/AutoFetcherControl";
import type {
  MarketNews,
  EconomicEvent,
  NewsArticle,
  NewsBlackout,
  NewsSignal,
  SentimentAnalysis,
} from "@/types/news";

interface NewsData {
  marketNews: MarketNews;
  signals: NewsSignal[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}

interface PaginatedNewsData {
  articles: NewsArticle[];
  events: EconomicEvent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  loading: boolean;
}

interface NewsFiltersType {
  search?: string;
  startDate?: string;
  endDate?: string;
  impact?: string[];
  source?: string[];
  currency?: string[];
  sentiment?: string[];
}

interface PaginationState {
  page: number;
  limit: number;
  filters: NewsFiltersType;
}

export default function NewsDashboard() {
  const [newsData, setNewsData] = useState<NewsData>({
    marketNews: {
      breakingNews: [],
      economicEvents: [],
      sentimentOverview: {
        overall: "neutral",
        byPair: {},
        confidence: 0,
      },
      blackoutStatus: {
        isActive: false,
        reason: "",
        events: [],
        startTime: "",
        endTime: "",
        affectedPairs: [],
        riskLevel: "low",
        recommendations: [],
      },
      lastUpdated: "",
    },
    signals: [],
    loading: true,
    error: null,
    lastUpdated: "",
  });

  // Paginated data states
  const [paginatedNewsData, setPaginatedNewsData] = useState<PaginatedNewsData>(
    {
      articles: [],
      events: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 20,
        hasNext: false,
        hasPrev: false,
      },
      loading: false,
    }
  );

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    limit: 20,
    filters: {},
  });

  const [selectedPair, setSelectedPair] = useState<string>("EUR_USD");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch market overview data (for KPIs and overview)
  const fetchMarketOverview = useCallback(async () => {
    try {
      const marketResponse = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "market_overview" }),
      });

      const marketData = await marketResponse.json();
      if (!marketData.success) {
        throw new Error(marketData.error || "Failed to fetch market overview");
      }

      setNewsData((prev) => ({
        ...prev,
        marketNews: marketData.data,
        lastUpdated: new Date().toISOString(),
        error: null,
      }));
    } catch (error) {
      console.error("Error fetching market overview:", error);
      setNewsData((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, []);

  // Fetch paginated news data using auto-fetcher API
  const fetchPaginatedNews = useCallback(async () => {
    try {
      setPaginatedNewsData((prev) => ({ ...prev, loading: true }));

      const { page, limit, filters } = paginationState;

      // Prepare query parameters
      const params: Record<string, any> = {
        page,
        limit,
      };

      // Add filters to params
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.impact?.length) params.impact = filters.impact;
      if (filters.source?.length) params.source = filters.source;
      if (filters.currency?.length) params.currency = filters.currency;
      if (filters.sentiment?.length) params.sentiment = filters.sentiment;

      // Fetch news articles using paginated API
      const newsParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (filters.search) newsParams.append("search", filters.search);
      if (filters.startDate) newsParams.append("startDate", filters.startDate);
      if (filters.endDate) newsParams.append("endDate", filters.endDate);
      if (filters.impact?.length)
        newsParams.append("impact", filters.impact.join(","));
      if (filters.source?.length)
        newsParams.append("source", filters.source.join(","));

      const newsResponse = await fetch(
        `/api/news/paginated?${newsParams.toString()}`
      );

      // For now, get both news and events from the paginated API
      // (Events will be added to the paginated API later)
      const eventsResponse = await fetch("/api/news/calendar");

      const [newsDataResponse, eventsDataResponse] = await Promise.all([
        newsResponse.json(),
        eventsResponse.json(),
      ]);

      if (!newsDataResponse.success) {
        throw new Error(newsDataResponse.error || "Failed to fetch news");
      }

      if (!eventsDataResponse.success) {
        throw new Error(eventsDataResponse.error || "Failed to fetch events");
      }

      // Update paginated data
      setPaginatedNewsData({
        articles: newsDataResponse.data.articles || [],
        events: eventsDataResponse.data.events || [],
        pagination: {
          currentPage: page,
          totalPages: newsDataResponse.data.pagination?.totalPages || 1,
          totalItems: newsDataResponse.data.pagination?.total || 0,
          pageSize: limit,
          hasNext: newsDataResponse.data.pagination?.hasNext || false,
          hasPrev: newsDataResponse.data.pagination?.hasPrev || false,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching paginated news:", error);
      setPaginatedNewsData((prev) => ({ ...prev, loading: false }));
      setNewsData((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, [paginationState]);

  // Fetch trading signals
  const fetchTradingSignals = useCallback(async () => {
    try {
      const signalsResponse = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_signals",
          pair: selectedPair,
        }),
      });

      const signalsData = await signalsResponse.json();
      if (!signalsData.success) {
        throw new Error(signalsData.error || "Failed to fetch signals");
      }

      setNewsData((prev) => ({
        ...prev,
        signals: signalsData.data?.signals || [],
      }));
    } catch (error) {
      console.error("Error fetching trading signals:", error);
    }
  }, [selectedPair]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: any) => {
    setPaginationState((prev) => ({
      ...prev,
      page: 1, // Reset to first page when filters change
      filters: newFilters,
    }));
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setPaginationState((prev) => ({
      ...prev,
      page: 1,
      filters: {},
    }));
  }, []);

  // Calculate active filter count
  const getActiveFilterCount = useCallback(() => {
    const { filters } = paginationState;
    let count = 0;
    if (filters.search) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.impact?.length) count++;
    if (filters.source?.length) count++;
    if (filters.currency?.length) count++;
    if (filters.sentiment?.length) count++;
    return count;
  }, [paginationState]);

  // Handle pagination changes
  const handlePageChange = useCallback((newPage: number) => {
    setPaginationState((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPaginationState((prev) => ({
      ...prev,
      page: 1, // Reset to first page when page size changes
      limit: newPageSize,
    }));
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    setNewsData((prev) => ({ ...prev, loading: true }));
    await Promise.all([
      fetchMarketOverview(),
      fetchPaginatedNews(),
      fetchTradingSignals(),
    ]);
    setNewsData((prev) => ({ ...prev, loading: false }));
  }, [fetchMarketOverview, fetchPaginatedNews, fetchTradingSignals]);

  useEffect(() => {
    fetchMarketOverview();
    fetchTradingSignals();
  }, [fetchMarketOverview, fetchTradingSignals]);

  useEffect(() => {
    fetchPaginatedNews();
  }, [fetchPaginatedNews]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchMarketOverview();
        fetchTradingSignals();
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, fetchMarketOverview, fetchTradingSignals]);

  // Utility functions
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getImpactColor = (impact: EconomicEvent["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSentimentColor = (sentiment: SentimentAnalysis["overall"]) => {
    switch (sentiment) {
      case "very_bullish":
        return "text-green-600";
      case "bullish":
        return "text-green-500";
      case "neutral":
        return "text-gray-500";
      case "bearish":
        return "text-red-500";
      case "very_bearish":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getSentimentIcon = (sentiment: SentimentAnalysis["overall"]) => {
    if (sentiment.includes("bullish")) {
      return <TrendingUp className="w-4 h-4" />;
    } else if (sentiment.includes("bearish")) {
      return <TrendingDown className="w-4 h-4" />;
    }
    return <BarChart3 className="w-4 h-4" />;
  };

  const { marketNews, signals, loading, error } = newsData;
  const { blackoutStatus, sentimentOverview, economicEvents, breakingNews } =
    marketNews;
  const { articles, events, pagination } = paginatedNewsData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">News & Market Analysis</h1>
          <p className="text-muted-foreground">
            Real-time economic calendar and sentiment analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllData}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
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

      {/* News Blackout Alert */}
      {blackoutStatus.isActive && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <Shield className="h-4 w-4" />
          <AlertTitle className="text-yellow-800">
            News Blackout Active
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            {blackoutStatus.reason}. Affected pairs:{" "}
            {blackoutStatus.affectedPairs.join(", ")}
            <div className="mt-2">
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside mt-1">
                {blackoutStatus.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Sentiment
            </CardTitle>
            {getSentimentIcon(sentimentOverview.overall)}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getSentimentColor(
                sentimentOverview.overall
              )}`}
            >
              {sentimentOverview.overall.replace("_", " ")}
            </div>
            <p className="text-xs text-muted-foreground">
              {(sentimentOverview.confidence * 100).toFixed(1)}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Economic Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => e.impact === "high").length} high impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breaking News</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {articles.filter((n) => n.relevance > 0.8).length} high relevance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trading Signals
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signals.length}</div>
            <p className="text-xs text-muted-foreground">
              {signals.filter((s) => s.confidence > 0.8).length} high confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search news..."
                  value={paginationState.filters.search || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFiltersChange({
                      ...paginationState.filters,
                      search: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={paginationState.filters.startDate || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFiltersChange({
                      ...paginationState.filters,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={paginationState.filters.endDate || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFiltersChange({
                      ...paginationState.filters,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Badge variant="secondary">
                {getActiveFilterCount()} active filters
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-Fetcher Control */}
      <AutoFetcherControl />

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Economic Calendar</TabsTrigger>
          <TabsTrigger value="news">Breaking News</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
        </TabsList>

        {/* Economic Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Economic Calendar
              </CardTitle>
              <CardDescription>
                Upcoming economic events and their market impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedNewsData.loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">
                      Loading events...
                    </p>
                  </div>
                ) : events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No economic events found
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${getImpactColor(
                            event.impact
                          )}`}
                        />
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.country} • {event.currency}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(event.date)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.timeToRelease > 0
                            ? `In ${event.timeToRelease}m`
                            : "Released"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Economic Calendar Pagination */}
              {events.length > 0 && (
                <NewsPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  pageSize={pagination.pageSize}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  loading={paginatedNewsData.loading}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breaking News Tab */}
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="w-5 h-5 mr-2" />
                Breaking News
              </CardTitle>
              <CardDescription>
                Latest financial news with sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedNewsData.loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">
                      Loading news...
                    </p>
                  </div>
                ) : articles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No news articles found
                  </p>
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{article.title}</h3>
                        <Badge variant="outline">{article.source}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`flex items-center ${getSentimentColor(
                              article.sentiment.overall
                            )}`}
                          >
                            {getSentimentIcon(article.sentiment.overall)}
                            <span className="ml-1 text-sm">
                              {article.sentiment.overall.replace("_", " ")}
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {(article.sentiment.confidence * 100).toFixed(0)}%
                            confidence
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(article.publishedAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Breaking News Pagination */}
              {articles.length > 0 && (
                <NewsPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  pageSize={pagination.pageSize}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  loading={paginatedNewsData.loading}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market Sentiment Overview
              </CardTitle>
              <CardDescription>
                Aggregated sentiment analysis by currency pair
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sentimentOverview.byPair).map(
                  ([pair, sentiment]) => (
                    <div key={pair} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{pair}</span>
                        <div
                          className={`flex items-center ${getSentimentColor(
                            sentiment
                          )}`}
                        >
                          {getSentimentIcon(sentiment)}
                          <span className="ml-1 text-sm">
                            {sentiment.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                News-Based Trading Signals
              </CardTitle>
              <CardDescription>
                Trading opportunities based on news analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">
                      Loading signals...
                    </p>
                  </div>
                ) : signals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No trading signals available
                  </p>
                ) : (
                  signals.map((signal) => (
                    <div key={signal.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{signal.pair}</span>
                          <Badge
                            variant={
                              signal.direction === "buy"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {signal.direction.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(signal.confidence * 100).toFixed(0)}% confidence
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Strength: {(signal.strength * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Type: {signal.type.replace("_", " ")}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">SL:</span>{" "}
                          {signal.riskParameters.stopLoss}
                        </div>
                        <div>
                          <span className="text-muted-foreground">TP:</span>{" "}
                          {signal.riskParameters.takeProfit}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk:</span>{" "}
                          {signal.riskParameters.maxRisk}%
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Valid until:
                          </span>{" "}
                          {formatTime(signal.validUntil)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated:{" "}
        {newsData.lastUpdated ? formatTime(newsData.lastUpdated) : "Never"}
      </div>
    </div>
  );
}
