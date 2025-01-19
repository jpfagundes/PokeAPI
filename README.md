# <h1 align="center">  🌟 PokeAPI Server 🌟 </h1>

Este projeto é uma API que expõe endpoints para interagir com dados de Pokémons, utilizando a [PokeAPI](https://pokeapi.co/). O servidor foi desenvolvido em Node.js, utilizando o framework Express.

## Funcionalidades

- 🐾 Listagem de Pokémons com detalhes básicos, como nome, ID, tipos e imagem.
- 🔍 Busca de Pokémons filtrados por tipo.
- 📜 Detalhamento de um Pokémon específico, incluindo informações de evolução com nome e imagem.

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- 🛠️ [Node.js](https://nodejs.org/) (v14 ou superior)
- 📦 [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Como executar o projeto

1. 🚀 Clone este repositório:

   ```bash
   git clone https://github.com/jpfagundes/PokeAPI.git
   cd PokeAPI
   ```

2. 📥 Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. ▶️ Inicie o servidor:

   ```bash
   node server.js
   ```

4. 🌐 O servidor estará disponível em `http://localhost:3000`.

## Endpoints Disponíveis

### 1. Listar Pokémons

- **URL:** `/pokemon/list`
- **Método:** GET
- **Parâmetros Query:**
  - `offset` (opcional): O deslocamento para paginação.
  - `limit` (opcional): O número máximo de Pokémons a serem retornados.
- **Exemplo de Requisição:**

  ```bash
  curl "http://localhost:3000/pokemons/list?offset=0&limit=10"
  ```

- **Resposta:**

  ```json
  [
    {
      "name": "bulbasaur",
      "id": 1,
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      "type": "grass, poison"
    },
    {
      "name": "ivysaur",
      "id": 2,
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      "type": "grass, poison"
    }
  ]
  ```

### 2. Filtrar Pokémons por Tipo

- **URL:** `/pokemon/type/:type`
- **Método:** GET
- **Parâmetro de Rota:**
  - `type`: O tipo do Pokémon (e.g., `electric`, `fire`).
- **Exemplo de Requisição:**

  ```bash
  curl "http://localhost:3000/pokemons/type/electric"
  ```

- **Resposta:**

  ```json
  [
    {
      "name": "pikachu",
      "id": 25,
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      "type": "electric"
    }
  ]
  ```

### 3. Obter Detalhes de um Pokémon

- **URL:** `/pokemon/:identifier`
- **Método:** GET
- **Parâmetro de Rota:**
  - `identifier`: O nome ou ID do Pokémon.
- **Exemplo de Requisição:**

  ```bash
  curl "http://localhost:3000/pokemons/pikachu"
  ```

- **Resposta:**

  ```json
  {
    "id": 25,
    "name": "pikachu",
    "height": 4,
    "weight": 60,
    "types": ["electric"],
    "stats": [35, 55, 40, 50, 50, 90],
    "evolutions": [
      {
        "name": "pichu",
        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png"
      },
      {
        "name": "pikachu",
        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
      },
      {
        "name": "raichu",
        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png"
      }
    ],
    "abilities": ["static", "lightning-rod"],
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
  ```

## Estrutura do Projeto

```
.
├── index.js           # Inicializa o projeto
├── server.js          # Servidor Express
├── pokeService.js     # Funções para interagir com a PokeAPI
├── README.md          # Documentação do projeto
└── package.json       # Dependências do projeto
```

## Tecnologias Utilizadas

- 🖥️ Node.js
- ⚡ Express
- 🌐 Axios

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar este projeto.

## Autor

- [@jpfagundes](https://www.github.com/jpfagundes)

## Contato

- [Email] jpsafagundes@hotmail.com

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jpfagundes/)


## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

