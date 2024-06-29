'use client'

import React, { useState, useMemo } from 'react';
import { IoCalendarOutline, IoLocationOutline, IoPersonOutline, IoAddCircleOutline, IoCashOutline, IoInformationCircleOutline, IoGiftOutline, IoSearchOutline, IoFilterOutline, IoTimeOutline, IoChevronBackOutline, IoChevronForwardOutline, IoCloseCircleOutline } from "react-icons/io5";
import EventDetailsModal from '../../components/EventDetailsModal';
import SendMoneyModal from '../../components/SendMoneyModal';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useAddContributionMutation, useGetEventsQuery } from '@/store/api';
import ContributionModal from '@/components/ContributionModal';
import NoEventComponent from '@/components/NoEventComponent';

const AllEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeSort, setTimeSort] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(5);
  const [addContribution] = useAddContributionMutation();
  const { data: events, isLoading: eventsLoading } = useGetEventsQuery();
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  const isUserHost = (event) => event.host._id === session?.user?.id;

  const filteredEvents = useMemo(() => {
    let filtered = events?.filter(event => {
      const matchesSearch = Object.values(event).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter =
        filters === 'all' ||
        (filters === 'hosted' && isUserHost(event)) ||
        (filters === 'not-hosted' && !isUserHost(event));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && event.status !== 'closed') ||
        (statusFilter === 'closed' && event.status === 'closed');
      return matchesSearch && matchesFilter && matchesStatus;
    });

    filtered?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return timeSort === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [events, searchTerm, filters, statusFilter, timeSort, session]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredEvents?.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage, eventsPerPage]);

  const totalPages = Math.ceil(filteredEvents?.length / eventsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEventsPerPageChange = (newEventsPerPage) => {
    setEventsPerPage(newEventsPerPage);
    setCurrentPage(1);
  };

  const handleViewDetails = (event) => {
    setShowEventDetails(true);
    setSelectedEvent(event);
  };

  const handleSendMoney = (event) => {
    setSelectedEventId(event._id);
    setSelectedEvent(event);
    setIsSendMoneyModalOpen(true);
  };

  const handleAddContribution = (event) => {
    setSelectedEventId(event._id);
    setSelectedEvent(event);
    setIsContributionModalOpen(true);
  };

  const closeContributionModal = () => {
    setIsContributionModalOpen(false);
    setSelectedEventId(null);
  }

  const handlePaymentSuccess = async (eventId, amount, paymentId) => {
    try {
      await addContribution({
        eventId,
        contributionData: {
          guestId: session.user.id,
          amount: parseFloat(amount),
          paymentId
        }
      }).unwrap();
      setIsSendMoneyModalOpen(false);
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const giftIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="mt-6 px-5 md:px-0 max-w-6xl mx-auto py-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-gray-800 flex items-center justify-center"
      >
        <IoGiftOutline className="mr-2 text-4xl text-purple-500" />
        All Events
      </motion.h2>

      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300"
            />
            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filters === 'all' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('hosted')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filters === 'hosted' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Hosting
              </button>
              <button
                onClick={() => setFilter('not-hosted')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filters === 'not-hosted' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Attending
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <IoFilterOutline className="text-xl" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${statusFilter === 'all' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${statusFilter === 'active' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${statusFilter === 'closed' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Closed
              </button>
            </div>

            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setTimeSort('latest')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${timeSort === 'latest' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Latest First
              </button>
              <button
                onClick={() => setTimeSort('oldest')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${timeSort === 'oldest' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-gray-600">
          Showing {Math.min((currentPage - 1) * eventsPerPage + 1, filteredEvents?.length)} - {Math.min(currentPage * eventsPerPage, filteredEvents?.length)} of {filteredEvents?.length} results
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Events per page:</span>
          <select
            value={eventsPerPage}
            onChange={(e) => handleEventsPerPageChange(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {paginatedEvents?.length > 0 ? (
        <div className="space-y-6">
          {paginatedEvents?.map((event, index) => {
            const userIsHost = isUserHost(event);
            const isEventClosed = event.status === 'closed';
            return (
              <motion.div
                key={event._id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`w-full bg-gradient-to-r ${isEventClosed
                  ? 'from-gray-400 to-gray-600'
                  : userIsHost
                    ? 'from-blue-400 to-purple-500'
                    : 'from-green-400 to-blue-500'
                  } rounded-lg shadow-lg overflow-hidden transition-all duration-300`}
              >
                <div className="p-6 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                        {event.name}
                        <motion.div
                          variants={giftIconVariants}
                          initial="hidden"
                          animate="visible"
                          className="ml-2"
                        >
                          {isEventClosed ? (
                            <IoCloseCircleOutline className="text-red-500" />
                          ) : (
                            <IoGiftOutline className="text-purple-500" />
                          )}
                        </motion.div>
                      </h3>
                      <div className="flex items-center text-gray-600 mb-1">
                        <IoCalendarOutline className="mr-2" />
                        <p>{formatDate(event.date)}</p>
                      </div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <IoLocationOutline className="mr-2" />
                        <p>{event.venue}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IoPersonOutline className="mr-2" />
                        <p>Hosted by: {event.host.name}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                      {!isEventClosed && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => userIsHost ? handleAddContribution(event) : handleSendMoney(event)}
                          className={`w-full md:w-auto px-6 py-3 rounded-full text-white transition-colors duration-200 flex items-center justify-center ${userIsHost ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          {userIsHost ? (
                            <>
                              <IoAddCircleOutline className="mr-2" /> Add Contribution
                            </>
                          ) : (
                            <>
                              <IoCashOutline className="mr-2" /> Send Money
                            </>
                          )}
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(event)}
                        className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                      >
                        <IoInformationCircleOutline className="mr-2" /> Details
                      </motion.button>
                    </div>
                  </div>
                </div>
                {isEventClosed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-500 bg-opacity-20 text-red-700 px-6 py-2 text-sm font-semibold"
                  >
                    This event is closed
                  </motion.div>
                )}
                {userIsHost && !isEventClosed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white bg-opacity-20 text-white px-6 py-2 text-sm"
                  >
                    You are hosting this event
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <NoEventComponent/>
      )}

      {totalPages > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
          >
            <IoChevronBackOutline className="text-xl" />
          </motion.button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
          >
            <IoChevronForwardOutline className="text-xl" />
          </motion.button>
        </div>
      )}
      {selectedEvent && showEventDetails && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
            setShowEventDetails(false);
          }}
          currentUserId={session?.user?.id}
        />
      )}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={closeContributionModal}
        event={selectedEvent}
      />
      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
        event={selectedEvent}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AllEvents;