import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import https from "https";
import { Pool, Client } from "pg";
import  {authOptional} from "./authOptional.js";

const app : Application = express();
app.use(cors());
app.use(express.json());


export const pool = new Pool({
            host: 'dpg-d41723ali9vc739fvov0-a.oregon-postgres.render.com',
            port: 5432,
            database: 'registration_form_pg1',
            user: 'registration_form_pg1_user',
            password: 'fA5vRpQrNfg07LILIHHHaFIRapXr5nP8', 
            ssl: { rejectUnauthorized: false }
});

// Middleware для парсинга JSON-запросов
app.use(bodyParser.json());

// сохранить/обновить конфиг
app.post("/api/form-config", async (req, res) => {
  console.log(req.body);
  const { companyId, fields } = req.body;
  if (!companyId || !Array.isArray(fields)) {
    return res.status(400).json({ error: "Bad request" });
  }

  try {    
    const { rows } = await pool.query(
      `INSERT INTO form_config (company_id,fields)
       VALUES ($1, $2)
       ON CONFLICT (company_id) DO UPDATE SET fields = EXCLUDED.fields, updated_at = now()
       RETURNING *`,
      [companyId, JSON.stringify(fields)] 
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
/*
// получить конфиг для формы
app.get("/api/form-config", async (req, res) => {
  const { companyId } = req.query;
  if (!companyId) return res.status(400).json({ error: "companyId required" });

  try {
    console.log("мы тут: /api/form-config" );
    const { rows } = await pool.query (
      "SELECT fields FROM form_config WHERE company_id=$1",
      [companyId]
    );

    if (!rows[0]) return res.json([]); // ничего нет — вернём пустой массив

  let fields = rows[0].fields;

  // если fields — строка, попробуем её распарсить
  if (typeof fields === 'string') {
    try {
      fields = JSON.parse(fields);
    } catch {
      console.error('Ошибка парсинга поля fields из БД');
      fields = [];
    }
  }

  res.json(fields);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
*/

// GET /api/form-config?companyId=1
app.get("/api/form-config", authOptional, async (req, res) => {
  try {
    // companyId либо из JWT, либо из query
    const companyId =
      (req as any).user?.companyId ||
      Number(req.query.companyId);

    if (!companyId) {
      return res.status(400).json({ error: "companyId required" });
    }

    const q = `
      SELECT company_id, 
      --title, 
      'Регистрация' as type,
      fields as title, 
      updated_at as created_at
      FROM form_config
      WHERE company_id = $1
      ORDER BY updated_at DESC
    `;

    const { rows } = await pool.query(q, [companyId]);
    console.log(rows);
    return res.json(rows); // ✅ массив форм
  } catch (err) {
    console.error("GET /api/form-config ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

