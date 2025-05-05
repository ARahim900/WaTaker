import React from 'react';
import { motion } from 'framer-motion';

// Card component with optional gradient background
const Card = ({ 
  children, 
  title, 
  gradient = false, 
  className = '', 
  icon = null,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={`${gradient ? 'card-gradient' : 'card'} ${className}`}
    >
      {title && (
        <div className={`px-4 py-3 border-b ${gradient ? 'border-white/10' : 'border-gray-100'} flex items-center`}>
          {icon && <span className="mr-2">{icon}</span>}
          <h3 className={`font-medium ${gradient ? 'text-white' : 'text-gray-700'}`}>{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
