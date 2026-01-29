import { Component, EventEmitter, inject, Output, signal, viewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeCardComponent } from '../poke-card/poke-card.component';

type TabType = 'about' | 'stats' | 'evolution';

@Component({
  selector: 'app-pokemon-overlay',
  imports: [CommonModule],
  template: `
    <div
      class="overlay"
      [ngStyle]="{
        background:
          'linear-gradient(to top, ' +
          pokemon?.elementColor +
          ', #f0fdf4)',
        '--glow-color': pokemon?.elementColor,
      }"
    >


      <!-- @if (true) {
        <div class="wishing-wrapper">
          <div class="wishing-pokemon">
            <p>
              wish
            </p>

          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 512.002 512.002" xml:space="preserve">
            <path style="fill:#3D6DEB;" d="M508.084,268.926c0.222-0.33,0.414-0.675,0.616-1.015c0.186-0.312,0.382-0.614,0.554-0.936  c0.188-0.351,0.346-0.709,0.514-1.066c0.157-0.332,0.323-0.658,0.462-0.998c0.146-0.349,0.262-0.706,0.388-1.06  c0.13-0.362,0.27-0.718,0.382-1.089c0.109-0.358,0.188-0.721,0.279-1.085c0.095-0.374,0.199-0.743,0.275-1.125  c0.084-0.422,0.135-0.849,0.196-1.275c0.045-0.326,0.107-0.647,0.14-0.976c0.152-1.53,0.152-3.07,0-4.6  c-0.033-0.329-0.095-0.65-0.14-0.976c-0.061-0.427-0.112-0.852-0.196-1.275c-0.076-0.382-0.18-0.749-0.275-1.125  c-0.092-0.361-0.169-0.726-0.279-1.085c-0.112-0.369-0.251-0.726-0.382-1.089c-0.126-0.354-0.242-0.711-0.388-1.06  c-0.14-0.34-0.306-0.666-0.462-0.998c-0.168-0.355-0.326-0.715-0.514-1.064c-0.171-0.321-0.366-0.624-0.554-0.936  c-0.203-0.34-0.396-0.684-0.616-1.015c-0.233-0.351-0.493-0.68-0.745-1.015c-0.203-0.272-0.391-0.549-0.61-0.815  c-0.487-0.594-1.002-1.167-1.545-1.71l-58.179-58.179c-9.089-9.089-23.824-9.089-32.913,0s-9.089,23.824,0,32.912l18.454,18.454  H23.273C10.42,232.729,0,243.149,0,256.002c0,12.853,10.42,23.273,23.273,23.273h409.272l-18.454,18.452  c-9.089,9.089-9.089,23.824,0,32.912c4.544,4.544,10.501,6.817,16.455,6.817c5.956,0,11.913-2.271,16.457-6.817l58.179-58.177  c0.543-0.543,1.058-1.116,1.545-1.711c0.219-0.264,0.406-0.543,0.61-0.813C507.589,269.605,507.85,269.276,508.084,268.926z"/>
          </svg>
            
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -15 55 35" width="300" height="300">
            <defs>
              <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                <stop stop-color="rgba(248, 117, 55, 1)" offset="0%" />
                <stop stop-color="rgba(251, 168, 31, 1)" offset="100%" />
              </linearGradient>
            </defs>

            <path
              fill="url(#sw-gradient)"
              d="M11.3,-5.9C18.8,-3.9,31.7,-1.9,33.5,1.9C35.4,5.7,26.2,11.4,18.8,12.9C11.4,14.5,5.7,11.8,-0.4,12.3C-6.6,12.7,-13.1,16.2,-14.1,14.7C-15.1,13.1,-10.5,6.6,-9.9,0.6C-9.4,-5.4,-12.8,-10.8,-11.8,-12.8C-10.8,-14.8,-5.4,-13.4,-1.7,-11.7C1.9,-10,3.9,-7.9,11.3,-5.9Z"
            />
          </svg>


          </div>
        </div>  
      } -->
      
      <!-- <div class="swipe">
        @if (pokemon?.index !== '0001') {
          <div class="swipe-left" (click)="swipeToNextPokemon('previous')">
            <-
          </div>
        }

        @if (data.pokemonBufferArray[data.pokemonBufferArray.length - 1].index !== pokemon?.index) {
          <div class="swipe-right" (click)="swipeToNextPokemon('next')">
            ->
          </div>
        }
      </div> -->

      <div class="overlay-top">
        <div class="overlay-top-container max-width">
          <svg
            class="blob"
            viewBox="-25 -25 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                <stop stop-color="rgba(255,255,255,1)" offset="0%" />
                <stop stop-color="rgba(0,0,0,0)" offset="100%" />
              </linearGradient>
            </defs>
            <path
              fill="url(#sw-gradient)"
              d="M15.7,-17.4C19.5,-15.6,21.2,-9.8,19.9,-5.2C18.7,-0.6,14.7,2.8,12.7,8.4C10.7,14.1,10.8,22,8.4,22.6C6.1,23.2,1.2,16.5,-2.3,12.5C-5.8,8.5,-8,7.2,-11.3,4.9C-14.5,2.6,-18.9,-0.8,-20.9,-6.2C-23,-11.7,-22.8,-19.3,-18.9,-21.1C-15.1,-22.9,-7.5,-18.9,-0.8,-18C6,-17.1,11.9,-19.2,15.7,-17.4Z"
            />
          </svg>
          <button id="closeOverlay" (click)="closeOverlay()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xml:space="preserve"
              viewBox="0 0 2048 2048"
            >
              <polygon
                class="fil1"
                points="1270.92,506.998 1200.75,595.058 1512.54,906.846 1572.7,967.005 1487.62,967.005 249.375,967.005 249.375,1080.74 1482.79,1080.74 1567.86,1080.74 1507.7,1140.89 1184.77,1463.82 1263.28,1543.55 1785.38,1021.45 "
              />
            </svg>
          </button>

          <div class="overlay-pokemon-details">
            <div>
              <h2>
                {{ pokemon?.name }}
              </h2>

              <span>
                @for (
                  element of pokemon?.elements ?? [];
                  track $index
                ) {
                  <p>{{ element[0].toUpperCase() + element.slice(1) }}</p>
                }
              </span>
            </div>

            <p class="index-number">
              #{{ pokemon?.index }}
            </p>
          </div>
        </div>
      </div>

      <div class="overlay-bottom">
        <div class="overlay-bottom-content max-width">
          <svg
            class="pokeball"
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <!-- Ausstanzung -->
              <mask id="pokeball-cut">
                <rect width="200" height="200" fill="white" />
                <circle cx="100" cy="100" r="42" fill="black" />
              </mask>

              <!-- obere Hälfte (endet vor der Mitte) -->
              <clipPath id="clip-top">
                <rect x="0" y="0" width="200" height="92" />
              </clipPath>

              <!-- untere Hälfte (beginnt nach der Mitte) -->
              <clipPath id="clip-bottom">
                <rect x="0" y="108" width="200" height="92" />
              </clipPath>
            </defs>

            <!-- obere Außenschale -->
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="#ffffff"
              mask="url(#pokeball-cut)"
              clip-path="url(#clip-top)"
            />

            <!-- untere Außenschale -->
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="#ffffff"
              mask="url(#pokeball-cut)"
              clip-path="url(#clip-bottom)"
            />

            <!-- Mittelpunkt (unverändert) -->
            <circle cx="100" cy="100" r="30" fill="#ffffff" />
          </svg>

          <div #pokemonSwiper id="pokemonSwiper">
            @if (pokemon?.index !== '0001') {
              <img class="previousPokemon" src="{{ previousPokemon.img }}" alt="" (click)="swipeToNextPokemon('previous')">
            }

            <img
              src="{{ pokemon?.img }}"
              alt="{{ pokemon?.name }}"
            />

            @if (data.pokemonBufferArray[data.pokemonBufferArray.length - 1].index !== pokemon?.index) {
              <img class="nextPokemon" src="{{ nextPokemon.img }}" alt="" (click)="swipeToNextPokemon('next')">              
            }
          </div>

          <button
            (click)="this.activeTab.set('about')"
            [ngStyle]="{
              color:
                activeTab() === 'about'
                  ? 'black'
                  : 'lightgray',
            }"
            [ngClass]="{ 'active': activeTab() === 'about' }"
          >
            <p>About</p>
          </button>
          <button
            (click)="this.activeTab.set('stats')"
            [ngStyle]="{
              color:
                activeTab() === 'stats'
                  ? 'black'
                  : 'lightgray',
              
            }"
            [ngClass]="{ 'active': activeTab() === 'stats' }"
          >
            <p>Base Stats</p>
          </button>
          <button
            (click)="this.activeTab.set('evolution')"
            [ngStyle]="{
              color:
                activeTab() === 'evolution'
                  ? 'black'
                  : 'lightgray',
            }"
            [ngClass]="{ 'active': activeTab() === 'evolution' }"
          >
            <p>Evolution</p>
          </button>
        </div>
        
        @switch (activeTab()) {
          @case ('about') {
            <div class="tab-content-about max-width">
              <div>
                <p>Species</p> 
                <p>Height</p>
                <p>Weight</p>
                <p>Original name</p>
                <p>Abilities</p>
                
            
              </div>
              <div>
                <p>
                  {{ pokemon?.genetik }}
                </p>
                <p>
                  {{ getHeightInFeetAndInches(pokemon?.height) }} ({{
                  (pokemon?.height?.toFixed(2) ?? 0)
                    .toString()
                    .replace('.', ',')
                  }}
                  m)
                </p>
                <p>
                  {{ ((pokemon?.weight ?? 0) * 2.205).toFixed(1) }}
                  lbs ({{
                    (pokemon?.weight ?? 0).toString().replace('.', ',')
                  }}
                  kg)
                </p>
                <p>
                  {{ pokemon?.original_name }}
                </p>
                <p>
                  @for (
                  ability of pokemon?.abilities ?? [];
                  track $index
                  ) {
                    
                    @if (((pokemon?.abilities?.length ?? 0) - 1) !== $index) {
                     {{ ability[0].toUpperCase() + ability.slice(1) }},
                    } @else {
                      {{ ability[0].toUpperCase() + ability.slice(1) }}
                    }
                  }
                </p>
              </div>
              
            </div>
          }
          @case ('stats') {
            <div class="tab-content-stats max-width">
              @for (stat of pokemon?.stats; track $index) {
                <div class="stat-container">
                  <div class="stat-values">
                    <p>{{ stat?.name![0].toLocaleUpperCase() + stat?.name?.slice(1) }}</p>
                    <p>{{ stat?.value }}</p>
                  </div>
                  <div class="stat-progress-border">
                    <div
                      class="stat-progress-bar"
                      [ngStyle]="{ width: stat?.percent_progressbar + '%', background: (stat?.name === 'hp' || stat?.name === 'defense' || stat?.name === 'speed') ? 'linear-gradient(163deg, red, #5a0000a3)' : 'linear-gradient(163deg, #01cc16, #0b850b)' }"
                    ></div>
                  </div>
                </div>
              }
            </div>
          }
        @case ('evolution') {
          <div class="tab-content-evolution max-width">
            <h2>Evolution Chain</h2>

            @for (chain of evolutionChains; track $index) {
              <div class="chain">
                @for (evo of chain; track $index) {
                  <div class="evo-pokemon">
                    <div class="img-wrap">
                      <img src="{{evo.img}}" alt="{{evo.img}}">
                    </div>
                    <p>{{ evo.name[0].toUpperCase() + evo.name.slice(1) }}</p>
                  </div>
                  @if ($index < chain.length - 1) {
                    <div class="evo-arrow">
                      <p>
                        →
                      </p>
                      @if (evo.evoLevel !== null) {
                        <span>
                          <p>Level</p>
                          <p>{{ evo.evoLevel }}</p>
                        </span>
                      } @else {
                        {{ evo.evoItem }}
                      }
                    </div>
                  }
                }
              </div>
            }
          </div>
        }
        }
      </div>
    </div>
  `,
  styleUrl: './pokemon-overlay.component.scss',
})
export class PokemonOverlayComponent implements AfterViewInit {

