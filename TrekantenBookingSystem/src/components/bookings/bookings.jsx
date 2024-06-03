import { useState, useEffect } from 'react'
import style from './bookings.module.scss'
import { createClient } from '@supabase/supabase-js'
import PropTypes from 'prop-types';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ'
const supabase = createClient(supabaseUrl, supabaseKey)


const Bookings = ({ machineId }) => {

    // State for storing bookings and current time
    const [bookings, setBookings] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date());

    // Effect hook to update current time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);




    // Fetch bookings for the machine
    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('machine_id', machineId)

            console.log('Data:', data)
            console.log('Error:', error)

            if (error) console.error('Error fetching bookings:', error)
            else setBookings(data)
        }

        fetchBookings()
    }, [machineId])

    return (
        <>

            <div className={style.bookingList}>
                {bookings.map((booking, index) => {
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
                        </div>
                    );
                })}
            </div>

        </>

    )
}

Bookings.propTypes = {
    machineId: PropTypes.string.isRequired,
    bookingTime: PropTypes.string.isRequired
};



export default Bookings;