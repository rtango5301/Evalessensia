-- Enums
CREATE TYPE dataset_status AS ENUM ('in_progress', 'completed', 'failed');
CREATE TYPE dataset_source AS ENUM ('existing', 'uploaded', 'generated');
CREATE TYPE evaluation_status AS ENUM ('in_progress', 'completed', 'failed');
CREATE TYPE pass_fail AS ENUM ('pass', 'fail');

-- Datasets
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    query_count INTEGER DEFAULT 0,
    status dataset_status DEFAULT 'in_progress',
    source dataset_source NOT NULL,
    generated_config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_datasets_user_id ON datasets(user_id);

-- Dataset Queries
CREATE TABLE dataset_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    query_id VARCHAR(100) NOT NULL,
    query TEXT NOT NULL,
    reference_answer TEXT NOT NULL,
    category VARCHAR(100),
    rubric JSONB NOT NULL DEFAULT '[]',
    additional_context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dataset_id, query_id)
);

-- Evaluation Runs
CREATE TABLE evaluation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status evaluation_status DEFAULT 'in_progress',
    dataset_id UUID NOT NULL REFERENCES datasets(id),
    config JSONB NOT NULL,
    results_summary JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evaluation_runs_user_id ON evaluation_runs(user_id);

-- Evaluation Results
CREATE TABLE evaluation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_run_id UUID NOT NULL REFERENCES evaluation_runs(id) ON DELETE CASCADE,
    query_id VARCHAR(100) NOT NULL,
    query TEXT NOT NULL,
    reference_answer TEXT NOT NULL,
    category VARCHAR(100),
    rubric JSONB NOT NULL DEFAULT '[]',
    agent_response TEXT,
    latency_ms INTEGER,
    grader_reasoning TEXT,
    score DECIMAL(5,4),
    pass_fail pass_fail,
    additional_context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_datasets_status ON datasets(status);
CREATE INDEX idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX idx_evaluation_runs_status ON evaluation_runs(status);
CREATE INDEX idx_evaluation_runs_created_at ON evaluation_runs(created_at DESC);
CREATE INDEX idx_evaluation_results_run_id ON evaluation_results(evaluation_run_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_datasets_updated_at
    BEFORE UPDATE ON datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_runs_updated_at
    BEFORE UPDATE ON evaluation_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update query_count
CREATE OR REPLACE FUNCTION update_dataset_query_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE datasets SET query_count = query_count + 1 WHERE id = NEW.dataset_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE datasets SET query_count = query_count - 1 WHERE id = OLD.dataset_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_query_count
    AFTER INSERT OR DELETE ON dataset_queries
    FOR EACH ROW EXECUTE FUNCTION update_dataset_query_count();
