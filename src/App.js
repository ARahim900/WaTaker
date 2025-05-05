import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sampleData } from './data/sampleData';
import { getAvailablePeriods } from './utils/dataUtils';
import Dashboard from './components/Dashboard';
import ZoneDetails from './components/ZoneDetails';
import TypeDetails from './components/TypeDetails';
import LossDetails from './components/LossDetails';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [waterData, setWaterData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load and process data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use sample data
        setWaterData(sampleData);
        
        // Get available periods
        const availablePeriods = getAvailablePeriods(sampleData);
        setPeriods(availablePeriods);
        
        // Set default selected period to the most recent one
        if (availablePeriods.length > 0) {
          setSelectedPeriod(availablePeriods[availablePeriods.length - 1]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle period selection
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };
  
  // Handle navigation
  const handleNavigation = (view) => {
    setActiveView(view);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Loading WaTaker...</h2>
          <p className="text-gray-500 mt-2">Preparing your water data analysis</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        periods={periods} 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={handlePeriodChange} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={handleNavigation} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeView === 'dashboard' && (
              <Dashboard 
                waterData={waterData} 
                selectedPeriod={selectedPeriod} 
              />
            )}
            
            {activeView === 'zones' && (
              <ZoneDetails 
                waterData={waterData} 
                selectedPeriod={selectedPeriod} 
              />
            )}
            
            {activeView === 'types' && (
              <TypeDetails 
                waterData={waterData} 
                selectedPeriod={selectedPeriod} 
              />
            )}
            
            {activeView === 'losses' && (
              <LossDetails 
                waterData={waterData} 
                selectedPeriod={selectedPeriod} 
              />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
