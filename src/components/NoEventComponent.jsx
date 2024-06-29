import { motion } from 'framer-motion';
import { IoCalendarOutline } from 'react-icons/io5';
import EventForm from './EventForm';
import { useState } from 'react';

const NoEventComponent = ({page}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-lg shadow-lg"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <IoCalendarOutline className="mx-auto text-6xl text-gray-400 mb-4" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Events Found</h3>
            { page !== "dashboard" && <p className="text-gray-500 mb-6">There are no events matching your search or filter criteria.</p>}
            { page === "dashboard" && <p className="text-gray-500 mb-6">You will see your events analysis here!</p>}
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-colors duration-300"
                onClick={() => setIsModalOpen(true)}
            >
                Create New Event
            </motion.button>
            <EventForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </motion.div>
    )
}

export default NoEventComponent