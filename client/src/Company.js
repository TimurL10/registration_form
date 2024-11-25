// src/Company.js

import React, { useState, useEffect } from 'react';
import CompanyForm from './CompanyForm';
import './styles/MainList.css';

function Company() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false); // Состояние для выпадающего списка
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);



    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/companies');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleNewCompany = () => {
        setSelectedCompany({ CompanyName: '', CompanyDescription: '', CompanyPhone: '', CompanyEmail: '', CompanyWebSite: '', CompanyAddress: '', Contacts: [] });
        setShowForm(true);
    };

    const saveCompany = async (companyData) => {
        const method = companyData.id ? 'PUT' : 'POST';
        const endpoint = companyData.id ? `http://localhost:5000/api/companies/${companyData.id}` : 'http://localhost:5000/api/companies';

        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData),
        });

        if (response.ok) {
            fetchCompanies();
            setShowForm(false);
        } else {
            console.error('Failed to save the company');
        }
    };

    return (
        <div>
            <h1>Список Компаний</h1>
            <hr style={{ border: '1px solid #ccc',  marginBottom: '10px' }} /> {/* Разделительная линия */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button onClick={handleNewCompany}>Новая Компания</button>
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
            
            {showForm && <CompanyForm 
                companyData={selectedCompany} 
                saveCompany={saveCompany} 
                showAdditionalFields={showAdditionalFields} // Передаем состояние в CompanyForm
                setShowAdditionalFields={setShowAdditionalFields} // Функцию для изменения состояния
                />}
            {isLoading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Адрес</th>
                            <th>Описание компании</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(item => (
                            <tr key={item.companyid} onClick={() => { setSelectedCompany(item); setShowForm(true); }}>
                                <td>{item.companyid}</td>
                                <td>{item.companyname}</td>
                                <td>{item.companyphone}</td>
                                <td>{item.companyemail}</td>
                                <td>{item.companyaddress}</td>
                                <td>{item.companydescription}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Company;
