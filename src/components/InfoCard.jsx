import { motion } from "framer-motion";

const InfoCard = ({ title, description, icon }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
        >
            <div className="text-4xl text-blue-500 mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    )
};

export default InfoCard