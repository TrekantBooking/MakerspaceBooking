import { useState } from "react";
import style from "./deleteModal.module.scss";

const DeleteModal = ({ show, onClose, onSubmit, booking }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ password, bookingId: booking.id });
    setPassword("");
  };

  if (!show) return null;

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <div className={style.modal_header}>
          <h2>Delete Booking:</h2>
          <h2>{booking.user_name}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Secret Key"
          />
          <button className={style.submit_button} type="submit">Delete</button>
          <button className={style.close_button} type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
