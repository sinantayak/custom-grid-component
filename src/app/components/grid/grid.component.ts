import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Data } from 'models/grid-data.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {

  columns: (keyof Data)[] = [];
  data: Data[] = [];

  groupedData: Record<string, Data[]> = {};
  activeGroupingColumn: (keyof Data) | null = null;

  activeAccordions: Record<string, boolean> = {};

  allData: Data[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;

  isLoading: boolean = false;

  sortingColumn: (keyof Data) | null = null;
  sortingOrder: 'asc' | 'desc' | null = null;

  originalOrder = (): number => {
    return 0;
  }

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getGridData().subscribe(response => {
      this.pageNumber = response.pageNumber;
      this.pageSize = response.pageSize;
      this.allData = response.data;
      this.totalRecords = this.allData.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

      this.setCurrentPageData();
    });
  }

  setCurrentPageData(dontSort?: boolean) {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = this.allData.slice(startIndex, endIndex);

    // columns'ı sadece ilk defasında oluşturmak için.
    if (this.columns.length === 0 && this.data.length > 0) {
      this.generateColumnsFromData(this.data[0]);
    }

    // Eğer aktif bir gruplandırma sütunu varsa gruplandırmayı uygula.
    if (this.activeGroupingColumn) {
      this.groupData(this.activeGroupingColumn, false);
    }

    if (this.sortingColumn && dontSort) {
      this.sortData(this.sortingColumn, true);
    }
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize
    this.setCurrentPageData();
  }

  generateColumnsFromData(row: Data) {
    for (let field in row) {
      if (row.hasOwnProperty(field)) {
        this.columns.push(field);
      }
    }
  }

  groupData(column: keyof Data, reset: boolean = true) {
    if (this.activeGroupingColumn === column && reset) {
      this.activeGroupingColumn = null;
      this.groupedData = {};
      this.activeAccordions = {};
      return;
    }
    this.activeGroupingColumn = column;

    this.groupedData = this.data.reduce((previous, item) => {
      const key = item[column];

      if (!previous[key]) {
        previous[key] = [];
      }

      previous[key].push(item);
      return previous;
    }, {} as Record<string, Data[]>);

    this.activeAccordions = Object.keys(this.groupedData).reduce((current: Record<string, boolean>, key) => {
      current[key] = true;
      return current;
    }, {});
  }

  toggleAccordion(key: string) {
    this.activeAccordions[key] = !this.activeAccordions[key];
  }

  reset() {
    this.isLoading = true;
    this.activeGroupingColumn = null;
    this.groupedData = {};
    this.activeAccordions = {};
    this.pageSize = 10;
    this.pageNumber = 1;
    this.sortingColumn = null;
    this.sortingOrder = null;
    this.setCurrentPageData();
    setTimeout(() => {
      this.isLoading = false;
    }, 250);
  }

  sortData(column: keyof Data, dontChangeOrder?: boolean) {
    if (this.sortingColumn === column && !dontChangeOrder) {
      this.sortingOrder = this.sortingOrder === 'asc' ? 'desc' : 'asc';
    } else if (this.sortingColumn === column && dontChangeOrder) {
      this.sortingOrder = this.sortingOrder;
    } else {
      this.sortingColumn = column;
      this.sortingOrder = 'asc';
    }

    // Önce tüm veriyi sıralıyoruz.
    this.allData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) {
        return this.sortingOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortingOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    // Sonrasında sıralı veriyi sayfa boyutuna göre bölüyoruz.
    this.setCurrentPageData(false);
  }

}
