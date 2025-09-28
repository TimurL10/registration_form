import { useState } from 'react';
import Main from './Main';
import Configuration from './Configuration';
import './Index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [activeModule, setActiveModule] = useState('default');
   
    return ( 
        <Router>
            <div className="app-container">
               {}
               <div className="main-content">
                    <Routes>
                        <Route path='/' element={<Main/>} />
                        <Route path='/configuration' element={<Configuration/>} />                       
                    </Routes>
                     <ToastContainer position="top-right" autoClose={3000} />
                </div>
            </div>
        </Router>
    );
}
export default App;
