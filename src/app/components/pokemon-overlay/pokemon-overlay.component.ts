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

          
        <img src="/assets/icons/blob.svg" alt="/assets/icons/blob.svg">
        <div class="overlay-background">
          <button id="closeOverlay" (click)="data.lodingPokemonOverlay.set(false)">X</button>
        
       
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
