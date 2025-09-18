import { useState } from 'react';
import Main from './Main';
import './Index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [activeModule, setActiveModule] = useState('default');
   
    return ( 
        <Router>
            <div className="app-container">
               {}
               <div className="main-content">
                    <Routes>
                        <Route path='/' element={<Main/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
export default App;
