# TODO CRUD API

Esta é uma API para gerenciamento de tarefas com funcionalidades de autenticação e CRUD (Create, Read, Update, Delete). Desenvolvida com Node.js, Express e SQLite.

## Requisitos

- **Node.js**
- **npm** (ou **yarn**) para gerenciar pacotes

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/todo-crud-api.git
   cd todo-crud-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

1. Inicie o servidor:
   ```bash
   node server.js
   ```

2. Acesse a API no endereço local, exemplo:
   ```
   http://localhost:3000
   ```
3. Alternativamente pode-se enviar requisições direto de um terminal:

      Criar usuário no windows :
   ```bash
   curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"password\"}"
   ```

      Criar usuário no Linux/MacOs :
   ```bash
   curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{"username": "admin", "password": "password"}"
   ```
   Mais comandos acesse a [Lista de comandos](docs/COMMANDS.md)

## Endpoints

### Autenticação

#### **POST** `/login`
Autentica um usuário.

- **Body**:
  ```json
  {
    "username": "<username>",
    "password": "<password>"
  }
  ```
- **Resposta**:
  - Sucesso (200):
    ```json
    {
      "message": "Login bem-sucedido",
      "userId": 1
    }
    ```
  - Erro (401):
    ```json
    {
      "message": "Credenciais inválidas"
    }
    ```

### Usuários

#### **POST** `/users`
Cria um novo usuário.

- **Body**:
  ```json
  {
    "username": "<username>",
    "password": "<password>"
  }
  ```
- **Resposta**:
  - Sucesso (201):
    ```json
    {
      "message": "Usuário criado com sucesso",
      "user": {
        "id": 1,
        "username": "<username>"
      }
    }
    ```
  - Erro (400):
    ```json
    {
      "message": "Usuário já existe"
    }
    ```

### Tarefas

#### **GET** `/tarefas`
Obtém todas as tarefas.

- **Resposta**:
  - Sucesso (200):
    ```json
    [
      { "id": 1, "tarefa": "Minha primeira tarefa" },
      { "id": 2, "tarefa": "Minha segunda tarefa" }
    ]
    ```

#### **POST** `/tarefas`
Cria uma nova tarefa.

- **Body**:
  ```json
  {
    "tarefa": "<texto da tarefa>"
  }
  ```
- **Resposta**:
  - Sucesso (201):
    ```json
    {
      "message": "Tarefa criada com sucesso",
      "task": {
        "id": 1,
        "tarefa": "<texto da tarefa>"
      }
    }
    ```
  - Erro (400):
    ```json
    {
      "message": "O campo 'tarefa' é obrigatório"
    }
    ```

#### **PUT** `/tarefas/:id`
Atualiza uma tarefa pelo ID.

- **Body**:
  ```json
  {
    "tarefa": "<texto da tarefa atualizado>"
  }
  ```
- **Resposta**:
  - Sucesso (200):
    ```json
    {
      "message": "Tarefa atualizada com sucesso"
    }
    ```
  - Erro (404):
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```

#### **DELETE** `/tarefas/:id`
Deleta uma tarefa pelo ID.

- **Resposta**:
  - Sucesso (200):
    ```json
    {
      "message": "Tarefa deletada com sucesso"
    }
    ```
  - Erro (404):
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```

## Log de Requisições

Cada requisição à API é logada no console com a mensagem:
```bash
Requisição recebida
```

## Personalização

- O banco de dados SQLite está configurado como in-memory. Para persistência, altere a configuração para salvar em arquivo.

## Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.

