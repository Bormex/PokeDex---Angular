import { Component } from '@angular/core';


@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    
    <svg xmlns="http://www.w3.org/2000/svg" width="1e3" height="1e3" version="1.1" viewBox="0 0 264.58 264.58"> 
      <g class="shadow" transform="translate(0 -32.417)"> 
        <g transform="translate(42.106 42.808)"> 
          <path d="m206.57 121.73a118.09 118.09 0 0 1-118.09 118.09 118.09 118.09 0 0 1-118.09-118.09 118.09 118.09 0 0 1 118.09-118.09 118.09 118.09 0 0 1 118.09 118.09z" fill="#333" stroke-width="0"/> 
          <path transform="matrix(.26458 0 0 .26458 -42.106 -10.392)" d="m721.03 269-456.93 458.92 217.15 217.16a446.32 446.32 0 0 0 12.301 0.61524 446.32 446.32 0 0 0 446.32-446.32 446.32 446.32 0 0 0-0.42383-11.953l-218.42-218.42z" fill="#1a1a1a"/> 
          <path d="m88.482 1.6019a120.13 120.13 0 0 0-120.13 120.13 120.13 120.13 0 0 0 120.13 120.13 120.13 120.13 0 0 0 120.13-120.13 120.13 120.13 0 0 0-120.13-120.13zm0 4.0861a116.04 116.04 0 0 1 116.04 116.05 116.04 116.04 0 0 1-116.04 116.04 116.04 116.04 0 0 1-116.05-116.04 116.04 116.04 0 0 1 116.05-116.05z" fill="#a02c2c" stroke-width="0"/> 
          <path transform="matrix(.26458 0 0 .26458 -42.106 -10.392)" d="m169.93 509.77a324 324 0 0 0 323.63 313.6 324 324 0 0 0 323.48-313.6h-647.11z" fill="#fff"/> 
          <path transform="matrix(.26458 0 0 .26458 -42.106 -10.392)" d="m493.56 175.37a324 324 0 0 0-323.63 313.6h647.11a324 324 0 0 0-323.48-313.6z" fill="#c83737"/> 
          <circle cx="88.482" cy="121.73" r="27.237" fill="#000"/> 
          <path transform="matrix(.26458 0 0 .26458 -42.106 -10.392)" d="m170.08 488.97a324 324 0 0 0-0.51953 10.396 324 324 0 0 0 0.36914 10.396h647.11a324 324 0 0 0 0.51953-10.396 324 324 0 0 0-0.36914-10.396h-647.11z" fill="#000"/> 
          <circle cx="88.482" cy="121.73" r="21.941" fill="#fff"/> 
        </g> 
      </g> 
    </svg>


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

      svg {
        width: 19rem;
        height: 19rem;
        animation: bounce-spin-60hz 1.5s steps(60, end) infinite;
        will-change: transform;
        
        >g {  
          filter: drop-shadow(0 0 0.2rem black);
        }
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
      0%   { transform: translateY(0) rotate(0deg) scale(1); }
      20%  { transform: translateY(-6px) rotate(90deg) scale(1.03); }
      40%  { transform: translateY(0) rotate(180deg) scale(0.98); }
      60%  { transform: translateY(-3px) rotate(250deg) scale(1.01); }
      80%  { transform: translateY(0) rotate(310deg) scale(0.995); }
      100% { transform: translateY(0) rotate(360deg) scale(1); }
    }


    
    
   

  `,
})
export class LoadingSpinnerComponent { }
