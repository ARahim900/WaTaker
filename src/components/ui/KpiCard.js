import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

// KPI Card component for displaying key metrics with animation
const KpiCard = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  trend = null, 
  gradient = false, 
  className = '',
  delay = 0 
}) => {
  // Format value for better readability
  const formattedValue = typeof value === 'number' 
    ? value >= 1000 
      ? (value / 1000).toFixed(1) + 'k' 
      : value.toLocaleString()
    : value;
  
  // Determine trend color and icon
  const getTrendBadge = () => {
    if (trend === null) return null;
    
    const isPositive = trend > 0;
    
    // For loss metrics, positive trend is bad and negative is good
    const isLossMetric = title.toLowerCase().includes('loss');
    const isBad = isLossMetric ? isPositive : !isPositive;
    
    const badgeColor = isBad 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
    
    const trendIcon = isPositive ? (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3 w-3" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M12 7a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8.414l-4.293 4.293a1 1 0 0 1-1.414 0L8 10.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l5-5a1 1 0 0 1 1.414 0L11 10.586 14.586 7H12z" 
          clipRule="evenodd" 
        />
      </svg>
    ) : (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3 w-3" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M12 13a1 1 0 1 0 0 2h5a1 1 0 0 0 1-1v-5a1 1 0 1 0-2 0v2.586l-4.293-4.293a1 1 0 0 0-1.414 0L8 9.586l-4.293-4.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0L11 9.414 14.586 13H12z" 
          clipRule="evenodd" 
        />
      </svg>
    );
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
        {trendIcon}
        <span className="ml-1">
          {Math.abs(trend).toFixed(1)}%
        </span>
      </span>
    );
  };
  
  return (
    <Card 
      gradient={gradient} 
      className={className}
      delay={delay}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm ${gradient ? 'text-gray-100' : 'text-gray-500'}`}>{title}</p>
          <div className="flex items-end mt-1">
            <motion.h3 
              className={`text-2xl font-bold ${gradient ? 'text-white' : 'text-gray-800'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: (delay * 0.1) + 0.2,
                type: 'spring',
                stiffness: 150 
              }}
            >
              {formattedValue}
            </motion.h3>
            {unit && <span className={`ml-1 mb-1 text-sm ${gradient ? 'text-gray-200' : 'text-gray-500'}`}>{unit}</span>}
          </div>
          {trend !== null && (
            <div className="mt-2">
              {getTrendBadge()}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-full ${gradient ? 'bg-white/10' : 'bg-gray-100'}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default KpiCard;
