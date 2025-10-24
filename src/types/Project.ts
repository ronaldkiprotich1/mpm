export interface Project {
  id: number;
  title: string;
  department_name: string;
  ward_name: string;
  subcounty_name?: string;
  status: string;
  status_display: string;
  financial_year_name: string;
  description: string;
  contractor_name?: string;
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  budget?: number | string | null;
  progress_percentage?: number;
  procurement_stage?: string; // e.g. “Under Procurement”, “Tendering”, etc.
  created_at?: string;
  updated_at?: string;
}
