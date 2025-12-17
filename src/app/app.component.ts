import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { Pokemon } from './interfaces/pokemon.interface';

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent, FormsModule, NgStyle],
  template: `
    <header>
      <h1>{{ title }}</h1>
      <input
        type="text"
        name="search"
        id="search"
        #searchInput
        placeholder="searching Pokemon"
        (input)="searchingPokemon(this.searchQuery.toLowerCase())"
        (focus)="openSearchBar()"
        (blur)="closeSearchBar()"
        [(ngModel)]="searchQuery"
        [ngStyle]="searchBarOpen ? { 'width': '100%', 'padding': '0.5rem 1.75rem', 'cursor': 'auto' } : {}"
      />
    </header>

    @if(!allPokemonsRendered) {
      <app-loading-spinner></app-loading-spinner>
    }

  
    <app-poke-card (pokemonsLoaded)="tooglePokemonSpinner()">
    </app-poke-card>
    
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor() {
    this.allPokemonsRendered = false;
    this.searchBarOpen = false;
  }

  title = 'Pokédex';
  allPokemonsRendered: boolean;
  pokemonBuffer!: Pokemon[];
  searchBarOpen: boolean = false;
  searchQuery: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  tooglePokemonSpinner() {
    if (!this.allPokemonsRendered) this.allPokemonsRendered = true;
  }

  openSearchBar() {
    this.searchBarOpen = !this.searchBarOpen; 
  }

  closeSearchBar() {
    setTimeout(() => {
      this.searchBarOpen = !this.searchBarOpen;
      console.log(this.searchInput);
      
    }, 2000);
  }
  
  /*
  *
  * Function for searching Pokemon by name JUST for currently loaded Pokemons NOT all Pokemons from API
  */
  searchingPokemon(tippedLetters: string) {
    const allLoadedPokemonCards = document.querySelectorAll('#pokemon');
    const allLoadedPokemonNameFields = document.getElementsByClassName('name');
    const renderMoreButton = document.getElementById('loadMoreButton');

    if (this.searchQuery.length >= 1) {

      for (let i = 0; i < allLoadedPokemonNameFields.length; i++) {
        const pokemonLoadedNames = allLoadedPokemonNameFields[i].innerHTML.toLocaleLowerCase();
        allLoadedPokemonCards[i].classList.add('none');
        renderMoreButton!.classList.add('none');

          if (pokemonLoadedNames[0] === tippedLetters[0]) {  // first letter match
            if (pokemonLoadedNames.includes(tippedLetters)) {  // includes the tipped letters
             allLoadedPokemonCards[i].classList.remove('none')
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
