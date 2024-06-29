'use client';

import { useCreateEventMutation, useSearchUserQuery } from '@/store/api';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { IoClose, IoCalendarOutline, IoLocationOutline, IoPersonAddOutline, IoMailOutline, IoCallOutline, IoHomeOutline, IoAddCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import useToast from '@/hooks/useToast';

export default function EventForm({ isOpen, onClose }) {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    venue: '',
    guests: []
  });
  const dropdownRef = useRef(null);
  const [guestInput, setGuestInput] = useState({ name: '', email: '', phone: '', city: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const { data: session } = useSession();
  const { data: searchResults, isFetching } = useSearchUserQuery(searchTerm, { skip: searchTerm.length < 3 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showSuccessToast } = useToast();

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
    setShowDropdown(term.length >= 3);
  }, 300);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInput({ ...guestInput, [name]: value });
    if (name === 'email' || name === 'phone') {
      debouncedSearch(value);
    }
  };

  const selectUser = (user) => {
    setGuestInput({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city
    });
    setSearchTerm('');
    setShowDropdown(false);
  };

  const addGuest = () => {
    if (guestInput.name && guestInput.email && guestInput.phone && guestInput.city) {
      const guestExists = eventData.guests.some(
        guest => guest.email === guestInput.email || guest.phone === guestInput.phone
      );

      if (guestExists) {
        setErrorMessage('This guest has already been added.');
        return;
      }

      setEventData({
        ...eventData,
        guests: [...eventData.guests, guestInput]
      });
      setGuestInput({ name: '', email: '', phone: '', city: '' });
      setSearchTerm('');
      setShowDropdown(false);
      setErrorMessage('');
    }
  };

  const removeGuest = (index) => {
    const updatedGuests = eventData.guests.filter((_, i) => i !== index);
    setEventData({ ...eventData, guests: updatedGuests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createEvent({
        ...eventData,
        host: session.user.id
      }).unwrap();
      
      onClose();
      showSuccessToast("Event created successfully!");
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Create Event</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose size={28} />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <IoCalendarOutline className="absolute left-3 top-9 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <IoCalendarOutline className="absolute left-3 top-9 text-gray-400" size={20} />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input
              id="venue"
              type="text"
              name="venue"
              value={eventData.venue}
              onChange={handleChange}
              placeholder="Enter venue"
              className="w-full pl-10 pr-3 outline-none py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <IoLocationOutline className="absolute left-3 top-9 text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">Add Guests</h3>
            <p className="text-sm text-gray-600">Enter email or phone number of existing users to get their details</p>
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="name"
                  value={guestInput.name}
                  onChange={handleGuestInputChange}
                  placeholder="Guest Name"
                  className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <IoPersonAddOutline className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="relative flex-1">
                <input
                  type="email"
                  name="email"
                  value={guestInput.email}
                  onChange={handleGuestInputChange}
                  placeholder="Guest Email"
                  className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <IoMailOutline className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={guestInput.phone}
                  onChange={handleGuestInputChange}
                  placeholder="Guest Phone"
                  className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <IoCallOutline className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  name="city"
                  value={guestInput.city}
                  onChange={handleGuestInputChange}
                  placeholder="Guest City"
                  className="w-full pl-10 outline-none pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <IoHomeOutline className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <motion.button
                type="button"
                onClick={addGuest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
              >
                <IoAddCircleOutline size={20} className="mr-2" />
                Add Guest
              </motion.button>
            </div>
            {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <IoAlertCircleOutline size={20} className="mr-2" />
              <span className="block sm:inline">{errorMessage}</span>
            </motion.div>
          )}
            <AnimatePresence>
              {showDropdown && searchResults && searchResults.length > 0 && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg"
                >
                  {searchResults.map((user) => (
                    <motion.div
                      key={user._id}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      className="p-2 cursor-pointer"
                      onClick={() => selectUser(user)}
                    >
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email} | {user.phone}</p>
                      <p className="text-sm text-gray-600">{user.city}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {eventData.guests.map((guest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-gradient-to-br from-indigo-200 to-purple-200 p-4 rounded-lg relative"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => removeGuest(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <IoClose size={20} />
                  </motion.button>
                  <h4 className="font-semibold">{guest.name}</h4>
                  <p className="text-sm text-gray-600">{guest.email}</p>
                  <p className="text-sm text-gray-600">{guest.phone}</p>
                  <p className="text-sm text-gray-600">{guest.city}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors text-lg font-semibold"
          >
            Create Event
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}