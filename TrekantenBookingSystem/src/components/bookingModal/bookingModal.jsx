import { useState } from "react";
import style from "./bookingModal.module.scss";
import { IoMdClose } from "react-icons/io";

const Modal = ({ show, onClose, onSubmit, selectedMachine }) => {
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ user_name, password, quantity });
    setUser_name("");
    setPassword("");
    setQuantity(1);
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
          <label htmlFor="quantity" className={style.quantity_label}>
            <p>Quantity:</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="1"
              className={style.quantity_input}
            />
          </label>
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
