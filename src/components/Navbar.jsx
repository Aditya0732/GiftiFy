'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaHome, FaCalendarAlt, FaHandsHelping, FaChartBar, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar({ className }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Events', path: '/events', icon: FaCalendarAlt },
    { name: 'Contributions', path: '/contributions', icon: FaHandsHelping },
    { name: 'Dashboard', path: '/dashboard', icon: FaChartBar },
  ];

  return (
    <nav
      className={`z-50 transition-all rounded-b-md duration-300 ease-in-out w-full ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-md'
      } ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-around"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 },
                  }}
                  className="w-full h-0.5 bg-indigo-600 block"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-full h-0.5 bg-indigo-600 block"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 },
                  }}
                  className="w-full h-0.5 bg-indigo-600 block"
                ></motion.span>
              </motion.div>
            </button>
          </div>
          <div className="hidden md:block">
            {/* <h1 className='text-2xl font-bold text-indigo-600'>Logo</h1> */}
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition ease-in-out duration-300 group">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white group-hover:animate-ping"></span>
            </button>
            <button className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition ease-in-out duration-300 group">
              <FaEnvelope className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white group-hover:animate-ping"></span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white rounded-b-lg overflow-hidden absolute w-full shadow-lg"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100">
              <div className="flex items-center space-x-4">
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
                  <h2 className="text-lg font-semibold text-gray-800">{session?.user?.name}</h2>
                  <p className="text-sm text-gray-600">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="px-4 py-3 hover:bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 transition-all duration-300 ease-in-out flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-gray-700 hover:text-indigo-600">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className='space-y-3 mt-3 bg-white'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-3 w-full py-3 px-4 text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 transition-all duration-300'
              >
                <FaCog size={22} className="h-5 w-5 text-indigo-600"/>
                <span className='font-semibold text-gray-700'>Settings</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                disabled={isSigningOut}
                className='flex items-center gap-3 w-full py-3 px-4 text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 transition-all duration-300'
              >
                {isSigningOut ? (
                  <>
                    <FaSignOutAlt size={22} className="h-5 w-5 text-indigo-600"/>
                    <span className='font-semibold text-gray-700'>Signing Out</span>
                  </>
                ) : (
                  <>
                    <FaSignOutAlt size={22} className="h-5 w-5 text-indigo-600"/>
                    <span className='font-semibold text-gray-700'>Sign Out</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}