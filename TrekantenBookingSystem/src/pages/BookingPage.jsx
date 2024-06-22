import Machines from "../components/machines/machines";
import style from "../App.module.scss";
import logo from "../assets/Makerspace.png";
import { Link } from "react-router-dom";





const BookingPage = () => {
    return (
        <>
            <div className={style.heading}>
                <img src={logo} alt="makerspace" />
                <h1>BOOKING</h1>
                <Link to="/admin"></Link>
            </div>
            <Machines page="booking" />
        </>
    );
}

export default BookingPage;