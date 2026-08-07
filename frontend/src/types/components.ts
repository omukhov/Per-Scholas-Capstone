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

export interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface IStatCardProps {
  title: string;
  value: number;
  description?: string;
}

export interface IChartDataItem {
  name: string;
  value: number;
}

export interface ISourceChartProps {
  data: IChartDataItem[];
}

export interface IChartDataItem {
  name: string;
  value: number;
}

export interface ILevelChartProps {
  data: IChartDataItem[];
}

export interface IJobsTimelineItem {
  date: string;
  jobs: number;
}

export interface IJobsTimelineProps {
  data: IJobsTimelineItem[];
}

export interface IJobMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}
