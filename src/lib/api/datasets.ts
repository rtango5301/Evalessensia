/**
 * Datasets API
 * API functions for dataset operations
 */

import { apiGet, apiPost, apiDelete } from './client';
import type { Dataset, DatasetWithQueries, CreateDatasetRequest } from './types';

/**
 * Fetches all datasets for the current user
 * GET /api/datasets
 */
export async function getDatasets(): Promise<Dataset[]> {
  const response = await apiGet<{ datasets: Dataset[] }>('/api/datasets');
  return response.datasets;
}

/**
 * Fetches a single dataset by ID, including its queries
 * GET /api/datasets/{id}
 * Note: API returns dataset directly without wrapper
 */
export async function getDataset(id: string): Promise<DatasetWithQueries> {
  return apiGet<DatasetWithQueries>(`/api/datasets/${id}`);
}

/**
 * Creates a new dataset (generated or uploaded)
 * POST /api/datasets
 * Returns 202 Accepted - use getDataset to poll for completion
 */
export async function createDataset(data: CreateDatasetRequest): Promise<Dataset> {
  const response = await apiPost<{ dataset: Dataset }>('/api/datasets', data);
  return response.dataset;
}

/**
 * Soft-deletes a dataset by ID
 * DELETE /api/datasets/{id}
 * Sets status to 'inactive'
 */
export async function deleteDataset(id: string): Promise<void> {
  await apiDelete(`/api/datasets/${id}`);
}
