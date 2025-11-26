import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokeCardComponent } from "./poke-card/poke-card.component";

@Component({
  selector: 'app-root',
  imports: [PokeCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokedex';
}
