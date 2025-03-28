import { Component, EventEmitter, Input, Output, forwardRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-counter-input',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './counter-input.component.html',
  styleUrl: './counter-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true
    }
  ]
})
export class CounterInputComponent implements ControlValueAccessor, OnChanges, OnInit {
  @Input() isDisabled: boolean = false;
  @Input() min: number = 1;
  @Input() max: number = 999;
  @Output() count: EventEmitter<number> = new EventEmitter<number>();
  
  protected counterValue = 1;
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    // Initialize with min value if not set
    if (this.counterValue < this.min) {
      this.counterValue = this.min;
      this.onChange(this.counterValue);
      this.count.emit(this.counterValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max']) {
      // Ensure counterValue is within bounds when min/max changes
      this.counterValue = Math.min(Math.max(this.counterValue, this.min), this.max);
      this.onChange(this.counterValue);
      this.count.emit(this.counterValue);
    }
  }

  writeValue(value: number): void {
    if (value !== undefined && value !== this.counterValue) {
      this.counterValue = Math.min(Math.max(value, this.min), this.max);
      this.onChange(this.counterValue);
      this.count.emit(this.counterValue);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  increment() {
    if (!this.isDisabled && this.counterValue < this.max) {
      this.counterValue++;
      this.onChange(this.counterValue);
      this.count.emit(this.counterValue);
    }
  }

  decrement() {
    if (!this.isDisabled && this.counterValue > this.min) {
      this.counterValue--;
      this.onChange(this.counterValue);
      this.count.emit(this.counterValue);
    }
  }
}
