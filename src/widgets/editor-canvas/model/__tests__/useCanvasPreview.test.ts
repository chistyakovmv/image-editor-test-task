import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useImageEditStore, type SourceImage } from '@/entities/image-edit';
import { useCanvasPreview } from '../useCanvasPreview';

const source: SourceImage = {
  id: 'source-1',
  name: 'poster.png',
  type: 'image/png',
  objectUrl: 'blob:poster',
  width: 1200,
  height: 800,
  loadedAt: '2026-07-06T00:00:00.000Z',
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('useCanvasPreview', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal('URL', { revokeObjectURL: vi.fn() });
  });

  it('renders after canvas ref appears when image was already loaded', async () => {
    const store = useImageEditStore();
    const renderer = vi.fn().mockResolvedValue(undefined);
    const preview = useCanvasPreview({
      activeCrop: computed(() => store.effectiveCrop),
      isCropMode: computed(() => false),
      renderer,
    });

    store.setSource(source);
    await nextTick();
    await flushPromises();

    expect(renderer).not.toHaveBeenCalled();

    preview.canvasElement.value = document.createElement('canvas');
    await nextTick();
    await flushPromises();

    expect(renderer).toHaveBeenCalledTimes(1);
    expect(renderer).toHaveBeenCalledWith(
      preview.canvasElement.value,
      expect.objectContaining({
        crop: { x: 0, y: 0, width: 1200, height: 800 },
        filter: 'none',
        ignoreEdits: false,
        source,
      }),
    );
  });
});
