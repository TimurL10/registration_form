import React, { useState, useEffect } from 'react';
import TicketForm from './TicketForm';
import './styles/MainList.css';

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false); // Состояние для выпадающего списка

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/tickets'); // Обновите путь
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onSelectCompany = () =>{
        return;
    }
    
    const saveTicket = async (ticketData) => {
        const method = ticketData.id ? 'PUT' : 'POST';
        const endpoint = ticketData.id ? `http://localhost:5000/api/tickets/${ticketData.id}` : 'http://localhost:5000/api/tickets'; 
    
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData),
        });
    
        if (response.ok) {
            fetchData();
            setShowForm(false);
        } else {
            console.error('Failed to save the ticket');
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    const handleNewTicket = () => {
        setSelectedTicket({ ticketname: '', eventstartdate: '', nextcontactdate: '', description: '', eventenddate: '', eventtype: '' });
        setShowForm(true);
    };    

    return (
        <div>
            <h1>Список Заявок</h1>
            <hr style={{ border: '1px solid #ccc', marginBottom: '10px' }} /> {/* Разделительная линия */}
            
            <div style={{ display: 'flex',  justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button onClick={handleNewTicket}>Новая Заявка</button>
                <div>
                    <button onClick={() => setShowDropdown(!showDropdown)}>Действие</button>
                    {showDropdown && ( // условный рендеринг выпадающего списка
                        <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1 }}>
                            <ul style={{ listStyle: 'none', padding: '10px', margin: '0' }}>
                                <li><button>Опция 1</button></li>
                                <li><button>Опция 2</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
    
            {showForm && <TicketForm ticketData={selectedTicket} saveTicket={saveTicket} />}
            {isLoading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Название заявки</th>
                            <th>Начало события</th>                           
                            <th>Конец события</th>
                            <th>Дата следующего контакта</th>
                            <th>Описаниие</th>
                            <th>EventType</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(item => (
                            <tr key={item.id} onClick={() => { setSelectedTicket(item); setShowForm(true); }}>
                                <td>{item.id}</td>
                                <td>{item.ticketname}</td>
                                <td>{item.eventstartdate}</td>
                                <td>{item.eventenddate}</td>                             
                                <td>{item.nextcontactdate}</td>
                                <td>{item.description}</td>
                                <td>{item.eventtype}</td>                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    
}

export default Ticket;
