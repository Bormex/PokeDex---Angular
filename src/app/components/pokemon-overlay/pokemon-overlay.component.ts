import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeCardComponent } from '../poke-card/poke-card.component';

type TabType = 'about' | 'stats' | 'evolution' | 'moves';

@Component({
  selector: 'app-pokemon-overlay',
  imports: [CommonModule],
  template: `
  
    @if (data.lodingPokemonOverlay()) {
      <div class="overlay" [ngStyle]="{
              'background': 'linear-gradient(to top, ' + data.pokemonObj()?.elementColor + ', #f0fdf4)',
              '--glow-color': data.pokemonObj()?.elementColor
            }">

        <svg class="blob" viewBox="-25 -25 50 50" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
              <stop stop-color="rgba(255,255,255,1)" offset="0%" />
              <stop stop-color="rgba(0,0,0,0)" offset="100%" />
            </linearGradient>
          </defs>         
          <path fill="url(#sw-gradient)" d="M15.7,-17.4C19.5,-15.6,21.2,-9.8,19.9,-5.2C18.7,-0.6,14.7,2.8,12.7,8.4C10.7,14.1,10.8,22,8.4,22.6C6.1,23.2,1.2,16.5,-2.3,12.5C-5.8,8.5,-8,7.2,-11.3,4.9C-14.5,2.6,-18.9,-0.8,-20.9,-6.2C-23,-11.7,-22.8,-19.3,-18.9,-21.1C-15.1,-22.9,-7.5,-18.9,-0.8,-18C6,-17.1,11.9,-19.2,15.7,-17.4Z"/>
        </svg>

        <div class="overlay-background">
          <button id="closeOverlay" (click)="data.lodingPokemonOverlay.set(false)">
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 2048 2048">
              <polygon class="fil1" points="1270.92,506.998 1200.75,595.058 1512.54,906.846 1572.7,967.005 1487.62,967.005 249.375,967.005 249.375,1080.74 1482.79,1080.74 1567.86,1080.74 1507.7,1140.89 1184.77,1463.82 1263.28,1543.55 1785.38,1021.45 "/>
            </svg>
          </button>
        
            <div>
              <span>
                <p>
                  {{ data.pokemonObj()?.name }}
                </p>

                
                  @for (element of data.pokemonObj()?.elements ?? []; track $index) {
                    <p>{{ element[0].toUpperCase() + element.slice(1) }}</p>
                  }
                
              </span>

              <p>
                {{ data.pokemonObj()?.index }}
              </p>
            </div>

          </div>
          
        

        <div class="overlay-content">
          
          <div class="content">
            <img
              src="{{ data.pokemonObj()?.img }}"
              alt="{{ data.pokemonObj()?.name }}"
            />
            <button (click)="loadAbout()" [ngStyle]="{'color': activeTab() === 'about' ? data.pokemonObj()?.elementColor : 'gray'}">About</button>
            <button (click)="loadBaseStats()" [ngStyle]="{'color': activeTab() === 'stats' ? data.pokemonObj()?.elementColor : 'gray'}">Base Stats</button>
            <button (click)="loadEvolution()" [ngStyle]="{'color': activeTab() === 'evolution' ? data.pokemonObj()?.elementColor : 'gray'}">Evolution</button>
            <button (click)="loadMoves()" [ngStyle]="{'color': activeTab() === 'moves' ? data.pokemonObj()?.elementColor : 'gray'}">Moves</button>

               
            
        <!-- 
            <p>{{ data.pokemonObj()?.height }}</p>
            <p>{{ data.pokemonObj()?.weight }}</p>  
            <p>{{ data.pokemonObj()?.original_name }}</p>
           
            <p>
              @for (ability of data.pokemonObj()?.abilities ?? []; track $index) {
                {{ ability[0].toUpperCase() + ability.slice(1) }}
              }
            </p>
            <p>
             {{ data.pokemonObj()?.gifImg }}
            </p

            <p>
             {{ data.pokemonObj()?.genetik }}
            </p>

            <p>
             {{ data.pokemonObj()?.evolutions}}
            </p>
            <p>
             {{ data.pokemonObj()?.elementColor }}
            </p> -->
           
          </div>
          @switch (activeTab()) {
              @case ('about') {
                <div class="tab-content">
                  <p><strong>Species:</strong> {{ data.pokemonObj()?.genetik }}</p>
                  <p><strong>Height:</strong> {{ getHeightInFeetAndInches(data.pokemonObj()?.height) }} ({{ (data.pokemonObj()?.height?.toFixed(2) ?? 0).toString().replace(".", ",")}} m) </p>
                  <p><strong>Weight:</strong> {{ ((data.pokemonObj()?.weight ?? 0) *  2.205).toFixed(1) }} lbs ({{ (data.pokemonObj()?.weight ?? 0).toString().replace(".", ",") }} kg)</p>
                  <p><strong>Original name:</strong> {{ data.pokemonObj()?.original_name }}</p>
                  <p><strong>Abilities:</strong>
                    @for (ability of data.pokemonObj()?.abilities ?? []; track $index) {
                      <span>{{ ability[0].toUpperCase() + ability.slice(1) }}</span>
                    }
                  </p>
                </div>
              }
              @case ('stats') {
                <div class="tab-content">
                  <p>Base Stats Content</p>
                </div>
              }
              @case ('evolution') {
                <div class="tab-content">
                  <p>Evolution Content</p>
                </div>
              }
              @case ('moves') {
                <div class="tab-content">
                  <p>Moves Content</p>
                </div>
              }
            }
        </div>
      </div>
    }
  
  `,
  styleUrl: './pokemon-overlay.component.scss'
})
export class PokemonOverlayComponent {

  readonly data = inject(PokeCardComponent);
  readonly activeTab = signal<TabType>('about');

  /**
   * Konvertiert Höhe von Metern zu Feet und Zoll Format: X′Y"
   * Ohne Rundung - zeigt genaue Dezimalwerte
   */
  getHeightInFeetAndInches(height?: number): string {
    if (!height) return '0′0"';
    const totalFeet = height * 3.28084;
    const feet = Math.floor(totalFeet);
    const inches = (totalFeet - feet) * 12;
    return `${feet}′${inches.toFixed(1)}"`;
  }

  closeOverlay() {
    this.data.lodingPokemonOverlay.set(false);
  }

  loadAbout() {
    this.activeTab.set('about');
  }

  loadBaseStats() {
    this.activeTab.set('stats');
  }

  loadEvolution() {
    this.activeTab.set('evolution');
  }

  loadMoves() {
    this.activeTab.set('moves');
  }

}
