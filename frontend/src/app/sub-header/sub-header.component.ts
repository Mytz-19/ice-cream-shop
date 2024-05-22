import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Routes } from '../models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sub-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss'
})
export class SubHeaderComponent implements OnInit {

  @Input() headerContent: string = '';
  readonly employees = Routes.EMPLOYEES;
  protected currentRoute = '';

  constructor(
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
    // this.route = route;
    this.router.navigate([route]);
  }
}
