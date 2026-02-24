import type { ProblemDetail } from "@/types/api";

export class ApiError extends Error {
  public problemDetail?: ProblemDetail;
  public status?: number;

  constructor(message: string, problemDetail?: ProblemDetail, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.problemDetail = problemDetail;
    this.status = status;
  }
}
