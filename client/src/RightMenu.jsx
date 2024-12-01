import { Link } from 'react-router-dom';


function RightMenu({ setActiveModule }) {
    return (
        <div className="right-menu">
            <ul >               
                <li> <div style={{ display: 'flex', alignItems: 'center'}}>
                <Link 
                    to="/login" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        login
                    </span>
                </Link>
            </div>
            </li>
            <li> <div style={{ display: 'flex', alignItems: 'center'}}>
                <Link 
                    to="/" 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                    <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '30px', marginRight: '8px' }}
                    >
                        settings
                    </span>
                </Link>
            </div>
            </li>
            </ul>
        </div>
    );
}

export default RightMenu;