  constructor() { } 

  readonly data = inject(PokeCardComponent);
  readonly activeTab = signal<TabType>('about');
  readonly carouselRef = viewChild<ElementRef>('pokemonSwiper');

  @Output() toggleScrollbar = new EventEmitter<void>();

  start: number = 0;
  isDragStarted: boolean = false;

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
    this.data.loadingPokemonOverlay.set(false);
    this.activeTab.set('about');
    this.toggleScrollbar.emit();
  }

  dragging = (e: MouseEvent | TouchEvent) => {
    
    if (!this.isDragStarted) return;
    e.preventDefault();
    const swipeStart = this.start;
    
    if (e instanceof MouseEvent ? e.pageX > swipeStart : e.touches[0].pageX > swipeStart) {
      this.swipeToNextPokemon('previous');
      this.isDragStarted = false;
    }

    if (e instanceof MouseEvent ? e.pageX < swipeStart : e.touches[0].pageX < swipeStart) {
      this.swipeToNextPokemon('next');
      this.isDragStarted = false;
    }

    this.isDragStarted = false;

  };

  dragStart = (e: MouseEvent | TouchEvent) => {
    this.start = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.isDragStarted = true;
  }

  dragEnd = () => {
    this.isDragStarted = false;
  }

  ngAfterViewInit() {
    const carouselElement = this.carouselRef()?.nativeElement;
    if (carouselElement) {
      carouselElement.addEventListener("mousedown", this.dragStart);
      carouselElement.addEventListener("mousemove", this.dragging);
      carouselElement.addEventListener("touchstart", this.dragStart);
      carouselElement.addEventListener("touchmove", this.dragging);
    }
  }

  swipeToNextPokemon(attribute?: string) {
    if (attribute === "next") {
        const currentIndex = this.data.pokemonBufferArray.findIndex(
        (p) => p.index === this.pokemon?.index
      );
      const nextIndex =
        (currentIndex + 1) % this.data.pokemonBufferArray.length;
      const nextPokemon = this.data.pokemonBufferArray[nextIndex];
      this.data.openOverlayModal({ pokemon: nextPokemon });      
    }

    if (attribute === "previous") {
      const currentIndex = this.data.pokemonBufferArray.findIndex(
        (p) => p.index === this.pokemon?.index
      );
      const previousIndex =
        (currentIndex - 1 + this.data.pokemonBufferArray.length) % this.data.pokemonBufferArray.length;
      const previousPokemon = this.data.pokemonBufferArray[previousIndex];
      this.data.openOverlayModal({ pokemon: previousPokemon });
    }
  }

  get pokemon() {
    return this.data.pokemonObj();
  }

  get evolutionChains() {
    const evos = this.data.pokemonObj()?.evolutions ?? [];
    return evos.slice(0, -1).map((_, i) => evos.slice(i, i + 2));
  }

  get previousPokemon() {
    const currentIndex = this.data.pokemonBufferArray.findIndex(
      (p) => p.index === this.pokemon?.index
    );
    const previousIndex = (currentIndex - 1 + this.data.pokemonBufferArray.length) % this.data.pokemonBufferArray.length;
    return this.data.pokemonBufferArray[previousIndex];
  }

  get nextPokemon() {
    const currentIndex = this.data.pokemonBufferArray.findIndex(
      (p) => p.index === this.pokemon?.index
    );
    const nextIndex = (currentIndex + 1) % this.data.pokemonBufferArray.length;
    return this.data.pokemonBufferArray[nextIndex];
  }


}
