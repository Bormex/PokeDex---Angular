import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokeApiService } from '../services/poke-api.service';
import { map, Observable, switchMap } from 'rxjs';
import {
    Pokemon,
    PokemonData,
    EvolutionChainNode,
    Species,
} from '../interfaces/pokemon.interface';
import { NgStyle, NgClass } from '@angular/common';


@Component({
    selector: 'app-poke-card',
    imports: [NgStyle, NgClass],
    template: `
    <h1>Pokemon Cards Down below</h1>
    <main id="pokemons">
      <div id="pokemon" [style.background-color]="elementColor[this.pokemon!.elements[0]]">
        <p id="index">{{ this.pokemon?.index }}</p>
        
        <span class="pokeDetails">
            <p>{{ this.pokemon?.name }}</p>
            <p>{{ this.pokemon?.original_name }}</p>
            @for (element of this.pokemon?.elements; track $index) {
                <p class="element">{{ element }}</p>
            }
        </span>

        <img id="pokemonImage" src="{{ this.pokemon?.img }}" alt="{{ this.pokemon?.img }}" />

        <img id="pokemonElement" src="/assets/icons/elements/bug.svg" alt="">

      </div>
    </main>
  `,
    styleUrl: './poke-card.component.scss',
})
export class PokeCardComponent implements OnInit {
    constructor(private pokeApi: PokeApiService) { }
    pokemon: Pokemon | undefined;
    items: string[] | undefined;
    elementColor: Record<string, string> = {
        Bug: '#92BC2C',
        Dark: '#595761',
        Dragon: '#0C69C8',
        Electric: '#F2D94E',
        Fairy: '#EE90E6',
        Fighting: '#D3425F',
        Fire: '#FBA54C',
        Flying: '#A1BBEC',
        Ghost: '#5F6DBC',
        Grass: '#5FBD58',
        Ground: '#DA7C4D',
        Ice: '#75D0C1',
        Normal: '#A0A29F',
        Poison: '#B763CF',
        Psychic: '#FA8581',
        Rock: '#C9BB8A',
        Steel: '#5695A3',
        Water: '#539DDF',
    };

    ngOnInit(): void {
        this.getPokemonWithEvolution(this.pokenum);
    }

    //
    //       HIER POKEMON INDEX REIN
    //
    pokenum = 29;


    getPokemonWithEvolution(id: number) {
        this.pokeApi
            .fetchPokemonData(`pokemon/${id}`)
            .pipe(
                switchMap((pokemonData) =>
                    this.pokeApi.fetchPokemonData(`pokemon-species/${id}`).pipe(
                        // gibt alles vom ID pokemon zurück
                        map((species) => ({ pokemonData, species }))
                    )
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
                )
            )
            .subscribe({
                next: ({ pokemonData, evolutionChain, species }) => {
                    this.pokeCardInterface(pokemonData, evolutionChain, species);
                    console.log(this.pokemon);
                },
                error: (err) => console.error(err),
            });
    }

    pokeCardInterface(
        pokemonData: PokemonData,
        evolutionChain: { chain: EvolutionChainNode },
        species: Species
    ) {
        this.pokemon = {
            name: pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1),
            original_name: species.names[0].name,
            index: pokemonData.id.toString().padStart(4, '0'),
            img: pokemonData.sprites.other['official-artwork'].front_default,
            gifImg: this.getGifImg(pokemonData.sprites.other.showdown.front_default),  // DAS KANN null sein -> wollen aber undefined um es einheitlich zu halten
            height: pokemonData.height / 10 + 'm',
            weight:
                pokemonData.weight.toString().slice(0, -1) +
                '.' +
                pokemonData.weight.toString().slice(-1) +
                'kg',
            abilities: pokemonData.abilities.map(
                (a: { ability: { name: string | any[] } }) =>
                    a.ability.name[0].toUpperCase() + a.ability.name.slice(1)
            ),
            elements: pokemonData.types.map(
                (t: { type: { name: string | any[] } }) =>
                    t.type.name[0].toUpperCase() + t.type.name.slice(1)
            ),
            evolutions: this.extractEvolutions(evolutionChain.chain),
            genetik: this.getGenetik(species.genera),
        } as Pokemon;
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
            return gifImage
        }
        return undefined;
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
}
