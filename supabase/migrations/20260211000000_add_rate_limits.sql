-- Rate limiting: 3 evaluations + 3 datasets per calendar month
-- Two-layer enforcement: DB functions + modified RLS INSERT policies

-- A. check_monthly_limit function
-- Used by RLS policies to enforce insert limits
CREATE OR REPLACE FUNCTION check_monthly_limit(resource_type TEXT, max_count INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  current_count INT;
BEGIN
  IF resource_type = 'datasets' THEN
    SELECT COUNT(*)
    INTO current_count
    FROM datasets
    WHERE user_id = auth.uid()
      AND created_at >= date_trunc('month', NOW() AT TIME ZONE 'UTC');
  ELSIF resource_type = 'evaluation_runs' THEN
    SELECT COUNT(*)
    INTO current_count
    FROM evaluation_runs
    WHERE user_id = auth.uid()
      AND created_at >= date_trunc('month', NOW() AT TIME ZONE 'UTC');
  ELSE
    RETURN FALSE;
  END IF;

  RETURN current_count < max_count;
END;
$$;

-- B. get_usage_quota RPC function
-- Called from frontend to display remaining quota
CREATE OR REPLACE FUNCTION get_usage_quota()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  datasets_used INT;
  evaluations_used INT;
  period_start TIMESTAMPTZ;
  period_end TIMESTAMPTZ;
BEGIN
  period_start := date_trunc('month', NOW() AT TIME ZONE 'UTC');
  period_end := (period_start + INTERVAL '1 month');

  SELECT COUNT(*)
  INTO datasets_used
  FROM datasets
  WHERE user_id = auth.uid()
    AND created_at >= period_start;

  SELECT COUNT(*)
  INTO evaluations_used
  FROM evaluation_runs
  WHERE user_id = auth.uid()
    AND created_at >= period_start;

  RETURN json_build_object(
    'datasets_used', datasets_used,
    'datasets_limit', 3,
    'datasets_remaining', GREATEST(0, 3 - datasets_used),
    'evaluations_used', evaluations_used,
    'evaluations_limit', 3,
    'evaluations_remaining', GREATEST(0, 3 - evaluations_used),
    'period_start', period_start,
    'period_end', period_end
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_usage_quota() TO authenticated;

-- C. Drop and recreate INSERT policies with rate limit checks
DROP POLICY IF EXISTS "Users can insert own datasets" ON datasets;
CREATE POLICY "Users can insert own datasets" ON datasets
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND check_monthly_limit('datasets', 3)
  );

DROP POLICY IF EXISTS "Users can insert own evaluation runs" ON evaluation_runs;
CREATE POLICY "Users can insert own evaluation runs" ON evaluation_runs
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND check_monthly_limit('evaluation_runs', 3)
  );
