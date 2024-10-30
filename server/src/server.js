const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Импортируем пакет cors
var db_rep = require('./DbRepository');

const app = express();
const PORT = 5000;

// Используем CORS
app.use(cors());

// Middleware для парсинга JSON-запросов
app.use(bodyParser.json());

// Имитация базы данных (можно заменить на настоящую)
let tickets = [];


// Заявки

app.get('/api/tickets', async(req, res) => {
    await db_rep.load_config();
    res.json(tickets);
});

app.post('/api/tickets', async(req, res) => {
    const newTicket = req.body;
    await db_rep.load_config();
    await db_rep.save_new_ticket(newTicket)
    tickets.push(newTicket); 
    res.status(201).json(newTicket);
});

app.put('/api/tickets/id', (req, res) => {
    const ticketId = parseInt(req.params.id);
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);

    if (ticketIndex !== -1) {
        tickets[ticketIndex] = { ...tickets[ticketIndex], ...req.body };
        res.json(tickets[ticketIndex]);
    } else {
        res.status(404).json({ message: 'Ticket not found' });
    }
});

// Компании

app.post('/api/companies', async (req, res) => {
    try {
        const newCompany = req.body;
        await db_rep.load_config();
        const savedCompany = await db_rep.save_new_company(newCompany); 
        res.status(201).json(savedCompany); 
    }
    catch(e) {
        console.warn(new Date().toISOString(), 'server.js', 'app.post', e.stack);
        res.status(500).json({ message: 'Ошибка при сохранении компании', error: e.message });
    }
    
});

app.get('/api/companies', async (req, res) => {
    try {
        // await db_rep.load_config();
        const companies = await db_rep.get_companies(); 
        res.json(companies);
    }
    catch(e) {
        console.warn(new Date().toISOString(), 'server.js', 'app.get', e.stack);
        res.status(500).json({ message: 'Ошибка при сохранении компании', error: e.message });
    }
   
});

// Create a new contact
app.post('/contacts', (req, res) => {
    const contact = req.body;
    db_rep.save_new_contact(contact)
        .then((result) => res.status(201).json(result))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Get all contacts
app.get('/contacts', (req, res) => {
    db_rep.get_all_contacts()
        .then((contacts) => res.json(contacts))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Get a contact by ID
app.get('/contacts/:id', (req, res) => {
    const id = req.params.id;
    db.getContactById(id)
        .then((contact) => res.json(contact))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Update a contact
app.put('/contacts/:id', (req, res) => {
    const id = req.params.id;
    const updatedContact = req.body;
    db.updateContact(id, updatedContact)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;
    db.deleteContact(id)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
