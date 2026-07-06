import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useImageEditStore, type SourceImage } from '@/entities/image-edit';

const source: SourceImage = {
  id: 'source-1',
  name: 'poster.png',
  type: 'image/png',
  objectUrl: 'blob:poster',
  width: 1200,
  height: 800,
  loadedAt: '2026-07-06T00:00:00.000Z',
};

describe('image edit store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal('URL', { revokeObjectURL: vi.fn() });
  });

  it('resets operations to a non-destructive full-source baseline', () => {
    const store = useImageEditStore();

    store.setSource(source);
    store.setCrop({ x: 20, y: 10, width: 500, height: 300 });
    store.updateAdjustment('brightness', 130);
    store.setFilter('sepia');
    store.resetOperations();

    expect(store.crop).toEqual({ x: 0, y: 0, width: 1200, height: 800 });
    expect(store.adjustments).toEqual({ brightness: 100, contrast: 100, saturation: 100 });
    expect(store.filter).toBe('none');
    expect(store.operationsDocument?.operations[0]).toEqual({
      type: 'crop',
      rect: { x: 0, y: 0, width: 1200, height: 800 },
    });
  });

  it('normalizes crop before saving it', () => {
    const store = useImageEditStore();
    store.setSource(source);

    store.setCrop({ x: 1195, y: 790, width: 100, height: 100 });

    expect(store.crop).toEqual({ x: 1195, y: 790, width: 5, height: 10 });
  });
});
