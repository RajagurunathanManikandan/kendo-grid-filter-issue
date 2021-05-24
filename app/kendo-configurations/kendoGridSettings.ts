import { Injectable } from "@angular/core";
import { ColumnMenuSettings, GridComponent, SelectAllCheckboxState, SortSettings } from "@progress/kendo-angular-grid";
import {
  CompositeFilterDescriptor,
  filterBy,
  GroupDescriptor,
  isCompositeFilterDescriptor,
  orderBy,
  SortDescriptor,
  State,
} from "@progress/kendo-data-query";

@Injectable({
  providedIn: "root",
})
export class KendoGridSettingsService {
  public gridSortSettings: SortSettings = { allowUnsort: false, mode: "single" };
  private statusFilter: Array<any> = [];
  public selectAllState: SelectAllCheckboxState = "unchecked";
  public state: State = {
    skip: 0,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public columnSettings: ColumnMenuSettings = {
    filter: true,
    columnChooser: false,
    sort: false,
  };
  hideDefaultGroupedColumn = true;
  resetfilter() {
    this.state.filter = {
      logic: "and",
      filters: [],
    };
    this.selectAllState = "unchecked";
  }

  statusFilters(filter: CompositeFilterDescriptor) {
    this.statusFilter = [];
    this.statusFilter.splice(0, this.statusFilter.length, ...flatten(filter).map(({ value }) => value));
    return this.statusFilter;
  }

  filterChange(values, filterService, columnName: string) {
    filterService.filter({
      filters: values.map((value) => ({
        field: columnName,
        operator: "eq",
        value,
      })),
      logic: "or",
    });
  }

  filterResults(kendoGridService: KendoGridSettingsService, filter: CompositeFilterDescriptor, value) {
    kendoGridService.state.filter = filter;
    filterBy(value, filter);
  }
  exportToExcel(grid: GridComponent): void {
    grid.saveAsExcel();
  }
  exportToPdf(grid: GridComponent) {
    grid.saveAsPDF();
  }

  onSelectedKeysChange(keys: string[], gridData: any[]) {
    const selectedKeys = keys.length;
    if (selectedKeys === 0) {
      this.selectAllState = "unchecked";
    } else if (selectedKeys > 0 && selectedKeys < gridData.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
  }
  groupChanged(selectedGroups: GroupDescriptor[], columnName: string) {
    const groupedColumns = selectedGroups.map((group) => group.field);
    if (groupedColumns.includes(columnName)) {
      this.hideDefaultGroupedColumn = true;
    } else {
      this.hideDefaultGroupedColumn = false;
    }
  }
  public sortChange(data: any[], sort: SortDescriptor[]): any[] {
    return orderBy(data, sort);
  }
}

export const flatten = (filter) => {
  if (filter.filters) {
    return filter.filters.reduce(
      (actualFilter, currentFilter) =>
        actualFilter.concat(isCompositeFilterDescriptor(currentFilter) ? flatten(currentFilter) : [currentFilter]),
      []
    );
  }
  return [];
};
