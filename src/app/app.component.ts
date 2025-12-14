import { Component } from '@angular/core';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

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
        placeholder="Suche nach Pokemon"
      />
    </header>

    @if(!allPokemonsRendered) {
      <app-loading-spinner></app-loading-spinner>
    }

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


}
