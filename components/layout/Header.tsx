'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Bell, Settings, User, LogOut, Activity, Home } from 'lucide-react';
// import { ThemeToggle } from '@/components/ui/theme-toggle';
// import { useAccountData } from '@/hooks/use-account-data';
import { useRouter } from 'next/navigation';

export default function Header() {
  // const { accountData, isLoading, error, lastUpdate } = useAccountData();
  const router = useRouter();

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      // currency: accountData?.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format currency values for mobile (compact)
  const formatCurrencyCompact = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  // Calculate daily P&L percentage
  // const calculatePLPercentage = () => {
  //   if (!accountData) return 0;
  //   const dailyPL = accountData.unrealizedPL;
  //   const balance = accountData.balance;
  //   return balance > 0 ? (dailyPL / balance) * 100 : 0;
  // };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    console.log('logout done');

    router.push('/');
  };

  return (
    <header className='bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50'>
      <div className='flex items-center justify-between gap-2 sm:gap-4'>
        {/* Left Section - Status Indicators */}
        <div className='flex items-center space-x-2 sm:space-x-6 flex-shrink-0'>
          {/* Home button to navigate to root */}
          <button
            onClick={() => router.push('/')}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center'
            aria-label='Go to homepage'
          >
            <Home className='w-5 h-5 text-gray-700' />
          </button>

          <div className='flex items-center space-x-2 sm:space-x-4'>
            {/* Mobile - Simplified status */}
            <div className='md:hidden flex items-center space-x-2'>
              <div className='text-xs text-gray-500'>|</div>
              <div className='text-xs text-gray-700'>
                <span className='font-medium'>
                  {/* {error ? 'OFFLINE' : 'OANDA'} */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Account Info and Controls */}
        <div className='flex items-center space-x-2 sm:space-x-4 flex-shrink-0'>
          {/* Tablet - Compact account info */}
          <div className='hidden md:flex lg:hidden items-center space-x-3 mr-3'>
            <div className='text-right'>
              <div className='text-xs text-gray-500 font-semibold'>Balance</div>
              <div className='text-sm font-bold text-gray-900'>
                {/* {isLoading ? (
                  <span className='animate-pulse'>...</span>
                ) : error ? (
                  <span className='text-red-500'>Error</span>
                ) : (
                  formatCurrency(accountData?.nav || 0)
                )} */}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs text-gray-500 font-semibold'>P&L</div>
              <div
              // className={`text-sm font-bold ${
              //   (accountData?.unrealizedPL || 0) >= 0
              //     ? 'text-green-600 dark:text-green-400'
              //     : 'text-red-600 dark:text-red-400'
              // }`}
              >
                {/* {isLoading ? (
                  <span className='animate-pulse text-gray-500'>...</span>
                ) : error ? (
                  <span className='text-red-500'>Error</span>
                ) : (
                  <>
                    {(accountData?.unrealizedPL || 0) >= 0 ? '+' : ''}
                    {formatCurrency(accountData?.unrealizedPL || 0)}
                  </>
                )} */}
              </div>
            </div>
          </div>

          {/* Mobile - Very compact */}
          <div className='md:hidden flex items-center space-x-2 mr-2'>
            <div className='text-right'>
              <div className='text-xs font-bold text-gray-900'>
                {/* {isLoading ? (
                  <span className='animate-pulse'>...</span>
                ) : error ? (
                  <span className='text-red-500'>Error</span>
                ) : (
                  formatCurrencyCompact(accountData?.nav || 0)
                )} */}
              </div>
              <div
              // className={`text-xs font-bold ${
              //   (accountData?.unrealizedPL || 0) >= 0
              //     ? 'text-green-600 dark:text-green-400'
              //     : 'text-red-600 dark:text-red-400'
              // }`}
              >
                {/* {isLoading ? (
                  <span className='animate-pulse text-gray-500'>...</span>
                ) : error ? (
                  <span className='text-red-500'>Err</span>
                ) : (
                  <>
                    {(accountData?.unrealizedPL || 0) >= 0 ? '+' : ''}
                    {formatCurrencyCompact(accountData?.unrealizedPL || 0)}
                  </>
                )} */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center space-x-1 sm:space-x-2'>
            {/* <ThemeToggle /> */}

            {/* Desktop buttons */}
            <div className='hidden sm:flex items-center space-x-2'>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Bell className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
              </button>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Settings className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
              </button>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <User className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
              </button>
              <button
                onClick={() => handleLogout()}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <LogOut className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
              </button>
            </div>

            {/* Mobile - Essential buttons only */}
            <div className='sm:hidden flex items-center space-x-1'>
              <button className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'>
                <Bell className='w-4 h-4 text-gray-600' />
              </button>
              <button className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'>
                <User className='w-4 h-4 text-gray-600' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
