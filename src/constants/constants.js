import { IoGiftOutline, IoStarOutline, IoTrophyOutline, IoWalletOutline } from "react-icons/io5";

export const tabInfo = {
    received: {
        title: "Received Contributions",
        description: "View all the contributions you've received for events you've hosted.",
        icon: <IoGiftOutline />
    },
    contributed: {
        title: "Your Contributions",
        description: "See all the contributions you've made to other people's events.",
        icon: <IoWalletOutline />
    },
    'top contributors': {
        title: "Top Contributors",
        description: "Discover who has contributed the most to your events.",
        icon: <IoTrophyOutline />
    },
    'top hosts': {
        title: "Top Hosts",
        description: "See the hosts to whom you've contributed the most.",
        icon: <IoStarOutline />
    }
};