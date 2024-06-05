import { useState, useEffect, useContext } from "react";
import style from "./machines.module.scss";
import { createClient } from "@supabase/supabase-js";
import Bookings from "../bookings/bookings";
import Modal from "../bookingModal/bookingModal";
import PropTypes from 'prop-types';
import { MyContext } from "../../Providers/ContextProvider";

const supabaseUrl = "https://kakelsuvivlhklklbwpy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ";
const supabase = createClient(supabaseUrl, supabaseKey);

const Machines = () => {
    const { machines, fetchMachines, setTriggerFetch } = useContext(MyContext);

    const [showModal, setShowModal] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState(null);

    //fetch machines from database
    useEffect(() => {

        console.log(machines);
        fetchMachines();
    }, []);

    const handleAddBooking = async (booking) => {


        // Insert the new booking into the 'bookings' table
        const { error } = await supabase
            .from('bookings')
            .insert([{
                ...booking,
                machine_id: selectedMachine.id,
                duration: selectedMachine.booking_time
            }]);

        // If there's an error, log it
        if (error) console.error('Error creating booking:', error);

        // Trigger a fetch after adding a booking
        setTriggerFetch(prevState => !prevState);

        // Close the modal
        setShowModal(false);
    };



    const openModal = (machine) => {
        setSelectedMachine(machine);
        setShowModal(true);
    };

    return (
        <>
            <div className={style.machineList}>
                {machines.map((machine, index) => (
                    <div className={style.machine_container} key={index}>
                        <div className={style.machine_header}>
                            <h2>{machine.name}</h2>
                        </div>
                        <div>
                            <Bookings
                                machineId={machine.id.toString()}
                                bookingTime={machine.booking_time.toString()}

                            />
                        </div>
                        <div className={style.bookMachine_button}>
                            <button onClick={() => openModal(machine)}>Book machine</button>
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
