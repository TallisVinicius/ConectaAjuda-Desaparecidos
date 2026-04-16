const express = require("express");
const {criarBanco} = require("./database");

const app = express();

let db;

(async () => {
    db = await criarBanco();
})();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <body>
            <h1>Teste</h1>
        </body>
        `);
});

//Rota principal desaparecidos

app.post("/desaparecidos", async (req, res) => {
    const {nome, idade, descricao, ultima_localizacao,
        data_desaparecimento} = req.body;

    await db.run(
        `INSERT INTO desaparecidos(nome, idade,
        descricao, ultima_localizacao,
        data_desaparecimento) VALUES (?, ?, ?, ?, ?)`,
        [nome, idade, descricao,
        ultima_localizacao,data_desaparecimento],
    );

    res.send(`Adicionado um novo desaparecido a lista de busca`);
});

app.get("/desaparecidos", async (req, res) => {

    const listarDesaparecidos = await db.all(`
        SELECT * FROM desaparecidos`);

    res.json(listarDesaparecidos);
});

app.get("/desaparecidos/:id", async (req, res) => {
    const {id} = req.params;
    const desaparecidoEspecifico = await db.get(`
            SELECT * FROM desaparecidos WHERE id = ?`,
        [id],
    );
    res.json(desaparecidoEspecifico);
});

app.put("/desaparecidos/:id", async (req, res) => {
    const {id} = req.params;

    const {nome, descricao, status} = req.body;

    await db.run(`
            UPDATE desaparecidos
            SET nome = ?, descricao = ?, status = ? WHERE id = ?`,
        [nome, descricao, status, id],
        );
        res.send(`As informações do desaparecido foram atualizadas.`)
});

app.delete("/desaparecidos/:id", async (req, res) => {
    const {id} = req.params;
    await db.run(`
            DELETE FROM desaparecidos WHERE id = ?
        `,
        [id]
    );
    res.send(`Desaparecido foi deletado.`);
});


//==========================
//Rota solicitantes

app.post("/solicitantes", async (req, res) => {
    const {nome, telefone, email} = req.body;

    await db.run(`
            INSERT INTO solicitantes(nome, telefone, email) VALUES (?, ?, ?)`,
        [nome, telefone, email],
        );
    res.send(`Solicitante com nome ${nome} registrou um desaparecimento`);
});

app.get("/solicitantes", async (req, res) => {

    const listarSolicitantes = await db.all(`
            SELECT * FROM solicitantes
        `);
    res.json(listarSolicitantes);
})

//========================
// Rota casos

//===================================
//porta

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});