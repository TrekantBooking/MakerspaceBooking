import { useState, useEffect } from 'react'
import style from './bookings.module.scss'
import { createClient } from '@supabase/supabase-js'
import PropTypes from 'prop-types';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ'
const supabase = createClient(supabaseUrl, supabaseKey)


const Bookings = ({ machineId }) => {

    const [bookings, setBookings] = useState([])





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
                {bookings.map((booking, index) => (
                    <div key={index} >
                        <h2>{booking.user_name}</h2> {/* Assuming each booking object has a 'name' property */}

                    </div>
                ))}
            </div>

        </>

    )
}

Bookings.propTypes = {
    machineId: PropTypes.string.isRequired,
};



export default Bookings;