import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

interface Step {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatIconModule, MatButtonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() currentStep: number = 1;

  steps: Step[] = [
    { icon: 'person', label: 'Select Employee', route: '/employee' },
    { icon: 'ice_cream', label: 'Select Items', route: '/items' },
    { icon: 'receipt', label: 'Receipt', route: '/receipt' }
  ];

  constructor(private router: Router) {}

  navigateToStep(step: number) {
    if (step <= this.currentStep) {
      this.router.navigate([this.steps[step - 1].route]);
    }
  }
} 