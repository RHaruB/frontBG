import { Component, Input, Output, EventEmitter, TemplateRef, ContentChildren, QueryList, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';
import { PaginationData, PageEvent } from '@models/interfaces';

@Directive({
    selector: '[appTemplate]',
    standalone: true
})
export class AppTemplate {
    @Input('appTemplate') name: string = '';
    constructor(public template: TemplateRef<any>) { }
}

export interface TableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
    template?: TemplateRef<any>;
}

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [CommonModule, Button],
    templateUrl: './table.html',
    styleUrl: './table.css'
})
export class Table {
    @ContentChildren(AppTemplate) queryTemplates?: QueryList<AppTemplate>;

    getTemplate(name: string): TemplateRef<any> | null {
        return this.queryTemplates?.find(t => t.name === name)?.template || null;
    }
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() loading: boolean = false;
    @Input() pagination: PaginationData = {
        page: 1,
        pageSize: 10,
        totalRecords: 0
    };
    @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    @Input() emptyMessage: string = 'No se encontraron registros';
    @Input() showHeader: boolean = true;
    @Input() striped: boolean = true;
    @Input() hoverable: boolean = true;

    @Output() onPageChange = new EventEmitter<PageEvent>();
    @Output() onSort = new EventEmitter<{ field: string; order: 'asc' | 'desc' }>();
    @Output() onRowClick = new EventEmitter<any>();

    sortField: string = '';
    sortOrder: 'asc' | 'desc' = 'asc';

    get totalPages(): number {
        const totalRecords = this.pagination?.totalRecords || 0;
        const pageSize = this.pagination?.pageSize || 10;
        return Math.max(1, Math.ceil(totalRecords / pageSize));
    }

    get startRecord(): number {
        const page = this.pagination?.page || 1;
        const pageSize = this.pagination?.pageSize || 10;
        return (page - 1) * pageSize + 1;
    }

    get endRecord(): number {
        const page = this.pagination?.page || 1;
        const pageSize = this.pagination?.pageSize || 10;
        const totalRecords = this.pagination?.totalRecords || 0;
        const end = page * pageSize;
        return end > totalRecords ? totalRecords : end;
    }

    get visiblePages(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        const currentPage = this.pagination?.page || 1;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const newPageSize = parseInt(select.value);
        this.onPageChange.emit({
            page: 1,
            pageSize: newPageSize
        });
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.pagination.page) {
            this.onPageChange.emit({
                page,
                pageSize: this.pagination.pageSize
            });
        }
    }

    previousPage(): void {
        if (this.pagination.page > 1) {
            this.goToPage(this.pagination.page - 1);
        }
    }

    nextPage(): void {
        if (this.pagination.page < this.totalPages) {
            this.goToPage(this.pagination.page + 1);
        }
    }

    sort(column: TableColumn): void {
        if (!column.sortable) return;

        if (this.sortField === column.field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = column.field;
            this.sortOrder = 'asc';
        }

        this.onSort.emit({
            field: column.field,
            order: this.sortOrder
        });
    }

    handleRowClick(row: any): void {
        this.onRowClick.emit(row);
    }

    getCellValue(row: any, field: string): any {
        return field.split('.').reduce((obj, key) => obj?.[key], row);
    }
}
