import React, { useState } from 'react';
import { IoClose, IoPersonCircleOutline, IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import { useCloseEventMutation } from '@/store/api';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailsModal = ({ event, isOpen, onClose, currentUserId }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [closeEvent, { isLoading: isClosingEvent }] = useCloseEventMutation();
    const isHost = currentUserId === event.host._id;
    if (!isOpen) return null;
    const isEventClosed = event.status === 'closed';

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCloseEvent = async () => {
        setShowConfirmation(true);
    };

    const confirmCloseEvent = async () => {
        try {
            await closeEvent(event._id).unwrap();
            setShowConfirmation(false);
            onClose();
        } catch (error) {
            console.error('Failed to close event:', error);
        }
    };

    const cancelCloseEvent = () => {
        setShowConfirmation(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold">{event.name}</h2>
                                <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                                    <IoClose size={28} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center space-x-4">
                                <div className="flex items-center">
                                    <IoCalendarOutline className="mr-2" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center">
                                    <IoLocationOutline className="mr-2" />
                                    <span>{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex-grow overflow-y-auto p-6 space-y-6"
                        >
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">Host</h3>
                                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
                                    <p className="text-lg font-medium text-gray-800">{event.host.name}</p>
                                    <p className="text-gray-600">{event.host.email}</p>
                                    <p className="text-gray-600">{event.host.phone}</p>
                                    <p className="text-gray-600">{event.host.city}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">Guests</h3>
                                {event.guests && event.guests.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {event.guests.map((guest, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg"
                                            >
                                                <div className="flex items-center mb-2">
                                                    <IoPersonCircleOutline className="text-indigo-600 mr-2" size={24} />
                                                    <p className="text-lg font-medium text-gray-800">{guest.name}</p>
                                                </div>
                                                <p className="text-gray-600">{guest.email}</p>
                                                <p className="text-gray-600">{guest.phone}</p>
                                                <p className="text-gray-600">{guest.city}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                                        <p className="text-gray-600">No guests have been added to this event yet.</p>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">Contributions</h3>
                                {event.contributions && event.contributions.length > 0 ? (
                                    <div className="space-y-4">
                                        {event.contributions.map((contribution, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-lg font-medium text-gray-800">{contribution.contributor.name}</p>
                                                    <p className="text-xl font-bold text-green-600">${contribution.amount.toFixed(2)}</p>
                                                </div>
                                                <p className="text-gray-600">{contribution.contributor.email}</p>
                                                <p className="text-gray-600">{formatDate(contribution.date)}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                                        <p className="text-gray-600">No contributions have been made to this event yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>

                        {isHost && !isEventClosed && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="p-6 bg-gray-100"
                            >
                                <button
                                    onClick={handleCloseEvent}
                                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors text-lg font-semibold"
                                    disabled={isClosingEvent}
                                >
                                    {isClosingEvent ? 'Closing Event...' : 'Close Event'}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Confirm Event Closure</h3>
                        <p className="mb-6">Are you sure you want to close this event? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelCloseEvent}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCloseEvent}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Close Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EventDetailsModal;