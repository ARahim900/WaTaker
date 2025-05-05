import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeView, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: 'zones',
      name: 'Zone Analysis',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 3h-7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 10h-3"></path>
          <path d="M10 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 13H5"></path>
        </svg>
      ),
    },
    {
      id: 'types',
      name: 'Type Analysis',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="2"></circle>
          <circle cx="20" cy="21" r="2"></circle>
          <path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path>
        </svg>
      ),
    },
    {
      id: 'losses',
      name: 'Loss Analysis',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-16 md:w-64 bg-primary-900 text-white overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="p-4 hidden md:block">
          <h2 className="text-lg font-semibold truncate">Navigation</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center w-full p-2 rounded-md transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-primary-700'
                      : 'hover:bg-primary-800'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {item.icon}
                  </div>
                  <span className="ml-3 hidden md:block">{item.name}</span>
                  
                  {activeView === item.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute right-0 w-1 h-8 bg-white rounded-l-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 hidden md:block">
          <div className="bg-primary-800 rounded-lg p-3">
            <h3 className="text-sm font-medium">Need Help?</h3>
            <p className="text-xs text-gray-300 mt-1">
              Check the documentation or contact support for assistance.
            </p>
            <button className="mt-2 text-xs bg-primary-700 hover:bg-primary-600 py-1 px-2 rounded">
              View Docs
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
