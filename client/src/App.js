import { useState } from 'react';
import './styles/App.css';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Ticket from './Ticket';
import Company from './Company';
import Contact from './Contact';

function App() {
const [activeModule, setActiveModule] = useState('default');

// Функция для рендеринга содержимого на основе активного модуля
const renderContent = () => {
    switch (activeModule) {
        case 'Ticket':
            return <Ticket />;
        case 'Company':
            return <Company />;
            case 'Contact':
                return <Contact />;
        default:
            return <Ticket />;
    }
};

return (
    <div className="app-container">
        <LeftMenu setActiveModule={setActiveModule} />
        <div className="main-content">
            {renderContent()}
        </div>
        <RightMenu setActiveModule={setActiveModule} />
    </div>
);
}
export default App;
