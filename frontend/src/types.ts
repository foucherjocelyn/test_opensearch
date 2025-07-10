export interface Log {
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

export interface LogFilters {
  search: string;
  level: string;
  service: string;
}
