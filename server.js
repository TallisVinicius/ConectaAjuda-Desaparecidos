const express = require("express");
const {criarBanco} = require("./database");

const cors = require("cors");
const app = express();

app.use(cors());

let db;

(async () => {
    db = await criarBanco();
})();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <body style="font-family: Arial; padding: 20px;">
            <h1>🚨 API de Desaparecidos</h1>

            <p>Esta API foi desenvolvida para registrar e consultar pessoas desaparecidas e possíveis avistamentos.</p>

            <h2>📌 Rotas disponíveis:</h2>

            <h3>👤 Desaparecidos</h3>
            <ul>
                <li>POST /desaparecidos → Criar desaparecido</li>
                <li>GET /desaparecidos → Listar todos</li>
                <li>GET /desaparecidos/:id → Buscar por ID do desaparecido</li>
                <li>PUT /desaparecidos/:id → Atualizar dados</li>
                <li>DELETE /desaparecidos/:id → Remover</li>
            </ul>

            <h3>👥 Solicitantes</h3>
            <ul>
                <li>POST /solicitantes → Criar solicitante</li>
                <li>GET /solicitantes → Listar solicitantes</li>
                <lis>GET /solicitantes/:id → Buscar por ID do solicitante</li>
            </ul>

            <h3>👀 Avistamentos</h3>
            <ul>
                <li>POST /avistamentos → Registrar avistamento</li>
                <li>GET /avistamentos → Listar avistamentos</li>
                <lis>GET /avistamentos/:id → Buscar por ID do avistamento</li>
            </ul>

            <h2>📎 Status da API</h2>
            <p style="color: green;">✔ API funcionando corretamente</p>
        </body>
        `);
});

app.post("/desaparecidos", async (req, res) => {
    const {nome_Desaparecido, idade, descricao, ultima_localizacao,
        data_desaparecimento} = req.body;

    await db.run(
        `INSERT INTO desaparecidos(nome_Desaparecido, idade,
        descricao, ultima_localizacao,
        data_desaparecimento) VALUES (?, ?, ?, ?, ?)`,
        [nome_Desaparecido, idade, descricao,
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

    const {nome_Desaparecido, descricao, status} = req.body;

    await db.run(`
            UPDATE desaparecidos
            SET nome_Desaparecido = ?, descricao = ?, status = ? WHERE id = ?`,
        [nome_Desaparecido, descricao, status, id],
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

app.post("/solicitantes", async (req, res) => {
    const {nome_Solicitante, telefone, email} = req.body;

    await db.run(`
            INSERT INTO solicitantes(nome_Solicitante, telefone, email) VALUES (?, ?, ?)`,
        [nome_Solicitante, telefone, email],
        );
    res.send(`Solicitante com nome ${nome_Solicitante} registrou um desaparecimento`);
});

app.get("/solicitantes", async (req, res) => {

    const listarSolicitantes = await db.all(`
            SELECT * FROM solicitantes
        `);
    res.json(listarSolicitantes);
});

app.get("/solicitantes/:id", async (req, res) => {
    const {id} = req.params;
    const solicitanteEspecifico = await db.get(`
        SELECT * FROM solicitantes WHERE id = ?`,
    [id],
    );
    res.json(solicitanteEspecifico);
});

app.post("/avistamentos", async (req, res) => {
    const {desaparecido_id,descricao,localizacao,data_avistamento,contato} = req.body;
    await db.run(`
        INSERT INTO avistamentos(desaparecido_id,descricao,localizacao,data_avistamento,contato) VALUES (?,?,?,?,?)
        `, 
    [desaparecido_id,descricao,localizacao,data_avistamento,contato],
);
res.send(`Adicionado um avistamento de um desaparecido`);
});

app.get("/avistamentos", async (req, res) => {
    const listarAvistamentos = await db.all(`
        SELECT * FROM avistamentos
        `);
        res.json(listarAvistamentos);
});

app.get("/avistamentos/:id", async (req, res) => {
    const {id} = req.params;
    const avistamentoEspecifico = await db.get(
        `SELECT * FROM avistamentos WHERE id = ?`,
        [id],
    );
    res.json(avistamentoEspecifico);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});