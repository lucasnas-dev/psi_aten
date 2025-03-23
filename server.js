const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Adicionado
const app = express();
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY; // Carregar chave secreta do .env

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./banco.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão bem-sucedida com o banco de dados.");
    }
});

// Criação da tabela de usuários, caso ainda não exista
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            nome TEXT NOT NULL,
            crp TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Erro ao criar tabela:", err.message);
        } else {
            console.log("Tabela 'usuarios' pronta para uso.");
        }
    });
});

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Adicionando cookie-parser
app.use(express.static(__dirname));

// Rota inicial para carregar o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Middleware para verificar o token JWT via cookies
function autenticarToken(req, res, next) {
    const token = req.cookies.token; // Obtém o token do cookie

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    jwt.verify(token, SECRET_KEY, (err, usuario) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido ou expirado." });
        }

        console.log("Dados decodificados do token:", usuario); // Log para depuração
        req.usuario = usuario; // Atribui os dados do token decodificado ao req.usuario
        next(); // Passa para a próxima função
    });
}

// Rota de cadastro via POST
app.post("/api/cadastrar", (req, res) => {
    const { cpf, senha, nome, crp, email } = req.body;

    if (!cpf || !senha || !nome || !crp || !email) {
        return res.status(400).json({ message: "Dados inválidos" });
    }

    const checkQuery = `SELECT cpf FROM usuarios WHERE cpf = ?`;
    db.get(checkQuery, [cpf], (err, row) => {
        if (row) {
            return res.status(400).json({ message: "CPF já cadastrado." });
        }

        const query = `INSERT INTO usuarios (cpf, senha, nome, crp, email) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [cpf, senha, nome, crp, email], (err) => {
            if (err) {
                console.error("Erro ao cadastrar usuário:", err.message);
                return res.status(500).json({ message: "Erro ao cadastrar usuário." });
            }

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
        });
    });
});

// Rota de login via POST
// Rota de login via POST
app.post("/api/login", (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ message: "CPF e senha são obrigatórios." });
    }

    const query = `SELECT * FROM usuarios WHERE cpf = ? AND senha = ?`;
    db.get(query, [cpf, senha], (err, usuario) => {
        if (err) {
            console.error("Erro ao verificar o login:", err.message);
            return res.status(500).json({ message: "Erro no servidor." });
        }

        if (!usuario) { // Verifica se o usuário foi encontrado no banco de dados
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Gerar o token JWT
        const token = jwt.sign({ cpf: usuario.cpf }, SECRET_KEY, { expiresIn: "1h" });

        // Enviar o token como um cookie seguro
        res.cookie("token", token, {
            httpOnly: true, // Impede acesso ao cookie via JavaScript (protege contra XSS)
            secure: false, // Alterar para "true" em produção com HTTPS
            sameSite: "Strict", // Bloqueia requisições de outros sites
            maxAge: 3600000 // Expira em 1 hora
        });

        res.status(200).json({ message: "Login bem-sucedido!" });
    });
});

// Rota para obter dados do perfil via GET
app.get("/api/perfil", autenticarToken, (req, res) => {
    const cpf = req.usuario.cpf; // Obtém o CPF do token decodificado

    const query = `SELECT nome, cpf, crp, email FROM usuarios WHERE cpf = ?`;
    db.get(query, [cpf], (err, usuario) => {
        if (err) {
            console.error("Erro ao buscar perfil:", err.message);
            return res.status(500).json({ message: "Erro no servidor." });
        }

        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: "Usuário não encontrado." });
        }
    });
});

// Rota para atualizar perfil via PUT
app.put("/api/perfil", autenticarToken, (req, res) => {
    const { nome, crp, email } = req.body;
    const cpf = req.usuario.cpf; // CPF obtido do token decodificado

    if (!nome || !crp || !email) {
        return res.status(400).json({ message: "Dados inválidos." });
    }

    const query = `UPDATE usuarios SET nome = ?, crp = ?, email = ? WHERE cpf = ?`;
    db.run(query, [nome, crp, email, cpf], (err) => {
        if (err) {
            console.error("Erro ao atualizar perfil:", err.message);
            return res.status(500).json({ message: "Erro ao atualizar perfil." });
        }

        res.status(200).json({ message: "Perfil atualizado com sucesso!" });
    });
});

// Rota para excluir perfil via DELETE
app.delete("/api/perfil", autenticarToken, (req, res) => {
    const cpf = req.usuario.cpf; // CPF obtido do token decodificado

    const query = `DELETE FROM usuarios WHERE cpf = ?`;
    db.run(query, [cpf], (err) => {
        if (err) {
            console.error("Erro ao excluir perfil:", err.message);
            return res.status(500).json({ message: "Erro ao excluir perfil." });
        }

        res.status(200).json({ message: "Perfil excluído com sucesso!" });
    });
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando! Acesse em: http://localhost:${PORT}`);
});