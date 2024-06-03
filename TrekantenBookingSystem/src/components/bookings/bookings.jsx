import { useState, useEffect } from 'react';
import style from './bookings.module.scss';
import { createClient } from '@supabase/supabase-js';
import PropTypes from 'prop-types';
import DeleteModal from '../deleteModal/deleteModal';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const Bookings = ({ machineId, bookingTime }) => {
    const [bookings, setBookings] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('machine_id', machineId);

            if (error) console.error('Error fetching bookings:', error);
            else setBookings(data);
        };

        fetchBookings();
    }, [machineId]);

    const handleDeleteBooking = async ({ password, bookingId }) => {
        // Implement password verification logic here if needed
        const { data, error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) {
            console.error('Error deleting booking:', error);
        } else {
            setShowDeleteModal(false);
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        }
    };

    const openDeleteModal = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className={style.bookingList}>
                {bookings.map((booking, index) => (
                    <div key={index}>
                        <h2>{booking.user_name}</h2> {/* Assuming each booking object has a 'user_name' property */}
                        <p>{bookingTime}</p>
                        <button onClick={() => openDeleteModal(booking)}>Delete</button>
                    </div>
                ))}
            </div>

            {selectedBooking && (
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onSubmit={handleDeleteBooking}
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