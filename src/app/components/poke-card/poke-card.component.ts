import { Component, OnDestroy, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { PokeApiService } from '../../services/poke-api.service';
import { map, switchMap, concatMap, from, Subscription } from 'rxjs';
import {
    Pokemon,
    PokemonData,
    EvolutionChainNode,
    Species,
} from '../../interfaces/pokemon.interface';
import { PokemonOverlayComponent } from "../pokemon-overlay/pokemon-overlay.component";


@Component({
  selector: 'app-poke-card',
  imports: [NgStyle, PokemonOverlayComponent],
  template: `
    @if (this.loadingPokemonOverlay()) {
      <app-pokemon-overlay
        (toggleScrollbar)="toggleScrollBarOnLoad('auto')"
      ></app-pokemon-overlay>
    }

    <main>
      <div id="pokemons" class="max-width">
        @for (pokemon of pokemonBufferArray; track $index) {
          <div
            id="pokemon"
            [ngStyle]="{
              background:
                'linear-gradient(to top, ' +
                pokemon.elementColor +
                ', #f0fdf4)',
              '--glow-color': pokemon.elementColor,
            }"
            [title]="pokemon.name"
            (click)="openOverlayModal({ pokemon })"
          >
            <p id="index">{{ pokemon.index }}</p>
            <span class="pokeDetails">
              <p class="name">{{ pokemon.name }}</p>
              <p>{{ pokemon.original_name }}</p>
              @for (element of pokemon.elements; track $index) {
                <p class="element">
                  {{ element[0].toUpperCase() + element.slice(1) }}
                </p>
              }
            </span>

            <img
              style="background-image: url('./assets/icons/elements/fire.svg');"
              id="pokemonImage"
              src="{{ pokemon.img }}"
              alt="{{ pokemon.img }}"
            />

            <img
              id="pokemonElement"
              src="./assets/icons/elements/{{ pokemon.elements[0] }}.svg"
              alt=""
            />
          </div>
        }
      </div>

      <button id="loadMoreButton" (click)="loadMore()">
        Load More
        <img src="./assets/icons/pokeball.svg" alt="" />
      </button>
    </main>
  `,
  styleUrl: './poke-card.component.scss',
})
export class PokeCardComponent implements OnInit, OnDestroy {
  constructor(private pokeApi: PokeApiService) {}

  readonly loadingPokemonOverlay = signal(false);
  readonly pokemonObj = signal<Pokemon | null>(null);
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

  /**
   * Lifecycle hook that is called after the component has been initialized
   * It loads the first 20 pokemons and toggles the scrollbar to hidden to prevent scrolling while loading
   * The scrollbar is toggled back to auto after the pokemons are loaded
   */
  ngOnInit(): void {
    const startPokemon = 1;
    this.loadPokemons(startPokemon);
    this.toggleScrollBarOnLoad('hidden');
  }

  /**
   *
   * @param pokemon The pokemon object to be displayed in the overlay modal
   *
   * Function for opening the overlay modal when a pokemon card is clicked
   * It sets the pokemon object in the signal and toggles the loading state of the overlay modal to true
   * It also toggles the scrollbar to hidden to prevent scrolling while the overlay modal is open
   * The scrollbar is toggled back to auto when the overlay modal is closed
   */
  openOverlayModal(pokemon: { pokemon: Pokemon }) {
    this.pokemonObj.set(pokemon.pokemon);
    this.loadingPokemonOverlay.set(true);
    this.toggleScrollBarOnLoad('hidden');
  }

  /**
   * Function for loading more pokemons when the "Load More" button is clicked
   * It calculates the starting point of the next batch of pokemons based on the length of the currently loaded pokemons and calls the loadPokemons function with the new starting point
   */
  loadMore() {
    const startPointOfLastRenderedPokemonId =
      this.pokemonBufferArray.length + 1;
    this.loadPokemons(startPointOfLastRenderedPokemonId);
  }

  /**
   *
   * @param startIndexPokemon The starting index of the pokemon to load
   *
   * Function for loading 20 pokemons from the API
   */
  loadPokemons(startIndexPokemon: number) {
    const sub = from(
      Array.from({ length: 20 }, (_, i) => startIndexPokemon + i),
    )
      .pipe(concatMap((id) => this.getPokemonWithEvolution(id)))
      .subscribe({
        error: (err) => console.error(err),
        complete: () => {
          const closeLoadingSpinner = this.pokemonsLoaded.emit();
          this.toggleScrollBarOnLoad('auto');
        },
      });
    this.subscriptions.push(sub);
  }

  /**
   *
   * @param id The id of the pokemon to load
   * @returns An observable that emits the pokemon data with its evolution chain and species data
   */
  getPokemonWithEvolution(id: number) {
    return this.pokeApi.fetchPokemonData(`pokemon/${id}`).pipe(
      switchMap((pokemonData) =>
        this.pokeApi
          .fetchPokemonData(`pokemon-species/${id}`)
          .pipe(map((species) => ({ pokemonData, species }))),
      ),
      switchMap(({ pokemonData, species }) =>
        this.pokeApi
          .fetchPokemonData(
            species.evolution_chain.url.split('https://pokeapi.co/api/v2/')[1],
          )
          .pipe(
            map((evolutionChain) => ({
              pokemonData,
              evolutionChain,
              species,
            })),
          ),
      ),
      map(({ pokemonData, evolutionChain, species }) => {
        this.pokeCardInterface(pokemonData, evolutionChain, species);
        return void 0;
      }),
    );
  }

  /**
   *
   * @param pokemonData Pokemon Object
   * @param evolutionChain Evolution Chain Object
   * @param species Pokemon Species Object
   *
   * Function for transforming the raw pokemon data from the API into a format that can be easily used in the template
   * It calculates the total stats of the pokemon and the percentage of each stat for the progress bars
   * It also extracts the evolution chain and the original name of the pokemon from the species data
   */
  pokeCardInterface(
    pokemonData: PokemonData,
    evolutionChain: { chain: EvolutionChainNode },
    species: Species,
  ): void {
    let totalStat = 0;

    const stats = pokemonData.stats.map(
      (s: { stat: { name: string }; base_stat: number }) => {
        totalStat += s.base_stat;

        return {
          name: s.stat.name,
          value: s.base_stat,
          percent_progressbar: +((s.base_stat / 180) * 100).toFixed(2),
        };
      },
    );

    stats.push({
      name: 'total',
      value: totalStat,
      percent_progressbar: +((totalStat / 720) * 100).toFixed(2),
    });

    this.pokemonBufferArray.push(
      (this.pokemon = {
        name: pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1),
        original_name: species.names[0].name,
        index: pokemonData.id.toString().padStart(4, '0'),
        img: pokemonData.sprites.other['official-artwork'].front_default,
        gifImg: this.getGifImg(
          pokemonData.sprites.other.showdown.front_default,
        ), // DAS KANN null sein -> wollen aber undefined um es einheitlich zu halten
        height: pokemonData.height / 10,
        weight: pokemonData.weight / 10,
        abilities: pokemonData.abilities.map(
          (a: { ability: { name: string | any[] } }) => a.ability.name,
        ),
        elements: pokemonData.types.map(
          (t: { type: { name: string | any[] } }) => t.type.name,
        ),
        stats,
        elementColor: this.getElementColor(pokemonData.types),
        evolutions: this.extractEvolutions(evolutionChain.chain),
        genetik: this.getGenetik(species.genera),
      } as Pokemon),
    );
  }

  /**
   *
   * @param ele The types of the pokemon
   * @returns String of the element color of the Pokemon
   *
   * Function for getting the color of the pokemon based on its type
   * It takes the first type of the pokemon and returns the corresponding color from the elementColor object
   * If the pokemon has no type, it returns undefined
   *
   */
  getElementColor(ele: { type: { name: any } }[]) {
    const eleColorName = ele[0].type.name;
    const eleColorHexCode = this.elementColor[eleColorName];
    return eleColorHexCode;
  }

  /**
   *
   * @param geneObj The genera object from the species data
   * @returns genetic/ species of the Pokemon just in english IF NOT returns undefined
   */
  getGenetik(geneObj: any[]): string | undefined {
    for (const e of geneObj) {
      if (e.language.name === 'en') {
        return e.genus;
      }
    }
    return undefined;
  }

  /**
   *
   * @param gifImage The URL of the gif image from the pokemon data
   * @returns URL of the Gif Image IF NOT returns undefined
   */
  getGifImg(gifImage: string) {
    if (gifImage) {
      return gifImage;
    }
    return undefined;
  }

  /**
   * Unsubscribe all subscribtions if webpage is closed
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   *
   * @param chain Chain Object from the evolution chain data
   * @returns Evolution chain of the pokemon as an array of objects with the name, original name, image, gif image, evolution level, evolution item, elements and index of each pokemon in the evolution chain
   *
   * Function for extracting the evolution chain of the pokemon from the evolution chain data
   */
  extractEvolutions(chain: EvolutionChainNode) {
    const evoPokemon: object[] = [];

    fetchEvolutionPokemons(chain);

    async function fetchEvolutionPokemons(chain: EvolutionChainNode) {
      const pokemonIndexNumber = chain.species.url
        .split('pokemon-species/')[1]
        .slice(0, chain.species.url.split('pokemon-species/')[1].length - 1);

      const fetchPokemonSpeciesData = await (
        await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndexNumber}/`,
        )
      ).json();

      const fetchPokemonElements = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndexNumber}/`)
      ).json();

      const evoTrigger = getEvolutionTrigger(chain);

      evoPokemon.push({
        name: fetchPokemonSpeciesData.name,
        original_name: fetchPokemonSpeciesData.names[0].name,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fetchPokemonSpeciesData.id}.png`,
        gifImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${fetchPokemonSpeciesData.id}.gif`,
        evoLevel: evoTrigger.level,
        evoItem: evoTrigger.item,
        elements: fetchPokemonElements.types.map(
          (t: { type: { name: string } }) => t.type.name,
        ),
        index: fetchPokemonSpeciesData.id.toString().padStart(4, '0'),
      });

      // Evolution Chain Zahl -> solange wie chain.evolves_to vorhanden/ !== 0
      for (const evo of chain.evolves_to) {
        await fetchEvolutionPokemons(evo);
      }

      function getEvolutionTrigger(node: EvolutionChainNode): {
        level: number | null;
        item: string | null;
      } {
        for (const next of node.evolves_to) {
          const detail = next.evolution_details?.[0];

          if (detail?.min_level != null || detail?.item) {
            return {
              level: detail?.min_level ?? null,
              item: detail?.item?.name ?? null,
            };
          }

          const deeper = getEvolutionTrigger(next);
          if (deeper.level != null || deeper.item != null) {
            return deeper;
          }
        }

        return { level: null, item: null };
      }
    }

    return evoPokemon;
  }

  /**
   *
   * @param attribute The attribute to set the overflow property of the body element to
   *
   * Function for toggling the scrollbar of the webpage when the overlay modal is open or closed
   * It sets the overflow property of the body element to 'hidden' when the overlay modal is open to prevent scrolling and sets it back to 'auto' when the overlay modal is closed to allow scrolling again
   */
  toggleScrollBarOnLoad(attribute: string) {
    document.body.style.overflow = attribute;
  }
}


