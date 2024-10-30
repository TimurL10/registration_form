function RightMenu({ setActiveModule }) {
    return (
        <div className="right-menu">
            <ul>
                <li><button onClick={() => setActiveModule('default')}>Главная</button></li>
                <li><button onClick={() => setActiveModule('moduleA')}>Модуль А</button></li>
                {/* Добавьте другие пункты меню по необходимости */}
            </ul>
        </div>
    );
}

export default RightMenu;
