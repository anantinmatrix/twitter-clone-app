import Login from "./pages/Login"
import Register from "./pages/Register"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Notification from "./components/Notification"
import { useSelector } from "react-redux"
import Homepage from "./pages/Homepage"
import ErrorPage from "./pages/ErrorPage"
import CreateUsername from './pages/CreateUsername'
import io, { Socket } from 'socket.io-client'
import { API_BASE_URL } from "./env"

const socket = io(`${API_BASE_URL}`)


function App() {
  const loginSelector = useSelector((state)=> state.loginSlice)

  return (
    <div id="app">
      <Notification />
      <BrowserRouter>
        <Routes >
          <Route path="/*" element={loginSelector.isLogin ? <Homepage/> : <Login/>}/>
          <Route path="/register" element={<Register />} />
          <Route path='/createusername' element={<CreateUsername/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/app/*" element={loginSelector.isLogin ? <Homepage/>: <Login/>}/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App