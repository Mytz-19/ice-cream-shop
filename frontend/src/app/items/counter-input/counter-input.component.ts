import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input() isDisabled: boolean = false;
  @Output() count: EventEmitter<number> = new EventEmitter<number>();
  
  protected counterValue = 1;

  increment() {
    if(!this.isDisabled) {
      this.counterValue++;
      this.count.emit(this.counterValue);
    }
  }

  decrement() {
    if(!this.isDisabled) {
      if(this.counterValue<=1) return;
      else {
        this.counterValue--;
        this.count.emit(this.counterValue);
      }
    }
  }
}
