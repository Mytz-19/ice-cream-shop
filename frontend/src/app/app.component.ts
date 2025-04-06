import { Component, OnInit, HostListener } from '@angular/core';
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
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRippleModule } from '@angular/material/core';
import { CreateOrderService } from './services/create-order.service';

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
    MatBottomSheetModule,
    MatRippleModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentStep: number = 1;
  isEmployeeSelected: boolean = false;
  isItemsSelected: boolean = false;
  isMobile: boolean = false;
  screenWidth: number = 0;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private createOrderService: CreateOrderService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentStep(event.url);
        if (event.url.includes('/employees')) {
          this.updateSelectionStates();
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.updateCurrentStep(this.router.url);
    this.createIceCreamParticles();
    this.checkScreenSize();
  }

  private updateSelectionStates() {
    this.isEmployeeSelected = !!this.createOrderService.selectedEmployee;
    this.isItemsSelected = this.createOrderService.selectedProducts.length > 0;
    this.currentStep = 1;
  }

  private checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 768;
  }

  getSidenavMode() {
    return this.isMobile ? 'over' : 'side';
  }

  getSidenavOpened() {
    return !this.isMobile;
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
    this.currentStep = 1;
    this.router.navigate(['/employee']);
  }
  
  navigateToItems() {
    if (this.isEmployeeSelected || this.currentStep === 3) {
      this.currentStep = 2;
      this.router.navigate(['/items']);
    }
  }
  
  navigateToReceipt() {
    if ((this.isEmployeeSelected && this.isItemsSelected) || this.currentStep === 3) {
      this.currentStep = 3;
      this.router.navigate(['/receipt']);
    }
  }
  

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: ['error-snackbar']
    });
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