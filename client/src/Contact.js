import React, { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import './styles/MainList.css';

function Contact(){
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false); // Состояние для выпадающего списка
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    
    
    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/contacts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleNewContact = () => {
        setSelectedContact({name:'',familyname:'',email:'',primaryphone:'',secondaryphone:'',additionalphone:'',note:'',companyid:'',companyname:''});
        setShowForm(true);
    };


    const saveContact = async (contactData) => {
        const method = contactData.id ? 'PUT' : 'POST';
        const endpoint = contactData.id ? `http://localhost:5000/api/contacts/${contactData.id}` : 'http://localhost:5000/api/contacts';

        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });

        if (response.ok) {
            fetchContacts();
            setShowForm(false);
        } else {
            console.error('Failed to save the contact');
        }
    };


    return (
        <div>
            <h1>Список Контактов</h1>
            <hr style={{ border: '1px solid #ccc', marginBottom: '10px' }} /> {/* Разделительная линия */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <button onClick={handleNewContact}>Новый Контакт</button>
                <div>
                    <button onClick={() => setShowDropdown(!showDropdown)}>Действие</button>
                    {showDropdown && ( // условный рендеринг выпадающего списка
                        <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1 }}>
                            <ul style={{ listStyle: 'none', padding: '10px', margin: '0' }}>
                                <li><button type="button" onClick={()=> setShowAdditionalFields(!showAdditionalFields)}>{showAdditionalFields ? 'Скрыть доп. поля' : 'Показать доп. поля'}</button></li>
                                <li><button>Опция 2</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            {showForm && <ContactForm 
                contactData={selectedContact} 
                saveContact={saveContact} 
                showAdditionalFields={showAdditionalFields} // Передаем состояние в CompanyForm
                setShowAdditionalFields={setShowAdditionalFields} // Функцию для изменения состояния
                />}
            {isLoading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Фамилия</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Телефон 2</th>
                            <th>Телефон 3</th>
                            <th>Описание</th>
                            <th>Компания</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(item => (
                            <tr key={item.contactid} onClick={() => { setSelectedContact(item); setShowForm(true); }}>
                                <td>{item.name}</td>
                                <td>{item.familyname}</td>
                                <td>{item.email}</td>
                                <td>{item.primaryphone}</td>
                                <td>{item.secondaryphone}</td>
                                <td>{item.additionalphone}</td>
                                <td>{item.note}</td>
                                <td>{item.companyname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

    
export default Contact;
