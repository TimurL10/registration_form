import React, { useState, useEffect } from 'react';
import './styles/ContactForm.css';


const ContactForm = ({ existingContact, onSave, showAdditionalFields }) => {
    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (existingContact) {
            setContact(existingContact);
        }
    }, [existingContact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact((prevContact) => ({
            ...prevContact,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(contact);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Имя:</label>
                <input type="text" id="name" name="name" value={contact.name} onChange={handleChange} />

                <label htmlFor="familyname">Фамилия:</label>
                <input type="text" id="familyname" name="familyname" value={contact.familyname} onChange={handleChange} />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={contact.email} onChange={handleChange} />

                <label htmlFor="phone">Телефон:</label>
                <input type="text" id="primaryphone" name="primaryphone" value={contact.primaryphone} onChange={handleChange} />                

                {showAdditionalFields && <div>
                <label htmlFor="phone">Доп. Телефон:</label>
                <input type="text" id="secondaryphone" name="secondaryphone" value={contact.secondaryphone} onChange={handleChange} /> </div>}

                {showAdditionalFields && <div><label htmlFor="phone">Доп. Телефон:</label>
                <input type="text" id="additionalphone" name="additionalphone" value={contact.additionalphone} onChange={handleChange} /></div>}

                <label htmlFor="address">Адрес:</label>
                <input type="text" id="address" name="address" value={contact.address} onChange={handleChange}/>

                <label htmlFor="note">Заметка:</label>
                <textarea id="note" name="note" value={contact.note} onChange={handleChange}></textarea>

                <label htmlFor="companyname">Компания:</label>
                <textarea id="companyid" name="companyid" value={contact.companyid} onChange={handleChange}></textarea>

                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default ContactForm;

