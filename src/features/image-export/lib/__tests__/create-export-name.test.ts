import { describe, expect, it } from 'vitest';
import { createExportName } from '../create-export-name';

describe('createExportName', () => {
  it('replaces source extension with edited export extension', () => {
    expect(createExportName('print.poster.final.jpg', 'png')).toBe('print.poster.final-edited.png');
  });

  it('falls back to a stable base name', () => {
    expect(createExportName('.png', 'json')).toBe('edited-image-edited.json');
  });
});
