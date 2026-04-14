const express = require("express");
const {criarBanco} = require("./database");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <body>
            <h1>Teste</h1>
        </body>
        `);
});

app.post("/desaparecidos", async (req, res) => {
    const {nome, idade, descricao, foto, ultima_localizacao, data_desaparecimento} = req.body;
    const db = await criarBanco();

    await db.run(
        `INSERT INTO desaparecidos(nome, idade, descricao, foto, ultima_localizacao, data_desaparecimento) VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, idade, descricao, foto, ultima_localizacao, data_desaparecimento]
    );

    req.send(`Adicionado um novo desaparecido a lista de busca`)
})