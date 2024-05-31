import { useState, useEffect } from 'react'
import style from './bookings.module.scss'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ'
const supabase = createClient(supabaseUrl, supabaseKey)


const Bookings = () => {

    const [bookings, setBookings] = useState([])





    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')

            console.log('Data:', data)
            console.log('Error:', error)

            if (error) console.error('Error fetching bookings:', error)
            else setBookings(data)
        }

        fetchBookings()
    }, [])

    return (
        <>

        </>

    )
}

export default Bookings;