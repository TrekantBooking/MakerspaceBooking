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



    const { bookings, setBookings, selectedBooking, setSelectedBooking, triggerFetch, formatDuration } = useContext(MyContext);

    // State for storing bookings and current time
    // State to keep track of the number of bookings
    const [numBookings, setNumBookings] = useState(bookings[machineId]?.length || 0);
    // State to keep track of the remaining time
    const [remainingTime, setRemainingTime] = useState(null);
    // State to keep track of the id of the active booking
    const [activeBookingId, setActiveBookingId] = useState(null);


    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Update numBookings whenever the bookings state changes
    useEffect(() => {
        setNumBookings(bookings[machineId]?.length || 0);
    }, [bookings, machineId]);



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
                .order('created_at', { ascending: true }) // Order the bookings by their creation date (oldest first


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

            // After deleting the booking, update the next booking in line to active
            updateNextBookingToActive();
        }
    }, [machineId, setBookings]);

    // Function to update the next booking in line to active
    const updateNextBookingToActive = useCallback(async () => {
        // Sort the bookings by their order in the queue
        const sortedBookings = [...bookings[machineId]].sort((a, b) => a.queueOrder - b.queueOrder);

        // Get the next booking in line
        const nextBooking = sortedBookings[0];

        // If there's a next booking, update its status to active
        if (nextBooking) {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'active' })
                .eq('id', nextBooking.id);

            if (error) console.error('Error updating booking status:', error);
            else {
                setBookings(prevBookings => {
                    const updatedBookings = { ...prevBookings };
                    const bookingIndex = updatedBookings[machineId].findIndex(booking => booking.id === nextBooking.id);
                    if (bookingIndex !== -1) {
                        updatedBookings[machineId][bookingIndex].status = 'active';
                    }
                    return updatedBookings;
                });
            }
        }
    }, [machineId, setBookings, bookings]);

    // Update remainingTime and activeBookingId whenever the active booking changes
    useEffect(() => {
        const activeBooking = bookings[machineId]?.find(booking => booking.status === 'active');
        if (activeBooking && activeBooking.id !== activeBookingId) {
            setRemainingTime(activeBooking.duration);
            setActiveBookingId(activeBooking.id);
        }
    }, [bookings, machineId, activeBookingId]);

    // Timer to count down the remaining time
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime > 0 ? prevTime - 1 : 0);
            if (remainingTime === 0) {
                handleDeleteBooking(activeBookingId);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);



    // Call updateNextBookingToActive whenever a booking is deleted
    useEffect(() => {
        if (bookings[machineId]?.length < numBookings) {
            updateNextBookingToActive();
        }
    }, [bookings, machineId, numBookings, updateNextBookingToActive]);









    return (
        <>
            <div className={style.booking_list}>
                {
                    bookings[machineId]?.map((booking, index) => {



                        return (
                            <div key={index} className={style.user_booking}>
                                <h2>{booking.user_name}</h2>
                                {
                                    booking.status === 'active' ?
                                        <p>Time remaining: {formatDuration(remainingTime)}</p> :
                                        <p>I kø</p>



                                }

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