import { Component } from '@angular/core';
import { Routes } from '../models';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateOrderService } from '../services/create-order.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  readonly employees = Routes.EMPLOYEES;
  protected currentRoute = '';

  constructor(
    public createOrderService: CreateOrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to the NavigationEnd event
    this.activatedRoute.url.subscribe(([url]) => {
      const { path, parameters } = url;
      this.currentRoute = path;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
