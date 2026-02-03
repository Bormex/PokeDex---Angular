import { Component } from '@angular/core';


@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <img src="./assets/icons/pokemon-loading.svg" alt="">

    <span>
      Loading Pokemon's
    </span>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1001;
      background-color: rgba(255, 255, 255);

      img {
        width: 19rem;
        height: 19rem;
        animation: bounce-spin-60hz 1.5s steps(60, end) infinite;
        will-change: transform;
      }

      span {
        font-family: cursive;
        font-size: 1.5rem;
        font-weight: bold;
        color: rgba(51, 51, 51, 0.239216);
        filter: drop-shadow(0px 1px 1px black);
        text-align: center;
        position: absolute;
        bottom: 0;
        margin-bottom: 32px;

        &::after {
          content: "";
          animation: dots 1s steps(3, end) infinite;
          position: absolute;
          margin-left: 4px;
        }
      }

    }

    @keyframes dots {
      0%   { content: ""; }
      33%  { content: "."; }
      66%  { content: ".."; }
      100% { content: "..."; }
    }


    @keyframes bounce-spin-60hz {
      0% {
        transform: translateY(0) rotate(0deg) scale(1);
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.4));
      }
      20% {
        transform: translateY(-12px) rotate(90deg) scale(1.1);
        filter: drop-shadow(0 12px 10px rgba(0,0,0,0.5));
      }
      40% {
        transform: translateY(0) rotate(180deg) scale(0.97);
        filter: drop-shadow(0 3px 3px rgba(0,0,0,0.35));
      }
      60% {
        transform: translateY(-6px) rotate(250deg) scale(1.05);
        filter: drop-shadow(0 8px 6px rgba(0,0,0,0.45));
      }
      80% {
        transform: translateY(0) rotate(310deg) scale(0.99);
        filter: drop-shadow(0 3px 3px rgba(0,0,0,0.35));
      }
      100% {
        transform: translateY(0) rotate(360deg) scale(1);
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.4));
      }
  }
  `,
})
export class LoadingSpinnerComponent { }
