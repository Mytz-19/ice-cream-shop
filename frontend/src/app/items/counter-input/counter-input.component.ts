import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-counter-input',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './counter-input.component.html',
  styleUrl: './counter-input.component.scss'
})
export class CounterInputComponent {

  @Input()
  counterValue = 1;

  increment() {
    this.counterValue++;
  }

  decrement() {
    if(this.counterValue<=1) return;
    else this.counterValue--;
  }
}
