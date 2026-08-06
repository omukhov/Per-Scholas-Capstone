import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
}
