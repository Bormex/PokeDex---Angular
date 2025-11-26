import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeApiService } from '../services/poke-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poke-card',
  imports: [],
  template:`  
  <h1>Pokemon Cards Down below</h1>
    <main id="pokemons">
      <div id="pokemon">
        <img src="{{ this.pokemon?.img }}" alt="{{ this.pokemon?.img }}">
        <p>{{ this.pokemon?.index }}</p>
        <p>{{ this.pokemon?.name }}</p>
        <p>{{ this.pokemon?.height }}</p>
        <p>{{ this.pokemon?.weight }}</p>
        <p>{{ this.pokemon?.abilities }}</p>
        <p>{{ this.pokemon?.elements }}</p>
        <p>{{ this.pokemon?.evolutions }}</p>
      </div>
    </main>
  `,
  styleUrl: './poke-card.component.scss'
})

export class PokeCardComponent implements OnInit, OnDestroy {
  constructor (private pokeApi: PokeApiService) { }

  subPokemon: any;
  subEvoChain: any;

  items: string[] | undefined;

  elementColor = {         
    bug: "#92BC2C",
    dark: "#595761",
    dragon: "#0C69C8",
    electric: "#F2D94E",
    fairy: "#EE90E6",
    fighting: "#D3425F",
    fire: "#FBA54C",
    flying: "#A1BBEC",
    ghost: "#5F6DBC",
    grass: "#5FBD58",
    ground: "#DA7C4D",
    ice: "#75D0C1",
    normal: "#A0A29F",
    poison: "#B763CF",
    psychic: "#FA8581",
    rock: "#C9BB8A",
    steel: "#5695A3",
    water: "#539DDF",
  }

  ngOnInit(): void {
    this.getPokemons();
    this.getPokemonEvoChain();
  }

  ngOnDestroy(): void {
    this.subEvoChain;
    this.subPokemon;
  }

  // Parameter später als übergabe zum Iterrieren also 1.. 2.. 3.. 4.. 5.. ... Block technisch, anfang mit vlt 25 und wimmer wieder +25
  getPokemons() {
    this.subPokemon = this.pokeApi.fetchPokemonData("pokemon/6").subscribe({
      next: pokemon => this.pokemonCardInterface(pokemon),
      error: err => console.error('Error:', err)
    })
  }

  getPokemonEvoChain() {
    this.subEvoChain = this.pokeApi.fetchPokemonData("evolution-chain/1").subscribe({
      next: evolutionChain => this.getPokemonEvolutions(evolutionChain),
      error: err => console.error('Error:', err)
    })
  }

  pokemon: { name: any; index: any; img: any; height: string; weight: string; abilities: any; elements: any; evolutions: any; } | undefined;

  pokemonCardInterface(pokeDetails: any) {
    //////////////////////// console.log(pokeDetails);
    
    this.pokemon = {
      name: pokeDetails.name[0].toUpperCase() + pokeDetails.name.slice(1, pokeDetails.name.length),
      index: pokeDetails.id.toString().padStart(4, "0"),
      img: pokeDetails.sprites.other['official-artwork'].front_default,
      height: (pokeDetails.height/10).toString() + "m",
      weight: pokeDetails.weight.toString().slice(0, pokeDetails.weight.toString().length - 1) + "." +  pokeDetails.weight.toString()[pokeDetails.weight.toString().length - 1] + "kg",
      abilities: pokeDetails.abilities.map((pokemon: { ability: { name: string; }; }) => pokemon.ability.name[0].toUpperCase() + pokemon.ability.name.slice(1, pokemon.ability.name.length)), 
      elements: pokeDetails.types.map((pokemon: { type: { name: any; }; }) => pokemon.type.name[0].toUpperCase() + pokemon.type.name.slice(1, pokemon.type.name.length)),
      evolutions: this.getPokemonEvolutions(pokeDetails.name),
    }
    
    console.log("Evolutions:", this.pokemon.evolutions);
    
  }
  
  getPokemonEvolutions(pokemonName: string) {
    console.log(pokemonName);
    
  }

  

 

}
