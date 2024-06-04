import { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Define any functions or methods you need

    ////FETCH FUNCTIONS








    // Provide the context value to the children components
    return (
        <MyContext.Provider value={{
            bookings, setBookings,
            machines, setMachines,
            selectedBooking, setSelectedBooking,
            selectedMachine, setSelectedMachine,
            showModal, setShowModal,
            showDeleteModal, setShowDeleteModal,
            currentTime, setCurrentTime
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