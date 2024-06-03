import { useState } from 'react';
import style from './bookingModal.module.scss';

const Modal = ({ show, onClose, onSubmit, selectedMachine }) => {
    const [user_name, setUser_name] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        onSubmit({ user_name, password });
        setUser_name('');
        setPassword('');
    };

    if (!show) return null;

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h2>Book {selectedMachine.name}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={user_name}
                            onChange={(e) => setUser_name(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
