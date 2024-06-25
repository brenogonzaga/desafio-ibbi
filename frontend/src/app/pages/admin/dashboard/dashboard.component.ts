import { Component } from '@angular/core';
import { SellHistoryComponent } from './sell-history/sell-history.component';
import { CategoriesStatisticsComponent } from './categories-statistics/categories-statistics.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SellHistoryComponent,
    CategoriesStatisticsComponent,
    BestSellersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
