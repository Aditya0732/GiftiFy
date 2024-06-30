import React from 'react';
import { motion } from 'framer-motion';
import { IoInformationCircleOutline, IoCloudOfflineOutline } from 'react-icons/io5';

const NoDataCard = ({ message }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        className="text-6xl text-blue-500 mb-4"
        variants={childVariants}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <IoCloudOfflineOutline />
      </motion.div>
      <motion.h3
        variants={childVariants}
        className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
      >
        No Data Available
      </motion.h3>
      <motion.p
        variants={childVariants}
        className="text-lg text-gray-600 mb-4"
      >
        {message}
      </motion.p>
      <motion.div
        variants={childVariants}
        className="text-sm text-blue-500 flex items-center"
      >
        <IoInformationCircleOutline className="mr-1" />
        Check back later for updates
      </motion.div>
    </motion.div>
  );
};

export default NoDataCard;