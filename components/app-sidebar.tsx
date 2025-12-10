'use client';

import * as React from 'react';
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
  Brain,
  Activity,
  Zap,
  LayoutDashboard,
  Bot,
  User,
  PieChart,
  Cpu,
  HardDrive,
  GitBranch,
  Layers,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Users } from 'lucide-react';
import { Crown } from 'lucide-react';
// import { signOut, useSession } from "next-auth/react";

// Menu items.
const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Linear Regression',
    url: '/dashboard/linear-regression',
    icon: Cpu, // CPU for linear computation
  },
  {
    title: 'Support Vector Regressor',
    url: '/dashboard/regressors/support-vector',
    icon: HardDrive, // HardDrive for storage / data
  },
  {
    title: 'Decision Tree Regressor',
    url: '/dashboard/regressors/decision-tree',
    icon: GitBranch, // Branch for tree
  },
  {
    title: 'K-Neighbors Regressor',
    url: '/dashboard/regressors/neighbour',
    icon: Layers, // Layers for neighbors / clusters
  },
  {
    title: 'Random Forest Regressor',
    url: '/dashboard/regressors/random-forest',
    icon: Activity, // Activity for ensemble / randomness
  },
];

const navSecondary = [
  {
    title: 'Logistic Regression',
    url: '/dashboard/logistic-regression',
    icon: Cpu, // CPU for computation
  },
  {
    title: 'Random Forest Classifier',
    url: '/dashboard/random-forest',
    icon: BarChart3, // Ensemble trees visualized as chart
  },
  {
    title: 'K-Neighbors Classifier',
    url: '/dashboard/neighbour',
    icon: Layers, // Layers for neighbors / clusters
  },
  {
    title: 'Support Vector Classifier',
    url: '/dashboard/classifiers/support-vector',
    icon: Shield, // Shield for decision boundary / separation
  },
  {
    title: 'Naive Bayse Classifier',
    url: '/dashboard/naive-bayse',
    icon: GitBranch, // Branch for tree
  },
];

const navConfig = [
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // const { data: session } = useSession();

  // const handleSignOut = () => {
  //   signOut({ callbackUrl: "/" });
  // };

  // Admin navigation items
  const navAdmin = [
    {
      title: 'User Management',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'Admin Dashboard',
      url: '/admin',
      icon: Crown,
    },
  ];

  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='bg-white border-r border-gray-200/50'
    >
      <SidebarHeader className='px-4 pt-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex items-center space-x-3'>
                <div className='w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md'>
                  <img
                    src='/WhatsApp Image 2025-12-07 at 22.36.46_280ec6f8.jpg'
                    alt=''
                  />
                  {/* <Activity className='w-5 h-5 text-white' /> */}
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold text-gray-900'>
                    ModelFlow
                  </span>
                  <span className='truncate text-xs text-gray-500'>
                    Model AI System
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='px-3'>
        <SidebarGroup className='mt-6'>
          <SidebarGroupLabel className='text-xs font-medium text-gray-500 uppercase tracking-wider pl-3 mb-2'>
            Movie Rating
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                          : 'hover:bg-gray-100/70 text-gray-700'
                      }`}
                    >
                      <Link
                        href={item.url}
                        className='flex items-center gap-3 py-3'
                      >
                        <item.icon className='w-5 h-5 flex-shrink-0' />
                        <span className='font-medium'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className='my-4 bg-gray-200/50' />

        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-medium text-gray-500 uppercase tracking-wider pl-3 mb-2'>
            Titanic Survival
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                          : 'hover:bg-gray-100/70 text-gray-700'
                      }`}
                    >
                      <Link
                        href={item.url}
                        className='flex items-center gap-3 py-3'
                      >
                        <item.icon className='w-5 h-5 flex-shrink-0' />
                        <span className='font-medium'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className='my-4 bg-gray-200/50' />

        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-medium text-gray-500 uppercase tracking-wider pl-3 mb-2'>
            Boston Housing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/autonomous/positions'}
                  className={`rounded-xl transition-all ${
                    pathname === '/dashboard/autonomous/positions'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                      : 'hover:bg-gray-100/70 text-gray-700'
                  }`}
                >
                  <Link
                    href='/dashboard/autonomous/positions'
                    className='flex items-center gap-3 py-3'
                  >
                    <TrendingUp className='w-5 h-5 flex-shrink-0' />
                    <span className='font-medium'>Live Positions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/autonomous/history'}
                  className={`rounded-xl transition-all ${
                    pathname === '/dashboard/autonomous/history'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                      : 'hover:bg-gray-100/70 text-gray-700'
                  }`}
                >
                  <Link
                    href='/dashboard/autonomous/history'
                    className='flex items-center gap-3 py-3'
                  >
                    <FileText className='w-5 h-5 flex-shrink-0' />
                    <span className='font-medium'>Trade History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/autonomous/decisions'}
                  className={`rounded-xl transition-all ${
                    pathname === '/dashboard/autonomous/decisions'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                      : 'hover:bg-gray-100/70 text-gray-700'
                  }`}
                >
                  <Link
                    href='/dashboard/autonomous/decisions'
                    className='flex items-center gap-3 py-3'
                  >
                    <Brain className='w-5 h-5 flex-shrink-0' />
                    <span className='font-medium'>Decision Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className='my-4 bg-gray-200/50 dark:bg-gray-700' />

        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-medium text-gray-500 uppercase tracking-wider pl-3 mb-2'>
            Heart Disease
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navConfig.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                          : 'hover:bg-gray-100/70 text-gray-700'
                      }`}
                    >
                      <Link
                        href={item.url}
                        className='flex items-center gap-3 py-3'
                      >
                        <item.icon className='w-5 h-5 flex-shrink-0' />
                        <span className='font-medium'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* {session?.user.role === 'admin' && (
          <>
            <SidebarSeparator className="my-4 bg-gray-200/50 dark:bg-gray-700" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-3 mb-2">
                Administration
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navAdmin.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`rounded-xl transition-all ${
                            isActive
                              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 shadow-sm"
                              : "hover:bg-gray-100/70 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3 py-3"
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )} */}
      </SidebarContent>

      <SidebarFooter className='px-3 pb-4'>
        <div className='space-y-3'>
          {/* Sign Out Button */}
          {/* {session && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="rounded-xl transition-all hover:bg-red-100/70 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 w-full justify-start"
                >
                  <div className="flex items-center gap-3 py-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )} */}

          {/* System Status */}
          <div className='bg-gradient-to-r from-indigo-100/80 to-blue-100/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-200/50 shadow-sm'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-indigo-900'>
                System Status
              </span>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            </div>
            <div className='text-xs text-indigo-700/80'>
              All systems operational
            </div>
            <div className='text-xs text-indigo-700/80 mt-1 flex items-center gap-1'>
              <Zap className='w-3 h-3' />
              Uptime: 48h 23m
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
