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
// сохранить/обновить конфиг
app.post("/api/form-config", async (req, res) => {
    const { companyId, fields } = req.body;
    if (!companyId || !Array.isArray(fields)) {
        return res.status(400).json({ error: "Bad request" });
    }
    try {
        const { rows } = await pool.query(`INSERT INTO form_config (company_id, fields)
       VALUES ($1, $2)
       ON CONFLICT (company_id) DO UPDATE SET fields = EXCLUDED.fields, updated_at = now()
       RETURNING *`, [companyId, JSON.stringify(fields)]);
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});
// получить конфиг для формы
app.get("/api/form-config", async (req, res) => {
    const { companyId } = req.query;
    if (!companyId)
        return res.status(400).json({ error: "companyId required" });
    try {
        const { rows } = await pool.query("SELECT fields FROM form_config WHERE company_id=$1", [companyId]);
        res.json(rows[0] ? rows[0].fields : []);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});
initPgClient();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
