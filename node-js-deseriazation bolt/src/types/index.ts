export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface ReportConfig {
  type: string;
  parameters: Record<string, unknown>;
  format: 'pdf' | 'csv' | 'xlsx';
}