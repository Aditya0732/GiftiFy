import React from 'react';
import { motion } from 'framer-motion';
import { IoTrophyOutline, IoStarOutline, IoCashOutline } from 'react-icons/io5';

const RankingCard = ({ rank, name, amount, isContributor, maxAmount }) => {
  const Icon = isContributor ? IoTrophyOutline : IoStarOutline;
  const percentage = (amount / maxAmount) * 100;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 relative overflow-hidden"
    >
      <motion.div 
        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      <motion.div variants={childVariants} className="flex items-center mb-4">
        <div className={`text-3xl font-bold mr-3 ${rank <= 3 ? 'text-yellow-500' : 'text-blue-500'}`}>
          #{rank}
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold truncate">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {name}
            </span>
          </h3>
        </div>
        <motion.div 
          className="text-4xl text-blue-500"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Icon />
        </motion.div>
      </motion.div>

      <motion.div variants={childVariants} className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Total {isContributor ? 'Received' : 'Contribution'}</div>
        <motion.div 
          className="text-lg font-semibold text-green-600 flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.7 }}
        >
          <IoCashOutline className="mr-1" />
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)}
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-4 text-sm text-gray-500 italic"
        variants={childVariants}
      >
        {isContributor 
          ? `${percentage.toFixed(1)}% of highest received`
          : `${percentage.toFixed(1)}% of top contribution`}
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-24 h-24 opacity-10"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Icon className="w-full h-full" />
      </motion.div>
    </motion.div>
  );
};

export default RankingCard;