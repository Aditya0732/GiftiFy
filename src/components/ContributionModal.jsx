'use client';

import { useState, useEffect } from 'react';
import { IoClose, IoAddCircleOutline, IoCalendarOutline, IoLocationOutline, IoPeopleOutline } from "react-icons/io5";
import { useGetEventGuestsQuery, useAddContributionMutation } from '@/store/api';
import { motion, AnimatePresence } from 'framer-motion';
import useToast from '@/hooks/useToast';

export default function ContributionModal({ isOpen, onClose, event }) {
    const eventId = event?._id;
    const { data: guests, isLoading } = useGetEventGuestsQuery(eventId, {
        skip: !eventId
    });
    const [addContribution, { isLoading: isAdding }] = useAddContributionMutation();
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [amount, setAmount] = useState('');
    const { showSuccessToast } = useToast();

    const handleAddContribution = async (guestId) => {
        if (!amount) return;
        try {
            await addContribution({
                eventId,
                contributionData: {
                    guestId,
                    amount: parseFloat(amount),
                },
            }).unwrap();
            setAmount('');
            setSelectedGuest(null);
            showSuccessToast("Contributions added successfully!")
        } catch (error) {
            console.error('Failed to add contribution:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-indigo-800">Guest Contributions</h2>
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
                                <IoClose size={28} />
                            </button>
                        </div>

                        <div className="bg-white bg-opacity-60 rounded-lg p-4 mb-6 shadow-md">
                            <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{event.name}</h3>
                            <div className="flex items-center space-x-4 text-gray-700">
                                <div className="flex items-center">
                                    <IoCalendarOutline className="mr-2" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <IoLocationOutline className="mr-2" />
                                    <span>{event.venue}</span>
                                </div>
                                <div className="flex items-center">
                                    <IoPeopleOutline className="mr-2" />
                                    <span>{guests?.length || 0} Guests</span>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {guests?.map((guest) => (
                                    <motion.div
                                        key={guest._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <h3 className="text-xl font-semibold text-indigo-800 mb-2">{guest.name}</h3>
                                        <p className="text-sm text-gray-600">{guest.email}</p>
                                        <p className="text-sm text-gray-600">{guest.phone}</p>
                                        <p className="text-sm text-gray-600 mb-3">{guest.city}</p>
                                        <p className="text-lg font-bold text-green-600 mb-3">
                                            Total Contribution: ${guest.totalContribution.toFixed(2)}
                                        </p>
                                        {selectedGuest === guest._id ? (
                                            <div className="mt-2">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    className="w-full p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={() => handleAddContribution(guest._id)}
                                                    className="mt-3 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    disabled={isAdding}
                                                >
                                                    {isAdding ? 'Adding...' : 'Confirm'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedGuest(guest._id)}
                                                className="mt-3 flex items-center justify-center w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <IoAddCircleOutline size={24} className="mr-2" />
                                                Add Contribution
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}