import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useImageEditStore, type SourceImage } from '@/entities/image-edit';
import { useCropSession } from '../useCropSession';

const source: SourceImage = {
  id: 'source-1',
  name: 'poster.png',
  type: 'image/png',
  objectUrl: 'blob:poster',
  width: 1200,
  height: 800,
  loadedAt: '2026-07-06T00:00:00.000Z',
};

describe('useCropSession', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal('URL', { revokeObjectURL: vi.fn() });
  });

  it('keeps cropper changes as draft until user applies them', () => {
    const store = useImageEditStore();
    store.setSource(source);
    const session = useCropSession();

    session.startCrop();
    session.updateDraftCrop({ x: 20, y: 10, width: 500, height: 300 });

    expect(store.crop).toEqual({ x: 0, y: 0, width: 1200, height: 800 });
    expect(session.draftCrop.value).toEqual({ x: 20, y: 10, width: 500, height: 300 });

    session.applyCrop();

    expect(store.crop).toEqual({ x: 20, y: 10, width: 500, height: 300 });
    expect(session.isCropMode.value).toBe(false);
  });

  it('cancels draft crop without mutating committed crop', () => {
    const store = useImageEditStore();
    store.setSource(source);
    const session = useCropSession();

    session.startCrop();
    session.updateDraftCrop({ x: 20, y: 10, width: 500, height: 300 });
    session.cancelCrop();

    expect(store.crop).toEqual({ x: 0, y: 0, width: 1200, height: 800 });
    expect(session.draftCrop.value).toBeNull();
  });
});
