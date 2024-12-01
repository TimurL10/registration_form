import { Link } from 'react-router-dom';
import { useAuth } from "./AuthContext";




function LeftMenu() {

    const { authenticated } = useAuth(); // Получаем состояние аутентификации

    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: authenticated ? 'inherit' : 'gray', // Меняем цвет в зависимости от аутентификации
        pointerEvents: authenticated ? 'auto' : 'none', // Блокируем клики, если не аутентифицирован
        cursor: authenticated ? 'pointer' : 'not-allowed', // Меняем курсор
    };

    return (
        <div className="left-menu">
            <ul>
            <li>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <Link 
                    to="/" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        home
                    </span>
                    Главная
                </Link>
            </div>
            </li>
            <li>
            <div style={linkStyle}>
                <Link 
                    to="/tickets" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        cases
                    </span>
                    Заявки
                </Link>
            </div>
      
            </li>
            <li>
            <div style={linkStyle}>
                <Link 
                    to="/companies" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        business_center
                    </span>
                    Компании
                </Link>
            </div>
                </li>
            <li>
            <div style={linkStyle}>
                <Link 
                    to="/contacts" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        contacts
                    </span>
                    Контакты
                </Link>
            </div>
            </li>
            </ul>
        </div>
    );
}

export default LeftMenu;
