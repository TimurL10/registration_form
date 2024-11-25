// src/CompanyForm.js

import React, { useState, useEffect } from 'react';
//import './styles/CompanyForm.css';
//import './styles/MainList.css';

function CompanyForm({ saveCompany, companyData, showAdditionalFields, setShowAdditionalFields }) {
    const [company, setCompany] = useState(companyData);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        setCompany(companyData); // Обновляем состояние при изменении companyData
        setContacts(companyData.Contacts || []); // Устанавливаем контакты
    }, [companyData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCompany(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        saveCompany({ ...company, Contacts: contacts });
    };

    const addContact = () => {
        setContacts(prev => [...prev, { Name: '', Email: '', Phone: '' }]);
    };

    const handleContactChange = (index, event) => {
        const { name, value } = event.target;
        const updatedContacts = [...contacts];
        updatedContacts[index] = { ...updatedContacts[index], [name]: value };
        setContacts(updatedContacts);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Название компании:
                    <input
                        type="text"
                        name="CompanyName"
                        value={company.CompanyName}
                        onChange={handleChange}
                        required
                    />
                </label>
                {showAdditionalFields &&
                <label>
                    Описание:
                    <textarea
                        name="CompanyDescription"
                        value={company.CompanyDescription}
                        onChange={handleChange}
                    />
                </label>
                }
                <label>
                    Телефон:
                    <input
                        type="text"
                        name="CompanyPhone"
                        value={company.CompanyPhone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="CompanyEmail"
                        value={company.CompanyEmail}
                        onChange={handleChange}
                    />
                </label>                
                {showAdditionalFields &&
                <label>
                    Веб-сайт:
                    <input
                        type="text"
                        name="CompanyWebSite"
                        value={company.CompanyWebSite || ''}
                        onChange={handleChange}
                    />
                </label>}               
                <label>
                    Адрес:
                    <input
                        type="text"
                        name="CompanyAddress"
                        value={company.CompanyAddress}
                        onChange={handleChange}
                    />
                </label>
                <h3>Контакты</h3>
                {contacts.map((contact, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="Name"
                            placeholder="Имя"
                            value={contact.Name}
                            onChange={e => handleContactChange(index, e)}
                            required    
                            
                        />
                        {showAdditionalFields &&
                         <input
                            type="text"
                            name="FamilyName"
                            placeholder="Фамилия"
                            value={contact.FamilyName}
                            onChange={e => handleContactChange(index, e)}
                        />
                        }
                        <input
                            type="text"
                            name="Email"
                            placeholder="Email"
                            value={contact.Email}
                            onChange={e => handleContactChange(index, e)}
                        />                        
                        <input
                            type="text"
                            name="PrimaryPhone"
                            placeholder="Телефон"
                            value={contact.PrimaryPhone}
                            onChange={e => handleContactChange(index, e)}
                            style={{ flex: 1, marginRight: '5px' }}
                            required
                        />
                        {showAdditionalFields &&                        
                        <input
                            type="text"
                            name="SecondaryPhone"
                            placeholder="Доп. Телефон"
                            value={contact.SecondaryPhone}
                            onChange={e => handleContactChange(index, e)}
                            style={{ flex: 1, marginRight: '5px' }}
                        />
                        }
                        {showAdditionalFields &&                        
                        <input
                            type="text"
                            name="AdditionalPhone"
                            placeholder="Доп. Телефон"
                            value={contact.AdditionalPhone}
                            onChange={e => handleContactChange(index, e)}
                            style={{ flex: 1, marginRight: '5px' }}
                        />
                        }
                        {showAdditionalFields &&                                               
                        <input
                            type="text"
                            name="Note"
                            placeholder="Заметка"
                            value={contact.Note}
                            onChange={e => handleContactChange(index, e)}
                        />
                        }   
                        <br/>
                        <br/>                     
                    </div>
                ))}
                <button type="button" onClick={addContact}>Добавить контакт</button>
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
}

export default CompanyForm;
