import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { SupabaseContext } from './SupabaseProvider';
// Create a new context
export const MyContext = createContext();

// Create a provider component
const ContextProvider = ({ children }) => {

    const supabase = useContext(SupabaseContext);

    // Define your state variables here
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [machines, setMachines] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [triggerFetch, setTriggerFetch] = useState(false);

    // Define any functions or methods you need

    //fetch machines from database
    const fetchMachines = async () => {
        const { data, error } = await supabase.from("machines").select("*");

        if (error) {
            console.error('Error fetching machines:', error);
        } else {
            setMachines(data);

        }
    };





    // Provide the context value to the children components
    return (
        <MyContext.Provider value={{
            bookings, setBookings,
            machines, setMachines,
            selectedBooking, setSelectedBooking,

            showModal, setShowModal,
            showDeleteModal, setShowDeleteModal,
            currentTime, setCurrentTime,
            fetchMachines,
            triggerFetch, setTriggerFetch



        }}>
            {children}
        </MyContext.Provider>
    );
};

// Define the prop types for the provider component
ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};




export default ContextProvider;