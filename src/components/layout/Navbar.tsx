import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, BellRing, FlaskRound as Flask } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <button
            type="button"
            className="mr-2 rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <Flask className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">LabTrack</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <BellRing className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-600"></span>
          </button>
          
          <div className="h-8 w-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-medium">
            PR
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;