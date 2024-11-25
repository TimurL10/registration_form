import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanySearch = ({ onSelectCompany }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchCompanies = async () => {
        if (!searchTerm) {
            setCompanies([]);
            return;
        }

        setLoading(true);

        try {
            // Замените URL на ваш эндпоинт для поиска компаний
            const response = await axios.get(`http://localhost:5000/api/companies/search?query=${searchTerm}`); // Запрос на сервер
            setCompanies(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке компаний:', error);
        } finally {
            setLoading(false);
        }
    };

    // Задержка перед отправкой запроса (debouncing)
    const timeoutId = setTimeout(fetchCompanies, 300); // Задержка в 300 мс
    return () => clearTimeout(timeoutId);
}, [searchTerm]);

    const handleSelect = (company) => {
        setSearchTerm(company.companyname);
        onSelectCompany(company.companyid); // Возвращаем выбранный ID компании
        setCompanies([]);
    };

    return (
        <div style={{ position: 'relative'}}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск компании..."
            />
            {loading && <div>Загрузка...</div>}
            <ul style={{ border: '1px solid #ccc', position: 'absolute', width: '100%', zIndex: 1000, margin: 0, padding: 0, listStyle: 'none', backgroundColor: 'white' }}>
                {companies.map((company) => (
                    <li key={company.companyid} onClick={() => handleSelect(company)} style={{ cursor: 'pointer', padding: '8px' }}>
                        {company.companyname}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompanySearch;