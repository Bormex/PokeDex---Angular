import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <div>
      <img src="/assets/icons/pokemon-loading.svg" alt="" />
    </div>
  `,
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {}
