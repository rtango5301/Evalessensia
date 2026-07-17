import { describe, expect, it } from 'vitest';
import { dashboardNavigation, observabilityPageTitle } from './navigation';

describe('observability navigation additions', () => {
  it('keeps the required dashboard order', () => {
    expect(dashboardNavigation.map((item) => item.label)).toEqual([
      'Dashboard',
      'Tracing',
      'Monitoring',
      'Datasets',
      'Evaluations',
    ]);
  });

  it('maps only observability route titles', () => {
    expect(observabilityPageTitle('/tracing')).toBe('Tracing');
    expect(observabilityPageTitle('/tracing/projects/abc')).toBe('Tracing');
    expect(observabilityPageTitle('/monitoring')).toBe('Monitoring');
    expect(observabilityPageTitle('/datasets')).toBeNull();
  });
});
