import { useState } from 'react';
import Main from './pages/Main';
import Configuration from './pages/Configuration';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register'; 
import FormsDashboard from './pages/FormsDashboard';
import './Index.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isLoggedIn, logout } from "./api/authClient";



function App() {
const [activeModule, setActiveModule] = useState('default');
const nav = useNavigate();
const logged = isLoggedIn();

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-semibold">Registration App</Link>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-700 hover:text-black">Главная</Link>
            <Link to="/configuration" className="text-gray-700 hover:text-black">Конструктор</Link>
            {logged ? (
              <button className="text-red-600" onClick={() => { logout(); nav("/login"); }}>
                Выйти
              </button>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600">Войти</Link>
                <Link to="/register" className="text-indigo-600">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path='/registrationform' element={<Main/>} />

        {/* защищаем конструктор (и другие приватные страницы) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<FormsDashboard />} />   
          <Route path="/configuration" element={<Configuration/>} />
        </Route>

        {/* твои остальные маршруты ... */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
  }
export default App;