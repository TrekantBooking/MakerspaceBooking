import { useState, useEffect, useContext, useCallback } from "react";
import style from "./bookings.module.scss";
import { createClient } from "@supabase/supabase-js";
import PropTypes from "prop-types";
import DeleteModal from "../deleteModal/deleteModal";
import QueueModal from "../showQueue/showQueue"
import { MyContext } from "../../Providers/ContextProvider";
import { FaRegTrashCan } from "react-icons/fa6";

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
  const [showQueueModal, setShowQueueModal] = useState(false); // State for Queue Modal
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    fetchBookings();
  }, [triggerFetch, machineId, setBookings]);

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
      setIsLoading(true);
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
        setIsLoading(false);
      }
      fetchBookings();
    },
    [machineId, setBookings, updateNextBookingToActive]
  );

  useEffect(() => {
    if (isLoading) return;
    const activeBooking = bookings[machineId]?.find(
      (booking) => booking.status === "active"
    );
    if (activeBooking && activeBooking.id !== activeBookingId) {
      setActiveBookingRemainingTime(activeBooking.duration);
      setActiveBookingId(activeBooking.id);
    } else if (!activeBooking && activeBookingId !== null) {
      setActiveBookingRemainingTime(null);
      setActiveBookingId(null);
    }
  }, [bookings, machineId, activeBookingId, isLoading]);

  useEffect(() => {
    const updateRemainingTimeInDb = async (bookingId, newRemainingTime) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ duration: newRemainingTime })
        .eq("id", bookingId);
      console.log(data);
      if (error) console.error("Error updating booking duration:", error);
    };

    const timer = setInterval(() => {
      if (activeBookingRemainingTime > 0 && numBookings > 1) {
        setActiveBookingRemainingTime((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          if (newTime % 1 === 0) {
            updateRemainingTimeInDb(activeBookingId, newTime);
          }
          return newTime;
        });
      } else if (activeBookingRemainingTime === 0 && activeBookingId !== null) {
        handleDeleteBooking(activeBookingId);
        setActiveBookingRemainingTime(null);
        setActiveBookingId(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [
    activeBookingRemainingTime,
    handleDeleteBooking,
    activeBookingId,
    numBookings,
  ]);

  return (
    <>
      <div className={style.booking_list}>
        {isLoading ? (
          <div>Loading...</div>
        ) : bookings[machineId]?.length > 0 ? (
          <div className={style.user_booking_active}>
            <h2>{bookings[machineId][0].user_name}</h2>
            <p>Time remaining: {formatDuration(activeBookingRemainingTime)}</p>
            <div className={style.booking_buttons}>
              <button
                data-booking-id={bookings[machineId][0].id}
                onClick={() => openDeleteModal(bookings[machineId][0])}
              >
                <FaRegTrashCan />
              </button>
            </div>
          </div>
        ) : (
          <div className={style.user_booking_inactive}>
            <h2>No active bookings</h2>
          </div>
        )}
        {bookings[machineId]?.length > 1 ? (
          <div className={style.user_booking_active}>
            <h3 onClick={() => setShowQueueModal(true)}>Show Queue</h3>
            <p>
              <span>{bookings[machineId].length - 1} {bookings[machineId].length - 1 === 1 ? 'person' : 'people'} </span>
              <span>
                | {" "}
                {formatDuration(
                  bookings[machineId]
                    .slice(1)
                    .reduce((total, booking) => total + booking.duration, 0)
                )}
              </span>
            </p>
          </div>
        ) : (
          <div className={style.user_booking_inactive}>
            <h2>No people in queue</h2>
          </div>
        )}
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
      <QueueModal
        show={showQueueModal}
        onClose={() => setShowQueueModal(false)}
        bookings={bookings[machineId]?.slice(1) || []}
        formatDuration={formatDuration}
        openDeleteModal={openDeleteModal}
        machineId={machineId}
      />
    </>
  );
};

Bookings.propTypes = {
  machineId: PropTypes.string.isRequired,
  bookingTime: PropTypes.string.isRequired,
};

export default Bookings;
