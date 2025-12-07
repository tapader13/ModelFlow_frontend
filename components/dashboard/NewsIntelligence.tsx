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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  BarChart3,
  Zap,
  Eye,
  Globe,
  Filter,
  Gauge,
  Target,
  PieChart,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface NewsData {
  articles: Array<{
    id: string;
    title: string;
    summary: string;
    sentiment: string;
    impact: string;
    currency: string;
    timestamp: string;
    source: string;
    relevanceScore: number;
  }>;
  sentiment: {
    overall: string;
    score: number;
    distribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  calendar: Array<{
    id: string;
    title: string;
    currency: string;
    impact: string;
    forecast: string;
    previous: string;
    actual?: string;
    timestamp: string;
    timeToEvent: string;
  }>;
  marketImpact: {
    highImpactEvents: number;
    activeCurrencies: string[];
    sentimentTrend: string;
    volatilityWarning: boolean;
  };
}

export default function NewsIntelligence() {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  const currencies = [
    'ALL',
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CHF',
    'AUD',
    'CAD',
    'NZD',
  ];

  const fetchNewsData = async () => {
    try {
      setLoading(true);

      // Fetch news data from the dedicated intelligence endpoint
      const response = await fetch('/api/news/intelligence?limit=20');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNewsData(result.data);
          setError(null);
          return;
        }
      }

      // Fallback to paginated endpoint if intelligence endpoint fails
      const fallbackResponse = await fetch('/api/news/paginated?page=1&limit=20');
      
      let combinedData: NewsData = {
        articles: [],
        sentiment: {
          overall: 'neutral',
          score: 0,
          distribution: { positive: 0, neutral: 0, negative: 0 },
        },
        calendar: [],
        marketImpact: {
          highImpactEvents: 0,
          activeCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
          sentimentTrend: 'stable',
          volatilityWarning: false,
        },
      };

      if (fallbackResponse.ok) {
        const newsResult = await fallbackResponse.json();
        if (newsResult.success && newsResult.data.articles) {
          // Transform MongoDB articles to the expected format
          combinedData.articles = newsResult.data.articles.map((article: any) => ({
            id: article._id || article.id || `article_${Date.now()}_${Math.random()}`,
            title: article.title || 'No Title',
            summary: article.summary || article.content?.substring(0, 200) || 'No summary available',
            sentiment: article.sentiment?.overall || article.sentiment?.label || 'neutral',
            impact: article.impact || 'medium',
            currency: article.affectedPairs?.[0]?.split('_')?.[0] || 'USD',
            timestamp: article.publishedAt || article.createdAt || new Date().toISOString(),
            source: article.source || 'Unknown',
            relevanceScore: article.sentiment?.confidence || 0.5,
          }));

          // Calculate aggregated sentiment
          if (combinedData.articles.length > 0) {
            const sentiments = combinedData.articles.map(a => a.sentiment.toLowerCase());
            const positive = sentiments.filter(s => s.includes('positive') || s.includes('bullish')).length;
            const negative = sentiments.filter(s => s.includes('negative') || s.includes('bearish')).length;
            const neutral = sentiments.length - positive - negative;
            
            combinedData.sentiment = {
              overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral',
              score: (positive - negative) / sentiments.length,
              distribution: {
                positive: (positive / sentiments.length) * 100,
                neutral: (neutral / sentiments.length) * 100,
                negative: (negative / sentiments.length) * 100,
              }
            };

            combinedData.marketImpact.highImpactEvents = combinedData.articles.filter(a => a.impact === 'high').length;
          }
        }
      }

      // Add mock calendar events
      combinedData.calendar = [
        {
          id: 'mock_1',
          title: 'US Employment Data',
          currency: 'USD',
          impact: 'high',
          forecast: '3.8%',
          previous: '3.7%',
          timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timeToEvent: '1 day',
        },
        {
          id: 'mock_2',
          title: 'ECB Interest Rate Decision',
          currency: 'EUR',
          impact: 'high',
          forecast: '4.00%',
          previous: '4.00%',
          timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          timeToEvent: '3 days',
        },
      ];

      setNewsData(combinedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch news data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch news data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNewsData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
      case 'bullish':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400';
      case 'negative':
      case 'bearish':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const filteredArticles =
    newsData?.articles.filter(
      (article) =>
        selectedCurrency === 'ALL' || article.currency === selectedCurrency
    ) || [];

  const filteredEvents =
    newsData?.calendar.filter(
      (event) =>
        selectedCurrency === 'ALL' || event.currency === selectedCurrency
    ) || [];

  if (loading) {
    return (
      <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
        {/* Dark-mode grid overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

        <div className='space-y-6 relative z-10'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              News Intelligence
            </h1>
            <RefreshCw className='h-6 w-6 animate-spin text-gray-700 dark:text-gray-300' />
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className='animate-pulse bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'
              >
                <CardHeader className='pb-2'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                </CardHeader>
                <CardContent>
                  <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0a0f24] dark:via-[#0a0f24] dark:to-[#05070f] p-6'>
      {/* Dark-mode grid overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] hidden dark:block pointer-events-none' />

      <div className='space-y-6 relative z-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              News Intelligence
            </h1>
            <p className='text-sm text-muted-foreground dark:text-gray-400 mt-1'>
              Real-time market news and economic events analysis
            </p>
          </div>
          <div className='flex items-center gap-2'>
            {/* Currency Select */}
            <div className='flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 h-8 px-2'>
              <Filter className='h-4 w-4 text-muted-foreground' />
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger className='h-8 px-0 text-sm border-none bg-transparent focus:ring-0 ring-0 focus:outline-none dark:text-gray-300'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent className='text-sm'>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency}
                      value={currency}
                      className='h-8 text-sm'
                    >
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={fetchNewsData}
              disabled={loading}
              size='sm'
              variant='outline'
              className='border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Card className='border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                <AlertTriangle className='h-5 w-5' />
                <span>Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Impact Overview */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Overall Sentiment
              </CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Badge
                  className={`${getSentimentColor(
                    newsData?.sentiment?.overall || 'neutral'
                  )}`}
                >
                  {newsData?.sentiment?.overall?.toUpperCase() || 'NEUTRAL'}
                </Badge>
              </div>
              <div className='mt-3'>
                <div className='flex justify-between text-xs text-muted-foreground dark:text-gray-400 mb-1'>
                  <span>Sentiment Score</span>
                  <span>
                    {newsData?.sentiment?.score?.toFixed(2) || '0.00'}/1.0
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full'
                    style={{
                      width: `${(newsData?.sentiment?.score || 0) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                High Impact Events
              </CardTitle>
              <AlertTriangle className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
                {newsData?.marketImpact.highImpactEvents || 0}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                Events in next 24h
              </p>
              <div className='mt-3 flex items-center'>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
                  <div
                    className='bg-red-500 h-1.5 rounded-full'
                    style={{
                      width: `${Math.min(
                        100,
                        (newsData?.marketImpact.highImpactEvents || 0) * 20
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Active Currencies
              </CardTitle>
              <Globe className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {newsData?.marketImpact.activeCurrencies?.length || 0}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400 mt-2'>
                Currencies in focus
              </p>
              <div className='mt-2 flex flex-wrap gap-1'>
                {newsData?.marketImpact.activeCurrencies
                  ?.slice(0, 3)
                  .map((currency, i) => (
                    <span
                      key={i}
                      className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full'
                    >
                      {currency}
                    </span>
                  ))}
                {newsData &&
                  newsData.marketImpact.activeCurrencies.length > 3 && (
                    <span className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full'>
                      +{newsData.marketImpact.activeCurrencies.length - 3}
                    </span>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-[#0f172a]/50 border-gray-200 dark:border-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Volatility Warning
              </CardTitle>
              <Zap className='h-4 w-4 text-muted-foreground dark:text-gray-400' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                {newsData?.marketImpact.volatilityWarning ? (
                  <div className='flex items-center gap-2'>
                    <div className='relative'>
                      <div className='w-4 h-4 bg-red-500 rounded-full animate-pulse'></div>
                      <div className='absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full animate-ping'></div>
                    </div>
                    <Badge className='text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400'>
                      HIGH
                    </Badge>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                    <Badge className='text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400'>
                      LOW
                    </Badge>
                  </div>
                )}
              </div>
              <p className='text-xs text-muted-foreground dark:text-gray-400 mt-3'>
                Current market risk
              </p>
              <div className='mt-2'>
                <div className='flex justify-between text-xs text-muted-foreground dark:text-gray-400'>
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1'>
                  <div
                    className={`h-1.5 rounded-full ${
                      newsData?.marketImpact.volatilityWarning
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: newsData?.marketImpact.volatilityWarning
                        ? '85%'
                        : '25%',
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='news' className='space-y-4'>
          <div className='overflow-x-auto pb-2 hide-scrollbar'>
            <TabsList className='inline-flex w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 min-w-full sm:min-w-0'>
              <TabsTrigger
                value='news'
                className='relative flex items-center px-3 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-sm whitespace-nowrap'
              >
                <Newspaper className='h-4 w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500 flex-shrink-0' />
                <span className='hidden xs:inline'>News Feed</span>
                <span className='xs:hidden'>News</span>
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
              </TabsTrigger>

              <TabsTrigger
                value='calendar'
                className='relative flex items-center px-3 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-sm whitespace-nowrap'
              >
                <Calendar className='h-4 w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500 flex-shrink-0' />
                <span className='hidden xs:inline'>Economic Calendar</span>
                <span className='xs:hidden'>Calendar</span>
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
              </TabsTrigger>

              <TabsTrigger
                value='sentiment'
                className='relative flex items-center px-3 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-sm whitespace-nowrap'
              >
                <PieChart className='h-4 w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500 flex-shrink-0' />
                <span className='hidden xs:inline'>Sentiment</span>
                <span className='xs:hidden'>Sentiment</span>
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
              </TabsTrigger>

              <TabsTrigger
                value='impact'
                className='relative flex items-center px-3 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 group text-sm whitespace-nowrap'
              >
                <Target className='h-4 w-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-500 flex-shrink-0' />
                <span className='hidden xs:inline'>Market Impact</span>
                <span className='xs:hidden'>Impact</span>
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300'></div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='news' className='space-y-4   pt-4'>
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <Newspaper className='h-5 w-5 text-blue-500' />
                  Latest Market News
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Real-time news analysis with sentiment and impact scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        className='border rounded-xl p-4 space-y-3 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200 bg-white/50 dark:bg-gray-800/30'
                      >
                        <div className='flex items-start justify-between'>
                          <h4 className='font-semibold leading-tight text-gray-900 dark:text-white'>
                            {article.title}
                          </h4>
                          <div className='flex items-center gap-2 ml-4 flex-shrink-0'>
                            <Badge
                              className={`${getSentimentColor(
                                article.sentiment
                              )} px-2 py-1 font-medium`}
                            >
                              {article.sentiment?.toUpperCase() || 'NEUTRAL'}
                            </Badge>
                            <Badge
                              className={`${getImpactColor(
                                article.impact
                              )} px-2 py-1 font-medium`}
                            >
                              {article.impact?.toUpperCase() || 'LOW'}
                            </Badge>
                          </div>
                        </div>
                        <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                          {article.summary}
                        </p>
                        <div className='flex items-center justify-between text-xs text-muted-foreground dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700'>
                          <div className='flex items-center gap-4'>
                            <span className='flex items-center gap-1 font-medium'>
                              {article.source}
                            </span>
                            <span className='flex items-center gap-1'>
                              {article.currency}
                            </span>
                            <span className='flex items-center gap-1'>
                              {(article.relevanceScore * 100).toFixed(0)}%
                              Relevance
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            <span>
                              {new Date(article.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8'>
                      <Newspaper className='h-12 w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-2' />
                      <p className='text-muted-foreground dark:text-gray-400'>
                        No news articles available for selected currency
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='calendar' className='space-y-4 pt-4'>
            <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                  <Calendar className='h-5 w-5 text-blue-500' />
                  Economic Calendar
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Upcoming economic events and their expected market impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className='border rounded-xl p-4 space-y-3 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors duration-200 bg-white/50 dark:bg-gray-800/30'
                      >
                        <div className='flex items-start justify-between'>
                          <div>
                            <h4 className='font-semibold text-gray-900 dark:text-white'>
                              {event.title}
                            </h4>
                            <p className='text-sm text-muted-foreground dark:text-gray-400'>
                              {event.currency}
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Badge
                              className={`${getImpactColor(
                                event.impact
                              )} px-2 py-1 font-medium`}
                            >
                              {event.impact?.toUpperCase() || 'LOW'}
                            </Badge>
                            <div className='text-right'>
                              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                {event.timeToEvent}
                              </p>
                              <p className='text-xs text-muted-foreground dark:text-gray-400'>
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='grid gap-3 md:grid-cols-3 text-sm'>
                          <div className='text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                            <label className='font-medium text-muted-foreground dark:text-gray-400 text-xs uppercase tracking-wide'>
                              Forecast
                            </label>
                            <p className='text-gray-900 dark:text-white font-medium'>
                              {event.forecast || 'N/A'}
                            </p>
                          </div>
                          <div className='text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                            <label className='font-medium text-muted-foreground dark:text-gray-400 text-xs uppercase tracking-wide'>
                              Previous
                            </label>
                            <p className='text-gray-900 dark:text-white font-medium'>
                              {event.previous || 'N/A'}
                            </p>
                          </div>
                          <div className='text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                            <label className='font-medium text-muted-foreground dark:text-gray-400 text-xs uppercase tracking-wide'>
                              Actual
                            </label>
                            <p
                              className={`font-medium ${
                                event.actual
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-muted-foreground dark:text-gray-400'
                              }`}
                            >
                              {event.actual || 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8'>
                      <Calendar className='h-12 w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-2' />
                      <p className='text-muted-foreground dark:text-gray-400'>
                        No economic events scheduled for selected currency
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='sentiment' className='space-y-4 pt-4'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <PieChart className='h-5 w-5 text-blue-500' />
                    Sentiment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50'>
                      <span className='text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2'>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                        Positive
                      </span>
                      <div className='flex items-center gap-3'>
                        <div className='w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                          <div
                            className='bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out'
                            style={{
                              width: `${Math.min(
                                newsData?.sentiment?.distribution?.positive || 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm font-bold text-gray-900 dark:text-white min-w-[45px] text-right'>
                          {(
                            newsData?.sentiment?.distribution?.positive || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50'>
                      <span className='text-sm font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-2'>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        Neutral
                      </span>
                      <div className='flex items-center gap-3'>
                        <div className='w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                          <div
                            className='bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out'
                            style={{
                              width: `${Math.min(
                                newsData?.sentiment?.distribution?.neutral || 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm font-bold text-gray-900 dark:text-white min-w-[45px] text-right'>
                          {(
                            newsData?.sentiment?.distribution?.neutral || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50'>
                      <span className='text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                        Negative
                      </span>
                      <div className='flex items-center gap-3'>
                        <div className='w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                          <div
                            className='bg-red-500 h-2.5 rounded-full transition-all duration-1000 ease-out'
                            style={{
                              width: `${Math.min(
                                newsData?.sentiment?.distribution?.negative || 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className='text-sm font-bold text-gray-900 dark:text-white min-w-[45px] text-right'>
                          {(
                            newsData?.sentiment?.distribution?.negative || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Gauge className='h-5 w-5 text-blue-500' />
                    Overall Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                    <div className='text-5xl font-bold mb-3 text-gray-900 dark:text-white'>
                      {(newsData?.sentiment?.score || 0).toFixed(2)}
                    </div>
                    <Badge
                      className={`${getSentimentColor(
                        newsData?.sentiment?.overall || 'neutral'
                      )} px-4 py-2 text-sm font-semibold uppercase tracking-wide`}
                    >
                      {newsData?.sentiment?.overall || 'NEUTRAL'}
                    </Badge>
                    <div className='mt-3 text-xs text-gray-600 dark:text-gray-400'>
                      Sentiment Score Range: -1.0 to +1.0
                    </div>
                  </div>

                  <div className='p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Market Trend Direction
                      </span>
                      <div className='flex items-center gap-2'>
                        {newsData?.marketImpact?.sentimentTrend === 'bullish' || 
                         newsData?.sentiment?.overall === 'positive' ? (
                          <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                        ) : newsData?.marketImpact?.sentimentTrend === 'bearish' || 
                              newsData?.sentiment?.overall === 'negative' ? (
                          <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                        ) : (
                          <Activity className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                        )}
                        <span className='text-sm font-semibold capitalize text-gray-900 dark:text-white'>
                          {newsData?.marketImpact?.sentimentTrend || newsData?.sentiment?.overall || 'stable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                      <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                        {filteredArticles.filter(a => a.sentiment.toLowerCase().includes('positive') || a.sentiment.toLowerCase().includes('bullish')).length}
                      </div>
                      <div className='text-xs text-green-700 dark:text-green-300 font-medium'>
                        Bullish Articles
                      </div>
                    </div>
                    <div className='text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                      <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
                        {filteredArticles.filter(a => a.sentiment.toLowerCase().includes('negative') || a.sentiment.toLowerCase().includes('bearish')).length}
                      </div>
                      <div className='text-xs text-red-700 dark:text-red-300 font-medium'>
                        Bearish Articles
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='impact' className='space-y-4 pt-4'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <Eye className='h-5 w-5 text-blue-500' />
                    Market Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                      News sentiment influences short-term volatility
                    </span>
                  </div>

                  <div className='flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800'>
                    <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                      Economic events drive medium-term trends
                    </span>
                  </div>

                  <div className='flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                      Monitor high-impact events for position adjustments
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                    <AlertTriangle className='h-5 w-5 text-red-500' />
                    Active Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-3'>
                      Currencies in Focus
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {newsData?.marketImpact.activeCurrencies?.map(
                        (currency, i) => (
                          <Badge
                            key={i}
                            className='bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1 font-medium'
                          >
                            {currency}
                          </Badge>
                        )
                      ) || (
                        <span className='text-sm text-muted-foreground dark:text-gray-400'>
                          No specific currencies highlighted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='pt-3 border-t border-gray-100 dark:border-gray-700'>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Risk Level
                    </h4>
                    <div className='flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                      {newsData?.marketImpact.volatilityWarning ? (
                        <>
                          <AlertTriangle className='h-5 w-5 text-red-600 dark:text-red-400' />
                          <div>
                            <p className='text-sm font-semibold text-red-600 dark:text-red-400'>
                              High Volatility Expected
                            </p>
                            <p className='text-xs text-muted-foreground dark:text-gray-400'>
                              Monitor positions closely
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Eye className='h-5 w-5 text-green-600 dark:text-green-400' />
                          <div>
                            <p className='text-sm font-semibold text-green-600 dark:text-green-400'>
                              Normal Market Conditions
                            </p>
                            <p className='text-xs text-muted-foreground dark:text-gray-400'>
                              Standard monitoring recommended
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
