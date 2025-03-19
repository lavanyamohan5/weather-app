import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Weather from './weather'
import "leaflet/dist/leaflet.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Weather/>
      </div>
       
    </>
  )
}

export default App
