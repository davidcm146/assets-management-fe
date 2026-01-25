import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="container">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
