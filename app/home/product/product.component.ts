import { Component, OnInit } from '@angular/core';
import { ColumnMenuSettings, DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { sampleProducts } from '../../products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  constructor() {}

  public columnSettings: ColumnMenuSettings = {
    filter: true,
    columnChooser: false,
    sort: false,
  };

  ngOnInit() {}
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ProductName', operator: 'contains', value: 'Chef' }]
    }
  };

  public gridData: GridDataResult = process(sampleProducts, this.state);

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(sampleProducts, this.state);
  }

}
