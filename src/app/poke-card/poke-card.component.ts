import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { PokeApiService } from '../services/poke-api.service';
import { map, switchMap, concatMap, from, Subscription } from 'rxjs';
import {
    Pokemon,
    PokemonData,
    EvolutionChainNode,
    Species,
} from '../interfaces/pokemon.interface';


@Component({
  selector: 'app-poke-card',
  imports: [],
  template: `

    <!-- <app-pokemon-overlay dient zu direkt einseitigen overlay und nicht nur dazu "addiert" wenn nicht frag noch gpt ^^nohand -->

    <h1>Pokemon Cards Down below</h1>
    <main id="pokemons">
      @for(pokemon of pokemonBufferArray; track $index) {
      <div
        id="pokemon"
        [style.background]="
          'linear-gradient(to top, ' + pokemon.elementColor + ', #f0fdf4)'
        "
      >
        <p id="index">{{ pokemon.index }}</p>
        <span class="pokeDetails">
          <p>{{ pokemon.name }}</p>
          <p>{{ pokemon.original_name }}</p>
          @for (element of pokemon.elements; track $index) {
          <p class="element">
            {{ element[0].toUpperCase() + element.slice(1) }}
          </p>
          }
        </span>

        <img
          id="pokemonImage"
          src="{{ pokemon.img }}"
          alt="{{ pokemon.img }}"
        />

        <img
          id="pokemonElement"
          src="/assets/icons/elements/{{ pokemon.elements[0] }}.svg"
          alt=""
        />
      </div>
      }
    </main>

    <button
      (click)="loadMore()"
      style="background-color: black; color: white; padding: 24px; width: 100%"
    >
      Load More
    </button>
  `,
  styleUrl: './poke-card.component.scss',
})
export class PokeCardComponent implements OnInit, OnDestroy {

  constructor(private pokeApi: PokeApiService) { }
  
  @Output() pokemonsLoaded = new EventEmitter<void>();

  pokemonBufferArray: Pokemon[] = [];
  subscriptions: Subscription[] = [];
  pokemon: Pokemon | undefined;
  items: string[] | undefined;
  elementColor: Record<string, string> = {
    bug: '#92BC2C',
    dark: '#595761',
    dragon: '#0C69C8',
    electric: '#F2D94E',
    fairy: '#EE90E6',
    fighting: '#D3425F',
    fire: '#FBA54C',
    flying: '#A1BBEC',
    ghost: '#5F6DBC',
    grass: '#5FBD58',
    ground: '#DA7C4D',
    ice: '#75D0C1',
    normal: '#A0A29F',
    poison: '#B763CF',
    psychic: '#FA8581',
    rock: '#C9BB8A',
    steel: '#5695A3',
    water: '#539DDF',
  };

  ngOnInit(): void {
    const startPokemon = 1;
    this.loadPokemons(startPokemon);
    console.log(this.pokemonBufferArray);
    this.toggleScrollBarOnLoad('add');
  }

  loadMore() {
    this.toggleScrollBarOnLoad('add'); 
    this.pokemonsLoaded.emit();
    const startPointOfLastRenderedPokemonId = this.pokemonBufferArray.length + 1;
    this.loadPokemons(startPointOfLastRenderedPokemonId);
  }

  loadPokemons(startIndexPokemon: number) {
    const sub = from(
      Array.from({ length: 20 }, (_, i) => startIndexPokemon + i)
    )
      .pipe(concatMap((id) => this.getPokemonWithEvolution(id)))
      .subscribe({
        error: (err) => console.error(err),
        complete: () => { 
          this.pokemonsLoaded.emit();
          console.log("All Pokemons loaded", this.pokemonBufferArray);
          this.toggleScrollBarOnLoad('remove');
        }
      });
    this.subscriptions.push(sub);
  }

