function RightMenu({ setActiveModule }) {
    return (
        <div className="right-menu">
            <ul>
                <li><button onClick={() => setActiveModule('default')}>
                <img 
                    src="https://fonts.gstatic.com/s/i/materialiconsoutlined/login/v1/24px.svg" 
                    alt="Войти" 
                    style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                />
                    </button></li>
                <li><button onClick={() => setActiveModule('moduleA')}>
                <img 
                    src="https://fonts.gstatic.com/s/i/materialiconsoutlined/settings/v1/24px.svg" 
                    alt="Настройки" 
                    style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                />
                    </button></li>
                {/* Добавьте другие пункты меню по необходимости */}
            </ul>
        </div>
    );
}

export default RightMenu;



