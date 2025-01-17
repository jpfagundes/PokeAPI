const pokeService = require('./pokeService');

async function main() {
    try {
        const pokemonName = 'pikachu'; // Substitua pelo Pokémon desejado
        const pokemonDetails = await pokeService.getPokemonDetails(pokemonName);
        console.log('\n=== Detalhes do Pokémon ===');
        console.log(pokemonDetails);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

main();
