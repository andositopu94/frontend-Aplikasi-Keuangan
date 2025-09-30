import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | 'aksi';
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
}
