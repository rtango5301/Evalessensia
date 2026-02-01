/**
 * Evaluations API
 * API functions for evaluation operations
 */

import { apiGet, apiPost, apiDelete } from './client';
import type { Evaluation, EvaluationWithResults, CreateEvaluationRequest } from './types';

/**
 * Fetches all evaluations for the current user
 * GET /api/evaluations
 */
export async function getEvaluations(): Promise<Evaluation[]> {
  const response = await apiGet<{ evaluations: Evaluation[] }>('/api/evaluations');
  return response.evaluations;
}

/**
 * Fetches a single evaluation by ID, including its results
 * GET /api/evaluations/{id}
 * Note: API returns evaluation directly without wrapper
 */
export async function getEvaluation(id: string): Promise<EvaluationWithResults> {
  return apiGet<EvaluationWithResults>(`/api/evaluations/${id}`);
}

/**
 * Creates a new evaluation
 * POST /api/evaluations
 * Returns 202 Accepted - use getEvaluation to poll for completion
 */
export async function createEvaluation(data: CreateEvaluationRequest): Promise<Evaluation> {
  return apiPost<Evaluation>('/api/evaluations', data);
}

/**
 * Soft-deletes an evaluation by ID
 * DELETE /api/evaluations/{id}
 * Sets status to 'inactive'
 */
export async function deleteEvaluation(id: string): Promise<void> {
  await apiDelete(`/api/evaluations/${id}`);
}
