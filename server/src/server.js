const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Импортируем пакет cors
var dbrep = require('./DbRepository');

const app = express();
const PORT = 5000;

let companies = [];

// Используем CORS
app.use(cors());

// Middleware для парсинга JSON-запросов
app.use(bodyParser.json());

let tickets = [];

dbrep.load_config(); 


app.post('/api/login', async(req,res) => {
    try {
        await dbrep.loginUser(req,res);
    }
    catch(e) {
        res.status(500).json({message: 'Internal Server Error'})
    }


});

app.post('/api/register',async(req,res) => {
    try{
        await dbrep.registerUser(req,res)
    }
    catch(e) {
        res.status(500).json({message: 'Internal Server Error'})
    }
})


// Заявки

app.get('/api/tickets', async(req, res) => {
    let tickets = await dbrep.get_tickets();
    res.json(tickets);
});

app.post('/api/tickets', async(req, res) => {
    const newTicket = req.body;
    await dbrep.save_new_ticket(newTicket)
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
        const savedCompany = await dbrep.save_new_company(newCompany); 
        res.status(201).json(savedCompany); 
    }
    catch(e) {
        console.warn(new Date().toISOString(), 'server.js', 'app.post', e.stack);
        res.status(500).json({ message: 'Ошибка при сохранении компании', error: e.message });
    }
    
});

app.get('/api/companies', async (req, res) => {
    try {
        companies = await dbrep.get_companies(); 
        res.json(companies);
    }
    catch(e) {
        console.warn(new Date().toISOString(), 'server.js', 'app.get', e.stack);
        res.status(500).json({ message: 'Ошибка при сохранении компании', error: e.message });
    }
   
});

app.get('/api/companies/search', async (req, res) => {
    const query = req.query.query.toLowerCase();
    if (companies.length == 0)
        companies = await dbrep.get_companies();  
    const filteredCompanies = companies.filter(company =>
        company.companyname.toLowerCase().includes(query)
    );

    
    res.json(filteredCompanies.slice(0, 10)); // Возвращаем только первые 10 результатов
});

// Create a new contact
app.post('/api/contacts', (req, res) => {
    const contact = req.body;
    dbrep.save_new_contact(contact)
        .then((result) => res.status(201).json(result))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    dbrep.get_all_contacts()
        .then((contacts) => res.json(contacts))
        .catch((err) => res.status(500).json({ error: err.message }));
});

app.get('/api/contacts/:companyId', async (req,res) => {
    const companyId = req.params.companyId;
    await dbrep.get_company_contacts(companyId)
        .then((contacts) => res.json(contacts))
        .catch((err) => res.status(500).json({error: err.message}));

})

// Get a contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    db.getContactById(id)
        .then((contact) => res.json(contact))
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Update a contact
app.put('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    const updatedContact = req.body;
    db.updateContact(id, updatedContact)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    db.deleteContact(id)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err.message }));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
