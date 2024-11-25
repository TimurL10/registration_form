import React, { useState, useEffect } from 'react';
//import '.src/styles/TicketForm.css'; 
import DatePicker from 'react-datepicker';
import CompanySearch from './CompanySearch';
import axios from 'axios';
//import "react-datepicker/dist/react-datepicker.css";
//import { register } from 'react-datepicker'; // Импортируем функции регистрации
//import { ru } from 'date-fns/locale'; // Импортируем локализацию

//register('ru', ru);

function TicketForm({ saveTicket, ticketData = { ticketname: '', companyid: '', description: '', eventstartdate: '', eventenddate: '', nextcontactdate: '', contact: '',eventstatus:'' } }) {
    const [ticket, setTicket] = useState(ticketData);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async (companyid) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/contacts/${companyid}`)
            setContacts(response.data);
        }
        catch (error){
            console.error("Ошибка при загрузке контактов:", error);
            setContacts([]); 
        }
    };
 


     // Функция для обработки выбора компании
     const handleSelectCompany = (companyid) => {
        setSelectedCompanyId(companyid); // Обновляем состояние с ID выбранной компании
        fetchContacts(companyid);
        console.log(`Выбрана компания с ID: ${companyid}`);
    };

    useEffect(() => {
        setTicket(ticketData); // Обновляем состояние при изменении ticketData
    }, [ticketData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTicket(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const new_ticket = { 
            ...ticket, 
            companyid: selectedCompanyId // Добавляем поле company
        };
        saveTicket(new_ticket);
    };    

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Название заявки:
                    <input
                        type="text"
                        name="ticketname"
                        value={ticket.ticketname}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Выберите компанию:
                        <CompanySearch onSelectCompany={handleSelectCompany} /> 
                        {selectedCompanyId && <p>Выбранная компания ID: {selectedCompanyId}</p>}
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
                        name="eventstartdate"
                        value={ticket.eventstartdate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Конец мероприятия:
                    <input
                        type="datetime-local"
                        name="eventenddate"
                        value={ticket.eventenddate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Дата следующего контакта:
                    <input
                        type="datetime-local"
                        name="nextcontactdate"
                        value={ticket.nextcontactdate}
                        onChange={handleChange}
                    />
                </label>
                <label >
                    Контакт:
                    <select
                        type="text"
                        name="contact"
                        value={ticket.contact}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    >  
                    <option value=""></option>
                    {contacts.map((contact) => (
                        <option key={contact.contactid} value={contact.contactid}>
                            {contact.name}
                        </option>
                    ))}
                </select>
                </label>
                <label>
                    Статус:
                    <select
                        name="eventstatus"
                        value={ticket.eventstatus}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    >
                        <option value=""></option>
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