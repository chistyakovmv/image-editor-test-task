import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { type CropRect, type SourceImage } from '@/entities/image-edit';
import { useCropperOverlay } from '../useCropperOverlay';

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

const createSession = () => ({
  isCropMode: ref(true),
  draftCrop: ref<CropRect | null>({ x: 0, y: 0, width: 1200, height: 800 }),
  updateDraftCrop: vi.fn(),
});

describe('useCropperOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates cropper when image element, source and crop mode are available', async () => {
    const session = createSession();
    const cropperFactory = vi.fn().mockReturnValue({
      destroy: vi.fn(),
      getData: vi.fn().mockReturnValue({ x: 0, y: 0, width: 1200, height: 800 }),
      setData: vi.fn(),
    });

    const overlay = useCropperOverlay({
      source: ref(source),
      session,
      cropperFactory,
    });

    overlay.imageElement.value = document.createElement('img');
    await nextTick();
    await flushPromises();

    expect(cropperFactory).toHaveBeenCalledTimes(1);
    expect(cropperFactory.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        responsive: true,
        viewMode: 1,
        zoomable: true,
      }),
    );
  });

  it('does not commit draft update when crop event was caused by state sync', async () => {
    const session = createSession();
    let cropHandler: (() => void) | undefined;
    const setData = vi.fn(() => {
      cropHandler?.();
    });

    const cropperFactory = vi.fn().mockImplementation((_image, options) => {
      cropHandler = options.crop;

      return {
        destroy: vi.fn(),
        getData: vi.fn().mockReturnValue({ x: 0, y: 0, width: 1200, height: 800 }),
        setData,
      };
    });

    const overlay = useCropperOverlay({
      source: ref(source),
      session,
      cropperFactory,
    });

    overlay.imageElement.value = document.createElement('img');
    await nextTick();
    await flushPromises();

    session.draftCrop.value = { x: 10, y: 10, width: 500, height: 300 };
    await nextTick();
    await flushPromises();

    expect(setData).toHaveBeenCalledWith({ x: 10, y: 10, width: 500, height: 300 });
    expect(session.updateDraftCrop).not.toHaveBeenCalled();
  });
});
