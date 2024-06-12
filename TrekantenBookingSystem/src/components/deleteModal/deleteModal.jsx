import { useState } from "react";
import style from "./deleteModal.module.scss";
import { IoMdClose } from "react-icons/io";

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
            placeholder="Enter Password"
          />
          <button className={style.submit_button} type="submit">Delete</button>
          <button className={style.close_button} type="button" onClick={onClose}>
            <IoMdClose />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
