import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationCenter from '../notifications/NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 pt-20">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        <NotificationCenter />
      </div>
    </div>
  );
};

export default Layout;