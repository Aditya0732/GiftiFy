import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoCashOutline, IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const SendMoneyModal = ({ isOpen, onClose, event, onPaymentSuccess }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      initiatePayment(amount);
    }
  };

  const initiatePayment = (amount) => {
    const options = {
      key: "rzp_test_p6DLb3vUhP1H9p",
      amount: amount * 100,
      currency: "INR",
      name: "Event Contribution",
      description: `Contribution for ${event.name}`,
      handler: function (response) {
        onPaymentSuccess(event._id, amount, response.razorpay_payment_id);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#8B5CF6"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-800">Contribute</h2>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="text-purple-600 hover:text-purple-800"
              >
                <IoCloseOutline size={28} />
              </motion.button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">{event.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <IoCalendarOutline className="mr-2" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <IoLocationOutline className="mr-2" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUserFriends className="mr-2" />
                <span>{event.guests.length} guests</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-purple-700 mb-2">
                  Contribution Amount (INR)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 flex items-center justify-center shadow-lg"
              >
                <IoCashOutline className="mr-2" size={20} />
                Proceed to Payment
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendMoneyModal;