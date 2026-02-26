export interface ProblemDetailViolation {
  field: string;
  message: string;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: ProblemDetailViolation[];
}

export interface ApiErrorPayload {
  status?: number;
  message?: string;
  problemDetail?: ProblemDetail;
}

export interface HealthCheck {
  pod: string
}
