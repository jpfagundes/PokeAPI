const axios = require('axios');
const { apiUrl } = require('./config');

/**
 * Lista os Pokémons com paginação.
 * @param {number} offset - Deslocamento para paginação.
 * @param {number} limit - Quantidade de Pokémons por página.
 * @returns {Promise<object>} - Lista de Pokémons.
 */
async function listPokemons(offset, limit) {
    try {
        const response = await axios.get(`${apiUrl}?offset=${offset}&limit=${limit}`);
        // Obtemos a lista básica de Pokémon
        const pokemons = response.data.results;

        // Iteramos para obter detalhes adicionais de cada Pokémon
        const detailedPokemons = await Promise.all(
        pokemons.map(async (pokemon) => {
            const details = await axios.get(`${apiUrl}/${pokemon.name}`); // Busca os detalhes completos

            // Extrai os campos desejadosS
            const { name, id, types } = details.data;

            return {
            name,
            id,
            type: types.map((t) => t.type.name).join(', '), // Combina os tipos em uma string
            };
        })
 );

 return detailedPokemons; // Retorna apenas os dados filtrados
} catch (error) {
 console.error('Erro ao listar os Pokémon:', error.message);
 throw new Error('Não foi possível listar os Pokémon.');
}
}

/**
 * Busca detalhes de um Pokémon pelo nome ou ID.
 * @param {string|number} identifier - Nome ou ID do Pokémon.
 * @returns {Promise<object>} - Detalhes do Pokémon.
 */

async function getPokemonDetails(identifier) {
    try {
        // Busca os detalhes básicos do Pokémon
        const response = await axios.get(`${apiUrl}/${identifier}`);
        const { name, id, height, weight, types, species } = response.data;

        // Busca informações sobre a cadeia de evolução
        const speciesResponse = await axios.get(species.url);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionChain = [];
        let current = evolutionResponse.data.chain;

        // Extrai as evoluções
        while (current) {
            evolutionChain.push(current.species.name);
            current = current.evolves_to[0]; // Assume uma evolução linear
        }

        // Retorna os dados formatados
        return {
            name,
            id,
            height,
            weight,
            types: types.map(t => t.type.name), // Apenas os nomes dos tipos
            evolutions: evolutionChain,
        };
    } catch (error) {
        throw new Error(`Erro ao buscar detalhes do Pokémon "${identifier}": ${error.message}`);
    }
}


/**
 * Filtra Pokémons por tipo.
 * @param {string} type - Tipo do Pokémon (ex: 'fire', 'water').
 * @returns {Promise<object>} - Lista de Pokémons do tipo especificado.
 */
async function getPokemonsByType(type) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        return response.data.pokemon.map(p => p.pokemon); // Apenas retorna os Pokémons
    } catch (error) {
        throw new Error(`Erro ao filtrar Pokémons do tipo: "${type}": ${error.message}`);
    }
}

module.exports = {
    listPokemons,
    getPokemonDetails,
    getPokemonsByType,
};
