import { Component } from '@angular/core';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent],
  template: `

    @if(!allPokemonsRendered) {
      <app-loading-spinner [more]="onLoadMore(true)"></app-loading-spinner>
    }
    
    <header>
      <h1>PokeDex</h1>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Suche nach Pokemon"
      />
    </header>

    <app-poke-card (pokemonsLoaded)="tooglePokemonSpinner()"></app-poke-card>

  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pokedex';
  allPokemonsRendered: boolean;

  constructor() {
    this.allPokemonsRendered = false;
  }

  tooglePokemonSpinner() {
    if (!this.allPokemonsRendered) {
      this.allPokemonsRendered = true;
    } else {
      this.allPokemonsRendered = false;
    }
  }

  onLoadMore(boolean: boolean) {
    if (boolean) {
      return false;
    } else {
      return true;
    }
  }


}
