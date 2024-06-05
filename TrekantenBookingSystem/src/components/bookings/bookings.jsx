import { useState, useEffect, useContext, useCallback } from 'react';
import style from './bookings.module.scss';
import { createClient } from '@supabase/supabase-js';
import PropTypes from 'prop-types';
import DeleteModal from '../deleteModal/deleteModal';
import { MyContext } from '../../Providers/ContextProvider';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const Bookings = ({ machineId }) => {



    const { bookings, setBookings, selectedBooking, setSelectedBooking, triggerFetch } = useContext(MyContext);

    // State for storing bookings and current time

    const [showDeleteModal, setShowDeleteModal] = useState(false);



    // Function to open the delete modal
    const openDeleteModal = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    // Fetch bookings for the machine
    useEffect(() => {
        const fetchBookings = async () => {
            // Fetch all bookings from the 'bookings' table where 'machine_id' equals the current machineId
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('machine_id', machineId)


            // If there's an error, log it
            // Otherwise, update the 'bookings' state with the fetched data
            if (error) console.error('Error fetching bookings:', error);
            else setBookings(prevBookings => ({ ...prevBookings, [machineId]: data }));
        };


        // Call the fetchBookings function
        fetchBookings();
        // This effect hook runs whenever 'machineId' or 'setBookings' changes
    }, [machineId, setBookings, triggerFetch]);

    // Function to delete a selected booking
    const handleDeleteBooking = useCallback(async (bookingId) => {
        // Delete the booking from the 'bookings' table where 'id' equals the bookingId
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        // If there's an error, log it
        // Otherwise, update the 'bookings' state by removing the deleted booking
        if (error) console.error('Error deleting booking:', error);
        else {
            setBookings(prevBookings => {
                // Create a copy of the previous bookings
                const updatedBookings = { ...prevBookings };
                // Filter out the deleted booking
                updatedBookings[machineId] = updatedBookings[machineId].filter(booking => booking.id !== bookingId);
                // Return the updated bookings
                return updatedBookings;
            });
        }
    }, [machineId, setBookings]);









    return (
        <>
            <div className={style.booking_list}>
                {
                    bookings[machineId]?.map((booking, index) => {



                        return (
                            <div key={index} className={style.user_booking}>
                                <h2>{booking.user_name}</h2>
                                <p className={style.user_time}>Remaining time: {booking.duration}</p>
                                <button data-booking-id={booking.id} onClick={() => openDeleteModal(booking)}>Delete</button>
                            </div>
                        );
                    })
                }
            </div >

            {selectedBooking && (
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onSubmit={() => handleDeleteBooking(selectedBooking.id) && setShowDeleteModal(false)}
                    booking={selectedBooking}
                />
            )}
        </>
    );
};

Bookings.propTypes = {
    machineId: PropTypes.string.isRequired,
    bookingTime: PropTypes.string.isRequired
};

export default Bookings;