import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IDataTableColumn, IDataTablePaginationOptions } from 'novo-elements';
import { HistoricJob, HistoricJobCategory, JobCategory } from '../../interfaces/examples';
import { BullhornMeta } from '../../interfaces/bullhorn';

@Component({
  selector: 'app-historic-jobs',
  templateUrl: './historicJobs.component.html',
  styleUrls: ['./historicJobs.component.scss'],
})
export class HistoricJobsComponent implements OnInit {
  @Input() historicJobCategories: HistoricJobCategory[];
  @Input() jobMeta: BullhornMeta;
  @Input() isNovoEnabled: boolean;

  rows: HistoricJob[] = [];
  columns: IDataTableColumn<any>[];
  displayColumns: string[] = ['title', 'dateAdded', 'daysToSubmitAverage', 'daysToFirstFill'];
  defaultSort = { id: 'dateAdded', value: 'desc' };
  paginationOptions: IDataTablePaginationOptions = {
    theme: 'standard',
    page: 0,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 250, 500],
  };

  dataSetOptions: any[] = [
    { label: 'COMPANY', value: JobCategory.Company },
    { label: 'ROLE', value: JobCategory.Role },
  ];
  loadedDataSet: number = JobCategory.Company;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): any {
    this.loadDataset(this.loadedDataSet);
    this.buildColumns();
    this.ref.detectChanges();
  }

  loadDataset(index: number) {
    this.rows = this.historicJobCategories[index] && this.historicJobCategories[index].jobs;
    if (this.rows && this.rows.length) {
      // Must match `this.defaultSort` - jobs by date descending.
      this.rows.sort((a, b) => b.dateAdded - a.dateAdded);
    }
  }

  private buildColumns(): void {
    this.columns = [{
      id: 'id',
      type: 'number',
    }, {
      id: 'title',
      label: 'Title',
      type: 'text',
      template: 'jobOrder',
    }, {
      id: 'dateAdded',
      label: 'Date Added',
      type: 'text',
      template: 'timestamp',
      width: 160,
    }, {
      id: 'numOpenings',
      label: 'Openings',
      type: 'text',
      width: 180,
    }, {
      id: 'daysToSubmitAverage',
      label: 'Days to Submit',
      type: 'text',
      width: 180,
    }, {
      id: 'daysToFirstFill',
      label: 'Days to Fill',
      type: 'text',
      width: 170,
    }];
    this.columns.forEach(column => {
      const columnMeta: any = this.jobMeta.fields.find((item) => item.name === column.id);
      column.label = columnMeta ? columnMeta.label : column.label;
      column.filterable = true;
      column.sortable = true;
    });
  }
}
