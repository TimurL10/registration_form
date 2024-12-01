import { useState } from 'react';
import './styles/App.css';
import Login from './Login';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Ticket from './Ticket';
import Company from './Company';
import Contact from './Contact';
import Main from './Main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import { AuthProvider } from "./AuthContext";

function App() {
    const [activeModule, setActiveModule] = useState('default');
    /*
    // Функция для рендеринга содержимого на основе активного модуля
    const renderContent = () => {
        switch (activeModule) {
            case 'Ticket':
                return <Ticket />;
            case 'Company':
                return <Company />;
            case 'Contact':
                return <Contact />;
            case 'Login':
                return <Login />;
            case 'Registration':
                return <Registration />;            
            
        }
    };
    */
    return (
        <AuthProvider>
        <Router>
            <div className="app-container">
                <LeftMenu setActiveModule={setActiveModule} />
                <RightMenu setActiveModule={setActiveModule} />
               {/* Здесь рендерятся только маршруты */}
               <div className="main-content">
                    <Routes>
                        <Route path='/' element={<Main/>} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Registration />} />                        
                        <Route path='/tickets' element={<Ticket />} />
                        <Route path='/companies' element={<Company />} />
                        <Route path='/contacts' element={<Contact />} />
                    </Routes>
                </div>
            </div>
        </Router>
        </AuthProvider>
    );
}
export default App;
