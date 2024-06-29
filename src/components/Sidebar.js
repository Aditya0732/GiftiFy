'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaHome, FaChartBar, FaGift, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Loader from './Loader';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome size={22} /> },
    { name: 'Events', path: '/events', icon: <FaGift size={22} /> },
    { name: 'Contributions', path: '/contributions', icon: <IoWalletOutline size={22} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar size={22} /> },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-[300px] bg-gradient-to-b from-white to-orange-50 shadow-lg flex flex-col justify-between h-full p-6 rounded-r-2xl'
    >
      {isSigningOut && <Loader />}
      <div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=' mb-12 '
        >
          <Link href='/' className='cursor-pointer flex items-center gap-3'>
            <div className='p-2 rounded-xl shadow-md bg-gradient-to-br from-orange-200 to-orange-100'>
              <Image src='/logo.svg' alt='mainlogo' width={40} height={40} className="rounded-lg" />
            </div>
            <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FF4500]'>
              GiftiFy
            </h1>
          </Link>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='flex items-center gap-4 mb-12 bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-xl shadow-inner'
        >
          <div className='rounded-full overflow-hidden w-[60px] h-[60px] border-4 border-white shadow-md'>
            <Image
              src='https://images.unsplash.com/photo-1563396983906-b3795482a59a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='profilePic'
              width={60}
              height={60}
              className='object-cover w-full h-full'
            />
          </div>
          <div>
            <h2 className='font-semibold text-lg text-gray-800'>{session?.user?.name}</h2>
            <p className='text-sm text-[#FFA500] font-medium'>Premium Member</p>
          </div>
        </motion.div>

        <nav className='space-y-3'>
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <Link href={item.path}>
                <div
                  className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer
                    ${pathname === item.path
                      ? 'bg-gradient-to-r from-[#FFA500] to-[#FF4500] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 hover:scale-105'}`}
                >
                  <span>{item.icon}</span>
                  <h1 className='font-medium'>{item.name}</h1>
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className='space-y-3 mt-6'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-3 w-full py-3 px-4 text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 rounded-xl transition-all duration-300'
          >
            <FaCog size={22} />
            <span>Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            disabled={isSigningOut}
            className='flex items-center gap-3 w-full py-3 px-4 text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 rounded-xl transition-all duration-300'
          >
            {isSigningOut ? (
              <>
                <FaSignOutAlt size={22} />
                <span>Signing Out</span>
              </>
            ) : (
              <>
                <FaSignOutAlt size={22} />
                <span>Sign Out</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}