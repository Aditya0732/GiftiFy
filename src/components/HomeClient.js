'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoAddOutline, IoGiftOutline, IoEyeOutline, IoWalletOutline, IoChevronForward, IoGridOutline } from "react-icons/io5";
import EventForm from './EventForm';
import { useGetEventsQuery } from '@/store/api';
import { ActiveEvents } from './ActiveEvents';
import Navbar from './Navbar';
import Loader from './Loader';

export default function HomeClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldFetchEvents, setShouldFetchEvents] = useState(false);
  const { data: events, isLoading: eventsLoading } = useGetEventsQuery(undefined, { skip: !shouldFetchEvents });

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      localStorage.setItem('userId', session.user.id);
      setShouldFetchEvents(true);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router, session]);

  if (status === 'loading' || eventsLoading) {
    return <Loader/>;
  }

  if (!session) {
    return null;
  }
  
  const cards = [
    {
      title: "Create an Event",
      description: "Start a new gifting event, invite friends, and set up your wishlist. Make your next celebration unforgettable!",
      icon: <IoGiftOutline className="text-white text-3xl" />,
      gradient: "from-blue-400 to-blue-600",
      buttonGradient: "from-pink-500 to-pink-600",
      buttonIcon: <IoAddOutline className="text-white text-2xl" />,
      onClick: () => setIsModalOpen(true),
    },
    {
      title: "View Your Events",
      description: "Check out your ongoing and upcoming events. Keep track of RSVPs, gifts, and all the exciting details!",
      icon: <IoEyeOutline className="text-white text-3xl" />,
      gradient: "from-green-400 to-green-600",
      buttonGradient: "from-yellow-500 to-yellow-600",
      buttonIcon: <IoChevronForward className="text-white text-2xl" />,
      onClick: () => router.push('/events'),
    },
    {
      title: "Contributions Track",
      description: "See your contributions to friends' events and track gifts for your own celebrations. Spread joy effortlessly!",
      icon: <IoWalletOutline className="text-white text-3xl" />,
      gradient: "from-purple-400 to-purple-600",
      buttonGradient: "from-indigo-500 to-indigo-600",
      buttonIcon: <IoChevronForward className="text-white text-2xl" />,
      onClick: () => router.push('/contributions'),
    },
    {
      title: "Dashboard",
      description: "Get a comprehensive overview of your gifting activities, upcoming events, and recent contributions all in one place.",
      icon: <IoGridOutline className="text-white text-3xl" />,
      gradient: "from-orange-400 to-orange-600",
      buttonGradient: "from-teal-500 to-teal-600",
      buttonIcon: <IoChevronForward className="text-white text-2xl" />,
      onClick: () => router.push('/dashboard'),
    },
  ];

  return (
    <div className='w-full px-4 py-8 min-h-screen'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-10 text-gray-800'>Welcome to Your Gifting Hub</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-r ${card.gradient} rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 shadow-lg transform hover:-translate-y-1`}
            >
              <div className='flex gap-3 items-center'>
                <span className="p-2 bg-white bg-opacity-20 rounded-full">{card.icon}</span>
                <h2 className='text-2xl font-bold text-white'>{card.title}</h2>
              </div>
              <p className='text-sm flex-grow text-white'>{card.description}</p>
              <div className='flex justify-end'>
                <button
                  onClick={card.onClick}
                  className={`flex items-center justify-center p-3 w-12 h-12 bg-gradient-to-r ${card.buttonGradient} rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 duration-300 transform hover:-translate-y-1`}
                >
                  {card.buttonIcon}
                </button>
              </div>
            </div>
          ))}
        </div>
        <ActiveEvents events={events || []} />
        <EventForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}