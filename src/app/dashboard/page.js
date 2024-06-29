'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
    IoCalendarOutline,
    IoPeopleOutline,
    IoCashOutline,
    IoLocationOutline,
    IoStatsChartOutline,
    IoOptionsOutline,
    IoTrophyOutline,
    IoWalletOutline
} from "react-icons/io5";
import { api, useGetEventsQuery, useGetContributionsQuery, useGetEventGuestsQuery, useGetUserTotalContributionsQuery, useGetAllContributionsQuery } from '@/store/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { motion } from 'framer-motion';
import NoEventComponent from '@/components/NoEventComponent';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const Dashboard = () => {
    const { data: events = [], isLoading3 } = useGetEventsQuery();
    const { data: session } = useSession();
    const [selectedEvent, setSelectedEvent] = useState(events[0]?._id);
    const { data: selectedEventContributions = [], isLoading2 } = useGetContributionsQuery(selectedEvent, {
        skip: !selectedEvent
    });
    const { data: guests = [], isLoading1 } = useGetEventGuestsQuery(selectedEvent, {
        skip: !selectedEvent
    });
    const { data: userContributions = [], isLoading } = useGetUserTotalContributionsQuery(session?.user?.id, {
        skip: !session?.user?.id
    });
    const [selectedCharts, setSelectedCharts] = useState(['contributions', 'guests', 'topContributors', 'distribution']);

    const selectedEventData = events.find(e => e._id === selectedEvent);
    const { data: allContributions = [], isLoading: isLoadingAllContributions } = useGetAllContributionsQuery();

    const contributionData = {
        labels: selectedEventContributions.map(c => new Date(c.date).toLocaleDateString()),
        datasets: [{
            label: 'Contributions',
            data: selectedEventContributions.map(c => c.amount),
            backgroundColor: 'rgba(129, 140, 248, 0.6)',
            borderColor: 'rgb(129, 140, 248)',
            borderWidth: 1
        }]
    };

    const guestContributionData = useMemo(() => {
        const totalGuests = guests.length;
        const contributingGuests = new Set(selectedEventContributions.map(c => c.contributor._id)).size;
        return {
            labels: ['Contributing Guests', 'Non-Contributing Guests'],
            datasets: [{
                data: [contributingGuests, totalGuests - contributingGuests],
                backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(209, 213, 219, 0.8)'],
            }]
        };
    }, [guests, selectedEventContributions]);

    const topContributorsData = {
        labels: guests.slice(0, 5).map(g => g.name),
        datasets: [{
            label: 'Top Contributors',
            data: guests.slice(0, 5).map(g => selectedEventContributions.filter(c => c.contributor._id === g._id).reduce((sum, c) => sum + c.amount, 0)),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
        }]
    };

    const contributionDistributionData = {
        labels: guests.map(g => g.name),
        datasets: [{
            data: guests.map(g => selectedEventContributions.filter(c => c.contributor._id === g._id).reduce((sum, c) => sum + c.amount, 0)),
            backgroundColor: guests.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
        }]
    };

    const userContributionsByHost = useMemo(() => {
        if (!session?.user?.id) return [];

        return allContributions.reduce((acc, contribution) => {
            if (contribution.contributor._id === session.user.id) {
                const hostId = contribution.event.host._id;
                const hostName = contribution.event.host.name;
                if (!acc[hostId]) {
                    acc[hostId] = { hostName, totalAmount: 0 };
                }
                acc[hostId].totalAmount += contribution.amount;
            }
            return acc;
        }, {});
    }, [allContributions, session?.user?.id]);

    const userContributionData = {
        labels: Object.values(userContributionsByHost).map(item => item.hostName),
        datasets: [{
            label: 'Your Contributions',
            data: Object.values(userContributionsByHost).map(item => item.totalAmount),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
        }]
    };

    if (isLoading || isLoading1 || isLoading2 || isLoading3 || isLoadingAllContributions) {
        return <Loader />;
    }

    return (
        <div
            className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        >
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center"
            >
                Event Dashboard
            </motion.h1>
            {events.length === 0 && (
                <NoEventComponent page={"dashboard"} />
            )}
            {events.length > 0 && (<>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 flex justify-between items-center"
                >
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="p-2 rounded-md border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg"
                    >
                        {events.map(event => (
                            <option key={event._id} value={event._id}>{event.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center space-x-4">
                        <IoOptionsOutline className="text-2xl text-indigo-600" />
                        {['contributions', 'guests', 'topContributors', 'distribution'].map(chart => (
                            <label key={chart} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedCharts.includes(chart)}
                                    onChange={() => setSelectedCharts(prev =>
                                        prev.includes(chart) ? prev.filter(c => c !== chart) : [...prev, chart]
                                    )}
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                />
                                <span className="text-sm text-indigo-700 capitalize">{chart}</span>
                            </label>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: IoCalendarOutline, title: "Event Name", value: selectedEventData?.name },
                        { icon: IoPeopleOutline, title: "Event Guests", value: guests.length },
                        { icon: IoCashOutline, title: "Total Contributions", value: `₹${selectedEventContributions.reduce((sum, c) => sum + c.amount, 0)}` },
                        { icon: IoLocationOutline, title: "Venue", value: selectedEventData?.venue },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-white to-indigo-50 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">{item.title}</p>
                                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{item.value}</p>
                                </div>
                                <item.icon className="text-4xl text-purple-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {selectedCharts.includes('contributions') && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                                <IoCashOutline className="mr-2" /> Contribution Trend
                            </h2>
                            <Bar data={contributionData} />
                        </motion.div>
                    )}

                    {selectedCharts.includes('topContributors') && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                                <IoTrophyOutline className="mr-2" /> Top Contributors
                            </h2>
                            <Bar data={topContributorsData} />
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {selectedCharts.includes('guests') && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                                <IoPeopleOutline className="mr-2" /> Guest Contribution Distribution
                            </h2>
                            <Pie
                                data={guestContributionData}
                                options={{
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    const label = context.label || '';
                                                    const value = context.parsed || 0;
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                                                    return `${label}: ${percentage} (${value} guests)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                    {selectedCharts.includes('distribution') && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                                <IoStatsChartOutline className="mr-2" /> Contribution Distribution by Guest
                            </h2>
                            <Doughnut data={contributionDistributionData} />
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-1 gap-8 mb-8"
                >
                    <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                            <IoWalletOutline className="mr-2" /> Your Contributions to Hosts
                        </h2>
                        <div className="bg-white bg-opacity-90 rounded-lg p-4">
                            {isLoadingAllContributions ? (
                                <p>Loading...</p>
                            ) : (
                                <Bar
                                    data={userContributionData}
                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Contribution Amount (₹)'
                                                }
                                            }
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        let label = context.dataset.label || '';
                                                        if (label) {
                                                            label += ': ';
                                                        }
                                                        if (context.parsed.y !== null) {
                                                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                                        }
                                                        return label;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                        <IoCalendarOutline className="mr-2" /> Recent Events
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-indigo-600">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Venue</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.slice(0, 5).map((event, index) => (
                                    <motion.tr
                                        key={event._id}
                                        className={index % 2 === 0 ? 'bg-indigo-50 bg-opacity-50' : ''}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <td className="p-3">{event.name}</td>
                                        <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="p-3">{event.venue}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </>)}
        </div>
    );
};

export default Dashboard;