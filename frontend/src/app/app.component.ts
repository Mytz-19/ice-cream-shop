import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StepperComponent } from './stepper/stepper.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StepperComponent, 
    RouterModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatSidenavModule, 
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentStep: number = 1;
  isEmployeeSelected: boolean = false;
  isItemsSelected: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentStep(event.url);
      }
    });
  }

  ngOnInit() {
    this.updateCurrentStep(this.router.url);
    this.isEmployeeSelected = !!localStorage.getItem('selectedEmployee');
    this.isItemsSelected = !!localStorage.getItem('selectedItems');
    this.createIceCreamParticles();
  }

  private updateCurrentStep(url: string) {
    if (url.includes('/employee')) {
      this.currentStep = 1;
    } else if (url.includes('/items')) {
      this.currentStep = 2;
    } else if (url.includes('/receipt')) {
      this.currentStep = 3;
    }
  }

  navigateToEmployee() {
    this.router.navigate(['/employee']);
  }

  navigateToItems() {
    if (!this.isEmployeeSelected) {
      this.showError('Please select an employee first');
      return;
    }
    this.router.navigate(['/items']);
  }

  navigateToReceipt() {
    if (!this.isItemsSelected) {
      this.showError('Please select items first');
      return;
    }
    this.router.navigate(['/receipt']);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  updateStepStatus(step: number, completed: boolean) {
    switch (step) {
      case 1:
        this.isEmployeeSelected = completed;
        if (completed) {
          localStorage.setItem('selectedEmployee', 'true');
        } else {
          localStorage.removeItem('selectedEmployee');
        }
        break;
      case 2:
        this.isItemsSelected = completed;
        if (completed) {
          localStorage.setItem('selectedItems', 'true');
        } else {
          localStorage.removeItem('selectedItems');
        }
        break;
    }
  }

  private createIceCreamParticles() {
    const container = document.querySelector('.app-container');
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'ice-cream-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);
    }
  }
}
