# Comandos

É possivel usar comandos para fazer requisições na API através de um terminal.


## Windows
### Criar um usuário:

   ```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"password\"}"
   ```

Login:
   ```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"password\"}"
   ```

Criar uma tarefa:
   ```bash
curl -X POST http://localhost:3000/tarefas -H "Content-Type: application/json" -d "{\"tarefa\": \"Minha primeira tarefa\"}"
   ```

Listar tarefas:
   ```bash
curl -X GET http://localhost:3000/tarefas
   ```

Atualizar uma tarefa:
   ```bash
curl -X PUT http://localhost:3000/tarefas/1 -H "Content-Type: application/json" -d "{\"tarefa\": \"Tarefa atualizada\"}"
   ```

Deletar uma tarefa:
   ```bash
curl -X DELETE http://localhost:3000/tarefas/1
   ```



## Linux:

Criar um usuário:
   ```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{"username": "admin", "password": "password"}"
   ```

Login:
   ```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "user1", "password": "pass123"}'
   ```

Criar uma tarefa:
   ```bash
curl -X POST http://localhost:3000/tarefas -H "Content-Type: application/json" -d '{"tarefa": "Minha primeira tarefa"}'
   ```

Listar tarefas:
   ```bash
curl -X GET http://localhost:3000/tarefas
   ```

Atualizar uma tarefa:
   ```bash
curl -X PUT http://localhost:3000/tarefas/1 -H "Content-Type: application/json" -d '{"tarefa": "Tarefa atualizada"}'
   ```

Deletar uma tarefa:
   ```bash
curl -X DELETE http://localhost:3000/tarefas/1
   ```