"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Подключение к базе (Render PostgreSQL или другая)
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // для Render Postgres
});
// Middleware для парсинга JSON-запросов
app.use(body_parser_1.default.json());
//dbrep.load_config();
async function initPgClient() {
    let pg_conf = new pg_1.Client({
        host: 'dpg-d366st6r433s73dvhqb0-a.oregon-postgres.render.com',
        port: 5432,
        database: 'registration_form_bd',
        user: 'admin',
        password: 'jKcutjuPA9EA795ICY18AlhYXHV7XU4H',
        ssl: { rejectUnauthorized: false }
    });
    await pg_conf.connect();
    pg_conf.on('error', (err) => {
        console.log(err);
    });
    return pg_conf;
}
initPgClient();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
