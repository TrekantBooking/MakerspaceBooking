import { useState, useEffect } from "react";
import style from "./machines.module.scss";
import { createClient } from "@supabase/supabase-js";
import Bookings from "../bookings/bookings";
import Modal from "../bookingModal/bookingModal";

const supabaseUrl = "https://kakelsuvivlhklklbwpy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ";
const supabase = createClient(supabaseUrl, supabaseKey);

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState(null);

    useEffect(() => {
        const fetchMachines = async () => {
            const { data, error } = await supabase.from("machines").select("*");

            if (error) {
                console.error('Error fetching machines:', error);
            } else {
                setMachines(data);
            }
        };

        fetchMachines();
    }, []);

    const handleAddBooking = async (booking) => {
        console.log("Selected machine:", selectedMachine);

        // Fetch existing bookings to find the latest end time
        const { data: existingBookings, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('machine_id', selectedMachine.id)
            .order('end_time', { ascending: false })
            .limit(1);

        if (fetchError) {
            console.error('Error fetching existing bookings:', fetchError);
            return;
        }

        console.log("Existing bookings:", existingBookings);

        let startTime = new Date(); // Default to current time
        if (existingBookings.length > 0) {
            const latestEndTime = new Date(existingBookings[0].end_time);
            if (latestEndTime > startTime) {
                startTime = latestEndTime; // Set start time to the latest end time
            }
        }

        const endTime = new Date(startTime.getTime() + selectedMachine.booking_time * 60000); // Add booking_time minutes
        console.log("Booking start time:", startTime);
        console.log("Booking end time:", endTime);

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                ...booking,
                machine_id: selectedMachine.id,
                start_time: startTime,
                end_time: endTime
            }]);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            setShowModal(false);
        }

        // Refresh machines data to reflect new bookings
        const fetchMachines = async () => {
            const { data, error } = await supabase.from("machines").select("*");

            if (error) {
                console.error('Error fetching machines:', error);
            } else {
                setMachines(data);
            }
        };

        fetchMachines();
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
                        <div className={style.machine_name}>
                            <h2>{machine.name}</h2>
                        </div>
                        <div className={style.bookingList}>
                            <Bookings
                                machineId={machine.id.toString()}
                                bookingTime={machine.booking_time.toString()}
                            />
                        </div>
                        <div className={style.buttonContainer}>
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
}
export default Machines;
