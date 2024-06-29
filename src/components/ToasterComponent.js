'use client';

import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from "react-icons/io5";

const ToasterComponent = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 5000,
        success: {
          icon: '🎉',
        },
      }}
    >
      {(t) => (
        <AnimatePresence>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {t.type === 'success' && <IoCheckmarkCircle className="h-10 w-10 text-green-500" />}
                  {t.type === 'error' && <IoCloseCircle className="h-10 w-10 text-red-500" />}
                  {t.type === 'loading' && <IoInformationCircle className="h-10 w-10 text-blue-500" />}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {t.type === 'success' && 'Success!'}
                    {t.type === 'error' && 'Error!'}
                    {t.type === 'loading' && 'Info'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{t.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Toaster>
  );
};

export default ToasterComponent;