import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Clock, Settings, X, ExternalLink, FilePlus } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
            <span className="text-lg font-bold text-gray-900">LabTrack</span>
          </Link>
          
          <button
            type="button"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={onClose}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            
            <li>
              <Link
                to="/upload"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive('/upload') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={onClose}
              >
                <Upload className="mr-3 h-5 w-5" />
                Upload Protocol
              </Link>
            </li>
            
            <li>
              <Link
                to="#"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <Clock className="mr-3 h-5 w-5" />
                Experiment History
              </Link>
            </li>
            
            <li>
              <Link
                to="#"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/upload"
              className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              onClick={onClose}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              New Experiment
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;