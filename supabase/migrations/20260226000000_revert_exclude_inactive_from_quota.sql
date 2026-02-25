-- Revert: remove "AND status != 'inactive'" filter from quota functions.
-- Quota is consumed on creation and is NOT freed by deletion.

-- A. Restore check_monthly_limit: count ALL records in billing period
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

-- B. Restore get_usage_quota: count ALL records in billing period
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
