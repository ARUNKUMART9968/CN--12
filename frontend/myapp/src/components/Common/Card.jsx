import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-md p-6 transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
