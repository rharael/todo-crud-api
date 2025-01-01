// Importação de módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para logar requisições
app.use((req, res, next) => {
    console.log('Requisição recebida');
    next();
});

// Configuração do banco de dados SQLite
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite em memória');
        db.run(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `);
        db.run(`
            CREATE TABLE tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tarefa TEXT NOT NULL
            );
        `);
    }
});

// Endpoint para autenticação
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro no servidor', error: err.message });
            }

            if (user) {
                res.status(200).json({ message: 'Login bem-sucedido', userId: user.id });
            } else {
                res.status(401).json({ message: 'Credenciais inválidas' });
                console.log('Credenciais inválidas');
            }
        }
    );
});

// Endpoint para criar usuário
app.post('/users', (req, res) => {
    const { username, password } = req.body;

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'Usuário já existe' });
                }
                return res.status(500).json({ message: 'Erro no servidor', error: err.message });
            }

            res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: this.lastID, username } });
        }
    );
});

// Endpoint para obter todas as tarefas
app.get('/tarefas', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor', error: err.message });
        }

        res.status(200).json(rows);
    });
});

// Endpoint para criar nova tarefa
app.post('/tarefas', (req, res) => {
    const { tarefa } = req.body;

    if (!tarefa) {
        return res.status(400).json({ message: 'O campo "tarefa" é obrigatório' });
    }

    db.run('INSERT INTO tasks (tarefa) VALUES (?)', [tarefa], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor', error: err.message });
        }

        res.status(201).json({ message: 'Tarefa criada com sucesso', task: { id: this.lastID, tarefa } });
    });
});

// Endpoint para atualizar tarefa pelo ID
app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { tarefa } = req.body;

    if (!tarefa) {
        return res.status(400).json({ message: 'O campo "tarefa" é obrigatório' });
    }

    db.run('UPDATE tasks SET tarefa = ? WHERE id = ?', [tarefa, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor', error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
    });
});

// Endpoint para deletar tarefa pelo ID
app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor', error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    });
});

// Configurando servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
