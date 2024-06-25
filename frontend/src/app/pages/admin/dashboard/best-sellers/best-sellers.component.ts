import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductSummary } from '@root/app/models/productSummary';
import { DashboardService } from '@root/app/services/dashboard.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit {
  productSummary: ProductSummary[];
  bars: any[];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSalesData().subscribe((data) => {
      this.productSummary = data.top_sold_products.slice(0, 10);
      this.constructBars(this.productSummary);
    });
  }

  constructBars(productSummary: ProductSummary[]): void {
    const colors = [
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#FF33A6',
      '#FF9A33',
      '#33FFC4',
      '#A633FF',
      '#FFC433',
      '#33FFF2',
      '#FF5733',
    ];
    const bestSellerProductQuantity = productSummary[0].total_sales;
    this.bars = productSummary.map((product, i) => ({
      backgroundColor: colors[i],
      height: `${(product.total_sales / bestSellerProductQuantity) * 100}%`,
    }));
  }
}
