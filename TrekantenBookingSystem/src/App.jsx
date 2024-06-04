import style from "./App.module.scss";
import Machines from "./components/machines/machines";
import logo from "./assets/Makerspace.png";

function App() {
  return (
    <>
      <div className={style.heading}>
        <img src={logo} alt="makerspace" />
        <h1>Book en maskine </h1>
      </div>
      <Machines />
    </>
  );
}

export default App;
