const axios = require('axios');
const { apiUrl } = require('./config');

/**
 * Lista os Pokémons com paginação.
 * @param {number} offset - Deslocamento para paginação.
 * @param {number} limit - Quantidade de Pokémons por página.
 * @returns {Promise<object>} - Lista de Pokémons.
 */
async function getPokemonList(offset, limit) {
    try {
        const response = await axios.get(`${apiUrl}/pokemon?offset=${offset}&limit=${limit}`);
        // Obtemos a lista básica de Pokémon
        const pokemons = response.data.results;

        // Iteramos para obter detalhes adicionais de cada Pokémon
        const detailedPokemons = await Promise.all(
        pokemons.map(async (pokemon) => {
            const details = await axios.get(`${apiUrl}/pokemon/${pokemon.name}`); // Busca os detalhes completos

            // Extrai os campos desejadosS
            const { name, id, types, sprites } = details.data;

            return {
            name,
            id,
            image: sprites.front_default,
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
        const response = await axios.get(`${apiUrl}/pokemon/${identifier}`);
        const { name, id, height, weight, types, species, sprites, stats, abilities } = response.data;

        // Busca informações sobre a cadeia de evolução
        const speciesResponse = await axios.get(species.url);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionData = evolutionResponse.data.chain;

        // Função auxiliar para buscar os dados da cadeia de evolução
        const getEvolutions = async (chain) => {
            const evolutions = [];
            let current = chain;

            while (current) {
                const pokemonName = current.species.name;

                // Buscar detalhes do Pokémon para obter a imagem
                const pokemonResponse = await axios.get(`${apiUrl}/pokemon/${pokemonName}`);
                const pokemonData = pokemonResponse.data;

                evolutions.push({
                    name: pokemonName,
                    image: pokemonData.sprites.front_default,
                });

                current = current.evolves_to[0]; // Assume uma evolução linear
            }

            return evolutions;
        };

        const evolutions = await getEvolutions(evolutionData);

        // Retorna os dados formatados
        return {
            id,
            name,
            height,
            weight,
            types: types.map(t => t.type.name), // Apenas os nomes dos tipos
            stats: stats.map(s => s.base_stat),
            evolutions,
            abilities: abilities.map(a => a.ability.name),
            image: sprites.front_default,
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
        const instance = axios.create({
            baseURL: apiUrl,
            timeout: 5000, // 5 segundos de timeout
        });

        const response = await instance.get(`/type/${type}`);
        const pokemons = response.data.pokemon.map(p => p.pokemon);

        // Iteração controlada para evitar sobrecarga
        const detailedPokemons = [];
        for (const pokemon of pokemons) {
            try {
                const details = await instance.get(`/pokemon/${pokemon.name}`);
                const { name, id, types, sprites } = details.data;

                detailedPokemons.push({
                    name,
                    id,
                    image: sprites.front_default,
                    type: types.map((t) => t.type.name).join(', '),
                });
            } catch (detailError) {
                console.error(`Erro ao obter detalhes do Pokémon ${pokemon.name}:`, detailError.message);
            }
        }

        return detailedPokemons;
    } catch (error) {
        throw new Error(`Não foi possível listar os Pokémon do tipo "${type}". ${error.message}`);
    }
}

module.exports = {
    getPokemonList,
    getPokemonDetails,
    getPokemonsByType,
};
