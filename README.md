# Image Editor Test Task

Browser-based non-destructive image editor for print-prep style workflows.

## Stack

- Vue 3 + TypeScript
- Vuetify 3
- Pinia
- Vite
- cropperjs

## Run

```bash
npm i
npm run dev
```

## Features

- Image upload from local file.
- Crop with cropperjs.
- Live canvas preview.
- Brightness, contrast and saturation sliders.
- Non-destructive reset and original/edited comparison.
- PNG export.
- Bonus: greyscale/sepia filters.
- Bonus: JSON export of replayable operations.

## Architecture Notes

The code is organized close to Feature-Sliced Design:

- `app` contains app bootstrap, Vuetify and global styles.
- `pages/editor` owns the page composition.
- `widgets/editor-workspace` composes larger UI blocks.
- `features/*` contains user-facing actions: upload, crop, adjustments and export.
- `entities/image-edit` contains the operation model, Pinia store and canvas render pipeline.

The original image is kept as an object URL with immutable source metadata. Edits are stored separately as operations:

```json
{
  "version": 1,
  "source": { "name": "example.png", "width": 1200, "height": 800 },
  "operations": [
    { "type": "crop", "rect": { "x": 0, "y": 0, "width": 1200, "height": 800 } },
    { "type": "adjust", "adjustments": { "brightness": 100, "contrast": 100, "saturation": 100 } },
    { "type": "filter", "name": "sepia" }
  ]
}
```

Rendering is derived from the original image every time through `renderImageToCanvas`. The same renderer is used by preview and export, so the downloaded PNG matches the visible result.

## Trade-offs

- Canvas filters are used for brightness/contrast/saturation/filter operations. This keeps the implementation compact and deterministic enough for the task, but a production print pipeline could replace it with a more explicit pixel-processing engine or WASM module.
- Cropperjs is used for crop interaction to avoid spending the task budget on low-level pointer handling.
- Export is PNG-only for predictable browser support and lossless output.
