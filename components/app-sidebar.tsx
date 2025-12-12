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
import { useSession } from 'next-auth/react';
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
    url: '/dashboard/svr-rating',
    icon: HardDrive, // HardDrive for storage / data
  },
  {
    title: 'Decision Tree Regressor',
    url: '/dashboard/decission-tree',
    icon: GitBranch, // Branch for tree
  },
  {
    title: 'K-Neighbors Regressor',
    url: '/dashboard/neighbour-rating',
    icon: Layers, // Layers for neighbors / clusters
  },
  {
    title: 'Random Forest Regressor',
    url: '/dashboard/random-forest-rating',
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
    url: '/dashboard/support-vector-classifier',
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
const car_price = [
  {
    title: 'Linear Regression',
    url: '/dashboard/linear-regression-car-price',
    icon: Cpu, // CPU for linear computation
  },
  {
    title: 'Support Vector Regressor',
    url: '/dashboard/svr-rating-car-price',
    icon: HardDrive, // HardDrive for storage / data
  },
  {
    title: 'Decision Tree Regressor',
    url: '/dashboard/decission-tree-car-price',
    icon: GitBranch, // Branch for tree
  },
  {
    title: 'K-Neighbors Regressor',
    url: '/dashboard/neighbour-car-price',
    icon: Layers, // Layers for neighbors / clusters
  },
  {
    title: 'Random Forest Regressor',
    url: '/dashboard/random-forest-rating-car-price',
    icon: Activity, // Activity for ensemble / randomness
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
  const { data: session, status } = useSession();
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

        <SidebarSeparator className='my-4 bg-gray-200/50 dark:bg-gray-700' />

        <SidebarGroup className='mt-6'>
          <SidebarGroupLabel className='text-xs font-medium text-gray-500 uppercase tracking-wider pl-3 mb-2'>
            Car Price
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {car_price.map((item) => {
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
      </SidebarContent>

      <SidebarFooter className='px-3 pb-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='rounded-xl w-full transition-all hover:bg-muted justify-start'
            >
              <div className='flex items-center gap-3 py-2'>
                {/* User Avatar Icon */}
                <img
                  src={session?.user?.image || '/default-user.png'}
                  className='w-8 h-8 rounded-full border flex-shrink-0'
                  alt='user'
                />

                {/* Text — auto hidden on collapse */}
                <div className='flex flex-col '>
                  <span className='font-medium text-sm'>
                    {session?.user?.name || 'User Name'}
                  </span>
                  <span className='text-xs  text-muted-foreground'>
                    {session?.user?.email || 'user@example.com'}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
