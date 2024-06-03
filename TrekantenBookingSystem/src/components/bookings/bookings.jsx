import { useState, useEffect, useCallback } from 'react';
import style from './bookings.module.scss';
import { createClient } from '@supabase/supabase-js';
import PropTypes from 'prop-types';
import DeleteModal from '../deleteModal/deleteModal';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const Bookings = ({ machineId }) => {

    // State for storing bookings and current time
    const [bookings, setBookings] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleDeleteBooking = useCallback(async (eventOrBookingId) => {
        let bookingId;
        if (eventOrBookingId instanceof Event) {
            bookingId = eventOrBookingId.target.getAttribute('data-booking-id');
        } else {
            bookingId = eventOrBookingId;
        }

        // Implement password verification logic here if needed
        const { data, error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) {
            console.error('Error deleting booking:', error);
        } else {
            setBookings(bookings => bookings.filter(booking => booking.id !== bookingId));
        }
    }, []);

    // Effect hook to update current time every second
    useEffect(() => {
        const intervalId = setInterval(async () => {
            setCurrentTime(new Date());

            // Check if any bookings have ended
            for (const booking of bookings) {
                const endTime = new Date(booking.end_time);
                if (endTime <= currentTime) {
                    // If the booking has ended, delete it
                    await handleDeleteBooking(booking.id);
                }
            }
        }, 1000);

        return () => clearInterval(intervalId); // Clear the interval when the component unmounts
    }, [bookings, currentTime, handleDeleteBooking]);




    // Fetch bookings for the machine
    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('machine_id', machineId)
                .order('start_time', { ascending: true }); // Sort bookings by start_time

            if (error) console.error('Error fetching bookings:', error);
            else setBookings(data);
        };

        fetchBookings();
    }, [machineId]);



    const openDeleteModal = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className={style.bookingList}>
                {
                    bookings.map((booking, index) => {
                        const endTime = new Date(booking.end_time);
                        const now = new Date();
                        const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000)); // in seconds

                        const minutes = Math.floor(remainingTime / 60);
                        const seconds = remainingTime % 60;

                        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                        return (
                            <div key={index}>
                                <h2>{booking.user_name}</h2>
                                <p>Remaining time: {formattedTime}</p>
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