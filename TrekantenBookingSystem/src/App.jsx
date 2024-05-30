import { useState, useEffect } from 'react'
import style from './App.module.scss'



function App() {

  const machines = [
    "Bambu Lab",
    "Brother",
    "Eduard",
    "VLS 3.50",
    "VLS 6.60",
    "PRO 4100S",
    "Roland BIV-20"
  ]


  return (
    <>
      <h1>Book en maskine </h1>
      <div className={style.machineList}>
        {machines.map((machine, index) => (
          <div key={index} >
            <h2>{machine}</h2>
            <div className={style.buttonContainer}>
              <button>Book</button>

            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
