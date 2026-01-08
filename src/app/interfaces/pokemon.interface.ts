import { Evolution } from "./pokemon_evolutions.interface";

export interface Pokemon {
  name: string;                // Capitalized Pokémon name
  original_name: string;       // Original language name
  index: string;               // 4-digit Pokémon index (0001)
  img: string;                 // Official artwork image URL
  gifImg: string | undefined;              // Official artwork gif-image URL
  height: number;              // z. B. 1.7
  weight: number;              // z. B. "90.5kg"
  abilities: string[];         // Capitalized list of abilities
  elements: string[];          // Pokémon type names (Water, Fire...)
  elementColor: string,
  evolutions: Evolution[];     // Deine extrahierten Evolutionsdaten
  genetik: string | undefined;             // Genus (z. B. "Seed Pokémon")
}

export interface PokemonData {
  name: string;
  id: { toString: () => string };
  sprites: {
    other: {
      [x: string]: { front_default: string };
      showdown: { front_default: string };
    };
  };
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
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