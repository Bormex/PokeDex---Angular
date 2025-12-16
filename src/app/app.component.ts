import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { Pokemon } from './interfaces/pokemon.interface';

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent, FormsModule],
  template: `
    <header>
      <h1>PokeDex</h1>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="searching Pokemon"
        (input)="searchingPokemon()"
        [(ngModel)]="searchQuery"
      />
    </header>

    @if(!allPokemonsRendered) {
    <app-loading-spinner></app-loading-spinner>
    }

    @if(true) {
    <app-poke-card
      (pokemonsLoaded)="tooglePokemonSpinner()"
      (pokemonBufferLoadedPokemons)="onPokemonBufferChange($event)"
    >
    </app-poke-card>
    }
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pokedex';
  allPokemonsRendered: boolean;
  pokemonBuffer!: Pokemon[];

  searchQuery: string = '';
  array: string[] = [];

  searchingPokemon() {
    this.searchFilter(this.searchQuery);
  }

  searchFilter(tippedLetters: string) {

    if (this.searchQuery.length > 3) {
      const getLoadedPokename = document.getElementsByClassName('name');

      for (let i = 0; i < getLoadedPokename.length; i++) {
        const element = document.getElementsByClassName('name')[i].innerHTML.toLocaleLowerCase();
        const el = document.querySelectorAll('#pokemon')[i];
        document.querySelectorAll('#pokemon')[i].classList.add('none');


          if (element.includes(tippedLetters) || element == tippedLetters) {    // oder muss noch an einer anderen stelle anfangen?? aber funzt erma
             console.log(element, tippedLetters);
             document.querySelectorAll('#pokemon')[i].classList.add('flex')

             break
          }





      }
    }

  }

  constructor() {
    this.allPokemonsRendered = false;
  }

  // Neue Methode, die das Event behandelt
  onPokemonBufferChange(array: string[]) {
    console.log('KSAFHSAKFS', array);
  }

  tooglePokemonSpinner() {
    if (!this.allPokemonsRendered) this.allPokemonsRendered = true;
  }
}
