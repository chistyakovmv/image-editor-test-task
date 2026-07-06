import { describe, expect, it } from 'vitest';
import { DEFAULT_ADJUSTMENTS } from '../constants';
import { createOperationsDocument } from '../operations';
import type { SourceImage } from '../types';

const source: SourceImage = {
  id: 'source-1',
  name: 'poster.png',
  type: 'image/png',
  objectUrl: 'blob:poster',
  width: 1200,
  height: 800,
  loadedAt: '2026-07-06T00:00:00.000Z',
};

describe('operations document', () => {
  it('serializes replayable operations from a state snapshot', () => {
    expect(
      createOperationsDocument({
        source,
        crop: { x: 20, y: 10, width: 500, height: 300 },
        adjustments: { brightness: 120, contrast: 90, saturation: 110 },
        filter: 'sepia',
      }),
    ).toEqual({
      version: 1,
      source: { name: 'poster.png', width: 1200, height: 800 },
      operations: [
        { type: 'crop', rect: { x: 20, y: 10, width: 500, height: 300 } },
        { type: 'adjust', adjustments: { brightness: 120, contrast: 90, saturation: 110 } },
        { type: 'filter', name: 'sepia' },
      ],
    });
  });

  it('uses full image crop and omits no-op filter when crop/filter are not customized', () => {
    expect(
      createOperationsDocument({
        source,
        crop: null,
        adjustments: DEFAULT_ADJUSTMENTS,
        filter: 'none',
      }).operations,
    ).toEqual([
      { type: 'crop', rect: { x: 0, y: 0, width: 1200, height: 800 } },
      { type: 'adjust', adjustments: DEFAULT_ADJUSTMENTS },
    ]);
  });
});
