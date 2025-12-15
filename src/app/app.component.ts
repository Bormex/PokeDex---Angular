import { Component } from '@angular/core';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { Pokemon } from './interfaces/pokemon.interface';

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent],
  template: `
    <header>
      <h1>PokeDex</h1>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="searching Pokemon"
        (input)="searchingPokemon($event)"
        [(ngModel)]="searchQuery"
      />
    </header>

    @if(!allPokemonsRendered) {
    <app-loading-spinner></app-loading-spinner>
    }

    <app-poke-card
      (pokemonsLoaded)="tooglePokemonSpinner()"
      (pokemonBufferChange)="onPokemonBufferChange($event)"
    >
    </app-poke-card>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pokedex';
  allPokemonsRendered: boolean;
  pokemonBuffer!: Pokemon[];

  searchingPokemon(event: Event) {
    console.log((event.target as HTMLInputElement).value);
    const InputValue = (event.target as HTMLInputElement).value;

    this.pokemonBuffer = this.pokemonBuffer.filter((pokemon) =>
      pokemon.name
        .toLowerCase()
        .includes(
          (document.getElementById('search') as HTMLInputElement).value.toLowerCase()
        )
    );



    // gib nicht ganzen buffer raus setze nebem dem konstrukt im Pokecard ein weiter buffer rein
    // nur für die suche
  }

  constructor() {
    this.allPokemonsRendered = false;
  }

  // Neue Methode, die das Event behandelt
  onPokemonBufferChange(buffer: Pokemon[]) {
    this.pokemonBuffer = buffer;
    console.log('Pokemon Buffer im Parent:', this.pokemonBuffer);
  }

  tooglePokemonSpinner() {
    if (!this.allPokemonsRendered) this.allPokemonsRendered = true;
  }
}
