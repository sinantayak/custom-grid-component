import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() pageNumber: number = 0;
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 0;
  @Input() totalPages: number = 0;

  @Output() pageChange = new EventEmitter<{ pageNumber: number, pageSize: number }>();

  get startRecord(): number {
    return ((this.pageNumber - 1) * this.pageSize) + 1;
  }

  get endRecord(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageSize'] || changes['totalRecords']) {
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
  }

  firstPage() {
    this.pageNumber = 1;
    this.emitPageChange();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.emitPageChange();
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.emitPageChange();
    }
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.emitPageChange();
  }

  updatePageSize() {
    this.pageNumber = 1;
    this.pageSize = this.pageSize;
    this.emitPageChange();
  }

  private emitPageChange() {
    this.pageChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize });
  }
}