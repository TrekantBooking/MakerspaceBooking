import React from "react";
import PropTypes from "prop-types";
import style from "./showQueue.module.scss";

const QueueModal = ({ show, onClose, bookings, formatDuration, openDeleteModal, machineId }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>Queue for Machine</h2>
        <button className={style.close_button} onClick={onClose}>
          Close
        </button>
        {bookings.map((booking, index) => (
          <ul className={style.queueList} key={booking.id}>
            <li>
              <h3>{booking.user_name}</h3>
              <span>In queue | {formatDuration(booking.duration)}</span>
              {console.log(booking)}
              <button onClick={() => openDeleteModal(booking)}>Delete</button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

QueueModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })
  ).isRequired,
  formatDuration: PropTypes.func.isRequired,
};

export default QueueModal;
