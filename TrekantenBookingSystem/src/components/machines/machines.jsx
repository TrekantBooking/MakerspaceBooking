import { useState, useEffect } from 'react'
import style from './machines.module.scss'
import { createClient } from '@supabase/supabase-js'
import Bookings from '../bookings/bookings'

import Modal from '../bookingModal/bookingModal';

const supabaseUrl = 'https://kakelsuvivlhklklbwpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState(null);

    useEffect(() => {
        const fetchMachines = async () => {
            const { data, error } = await supabase
                .from('machines')
                .select('*');

            if (error) console.error('Error fetching machines:', error);
            else setMachines(data);
        };

        fetchMachines();
    }, []);

    const handleAddBooking = async (booking) => {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{ ...booking, machine_id: selectedMachine.id }]);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            setShowModal(false);
        }
    };

    const openModal = (machine) => {
        setSelectedMachine(machine);
        setShowModal(true);
    };

    return (
        <>
            <div className={style.machineList}>
                {machines.map((machine, index) => (
                    <div key={index} >
                        <h2>{machine.name}</h2> {/* Assuming each machine object has a 'name' property */}
                        <div className={style.bookingList}>
                            <Bookings machineId={machine.id} bookingTime={machine.booking_time} />
                        </div>
                        <div className={style.buttonContainer}>
                            <button onClick={() => openModal(machine)}>Book</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMachine && (
                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddBooking}
                    selectedMachine={selectedMachine}
                />
            )}
        </>
    );
};

export default Machines;
