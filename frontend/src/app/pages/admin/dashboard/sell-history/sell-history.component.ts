import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@root/app/services/dashboard.service';
import { extractDateFromTimestamp } from '@root/app/utils/extractDateFromTimestamp';
import { extractTimeFromTimestamp } from '@root/app/utils/extractTimeFromTimestamp';

type Sale = {
  date: string;
  time: string;
  seller: string;
  customer: string;
  description: number;
  note: string;
};

@Component({
  selector: 'app-sell-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sell-history.component.html',
  styleUrls: ['./sell-history.component.scss'],
})
export class SellHistoryComponent implements OnInit {
  extractDate = extractDateFromTimestamp;
  extractTime = extractTimeFromTimestamp;
  salesHistory: Sale[] = [];

  constructor(private saleService: DashboardService) {}

  ngOnInit(): void {
    this.saleService.getSalesData().subscribe((data) => {
      this.salesHistory = [];
      data.sales_history.forEach((sale) => {
        if (this.salesHistory.length === 4) return;
        sale.items.forEach((item) => {
          if (this.salesHistory.length === 4) return;
          this.salesHistory.push({
            date: this.extractDate(sale.timestamp),
            time: this.extractTime(sale.timestamp),
            seller: item.seller.name,
            customer: sale.user.name,
            description: item.description,
            note: sale.note,
          });
        });
      });
    });
  }
}
