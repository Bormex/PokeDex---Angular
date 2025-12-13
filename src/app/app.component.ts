import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokeCardComponent } from "./poke-card/poke-card.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent, LoadingSpinnerComponent],
  template: `
    @if(!allPokemonsRendered) {
    <app-loading-spinner></app-loading-spinner>
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

    <app-poke-card></app-poke-card>

  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pokedex';
  allPokemonsRendered: boolean;

  constructor() {
    this.allPokemonsRendered = false;
  }

  @ViewChild(PokeCardComponent) pokeCardComponent!: PokeCardComponent;

  ngAfterViewInit() {
    // child ist jetzt verfügbar
    console.log(this.pokeCardComponent);
  }

  callChild() {
    this.pokeCardComponent; // direkte Methode aufrufen
  }
}
