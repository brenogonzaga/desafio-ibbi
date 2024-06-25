import Chart, { ChartItem } from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@root/app/services/dashboard.service';
import { CategorySummary } from '@root/app/models/categorySummary';

@Component({
  selector: 'app-categories-statistics',
  standalone: true,
  templateUrl: './categories-statistics.component.html',
  styleUrls: ['./categories-statistics.component.scss'],
})
export class CategoriesStatisticsComponent implements OnInit {
  categorySummary: CategorySummary[];
  totalSells: number;

  constructor(private saleService: DashboardService) {}

  ngOnInit(): void {
    this.saleService.getSalesData().subscribe((data) => {
      this.categorySummary = data.category_summary;
      this.totalSells = this.salesReducer(data.category_summary);
      const others = this.categorySummary.slice(3);
      const topCategories = this.categorySummary.slice(0, 3);
      topCategories.push({
        category_id: 0,
        description: 'Outros',
        total_sales: this.salesReducer(others),
      });

      const chartElement = document.getElementById('acquisitions');
      if (chartElement) {
        new Chart(chartElement as ChartItem, {
          type: 'doughnut',
          data: {
            labels: topCategories.map((category) => category.description),
            datasets: [
              {
                data: topCategories.map((category) => category.total_sales),
                hoverOffset: 4,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'right',
                align: 'start',
              },
            },
          },
        });
      }
    });
  }

  salesReducer(categorySummary: CategorySummary[]): number {
    return categorySummary.reduce(
      (acc, category) => acc + category.total_sales,
      0
    );
  }
}
