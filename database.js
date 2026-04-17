const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const criarBanco = async () => {
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS desaparecidos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER,
            descricao TEXT,
            ultima_localizacao TEXT,
            data_desaparecimento TEXT NOT NULL,
            status TEXT DEFAULT 'desaparecido'
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS solicitantes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            telefone TEXT,
            email TEXT
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS avistamentos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            desaparecido_id INTEGER,
            descricao TEXT,
            localizacao TEXT,
            data_avistamento TEXT,
            contato TEXT
        )
        `);

        console.log("Banco conectado");

        return db;
};

module.exports = { criarBanco };