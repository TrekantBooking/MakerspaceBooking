import React from "react";
import PropTypes from "prop-types";
import style from "./showQueue.module.scss";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const QueueModal = ({ show, onClose, bookings, formatDuration, openDeleteModal, machineId }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>Queue for Machine</h2>
        <button className={style.close_button} onClick={onClose}>
          <IoMdClose />
        </button>
        <div className={style.scrollableList}>
          {bookings.map((booking, index) => (
            <ul className={style.queueList} key={booking.id}>
              <li>
                <h3>{booking.user_name}</h3>
                <span>In queue | {formatDuration(booking.duration)}</span>
                <button onClick={() => openDeleteModal(booking)}><FaRegTrashCan /></button>
              </li>
            </ul>
          ))}
        </div>
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
