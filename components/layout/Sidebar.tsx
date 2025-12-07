'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  BarChart3,
  Settings,
  Shield,
  Newspaper,
  FileText,
  AlertTriangle,
  Brain,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AI Analysis', href: '/dashboard/analysis', icon: Brain },
  { name: 'Trading', href: '/dashboard/trading', icon: TrendingUp },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Risk Management', href: '/dashboard/risk-monitoring', icon: Shield },
  { name: 'News & Events', href: '/dashboard/news', icon: Newspaper },
  { name: 'System Logs', href: '/dashboard/logs', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='w-64 bg-slate-900 text-white h-screen flex flex-col'>
      <div className='p-6'>
        <div className='flex items-center space-x-2 mb-8'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
            <AlertTriangle className='w-5 h-5' />
          </div>
          <span className='text-lg font-semibold'>Command Center</span>
        </div>

        <nav className='space-y-2'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className='w-5 h-5' />
                <span className='font-medium'>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='mt-auto p-6 border-t border-gray-700'>
        <div className='bg-gray-800 p-4 rounded-lg'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium'>System Status</span>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          </div>
          <div className='text-xs text-gray-400'>All systems operational</div>
        </div>
      </div>
    </div>
  );
}
