import { useState, useEffect, useContext, useCallback } from "react";
import style from "./bookings.module.scss";
import { createClient } from "@supabase/supabase-js";
import PropTypes from "prop-types";
import DeleteModal from "../deleteModal/deleteModal";
import { MyContext } from "../../Providers/ContextProvider";

const supabaseUrl = "https://kakelsuvivlhklklbwpy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtha2Vsc3V2aXZsaGtsa2xid3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjk2ODAsImV4cCI6MjAzMjY0NTY4MH0.uzudZASPyKYTrYHOkKQHmUiXgNIaCJ98Nwn-NaWrmkQ";
const supabase = createClient(supabaseUrl, supabaseKey);

const Bookings = ({ machineId }) => {
  const {
    bookings,
    setBookings,
    selectedBooking,
    setSelectedBooking,
    triggerFetch,
    formatDuration,
  } = useContext(MyContext);

  const [numBookings, setNumBookings] = useState(
    bookings[machineId]?.length || 0
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [activeBookingRemainingTime, setActiveBookingRemainingTime] =
    useState(null);
  const [activeBookingId, setActiveBookingId] = useState(null);

  useEffect(() => {
    setNumBookings(bookings[machineId]?.length || 0);
  }, [bookings, machineId]);

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("machine_id", machineId)
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching bookings:", error);
      else {
        // Ensure only one booking is marked as active
        const sortedBookings = data.map((booking, index) => ({
          ...booking,
          status: index === 0 ? "active" : "pending",
        }));
        setBookings((prevBookings) => ({
          ...prevBookings,
          [machineId]: sortedBookings,
        }));
      }
    };

    fetchBookings();
  }, [machineId, setBookings, triggerFetch]);

  const updateNextBookingToActive = useCallback(async () => {
    const sortedBookings = [...bookings[machineId]].sort(
      (a, b) => a.queueOrder - b.queueOrder
    );
    const nextBooking = sortedBookings[0];

    if (nextBooking) {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "active" })
        .eq("id", nextBooking.id);

      if (error) console.error("Error updating booking status:", error);
      else {
        setBookings((prevBookings) => {
          const updatedBookings = { ...prevBookings };
          const bookingIndex = updatedBookings[machineId].findIndex(
            (booking) => booking.id === nextBooking.id
          );
          if (bookingIndex !== -1) {
            updatedBookings[machineId][bookingIndex].status = "active";
          }
          return updatedBookings;
        });
      }
    }
  }, [machineId, setBookings, bookings]);

  const handleDeleteBooking = useCallback(
    async (bookingId) => {
      if (bookingId === null) {
        return;
      }
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) console.error("Error deleting booking:", error);
      else {
        setBookings((prevBookings) => {
          const updatedBookings = { ...prevBookings };
          updatedBookings[machineId] = updatedBookings[machineId].filter(
            (booking) => booking.id !== bookingId
          );
          return updatedBookings;
        });
        updateNextBookingToActive(); // Update the next booking to be active
      }
    },
    [machineId, setBookings, updateNextBookingToActive]
  );

  useEffect(() => {
    const activeBooking = bookings[machineId]?.find(
      (booking) => booking.status === "active"
    );
    if (activeBooking && activeBooking.id !== activeBookingId) {
      setActiveBookingRemainingTime(activeBooking.duration);
      setActiveBookingId(activeBooking.id);
    }
  }, [bookings, machineId, activeBookingId]);

  useEffect(() => {
    const updateRemainingTimeInDb = async (bookingId, newRemainingTime) => {
      const { error } = await supabase
        .from("bookings")
        .update({ duration: newRemainingTime })
        .eq("id", bookingId);

      if (error) console.error("Error updating booking duration:", error);
    };

    const timer = setInterval(() => {
      if (activeBookingRemainingTime > 0) {
        setActiveBookingRemainingTime((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          if (newTime % 10 === 0) {
            updateRemainingTimeInDb(activeBookingId, newTime);
          }
          return newTime;
        });
      } else {
        if (activeBookingId !== null) {
          handleDeleteBooking(activeBookingId);
        }
        clearInterval(timer); // Stop the timer when remaining time reaches 0
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeBookingRemainingTime, handleDeleteBooking, activeBookingId]);

  return (
    <>
      <div className={style.booking_list}>
        {bookings[machineId]?.map((booking, index) => (
          <div key={index} className={style.user_booking}>
            <h2>{booking.user_name}</h2>
            {booking.status === "active" ? (
              <p>
                Time remaining:{" "}
                {numBookings > 1
                  ? formatDuration(activeBookingRemainingTime)
                  : formatDuration(booking.duration)}
              </p>
            ) : (
              <p>
                {numBookings > 1
                  ? "In queue"
                  : formatDuration(booking.duration)}
              </p>
            )}
            <button
              data-booking-id={booking.id}
              onClick={() => openDeleteModal(booking)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedBooking && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={() =>
            handleDeleteBooking(selectedBooking.id) && setShowDeleteModal(false)
          }
          booking={selectedBooking}
        />
      )}
    </>
  );
};

Bookings.propTypes = {
  machineId: PropTypes.string.isRequired,
  bookingTime: PropTypes.string.isRequired,
};

export default Bookings;
