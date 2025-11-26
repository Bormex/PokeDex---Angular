import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeApiService } from '../services/poke-api.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-poke-card',
  imports: [],
  template:`
  <h1>Pokemon Cards Down below</h1>
    <main id="pokemons">
      <div id="pokemon">
        <!-- <img src="{{ this.pokemon?.img }}" alt="{{ this.pokemon?.img }}">
        <p>{{ this.pokemon?.index }}</p>
        <p>{{ this.pokemon?.name }}</p>
        <p>{{ this.pokemon?.height }}</p>
        <p>{{ this.pokemon?.weight }}</p>
        <p>{{ this.pokemon?.abilities }}</p>
        <p>{{ this.pokemon?.elements }}</p>
        <p>{{ this.pokemon?.evolutions }}</p> -->
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
    // this.getPokemons();
    // this.getPokemonEvoChain();
    this.getPokemonWithEvolution(this.pokenum);
  }

  ngOnDestroy(): void {
    // this.subEvoChain;
    // this.subPokemon;
  }

  // Parameter später als übergabe zum Iterrieren also 1.. 2.. 3.. 4.. 5.. ... Block technisch, anfang mit vlt 25 und wimmer wieder +25
  getPokemons() {
    this.subPokemon = this.pokeApi.fetchPokemonData("pokemon/6").subscribe({
      next: pokemon => this.pokemonCardInterface(pokemon),
      error: err => console.error('Error:', err)
    })
  }

  getPokemonEvoChain() {
    this.subEvoChain = this.pokeApi.fetchPokemonData("evolution-chain/60").subscribe({
      next: evolutionChain => this.getPokemonEvolutions(evolutionChain),
      error: err => console.error('Error:', err)
    })
  }

  // pokemon: { name: any; index: any; img: any; height: string; weight: string; abilities: any; elements: any; evolutions: any; } | undefined;

  pokemonCardInterface(pokeDetails: any) {
    //////////////////////// console.log(pokeDetails);

    // this.pokemon = {
    //   name: pokeDetails.name[0].toUpperCase() + pokeDetails.name.slice(1, pokeDetails.name.length),
    //   index: pokeDetails.id.toString().padStart(4, "0"),
    //   img: pokeDetails.sprites.other['official-artwork'].front_default,
    //   height: (pokeDetails.height/10).toString() + "m",
    //   weight: pokeDetails.weight.toString().slice(0, pokeDetails.weight.toString().length - 1) + "." +  pokeDetails.weight.toString()[pokeDetails.weight.toString().length - 1] + "kg",
    //   abilities: pokeDetails.abilities.map((pokemon: { ability: { name: string; }; }) => pokemon.ability.name[0].toUpperCase() + pokemon.ability.name.slice(1, pokemon.ability.name.length)),
    //   elements: pokeDetails.types.map((pokemon: { type: { name: any; }; }) => pokemon.type.name[0].toUpperCase() + pokemon.type.name.slice(1, pokemon.type.name.length)),
    //   evolutions: "",
    // }

    // console.log("Evolutions:", this.pokemon.evolutions);

  }

  getPokemonEvolutions(pokemonName: any) {
    console.log("Evo Chain Object:", pokemonName);

    console.log("Name:", pokemonName.chain.species.name);
    console.log("Url:", pokemonName.chain.species.url);
    console.log("ID:", pokemonName.chain.species.url.split("pokemon-species/")[1].slice(0, pokemonName.chain.species.url.split("pokemon-species/")[1].length - 1));

  }

  //
  //       HIER POKEMON INDEX REIN
  //
  pokenum = 1;


  pokemon: { name: any; index: any; img: any; height: string; weight: string; abilities: any; elements: any; evolutions: any; } | undefined;

  getPokemonWithEvolution(id: number) {
  this.pokeApi.fetchPokemonData(`pokemon/${id}`).pipe(
    switchMap(pokemonData =>
      this.pokeApi.fetchPokemonData(`pokemon-species/${id}`).pipe(
        map(species => ({ pokemonData, species }))
      )
    ),
    switchMap(({ pokemonData, species }) =>
      this.pokeApi.fetchPokemonData(species.evolution_chain.url.split("https://pokeapi.co/api/v2/")[1]).pipe(
        map(evolutionChain => ({ pokemonData, evolutionChain }))
      )
    )
  ).subscribe({
    next: ({ pokemonData, evolutionChain }) => {

      console.log(pokemonData);


    this.pokemon = {
      name: pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1, pokemonData.name.length),
      index: pokemonData.id.toString().padStart(4, "0"),
      img: pokemonData.sprites.other['official-artwork'].front_default,
      height: (pokemonData.height/10).toString() + "m",
      weight: pokemonData.weight.toString().slice(0, pokemonData.weight.toString().length - 1) + "." +  pokemonData.weight.toString()[pokemonData.weight.toString().length - 1] + "kg",
      abilities: pokemonData.abilities.map((pokemon: { ability: { name: string; }; }) => pokemon.ability.name[0].toUpperCase() + pokemon.ability.name.slice(1, pokemon.ability.name.length)),
      elements: pokemonData.types.map((pokemon: { type: { name: string | any[]; }; }) => pokemon.type.name[0].toUpperCase() + pokemon.type.name.slice(1, pokemon.type.name.length)),
      evolutions: this.extractEvolutions(evolutionChain.chain)
    }

    console.log(evolutionChain);


      console.log(this.pokemon);
      console.log(this.extractEvolutions(evolutionChain.chain));
    },
    error: err => console.error(err)
  });
}




extractEvolutions(chain: any) {
  const evoNames: object[] = [];
  traverse(chain);
  function traverse(node: any) {
    const evoNameBeginUpperCase = node.species.name[0].toUpperCase() + node.species.name.slice(1, node.species.name.length);



    const pokemonIndexId = node.species.url
      .split('pokemon-species/')[1]
      .slice(0, node.species.url.split('pokemon-species/')[1].length - 1);
    const convertetUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIndexId}.png`;

    evoNames.push({
      name: evoNameBeginUpperCase,
      img: convertetUrl
    });

    node.evolves_to.forEach((child: any) => traverse(child));

  };
  return evoNames;
}















}
