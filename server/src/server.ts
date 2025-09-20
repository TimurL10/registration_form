import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import https from "https";
import { Pool, Client } from "pg";

const app : Application = express();
app.use(cors());
app.use(express.json());

// Подключение к базе (Render PostgreSQL или другая)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // для Render Postgres
});


// Middleware для парсинга JSON-запросов
app.use(bodyParser.json());



//dbrep.load_config();

async function initPgClient() {
  let pg_conf = new Client({
            host: 'dpg-d366st6r433s73dvhqb0-a.oregon-postgres.render.com',
            port: 5432,
            database: 'registration_form_bd',
            user: 'admin',
            password: 'jKcutjuPA9EA795ICY18AlhYXHV7XU4H',
            ssl: { rejectUnauthorized: false }
        });

        await pg_conf.connect();

        await pg_conf.query('create table test1(id integer);');

        pg_conf.on('error',(err) => {
            console.log(err);
        });

    return pg_conf;
}

initPgClient();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

