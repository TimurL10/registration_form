import React, { useState, useEffect } from 'react';
import TicketForm from './TicketForm';
import './styles/MainList.css';

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]); // Для фильтрации
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [sortOrder, setSortOrder] = useState({ column: '', order: '' }); // Состояние сортировки
    const [filterDate, setFilterDate] = useState(''); // Для фильтрации по дате

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/tickets');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTickets(data);
            setFilteredTickets(data); // Изначально все данные
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTicket = async (ticketData) => {
        const method = ticketData.id ? 'PUT' : 'POST';
        const endpoint = ticketData.id
            ? `http://localhost:5000/api/tickets/${ticketData.id}`
            : 'http://localhost:5000/api/tickets';

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

    const handleNewTicket = () => {
        setSelectedTicket({
            ticketname: '',
            eventstartdate: '',
            nextcontactdate: '',
            description: '',
            eventenddate: '',
            eventtype: '',
        });
        setShowForm(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Сортировка
    const handleSort = (column) => {
        const order = sortOrder.column === column && sortOrder.order === 'asc' ? 'desc' : 'asc';
        const sortedData = [...filteredTickets].sort((a, b) => {
            if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredTickets(sortedData);
        setSortOrder({ column, order });
    };

    // Фильтрация по дате
    const handleFilter = (date) => {
        setFilterDate(date);
        if (date) {
            const filtered = tickets.filter((ticket) => ticket.eventstartdate === date);
            setFilteredTickets(filtered);
        } else {
            setFilteredTickets(tickets); // Показываем все данные, если дата не выбрана
        }
    };

    return (
        <div>
            <h1>Список Заявок</h1>
            <hr style={{ border: '1px solid #ccc', marginBottom: '10px' }} />

            {/* Фильтр */}
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Фильтр по дате начала события:{' '}
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => handleFilter(e.target.value)} 
                    />
                </label>
            </div>

            {/* Новая заявка */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button onClick={handleNewTicket}>Новая Заявка</button>
            </div>

            {showForm && <TicketForm ticketData={selectedTicket} saveTicket={saveTicket} />}
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                Название заявки
                                <button onClick={() => handleSort('ticketname')}>                                   
                                </button>
                            </th>
                            <th>
                                Начало события
                                <button onClick={() => handleSort('eventstartdate')}>
                                    {sortOrder.column === 'eventstartdate' &&
                                    sortOrder.order === 'asc'
                                        ? '↓'
                                        : '↑'}
                                </button>
                            </th>
                            <th>
                                Конец события
                                <button onClick={() => handleSort('eventenddate')}>
                                    {sortOrder.column === 'eventenddate' && sortOrder.order === 'asc'
                                        ? '↓'
                                        : '↑'}
                                </button>
                            </th>
                            <th>
                                Дата следующего контакта
                                <button onClick={() => handleSort('nextcontactdate')}>
                                    {sortOrder.column === 'nextcontactdate' &&
                                    sortOrder.order === 'asc'
                                        ? '↓'
                                        : '↑'}
                                </button>
                            </th>
                            <th>Описание</th>
                            <th>Тип события</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => {
                                    setSelectedTicket(item);
                                    setShowForm(true);
                                }}
                            >
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
