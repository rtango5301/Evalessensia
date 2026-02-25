-- Update rate limits:
--   1. Billing period anchored to user's created_at (not calendar month)
--   2. Evaluation limit: 3 → 5
--   3. Dataset limit: stays at 3

-- A. Helper: compute billing period from user's signup date
CREATE OR REPLACE FUNCTION get_user_billing_period()
RETURNS TABLE(period_start TIMESTAMPTZ, period_end TIMESTAMPTZ)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_created_at TIMESTAMPTZ;
  month_diff INT;
  candidate TIMESTAMPTZ;
BEGIN
  -- Get user signup date
  SELECT u.created_at INTO user_created_at
  FROM auth.users u
  WHERE u.id = auth.uid();

  -- Fallback if no user found
  IF user_created_at IS NULL THEN
    period_start := date_trunc('month', NOW() AT TIME ZONE 'UTC');
    period_end := period_start + INTERVAL '1 month';
    RETURN NEXT;
    RETURN;
  END IF;

  -- Months between signup and now
  month_diff := (EXTRACT(YEAR FROM NOW())::INT - EXTRACT(YEAR FROM user_created_at)::INT) * 12
              + (EXTRACT(MONTH FROM NOW())::INT - EXTRACT(MONTH FROM user_created_at)::INT);

  -- If signup anniversary this month hasn't arrived yet, go back 1 month
  candidate := user_created_at + (month_diff * INTERVAL '1 month');
  IF candidate > NOW() THEN
    month_diff := month_diff - 1;
  END IF;

  period_start := user_created_at + (month_diff * INTERVAL '1 month');
  period_end   := user_created_at + ((month_diff + 1) * INTERVAL '1 month');

  RETURN NEXT;
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_billing_period() TO authenticated;

-- B. Replace check_monthly_limit to use billing period
CREATE OR REPLACE FUNCTION check_monthly_limit(resource_type TEXT, max_count INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  current_count INT;
  billing_start TIMESTAMPTZ;
BEGIN
  SELECT bp.period_start INTO billing_start
  FROM get_user_billing_period() bp;

  IF resource_type = 'datasets' THEN
    SELECT COUNT(*) INTO current_count
    FROM datasets
    WHERE user_id = auth.uid()
      AND created_at >= billing_start;
  ELSIF resource_type = 'evaluation_runs' THEN
    SELECT COUNT(*) INTO current_count
    FROM evaluation_runs
    WHERE user_id = auth.uid()
      AND created_at >= billing_start;
  ELSE
    RETURN FALSE;
  END IF;

  RETURN current_count < max_count;
END;
$$;

-- C. Replace get_usage_quota with updated limits and billing period
CREATE OR REPLACE FUNCTION get_usage_quota()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  datasets_used INT;
  evaluations_used INT;
  billing_start TIMESTAMPTZ;
  billing_end TIMESTAMPTZ;
BEGIN
  SELECT bp.period_start, bp.period_end
  INTO billing_start, billing_end
  FROM get_user_billing_period() bp;

  SELECT COUNT(*) INTO datasets_used
  FROM datasets
  WHERE user_id = auth.uid()
    AND created_at >= billing_start;

  SELECT COUNT(*) INTO evaluations_used
  FROM evaluation_runs
  WHERE user_id = auth.uid()
    AND created_at >= billing_start;

  RETURN json_build_object(
    'datasets_used', datasets_used,
    'datasets_limit', 3,
    'datasets_remaining', GREATEST(0, 3 - datasets_used),
    'evaluations_used', evaluations_used,
    'evaluations_limit', 5,
    'evaluations_remaining', GREATEST(0, 5 - evaluations_used),
    'period_start', billing_start,
    'period_end', billing_end
  );
END;
$$;

-- D. Recreate RLS INSERT policies with updated evaluation limit
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
    AND check_monthly_limit('evaluation_runs', 5)
  );
