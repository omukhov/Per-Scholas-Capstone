import type { ReactNode } from "react";

export interface ITableColumn<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
}

export interface IDataTableProps<T> {
  columns: ITableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
}

export interface IJobFiltersProps {
  searchInput: string;
  internshipOnly: boolean;
  remoteOnly: boolean;

  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onInternshipChange: () => void;
  onRemoteChange: () => void;
  onClear: () => void;
}
