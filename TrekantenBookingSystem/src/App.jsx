import style from "./App.module.scss";
import Machines from "./components/machines/machines";

function App() {
  return (
    <>
      <div className={style.}>
        <h1>Book en maskine </h1>
      </div>
      <Machines />
    </>
  );
}

export default App;
