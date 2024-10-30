function LeftMenu({ setActiveModule }) {
    return (
        <div className="left-menu">
            <ul>
                <li><button onClick={() => setActiveModule('Ticket')}>Заявки</button></li>
                <li><button onClick={() => setActiveModule('Company')}>Компании</button></li>
                <li><button onClick={() => setActiveModule('Contact')}>Контакты</button></li>
                {/* Добавьте другие пункты меню по необходимости */}
            </ul>
        </div>
    );
}

export default LeftMenu;
