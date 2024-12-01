import React, { useState } from 'react';
import './styles/RegistrationPage.css'

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username,email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
            } else {
                setSuccessMessage('Регистрация успешна');
                setError('');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Регистрация</h1>
            <p className="register-subtitle">Создайте аккаунт</p>
            <hr className="divider" />

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Введите имя пользователя"
                    />
                </div>
                <div className="form-group">
                    <label>Имейл:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите имейл"
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />
                </div>                
                <div className="form-group">
                    <label>Подтвердите пароль:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Подтвердите пароль"
                    />
                </div>
                <button type="submit" className="register-btn">Зарегистрироваться</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </div>
    );
}

export default Registration;
