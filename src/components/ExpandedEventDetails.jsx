const { useGetContributionsQuery } = require("@/store/api");
const { IoCloseCircleOutline } = require("react-icons/io5");

export const ExpandedEventDetails = ({ eventId, guests, onCloseEvent }) => {
    const { data: contributions, isLoading } = useGetContributionsQuery(eventId);
  
    if (isLoading) return <div className="p-4">Loading contributions...</div>;
  
    return (
      <div className="bg-gray-100 p-4 border-t border-gray-200">
        <h4 className="font-semibold mb-2">Guest List</h4>
        <ul className="space-y-1 mb-4">
          {guests.map((guest, index) => (
            <li key={index} className="text-sm text-gray-600">{guest.email}</li>
          ))}
        </ul>
        <h4 className="font-semibold mb-2">Contributions</h4>
        <ul className="space-y-1 mb-4">
          {contributions?.map((contribution, index) => (
            <li key={index} className="text-sm text-gray-600">
              {contribution.contributor.email}: ${contribution.amount}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onCloseEvent(eventId)}
            className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <IoCloseCircleOutline className="mr-1" /> Close Event
          </button>
        </div>
      </div>
    );
  };