const axios = require("axios");
const { apiUrl } = require("./config");

// Configuração do Axios com timeout e criação de instância personalizada
const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // 10 segundos de tempo limite
});

/**
 * Função auxiliar para lidar com tentativas automáticas (retries)
 * @param {Function} fn - Função que realiza a requisição
 * @param {number} retries - Número de tentativas
 * @returns {Promise<any>}
 */
async function withRetries(fn, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error; // Lança o erro após exceder o número de tentativas
      }
    }
  }
}

/**
 * Lista os Pokémons com paginação.
 * @param {number} offset - Deslocamento para paginação.
 * @param {number} limit - Quantidade de Pokémons por página.
 * @returns {Promise<object>} - Lista de Pokémons.
 */
async function getPokemonList(offset, limit) {
  try {
    const response = await withRetries(() =>
      apiClient.get(`/pokemon?offset=${offset}&limit=${limit}`)
    );

    // Obtemos a lista básica de Pokémon
    const pokemons = response.data.results;

    // Iteramos para obter detalhes adicionais de cada Pokémon
    const detailedPokemons = await Promise.all(
      pokemons.map(async (pokemon) => {
        try {
          const details = await withRetries(() =>
            apiClient.get(`/pokemon/${pokemon.name}`)
          );
          const { name, id, types, sprites } = details.data;

          return {
            name,
            id,
            image: sprites.front_default,
            types: types.map((t) => t.type.name),
          };
        } catch (error) {
          console.error(`Erro ao obter detalhes de ${pokemon.name}: ${error.message}`);
          return null; // Retorna null para Pokémons que falharem
        }
      })
    );

    return {
      next: response.data.next ? response.data.next.split("?")[1] : null,
      previous: response.data.previous
        ? response.data.previous.split("?")[1]
        : null,
      pokemons: detailedPokemons.filter(Boolean), // Remove itens nulos
    };
  } catch (error) {
    console.error("Erro ao listar os Pokémon:", error.message);
    throw new Error("Não foi possível listar os Pokémon.");
  }
}

/**
 * Busca detalhes de um Pokémon pelo nome ou ID.
 * @param {string|number} identifier - Nome ou ID do Pokémon.
 * @returns {Promise<object>} - Detalhes do Pokémon.
 */
async function getPokemonDetails(identifier) {
  try {
    const response = await withRetries(() => apiClient.get(`/pokemon/${identifier}`));
    const {
      name,
      id,
      height,
      weight,
      types,
      species,
      sprites,
      stats,
      abilities,
    } = response.data;

    // Busca informações sobre a cadeia de evolução
    const speciesResponse = await withRetries(() => apiClient.get(species.url));
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

    const evolutionResponse = await withRetries(() =>
      apiClient.get(evolutionChainUrl)
    );
    const evolutionData = evolutionResponse.data.chain;

    const evolutions = await getEvolutions(evolutionData);

    return {
      id,
      name,
      height,
      weight,
      types: types.map((t) => t.type.name),
      stats: stats.map((s) => s.base_stat),
      evolutions,
      abilities: abilities.map((a) => a.ability.name),
      image: sprites.front_default,
    };
  } catch (error) {
    if(error.response && error.response.status === 404){
      console.error(`Pokémon "${identifier}" não encontrado.`);
      return null; // Retorna null se o Pokémon não existir
    }
    console.error(`Erro ao buscar detalhes do Pokémon "${identifier}": ${error.message}`);
    throw new Error("Não foi possível obter os detalhes do Pokémon.");
  }
}

/**
 * Função auxiliar para buscar a cadeia de evolução.
 * @param {object} chain - Dados da cadeia de evolução.
 * @returns {Promise<object[]>}
 */
const getEvolutions = async (chain) => {
  const evolutions = [];
  let current = chain;

  while (current) {
    const pokemonName = current.species.name;

    try {
      const { data: pokemonData } = await withRetries(() =>
        apiClient.get(`/pokemon/${pokemonName}`)
      );

      evolutions.push({
        id: pokemonData.id,
        name: pokemonName,
        image: pokemonData.sprites.front_default,
      });
    } catch (error) {
      console.error(`Erro ao buscar evolução de ${pokemonName}: ${error.message}`);
    }

    current = current.evolves_to[0]; // Assume uma evolução linear
  }

  return evolutions;
};

/**
 * Filtra Pokémons por tipo.
 * @param {string} type - Tipo do Pokémon (ex: 'fire', 'water').
 * @returns {Promise<object[]>} - Lista de Pokémons do tipo especificado.
 */
async function getPokemonsByType(type) {
  try {
    const responseType = await withRetries(() => apiClient.get(`/type/${type}`));
    const pokemons = responseType.data.pokemon.map((p) => p.pokemon);

    const detailedPokemons = await Promise.all(
      pokemons.map(async (pokemon) => {
        try {
          const details = await withRetries(() =>
            apiClient.get(`/pokemon/${pokemon.name}`)
          );
          const { name, id, types, sprites } = details.data;

          return {
            name,
            id,
            image: sprites.front_default,
            types: types.map((t) => t.type.name),
          };
        } catch (error) {
          console.error(`Erro ao obter detalhes de ${pokemon.name}: ${error.message}`);
          return null; // Retorna null para Pokémons que falharem
        }
      })
    );

    return detailedPokemons.filter(Boolean); // Remove itens nulos
  } catch (error) {
    console.error(`Erro ao filtrar Pokémon por tipo "${type}": ${error.message}`);
    throw new Error("Não foi possível listar os Pokémon pelo tipo.");
  }
}

module.exports = {
  getPokemonList,
  getPokemonDetails,
  getPokemonsByType,
};
