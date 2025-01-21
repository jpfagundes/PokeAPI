const express = require("express");
const pokeService = require("./pokeService");
const cors = require("cors");
const app = express();

app.use(cors());

// Endpoint para listar Pokémons com paginação
app.get("/pokemons", async (request, response) => {
  const { offset = 0, limit = 10 } = request.query;

  try {
    const pokemons = await pokeService.getPokemonList(
      Number(offset),
      Number(limit)
    );
    return response.json(pokemons);
  } catch (error) {
    throw new Error(`Erro ao listar Pokémons: ${error.message}`);
  }
});

// Endpoint para buscar os detalhes de um Pokémon
app.get("/pokemons/:identifier", async (request, response) => {
  const { identifier } = request.params;

  const pokemonDetails = await pokeService.getPokemonDetails(
    identifier.toLowerCase()
  );
  return response.json(pokemonDetails);
});

// Endpoint para buscar Pokémons por tipo
app.get("/pokemons/type/:type", async (request, response) => {
  const { type } = request.params;

  const pokemonsByType = await pokeService.getPokemonsByType(
    type.toLowerCase()
  );
  return response.json(pokemonsByType);
});

// Exporta apenas o app, sem iniciar o servidor
module.exports = app;