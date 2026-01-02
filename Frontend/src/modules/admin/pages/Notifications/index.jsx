import React from 'react';
import { motion } from 'framer-motion';

const Notifications = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Notifications management page coming soon...</p>
      </div>
    </motion.div>
  );
};

export default Notifications;

