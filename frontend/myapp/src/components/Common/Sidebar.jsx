import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
      >
        <FiMenu size={24} />
      </button>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 overflow-y-auto lg:static lg:w-64 lg:transform-none"
      >
        <div className="p-4 flex justify-between items-center lg:hidden">
          <h3 className="font-bold text-lg">Menu</h3>
          <button onClick={() => setOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        {children}
      </motion.div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;