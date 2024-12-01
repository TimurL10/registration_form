import './styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext"; // Контекст для управления аутентификацией

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Для переадресации
    const { setAuthenticated } = useAuth(); // Устанавливаем аутентификацию

   
    
    const handleRegister = () => {
        navigate('/register'); // Переход на страницу регистрации
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setAuthenticated(true);
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong');
        }
    };

    return (
            <div class="centered-box">
                <h1 className="login-title">Добро пожаловать</h1>
                <p className="login-subtitle">Авторизуйтесь, чтобы продолжить</p>
                <hr className="divider" />

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                        />
                    </div>

                    <button type="submit" className="login-btn">Войти</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                </form>

                <hr className="divider" />
                <div className="login-actions">
                    <button className="action-btn" onClick={handleRegister}>Регистрация</button>
                    <button className="action-btn">Забыли пароль?</button>
                </div>
            </div>
    );
}

export default Login;
