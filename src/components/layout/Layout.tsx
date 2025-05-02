import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="border-t" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm" style={{ color: 'var(--secondary-text)' }}>
            &copy; {new Date().getFullYear()} Document Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 