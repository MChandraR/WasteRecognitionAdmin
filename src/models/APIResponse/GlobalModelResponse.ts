export interface GlobalModelResponse {
  id : string;
  model_name: string;
  model_version: string;
  accuracy: number;
  f1_score: number;
  error_rate: number;
  last_updated: string;
}