# Image Editor Test Task

Browser-based non-destructive image editor for print-prep style workflows.

## Stack

- Vue 3 + TypeScript
- Vuetify 3
- Pinia
- Vite
- cropperjs
- Vitest

## Run

```bash
npm i
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## Features

- Image upload from local file.
- Unified editor stage: preview and crop mode work on the same main image area.
- Draft crop workflow with explicit `Apply`, `Cancel` and `Reset crop to full image` actions.
- Live canvas preview.
- Brightness, contrast and saturation sliders.
- Non-destructive reset and original/edited comparison.
- PNG export.
- Bonus: greyscale/sepia filters.
- Bonus: JSON export of replayable operations.
- Unit tests for the operation model, crop model, store behavior, export naming and crop session.

## Architecture Notes

The code follows a pragmatic Feature-Sliced Design structure:

- `app` contains app bootstrap, Vuetify and global styles.
- `pages/editor` owns page-level composition.
- `widgets/editor-workspace` composes the editor layout.
- `widgets/editor-canvas` owns the unified editor stage and preview rendering orchestration.
- `features/*` contains user-facing actions: upload, crop, adjustments and export.
- `entities/image-edit` contains the domain model, pure operation helpers, Pinia store and canvas render pipeline.
- `shared/lib/*` contains browser/download utilities with no feature knowledge.

The original image is kept as an object URL with immutable source metadata. Edits are stored separately and the preview/export are derived from the original image each time. This keeps editing non-destructive.

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

## Crop UX Decision

Cropper events are treated as transient UI state, not as committed business operations. The crop feature keeps a `draftCrop` while crop mode is active. Only `Apply` writes the crop into the image-edit store and operation JSON. `Cancel` discards the draft, and `Reset crop to full image` restores the full source rect.

This avoids a common cropper issue: responsive layout recalculation can emit crop events. Those events should not rewrite the operation model just because the viewport changed.

## Testability

The important business rules are pure functions or small composables:

- `normalizeCropRect`, `getFullImageCrop`, `areCropRectsEqual`
- `createOperationsDocument`
- `buildCanvasFilter`
- `createExportName`
- `useCropSession`
- Pinia store reset/update behavior

The tests intentionally focus on the edit model and workflow decisions rather than testing cropperjs itself.

## Trade-offs

- Canvas filters are used for brightness/contrast/saturation/filter operations. This keeps the implementation compact and deterministic enough for the task, but a production print pipeline could replace it with a more explicit pixel-processing engine or WASM module.
- Cropperjs is used for crop interaction to avoid spending the task budget on low-level pointer handling.
- Export is PNG-only for predictable browser support and lossless output.
