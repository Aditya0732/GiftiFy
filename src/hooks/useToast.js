'use client';

import { toast } from 'react-hot-toast';

const useToast = () => {
  const showSuccessToast = (message) => {
    toast.success(message, {
      icon: '🎉',
    });
  };

  return { showSuccessToast };
};

export default useToast;