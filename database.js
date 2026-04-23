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
            nome_desaparecido TEXT NOT NULL,
            idade INTEGER,
            descricao TEXT,
            ultima_localizacao TEXT,
            data_desaparecimento TEXT,
            status TEXT DEFAULT 'desaparecido'
        )
        `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS solicitantes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_solicitante TEXT,
            telefone TEXT,
            email TEXT
        )
        `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS avistamentos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            localizacao TEXT,
            data_avistamento TEXT,
            contato TEXT
        )
        `);

  console.log("Banco conectado");

  
  const checagem = await db.get(`SELECT COUNT(*) AS total FROM desaparecidos`);
  if (checagem.total === 0) {
    await db.exec(`
        INSERT INTO desaparecidos(nome_desaparecido, idade, descricao, ultima_localizacao, data_desaparecimento) 
        VALUES ("João Pessoa", 45, "1.70m de altura, Branco, cabelos pretos e roupa social", "São Paulo - SP", "2026-04-15")
    `);
  }

  const numeros = await db.get(`SELECT COUNT(*) AS total FROM solicitantes`);
  if (numeros.total === 0) {
    await db.exec(`
        INSERT INTO solicitantes(nome_solicitante, telefone, email) 
        VALUES ("Maria Silva", "984556877", "mariasilva@gmail.com")
    `);
  }

  
  const contador = await db.get(`SELECT COUNT(*) AS total FROM avistamentos`);
  if (contador.total === 0) {
    await db.exec(`
        INSERT INTO avistamentos(descricao, localizacao, data_avistamento, contato) 
        VALUES ("Pessoa tava em uma escola", "Rua de cima", "2026-04-21", "658897885")
    `);
  }

  return db;
};

module.exports = { criarBanco };
