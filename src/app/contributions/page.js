'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useGetUserDashboardDataQuery } from '@/store/api';
import { IoGiftOutline, IoWalletOutline, IoPeopleOutline, IoCalendarOutline, IoPersonOutline, IoCashOutline, IoStarOutline, IoTrophyOutline, IoInformationCircleOutline } from 'react-icons/io5';
import InfoCard from '@/components/InfoCard';
import { tabInfo } from '@/constants/constants';
import RankingCard from '@/components/RankingCard';
import NoDataCard from '@/components/NoDataCard';

const DynamicDashboard = () => {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('received');

    const { data: dashboardData, isLoading } = useGetUserDashboardDataQuery(session?.user?.id, {
        skip: !session?.user?.id
    });

    const consolidatedReceivedContributions = useMemo(() => {
        if (!dashboardData?.receivedContributions) return [];
        return dashboardData.receivedContributions.map(event => {
            const consolidatedContributions = event.contributions.reduce((acc, contribution) => {
                if (!acc[contribution.contributorName]) {
                    acc[contribution.contributorName] = 0;
                }
                acc[contribution.contributorName] += contribution.amount;
                return acc;
            }, {});

            const totalGuestContribution = event.contributions.reduce((total, contribution) => {
                return total + (contribution.contributorName === session?.user?.name ? contribution.amount : 0);
            }, 0);

            return {
                ...event,
                consolidatedContributions: Object.entries(consolidatedContributions).map(([name, amount]) => ({ contributorName: name, amount })),
                totalGuestContribution
            };
        });
    }, [dashboardData?.receivedContributions, session?.user?.name]);

    const consolidatedContributedGifts = useMemo(() => {
        if (!dashboardData?.contributedGifts) return [];
        const eventMap = new Map();

        dashboardData.contributedGifts.forEach(contribution => {
            if (!eventMap.has(contribution.eventName)) {
                eventMap.set(contribution.eventName, {
                    eventName: contribution.eventName,
                    hostName: contribution.hostName,
                    totalAmount: 0
                });
            }
            const event = eventMap.get(contribution.eventName);
            event.totalAmount += contribution.amount;
        });

        return Array.from(eventMap.values());
    }, [dashboardData?.contributedGifts]);

    const topContributors = useMemo(() => {
        if (!dashboardData?.receivedContributions) return [];
        const contributorMap = new Map();
        dashboardData.receivedContributions.forEach(event => {
            event.contributions.forEach(contribution => {
                const total = contributorMap.get(contribution.contributorName) || 0;
                contributorMap.set(contribution.contributorName, total + contribution.amount);
            });
        });
        return Array.from(contributorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, amount]) => ({ name, amount }));
    }, [dashboardData?.receivedContributions]);

    const topHosts = useMemo(() => {
        if (!dashboardData?.contributedGifts) return [];
        const hostMap = new Map();
        dashboardData.contributedGifts.forEach(contribution => {
            const total = hostMap.get(contribution.hostName) || 0;
            hostMap.set(contribution.hostName, total + contribution.amount);
        });
        return Array.from(hostMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, amount]) => ({ name, amount }));
    }, [dashboardData?.contributedGifts]);

    const maxContributorAmount = useMemo(() => {
        return topContributors.reduce((max, contributor) => Math.max(max, contributor.amount), 0);
    }, [topContributors]);

    const maxHostAmount = useMemo(() => {
        return topHosts.reduce((max, host) => Math.max(max, host.amount), 0);
    }, [topHosts]);

    const tabVariants = {
        inactive: {
            background: "linear-gradient(45deg, #e0e7ff, #c7d2fe)",
            opacity: 0.7,
        },
        active: {
            background: "linear-gradient(45deg, #93c5fd, #60a5fa)",
            opacity: 1,
            scale: 1.05,
            transition: { type: "spring", stiffness: 500, damping: 30 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-bold mb-8 text-center"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                    Contributions Track
                </span>
            </motion.h1>

            <div className="flex justify-center space-x-2 mb-8 flex-wrap">
                {['received', 'contributed', 'top contributors', 'top hosts'].map((tab) => (
                    <motion.button
                        key={tab}
                        variants={tabVariants}
                        initial="inactive"
                        animate={activeTab === tab ? "active" : "inactive"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab)}
                        className="px-4 py-2 rounded-full font-medium text-base shadow-md mb-2 text-gray-800"
                    >
                        {tab === 'received' && <><IoGiftOutline className="inline-block mr-1" /> Received</>}
                        {tab === 'contributed' && <><IoWalletOutline className="inline-block mr-1" /> Contributed</>}
                        {tab === 'top contributors' && <><IoTrophyOutline className="inline-block mr-1" /> Top Contributors</>}
                        {tab === 'top hosts' && <><IoStarOutline className="inline-block mr-1" /> Top Hosts</>}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <InfoCard
                        title={tabInfo[activeTab].title}
                        description={tabInfo[activeTab].description}
                        icon={tabInfo[activeTab].icon}
                    />
                    {activeTab === 'received' && (
                        consolidatedReceivedContributions.length > 0 ? consolidatedReceivedContributions.map((event) => (
                            <motion.div
                                key={event._id}
                                variants={itemVariants}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <IoCalendarOutline className="mr-2 text-2xl text-blue-500" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                                        {event.eventName}
                                    </span>
                                </h3>
                                <p className="text-lg mb-3 flex items-center">
                                    <IoCashOutline className="mr-2 text-xl text-green-500" />
                                    <span className="font-semibold text-green-600">
                                        Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(event.totalAmount)}
                                    </span>
                                </p>
                                <p className="text-base mb-4 flex items-center">
                                    <IoPersonOutline className="mr-2 text-lg text-blue-500" />
                                    <span className="font-medium">
                                        Your Contribution: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(event.totalGuestContribution)}
                                    </span>
                                </p>
                                <h4 className="text-base font-semibold mb-3 flex items-center">
                                    <IoPeopleOutline className="mr-2 text-lg text-blue-500" />
                                    Contributions:
                                </h4>
                                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                                    <ul className="space-y-2">
                                        {event.consolidatedContributions.map((contribution, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex justify-between items-center bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all duration-300"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <span className="font-medium flex items-center text-sm">
                                                    <IoPersonOutline className="mr-1 text-blue-500" />
                                                    {contribution.contributorName}
                                                </span>
                                                <span className="font-semibold text-green-600 text-sm">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(contribution.amount)}
                                                </span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )) : <NoDataCard message="No received contributions yet." />
                    )}

                    {activeTab === 'contributed' && (
                        consolidatedContributedGifts.length > 0 ? consolidatedContributedGifts.map((contribution) => (
                            <motion.div
                                key={contribution.eventName}
                                variants={itemVariants}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <IoCalendarOutline className="mr-2 text-2xl text-blue-500" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                                        {contribution.eventName}
                                    </span>
                                </h3>
                                <p className="text-base mb-4 flex items-center">
                                    <IoPersonOutline className="mr-2 text-lg text-blue-500" />
                                    Host: {contribution.hostName}
                                </p>
                                <p className="text-lg flex items-center">
                                    <IoCashOutline className="mr-2 text-xl text-green-500" />
                                    <span className="font-semibold text-green-600">
                                        Total Contribution: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(contribution.totalAmount)}
                                    </span>
                                </p>
                            </motion.div>
                        )) : <NoDataCard message="No contributions made yet." />
                    )}

                    {activeTab === 'top contributors' && (
                        topContributors.length > 0 ? topContributors.map((contributor, index) => (
                            <RankingCard
                                key={contributor.name}
                                rank={index + 1}
                                name={contributor.name}
                                amount={contributor.amount}
                                isContributor={true}
                                maxAmount={maxContributorAmount}
                            />
                        )) : <NoDataCard message="No top contributors data available." />
                    )}

                    {activeTab === 'top hosts' && (
                        topHosts.length > 0 ? topHosts.map((host, index) => (
                            <RankingCard
                                key={host.name}
                                rank={index + 1}
                                name={host.name}
                                amount={host.amount}
                                isContributor={false}
                                maxAmount={maxHostAmount}
                            />
                        )) : <NoDataCard message="No top hosts data available." />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DynamicDashboard;