  getPokemonWithEvolution(id: number) {
    return this.pokeApi.fetchPokemonData(`pokemon/${id}`).pipe(
      switchMap((pokemonData) =>
        this.pokeApi
          .fetchPokemonData(`pokemon-species/${id}`)
          .pipe(map((species) => ({ pokemonData, species })))
      ),
      switchMap(({ pokemonData, species }) =>
        this.pokeApi
          .fetchPokemonData(
            species.evolution_chain.url.split('https://pokeapi.co/api/v2/')[1]
          )
          .pipe(
            map((evolutionChain) => ({
              pokemonData,
              evolutionChain,
              species,
            }))
          )
      ),
      map(({ pokemonData, evolutionChain, species }) => {
        this.pokeCardInterface(pokemonData, evolutionChain, species);
        return void 0;
      })
    );
  }

  pokeCardInterface(
    pokemonData: PokemonData,
    evolutionChain: { chain: EvolutionChainNode },
    species: Species
  ) {
    this.pokemonBufferArray.push(
      (this.pokemon = {
        name: pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1),
        original_name: species.names[0].name,
        index: pokemonData.id.toString().padStart(4, '0'),
        img: pokemonData.sprites.other['official-artwork'].front_default,
        gifImg: this.getGifImg(
          pokemonData.sprites.other.showdown.front_default
        ), // DAS KANN null sein -> wollen aber undefined um es einheitlich zu halten
        height: pokemonData.height / 10 + 'm',
        weight:
          pokemonData.weight.toString().slice(0, -1) +
          '.' +
          pokemonData.weight.toString().slice(-1) +
          'kg',
        abilities: pokemonData.abilities.map(
          (a: { ability: { name: string | any[] } }) => a.ability.name
        ),
        elements: pokemonData.types.map(
          (t: { type: { name: string | any[] } }) => t.type.name
        ),
        elementColor: this.getElementColor(pokemonData.types),
        evolutions: this.extractEvolutions(evolutionChain.chain),
        genetik: this.getGenetik(species.genera),
      } as Pokemon)
    );
  }

  getElementColor(ele: { type: { name: any } }[]) {
    const eleColorName = ele[0].type.name;
    const eleColorHexCode = this.elementColor[eleColorName];
    // console.log(eleColorName, eleColorHexCode);
    return eleColorHexCode;
  }

  // RETURN only if an ENGLISH-VERSION is giffen
  getGenetik(geneObj: any[]): string | undefined {
    for (const e of geneObj) {
      if (e.language.name === 'en') {
        return e.genus;
      }
    }
    return undefined;
  }

  getGifImg(gifImage: string) {
    if (gifImage) {
      return gifImage;
    }
    return undefined;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  extractEvolutions(chain: EvolutionChainNode) {
    const evoPokemon: object[] = [];
    fetchEvolutionPokemons(chain);
    async function fetchEvolutionPokemons(chain: EvolutionChainNode) {
      const pokemonIndexNumb = chain.species.url
        .split('pokemon-species/')[1]
        .slice(0, chain.species.url.split('pokemon-species/')[1].length - 1);
      const fetchPokemonData = await (
        await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndexNumb}/`
        )
      ).json();
      const fetchPokemonElements = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndexNumb}/`)
      ).json();
      evoPokemon.push({
        name: fetchPokemonData.name,
        original_name: fetchPokemonData.names[0].name,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fetchPokemonData.id}.png`,
        gifImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${fetchPokemonData.id}.gif`,
        elements: fetchPokemonElements.types.map(
          (t: { type: { name: string } }) =>
            t.type.name[0].toUpperCase() + t.type.name.slice(1)
        ),
        index: fetchPokemonData.id.toString().padStart(4, '0'),
      });
      // Evolution Chain Zahl -> solange wie chain.evolves_to vorhanden/ !== 0
      for (const evo of chain.evolves_to) {
        await fetchEvolutionPokemons(evo);
      }
    }
    return evoPokemon;
  }

 toggleScrollBarOnLoad(attribute: 'add' | 'remove') {
    document.body.classList[attribute]('loading');
 }


}


