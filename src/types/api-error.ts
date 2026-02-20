export interface ApiError {
  code: string;
  message: string;
  httpStatus: number;
  details?: Record<string, unknown>;
}
