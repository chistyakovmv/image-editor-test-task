import { describe, expect, it } from 'vitest';
import { getFullImageCrop, normalizeCropRect, areCropRectsEqual } from '../crop';

const source = { width: 800, height: 600 };

describe('crop model', () => {
  it('creates full image crop from source dimensions', () => {
    expect(getFullImageCrop(source)).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('normalizes crop values and clamps them to source bounds', () => {
    expect(normalizeCropRect({ x: 790.2, y: -5, width: 50.7, height: 700 }, source)).toEqual({
      x: 790,
      y: 0,
      width: 10,
      height: 600,
    });
  });

  it('compares rounded crop rects', () => {
    expect(
      areCropRectsEqual(
        { x: 1.2, y: 2.4, width: 300.2, height: 200.3 },
        { x: 1, y: 2, width: 300, height: 200 },
      ),
    ).toBe(true);
  });
});
