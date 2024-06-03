import { useState } from 'react';
import style from './deleteModal.module.scss';

const DeleteModal = ({ show, onClose, onSubmit, booking }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ password, bookingId: booking.id });
        setPassword('');
    };

    if (!show) return null;

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h2>Delete Booking for {booking.user_name}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Key:
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

export default DeleteModal;
