-- Enable Row-Level Security on all tables
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;

-- Datasets: users can only access their own
CREATE POLICY "Users can select own datasets" ON datasets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own datasets" ON datasets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own datasets" ON datasets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own datasets" ON datasets FOR DELETE USING (auth.uid() = user_id);

-- Dataset queries: users can access queries belonging to their datasets
CREATE POLICY "Users can select own dataset queries" ON dataset_queries FOR SELECT USING (
  EXISTS (SELECT 1 FROM datasets WHERE datasets.id = dataset_queries.dataset_id AND datasets.user_id = auth.uid())
);
CREATE POLICY "Users can insert own dataset queries" ON dataset_queries FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM datasets WHERE datasets.id = dataset_queries.dataset_id AND datasets.user_id = auth.uid())
);
CREATE POLICY "Users can update own dataset queries" ON dataset_queries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM datasets WHERE datasets.id = dataset_queries.dataset_id AND datasets.user_id = auth.uid())
);
CREATE POLICY "Users can delete own dataset queries" ON dataset_queries FOR DELETE USING (
  EXISTS (SELECT 1 FROM datasets WHERE datasets.id = dataset_queries.dataset_id AND datasets.user_id = auth.uid())
);

-- Evaluation runs: users can only access their own
CREATE POLICY "Users can select own evaluation runs" ON evaluation_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evaluation runs" ON evaluation_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evaluation runs" ON evaluation_runs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evaluation runs" ON evaluation_runs FOR DELETE USING (auth.uid() = user_id);

-- Evaluation results: users can access results belonging to their runs
CREATE POLICY "Users can select own evaluation results" ON evaluation_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM evaluation_runs WHERE evaluation_runs.id = evaluation_results.evaluation_run_id AND evaluation_runs.user_id = auth.uid())
);
CREATE POLICY "Users can insert own evaluation results" ON evaluation_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM evaluation_runs WHERE evaluation_runs.id = evaluation_results.evaluation_run_id AND evaluation_runs.user_id = auth.uid())
);
CREATE POLICY "Users can update own evaluation results" ON evaluation_results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM evaluation_runs WHERE evaluation_runs.id = evaluation_results.evaluation_run_id AND evaluation_runs.user_id = auth.uid())
);
CREATE POLICY "Users can delete own evaluation results" ON evaluation_results FOR DELETE USING (
  EXISTS (SELECT 1 FROM evaluation_runs WHERE evaluation_runs.id = evaluation_results.evaluation_run_id AND evaluation_runs.user_id = auth.uid())
);
