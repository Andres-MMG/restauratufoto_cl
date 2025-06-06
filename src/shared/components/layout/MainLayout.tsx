import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

type MainLayoutProps = {
  children: ReactNode;
};

/**
 * Main layout component that wraps the app with header and footer
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
