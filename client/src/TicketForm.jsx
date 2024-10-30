import React, { useState, useEffect } from 'react';
import './styles/TicketForm.css'; 
import DatePicker from 'react-datepicker';
//import "react-datepicker/dist/react-datepicker.css";
//import { register } from 'react-datepicker'; // Импортируем функции регистрации
//import { ru } from 'date-fns/locale'; // Импортируем локализацию

//register('ru', ru);

function TicketForm({ saveTicket, ticketData = { TicketName: '', company: '', description: '', EventStartDate: '', EventEndDate: '', NextContactDate: '', contact: '' } }) {
    const [ticket, setTicket] = useState(ticketData);

    useEffect(() => {
        setTicket(ticketData); // Обновляем состояние при изменении ticketData
    }, [ticketData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTicket(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        saveTicket(ticket);
    };    

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Название заявки:
                    <input
                        type="text"
                        name="TicketName"
                        value={ticket.TicketName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Компания:
                    <input
                        type="text"
                        name="company"
                        value={ticket.company}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={ticket.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Начало мероприятия:
                    <input
                        type="datetime-local"
                        name="EventEndDate"
                        value={ticket.EventEndDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Конец мероприятия:
                    <input
                        type="datetime-local"
                        name="EventEndDate"
                        value={ticket.EventEndDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Дата следующего контакта:
                    <input
                        type="datetime-local"
                        name="NextContactDate"
                        value={ticket.NextContactDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Контакт:
                    <input
                        type="text"
                        name="contact"
                        value={ticket.contact}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Статус:
                    <select
                        name="EventStatus"
                        value={ticket.EventStatus}
                        onChange={handleChange}
                    >
                        <option value="Закончено">Закончено</option>
                        <option value="Новое">Новое</option>
                        <option value="В работе">В работе</option>
                    </select>
                </label>

                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
}

export default TicketForm;