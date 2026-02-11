import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { PokeCardComponent } from "./components/poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { Pokemon } from './interfaces/pokemon.interface';

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent, FormsModule, NgStyle],
  template: `
    <header>
      <img src="./assets/img/title.png" alt="./assets/img/title.png" />
      <input
        type="text"
        name="search"
        id="search"
        placeholder="searching Pokemons"
        (input)="searchingPokemon(this.searchQuery.toLowerCase())"
        (focus)="openSearchBar()"
        [(ngModel)]="searchQuery"
        [ngStyle]="
          searchBarOpen
            ? { width: '100%', padding: '0.5rem 1.75rem', cursor: 'auto' }
            : {}
        "
      />
    </header>

    @if (!allPokemonsRendered) {
      <app-loading-spinner></app-loading-spinner>
    }

    <app-poke-card (pokemonsLoaded)="togglePokemonSpinner()"> </app-poke-card>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    this.allPokemonsRendered = false;
    this.searchBarOpen = false;
  }

  title = 'pokedex';
  allPokemonsRendered: boolean;
  pokemonBuffer!: Pokemon[];
  searchBarOpen: boolean;
  searchQuery: string = '';

  /**
   * Function for toggling the loading spinner
   */
  togglePokemonSpinner() {
    if (!this.allPokemonsRendered) this.allPokemonsRendered = true;
  }


  /**
   * Function for opening the search bar when the user clicks on it
   * and changing the style of the search bar to make it more visible and user-friendly
   */
  openSearchBar() {
    this.searchBarOpen = true;
  }

  /*
   * Function for searching the pokemons by their name and rendering only the pokemons that match the search query
   * It also hides the "Load More" button when the user is searching for pokemons and shows it again when the search query is empty
   * The function is triggered by the (input) event on the search input field and it takes the current value of the search input as an argument
   * It compares the current value of the search input with the names of all loaded pokemons and renders only the pokemons that match the search query
   * If the search query is empty, it renders all loaded pokemons and shows the "Load More" button again
   */
  searchingPokemon(tippedLetters: string) {
    const allLoadedPokemonCards = document.querySelectorAll('#pokemon');
    const allLoadedPokemonNameFields = document.getElementsByClassName('name');
    const renderMoreButton = document.getElementById('loadMoreButton');

    if (this.searchQuery.length >= 1) {
      for (let i = 0; i < allLoadedPokemonNameFields.length; i++) {
        const pokemonLoadedNames =
          allLoadedPokemonNameFields[i].innerHTML.toLocaleLowerCase();
        allLoadedPokemonCards[i].classList.add('none');
        renderMoreButton!.classList.add('none');

        if (pokemonLoadedNames[0] === tippedLetters[0]) {
          // first letter match
          if (pokemonLoadedNames.includes(tippedLetters)) {
            // includes the tipped letters
            allLoadedPokemonCards[i].classList.remove('none');
          }
        }
      }
    } else {
      renderMoreButton!.classList.remove('none');
      for (let i = 0; i < allLoadedPokemonCards.length; i++) {
        allLoadedPokemonCards[i].classList.remove('none');
      }
    }
  }
}
