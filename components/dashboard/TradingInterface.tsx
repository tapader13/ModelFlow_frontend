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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  AlertTriangle,
  RefreshCw,
  X,
  Plus,
  Minus,
  Clock,
  Shield,
  ArrowUp,
  ArrowDown,
  Zap,
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  entry: number;
  current: number;
  profit: number;
  time: string;
}

interface Order {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  price: number;
  expiry: string;
}

interface Trade {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  entry: number;
  exit: number;
  profit: number;
  time: string;
}

interface TradingFormData {
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export default function TradingInterface() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accountData, setAccountData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('trade');
  const [isTrading, setIsTrading] = useState(false);

  // Trading form state
  const [tradeForm, setTradeForm] = useState<TradingFormData>({
    symbol: 'EUR_USD',
    type: 'BUY',
    volume: 0.01,
    orderType: 'MARKET',
  });

  const symbols = [
    'EUR_USD',
    'GBP_USD',
    'USD_JPY',
    'USD_CHF',
    'AUD_USD',
    'USD_CAD',
    'NZD_USD',
    'EUR_GBP',
    'EUR_JPY',
    'GBP_JPY',
    'CHF_JPY',
    'AUD_JPY',
    'CAD_JPY',
    'NZD_JPY',
  ];

  const fetchTradingData = async () => {
    try {
      setLoading(true);

      // Only fetch account data initially - minimal load
      const accountRes = await fetch('/api/oanda/account');

      // Process account data
      if (accountRes.ok) {
        const accountResult = await accountRes.json();
        if (accountResult.success) {
          setAccountData(accountResult.data.account);
        }
      }

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch account data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for specific tabs only when accessed
  const fetchTabData = async (tab: string) => {
    try {
      switch (tab) {
        case 'positions':
          const positionsRes = await fetch('/api/oanda/positions');
          if (positionsRes.ok) {
            const positionsResult = await positionsRes.json();
            if (positionsResult.success) {
              setPositions(positionsResult.data.positions);
            }
          }
          break;

        case 'orders':
          const ordersRes = await fetch('/api/oanda/orders');
          if (ordersRes.ok) {
            const ordersResult = await ordersRes.json();
            if (ordersResult.success) {
              setOrders(ordersResult.data.orders);
            }
          }
          break;

        case 'history':
          const tradesRes = await fetch('/api/oanda/trades/history?count=10');
          if (tradesRes.ok) {
            const tradesResult = await tradesRes.json();
            if (tradesResult.success) {
              setTrades(tradesResult.data.trades);
            }
          }
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab} data:`, err);
    }
  };

  useEffect(() => {
    fetchTradingData();

    // Removed auto-refresh for better performance
    // Data will be fetched when tabs are accessed
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (selectedTab !== 'trade') {
      fetchTabData(selectedTab);
    }
  }, [selectedTab]);

  const handleCreateTrade = async () => {
    try {
      setIsTrading(true);

      const payload: any = {
        symbol: tradeForm.symbol,
        type: tradeForm.type,
        volume: tradeForm.volume,
      };

      if (tradeForm.stopLoss) payload.stopLoss = tradeForm.stopLoss;
      if (tradeForm.takeProfit) payload.takeProfit = tradeForm.takeProfit;

      const response = await fetch('/api/oanda/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setError(null);
        fetchTradingData(); // Refresh data

        // Reset form
        setTradeForm({
          ...tradeForm,
          stopLoss: undefined,
          takeProfit: undefined,
        });
      } else {
        setError(result.error || 'Failed to create trade');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trade');
    } finally {
      setIsTrading(false);
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    try {
      const response = await fetch('/api/oanda/trades', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchTradingData(); // Refresh data
      } else {
        setError(result.error || 'Failed to close trade');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close trade');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/oanda/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchTradingData(); // Refresh data
      } else {
        setError(result.error || 'Failed to cancel order');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0);
  const totalFreeMargin = accountData?.marginAvailable || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Trading Dashboard
          </h1>
          <p className='text-muted-foreground dark:text-gray-400'>
            Live trading interface with real-time position management
          </p>
        </div>
        <Button
          onClick={fetchTradingData}
          disabled={loading}
          size='sm'
          variant='outline'
          className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
              <AlertTriangle className='h-5 w-5' />
              <span>Error: {error}</span>
              <Button
                onClick={() => setError(null)}
                size='sm'
                variant='ghost'
                className='ml-auto dark:text-gray-200'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Summary */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Account Balance
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {accountData
                ? formatCurrency(accountData.balance, accountData.currency)
                : '--'}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Free Margin: {formatCurrency(totalFreeMargin)}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Unrealized P&L
            </CardTitle>
            {totalProfit >= 0 ? (
              <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
            ) : (
              <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalProfit >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(totalProfit)}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Open positions P&L
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Open Positions
            </CardTitle>
            <Target className='h-4 w-4 text-muted-foreground dark:text-purple-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {positions.length}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Active trades
            </p>
          </CardContent>
        </Card>

        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Pending Orders
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground dark:text-yellow-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {orders.length}
            </div>
            <p className='text-xs text-muted-foreground dark:text-gray-400'>
              Awaiting execution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Interface */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='space-y-4'
      >
        <div className='overflow-x-auto pb-2 hide-scrollbar'>
          <TabsList className='inline-flex w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 min-w-full sm:min-w-0'>
            <TabsTrigger
              value='trade'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <Zap className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden sm:inline'>Trade</span>
              <span className='sm:hidden'>New</span>
              {selectedTab === 'trade' && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='positions'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <Activity className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden sm:inline'>Positions</span>
              <span className='sm:hidden'>Pos</span>
              {positions.length > 0 && (
                <Badge className='ml-1 sm:ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs py-0 px-1.5 min-w-[1.25rem]'>
                  {positions.length}
                </Badge>
              )}
              {selectedTab === 'positions' && positions.length === 0 && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='orders'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <Clock className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden sm:inline'>Orders</span>
              <span className='sm:hidden'>Ord</span>
              {orders.length > 0 && (
                <Badge className='ml-1 sm:ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs py-0 px-1.5 min-w-[1.25rem]'>
                  {orders.length}
                </Badge>
              )}
              {selectedTab === 'orders' && orders.length === 0 && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>

            <TabsTrigger
              value='history'
              className='relative flex items-center px-3 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap'
            >
              <Shield className='h-4 w-4 mr-1 sm:mr-2 flex-shrink-0' />
              <span className='hidden sm:inline'>History</span>
              <span className='sm:hidden'>Hist</span>
              {selectedTab === 'history' && (
                <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full' />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='trade' className='space-y-4'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Zap className='h-5 w-5 text-blue-500' />
                Create New Trade
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Place a new market order with optional risk management
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='symbol'
                    className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                  >
                    <Target className='h-4 w-4' />
                    Currency Pair
                  </Label>
                  <Select
                    value={tradeForm.symbol}
                    onValueChange={(value) =>
                      setTradeForm({ ...tradeForm, symbol: value })
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'>
                      <SelectValue placeholder='Select pair' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-600'>
                      {symbols.map((symbol) => (
                        <SelectItem
                          key={symbol}
                          value={symbol}
                          className='dark:hover:bg-gray-700'
                        >
                          {symbol.replace('_', '/')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='type'
                    className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                  >
                    <Activity className='h-4 w-4' />
                    Direction
                  </Label>
                  <Select
                    value={tradeForm.type}
                    onValueChange={(value: 'BUY' | 'SELL') =>
                      setTradeForm({ ...tradeForm, type: value })
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-600'>
                      <SelectItem
                        value='BUY'
                        className='dark:hover:bg-gray-700'
                      >
                        <div className='flex items-center gap-2'>
                          <ArrowUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                          BUY
                        </div>
                      </SelectItem>
                      <SelectItem
                        value='SELL'
                        className='dark:hover:bg-gray-700'
                      >
                        <div className='flex items-center gap-2'>
                          <ArrowDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                          SELL
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='volume'
                    className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                  >
                    <DollarSign className='h-4 w-4' />
                    Volume (Lots)
                  </Label>
                  <Input
                    id='volume'
                    type='number'
                    step='0.01'
                    min='0.01'
                    max='10'
                    value={tradeForm.volume}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        volume: parseFloat(e.target.value) || 0,
                      })
                    }
                    className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='orderType'
                    className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                  >
                    <Clock className='h-4 w-4' />
                    Order Type
                  </Label>
                  <Select
                    value={tradeForm.orderType}
                    onValueChange={(value: 'MARKET' | 'LIMIT' | 'STOP') =>
                      setTradeForm({ ...tradeForm, orderType: value })
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-800 dark:border-gray-600'>
                      <SelectItem
                        value='MARKET'
                        className='dark:hover:bg-gray-700'
                      >
                        Market Order
                      </SelectItem>
                      <SelectItem
                        value='LIMIT'
                        className='dark:hover:bg-gray-700'
                      >
                        Limit Order
                      </SelectItem>
                      <SelectItem
                        value='STOP'
                        className='dark:hover:bg-gray-700'
                      >
                        Stop Order
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label
                      htmlFor='stopLoss'
                      className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                    >
                      <Shield className='h-4 w-4 text-red-500' />
                      Stop Loss
                    </Label>
                    <Badge variant='outline' className='text-xs'>
                      Optional
                    </Badge>
                  </div>
                  <Input
                    id='stopLoss'
                    type='number'
                    step='0.0001'
                    placeholder='e.g., 1.1000'
                    value={tradeForm.stopLoss || ''}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        stopLoss: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'
                  />
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label
                      htmlFor='takeProfit'
                      className='text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2'
                    >
                      <Target className='h-4 w-4 text-green-500' />
                      Take Profit
                    </Label>
                    <Badge variant='outline' className='text-xs'>
                      Optional
                    </Badge>
                  </div>
                  <Input
                    id='takeProfit'
                    type='number'
                    step='0.0001'
                    placeholder='e.g., 1.1100'
                    value={tradeForm.takeProfit || ''}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        takeProfit: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className='dark:bg-gray-800 dark:border-gray-600 dark:text-white h-11'
                  />
                </div>
              </div>

              <div className='flex gap-4 pt-4'>
                <Button
                  onClick={handleCreateTrade}
                  disabled={isTrading || !tradeForm.symbol || !tradeForm.volume}
                  className={`flex-1 h-12 text-lg font-semibold transition-all duration-200 ${
                    tradeForm.type === 'BUY'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800'
                  }`}
                >
                  {isTrading ? (
                    <RefreshCw className='h-5 w-5 mr-2 animate-spin' />
                  ) : tradeForm.type === 'BUY' ? (
                    <ArrowUp className='h-5 w-5 mr-2' />
                  ) : (
                    <ArrowDown className='h-5 w-5 mr-2' />
                  )}
                  {isTrading
                    ? 'Placing Order...'
                    : `${tradeForm.type} ${tradeForm.symbol.replace('_', '/')}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='positions' className='space-y-4'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Activity className='h-5 w-5 text-blue-500' />
                Open Positions
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Manage your active trading positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse border rounded-lg p-4 border-gray-200 dark:border-gray-700'
                    >
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              ) : positions.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground dark:text-gray-400'>
                  <Target className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>No open positions</p>
                  <p className='text-sm'>
                    Create your first trade to get started
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className='border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <Badge
                            className={`${
                              position.type === 'BUY'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {position.type}
                          </Badge>
                          <div>
                            <div className='font-medium text-gray-900 dark:text-white'>
                              {position.symbol}
                            </div>
                            <div className='text-sm text-muted-foreground dark:text-gray-400'>
                              {position.volume} lots @ {position.entry}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          <div className='text-right'>
                            <div
                              className={`font-medium ${
                                position.profit >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {formatCurrency(position.profit)}
                            </div>
                            <div className='text-sm text-muted-foreground dark:text-gray-400'>
                              Current: {position.current}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCloseTrade(position.id)}
                            size='sm'
                            variant='outline'
                            className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                          >
                            <X className='h-4 w-4' />
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='orders' className='space-y-4'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Clock className='h-5 w-5 text-yellow-500' />
                Pending Orders
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Monitor and manage pending orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse border rounded-lg p-4 border-gray-200 dark:border-gray-700'
                    >
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground dark:text-gray-400'>
                  <Clock className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>No pending orders</p>
                  <p className='text-sm'>
                    All orders have been executed or expired
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className='border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-700 transition-colors'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <Badge
                            variant='outline'
                            className='dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                          >
                            {order.type}
                          </Badge>
                          <div>
                            <div className='font-medium text-gray-900 dark:text-white'>
                              {order.symbol}
                            </div>
                            <div className='text-sm text-muted-foreground dark:text-gray-400'>
                              {order.volume} lots @ {order.price}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          <div className='text-right'>
                            <div className='text-sm text-muted-foreground dark:text-gray-400'>
                              Expiry: {order.expiry}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCancelOrder(order.id)}
                            size='sm'
                            variant='outline'
                            className='dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                          >
                            <X className='h-4 w-4' />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='history' className='space-y-4'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                <Shield className='h-5 w-5 text-purple-500' />
                Trade History
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                Recent completed trades and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse border rounded-lg p-4 border-gray-200 dark:border-gray-700'
                    >
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                    </div>
                  ))}
                </div>
              ) : trades.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground dark:text-gray-400'>
                  <Shield className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>No trade history</p>
                  <p className='text-sm'>Completed trades will appear here</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {trades.map((trade) => (
                    <div
                      key={trade.id}
                      className='border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transition-colors'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <Badge
                            className={`${
                              trade.type === 'BUY'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {trade.type}
                          </Badge>
                          <div>
                            <div className='font-medium text-gray-900 dark:text-white'>
                              {trade.symbol}
                            </div>
                            <div className='text-sm text-muted-foreground dark:text-gray-400'>
                              {trade.volume} lots | {trade.entry} → {trade.exit}
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div
                            className={`font-medium ${
                              trade.profit >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {formatCurrency(trade.profit)}
                          </div>
                          <div className='text-sm text-muted-foreground dark:text-gray-400'>
                            {trade.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
