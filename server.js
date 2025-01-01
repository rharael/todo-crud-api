// Importa��o de m�dulos necess�rios
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para logar requisi��es
app.use((req, res, next) => {
    console.log('Requisi��o recebida');
    next();
});

// Configura��o do banco de dados SQLite
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite em mem�ria');
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

// Endpoint para autentica��o
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
                res.status(401).json({ message: 'Credenciais inv�lidas' });
                console.log('Credenciais inv�lidas');
            }
        }
    );
});

// Endpoint para criar usu�rio
app.post('/users', (req, res) => {
    const { username, password } = req.body;

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'Usu�rio j� existe' });
                }
                return res.status(500).json({ message: 'Erro no servidor', error: err.message });
            }

            res.status(201).json({ message: 'Usu�rio criado com sucesso', user: { id: this.lastID, username } });
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
        return res.status(400).json({ message: 'O campo "tarefa" � obrigat�rio' });
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
        return res.status(400).json({ message: 'O campo "tarefa" � obrigat�rio' });
    }

    db.run('UPDATE tasks SET tarefa = ? WHERE id = ?', [tarefa, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor', error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Tarefa n�o encontrada' });
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
            return res.status(404).json({ message: 'Tarefa n�o encontrada' });
        }

        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    });
});

// Configurando servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
