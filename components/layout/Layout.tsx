'use client';

import React from 'react';
import Header from './Header';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4'>
          <div className='mb-4 flex items-center gap-2'>
            <SidebarTrigger className='h-9 w-9' />
            <div className='h-6 w-px bg-border' />
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
