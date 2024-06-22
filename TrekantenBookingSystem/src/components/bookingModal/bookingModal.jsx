import { useState } from "react";
import style from "./bookingModal.module.scss";
import { IoMdClose, IoMdAdd, IoMdRemove } from "react-icons/io";

const Modal = ({ show, onClose, onSubmit, selectedMachine }) => {
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [quantity, setQuantity] = useState(selectedMachine.booking_time); // Default to intervalDuration


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ user_name, password, quantity });
    setUser_name("");
    setPassword("");
    setQuantity(selectedMachine.booking_time); // Reset to default intervalDuration
  };

  const handleQuantityChange = (modifier) => {
    const newQuantity = quantity + (selectedMachine.booking_time * modifier);
    if (newQuantity >= selectedMachine.booking_time) { // Prevent quantity from going below the intervalDuration
      setQuantity(newQuantity);
      console.log(quantity);
    }
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
            placeholder="Enter Your Name"
            className={style.username_input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose a password"
            className={style.password_input}
          />
          <div className={style.quantity_control}>
            <button type="button" onClick={() => handleQuantityChange(-1)} className={style.quantity_button}>
              <IoMdRemove />
            </button>
            <span className={style.quantity_display}>{quantity} min</span> {/* Display the current quantity */}
            <button type="button" onClick={() => handleQuantityChange(1)} className={style.quantity_button}>
              <IoMdAdd />
            </button>
          </div>
          <button className={style.submit_button} type="submit">
            Book
          </button>
        </form>
        <button className={style.close_button} type="button" onClick={onClose}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

export default Modal;
