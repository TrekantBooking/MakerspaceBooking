import style from "../App.module.scss";
import logo from "../assets/Makerspace.png";
import { Link } from "react-router-dom";
import Machines from "../components/machines/machines";


const AdminPage = () => {


    return (
        <>
            <div className={style.heading}>
                <img src={logo} alt="makerspace" />
                <h1>Admin</h1>
                <Link to="/"> Tilbage </Link>


            </div>
            <Machines page="admin" />
        </>
    );

}

export default AdminPage;