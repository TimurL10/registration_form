
# Интеграция клиента из mini-auth-cra в проект registration_form

В проект добавлен отдельный фронтенд `auth-client` (скопирован из `mini-auth-cra/client`) рядом с существующим `registration_form/client`.

## Структура
```
registration_form/
  auth-client/     # клиент аутентификации (Login/Register)
  client/          # основной клиент конфигуратора формы
  server/          # backend формы на порту 4000
```

## Запуск

### 1) Backend формы
```
cd registration_form/server
npm install
npm run dev   # слушает PORT=4000 (по умолчанию)
```

### 2) Auth-клиент (из mini-auth-cra)
```
cd registration_form/auth-client
cp .env.example .env
# при необходимости измените REACT_APP_API_URL на адрес auth-сервера (по умолчанию http://localhost:5001)
npm install
npm start
```

### 3) Клиент конфигуратора формы
```
cd registration_form/client
npm install
npm start
```

> Примечание: `auth-client` ожидает backend авторизации (из `mini-auth-cra/server`) на `REACT_APP_API_URL`. 
Если вы хотите пользоваться входом/регистрацией, поднимите `mini-auth-cra/server` (порт 5001 по умолчанию) или укажите ваш развернутый URL в `.env`.

## Как объединить UI в один домен (опционально)

- Вариант A: настроить Nginx/Reverse proxy и отдать оба клиента как /auth (auth-client) и /app (client).
- Вариант B: оставить два dev-сервера во время разработки: `http://localhost:3000` (auth) и `http://localhost:5173`/`3001` (основной), а ссылки друг на друга сделать абсолютными.

## Что было изменено
- Скопирован каталог `mini-auth-cra/mini-auth-cra/client` → `registration_form/auth-client`.
- Обновлён `package.json` (`name: "auth-client"`).
- Добавлен `.env.example` с `REACT_APP_API_URL=http://localhost:5001`.

