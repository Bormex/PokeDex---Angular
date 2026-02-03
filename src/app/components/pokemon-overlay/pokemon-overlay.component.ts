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
              <h1>
                {{ pokemon?.name }}
              </h1>

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
