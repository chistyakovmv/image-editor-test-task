import { describe, expect, it } from 'vitest';
import { buildCanvasFilter } from '../filters';

describe('canvas filter builder', () => {
  it('builds CSS-compatible filter pipeline', () => {
    expect(buildCanvasFilter({ brightness: 120, contrast: 80, saturation: 150 }, 'grayscale')).toBe(
      'brightness(120%) contrast(80%) saturate(150%) grayscale(1)',
    );
  });
});
