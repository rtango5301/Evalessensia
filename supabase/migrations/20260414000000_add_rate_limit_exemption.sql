-- Add rate_limit_exempt support via app_metadata JWT claim.
-- Exempt users bypass check_monthly_limit() and get unlimited quotas.

-- A. Update check_monthly_limit to bypass for exempt users
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
  -- Exempt users bypass all limits
  IF (auth.jwt() -> 'app_metadata' ->> 'rate_limit_exempt')::BOOLEAN IS TRUE THEN
    RETURN TRUE;
  END IF;

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

-- B. Update get_usage_quota to return unlimited sentinel for exempt users
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

  -- Exempt users get unlimited quotas (-1 sentinel)
  IF (auth.jwt() -> 'app_metadata' ->> 'rate_limit_exempt')::BOOLEAN IS TRUE THEN
    RETURN json_build_object(
      'datasets_used', datasets_used,
      'datasets_limit', -1,
      'datasets_remaining', -1,
      'evaluations_used', evaluations_used,
      'evaluations_limit', -1,
      'evaluations_remaining', -1,
      'period_start', billing_start,
      'period_end', billing_end,
      'is_exempt', true
    );
  END IF;

  RETURN json_build_object(
    'datasets_used', datasets_used,
    'datasets_limit', 3,
    'datasets_remaining', GREATEST(0, 3 - datasets_used),
    'evaluations_used', evaluations_used,
    'evaluations_limit', 5,
    'evaluations_remaining', GREATEST(0, 5 - evaluations_used),
    'period_start', billing_start,
    'period_end', billing_end,
    'is_exempt', false
  );
END;
$$;
