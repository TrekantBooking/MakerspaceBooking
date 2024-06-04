import { useState } from "react";
import style from "./bookingModal.module.scss";

const Modal = ({ show, onClose, onSubmit, selectedMachine }) => {
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ user_name, password });
    setUser_name("");
    setPassword("");
  };

  if (!show) return null;

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>{selectedMachine.name}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={user_name}
            onChange={(e) => setUser_name(e.target.value)}
            required
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Secret Key"
          />
          <button className={style.submit_button} type="submit">
            Book
          </button>
        </form>
        <button className={style.delete_button} type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
