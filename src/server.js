const express = require('express');
const pokeService = require("./pokeService");
const cors = require('cors');
const app = express();

app.use(cors());

// Endpoint para listar Pokémons com paginação
app.get('/pokemons', async (request, response) => {
  const { offset = 0, limit = 20 } = request.query;

  try {
      const pokemons = await pokeService.listPokemons(Number(offset), Number(limit));
      response.json(pokemons);
  } catch (error) {
    throw new Error(`Erro ao listar Pokémons: ${error.message}`)
  }
});



// Endpoint para buscar os detalhes de um Pokémon
app.get('/pokemon/:identifier', async (request, response) => {
  const { identifier } = request.params;

  try {
      const pokemonDetails = await pokeService.getPokemonDetails(identifier.toLowerCase());
      response.json(pokemonDetails);
  } catch (error) {
      throw new Error (`Erro ao buscar detalhes do Pokémon "${identifier}": ${error.message}`);
  }
});


// Endpoint para buscar Pokémons por tipo
app.get('/pokemons/type/:type', async (request, response) => {
  const { type } = request.params;

  try {
      const pokemonsByType = await pokeService.getPokemonsByType(type.toLowerCase());
      response.json(pokemonsByType);
  } catch (error) {
    throw new Error(`Erro ao filtrar Pokémons do tipo: "${type}": ${error.message}`);
  }
});

// Exporta apenas o app, sem iniciar o servidor
module.exports = app;