import { Evolution } from "./pokemon_evolutions.interface";

export interface Pokemon {
  name: string;                // Capitalized Pokémon name
  original_name: string;       // Original language name
  index: string;               // 4-digit Pokémon index (0001)
  img: string;                 // Official artwork image URL
  gifImg: string;              // Official artwork gif-image URL
  height: string;              // z. B. "1.7m"
  weight: string;              // z. B. "90.5kg"
  abilities: string[];         // Capitalized list of abilities
  elements: string[];          // Pokémon type names (Water, Fire...)
  evolutions: Evolution[];     // Deine extrahierten Evolutionsdaten
  genetik: string;             // Genus (z. B. "Seed Pokémon")
}

export interface PokemonData {
  name: string | any[];
  id: { toString: () => string };
  sprites: {
    other: {
      [x: string]: { front_default: any };
      showdown: { front_default: any };
    };
  };
  height: number;
  weight: { toString: () => string };
  abilities: { ability: { name: string | any[] } }[];
  types: { type: { name: string | any[] } }[];
}

export interface EvolutionChainNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainNode[];
}

export interface Species {
  names: { name: string }[];
  genera: { genus: string }[];
}