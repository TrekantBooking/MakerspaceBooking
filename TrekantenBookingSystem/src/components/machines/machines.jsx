import { useState, useEffect } from 'react'
import style from './machines.module.scss'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ'
const supabase = createClient(supabaseUrl, supabaseKey)


const Machines = () => {

    const [machines, setMachines] = useState([])





    useEffect(() => {
        const fetchMachines = async () => {
            const { data, error } = await supabase
                .from('machines')
                .select('*')

            console.log('Data:', data)
            console.log('Error:', error)

            if (error) console.error('Error fetching machines:', error)
            else setMachines(data)
        }

        fetchMachines()
    }, [])

    return (
        <>
            <div className={style.machineList}>
                {machines.map((machine, index) => (
                    <div key={index} >
                        <h2>{machine.name}</h2> {/* Assuming each machine object has a 'name' property */}
                        <div className={style.buttonContainer}>
                            <button>Book</button>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )
}

export default Machines;