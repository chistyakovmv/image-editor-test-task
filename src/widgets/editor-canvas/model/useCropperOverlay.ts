import Cropper from 'cropperjs';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { areCropRectsEqual, type CropRect, type SourceImage } from '@/entities/image-edit';

type RefLike<T> = {
  value: T;
};

type CropSessionLike = {
  isCropMode: RefLike<boolean>;
  draftCrop: RefLike<CropRect | null>;
  updateDraftCrop: (crop: CropRect) => void;
};

type CropperLike = {
  destroy: () => void;
  getData: (rounded?: boolean) => Cropper.Data;
  setData: (data: CropRect) => void;
};

type CropperFactory = (
  image: HTMLImageElement,
  options: Cropper.Options<HTMLImageElement>,
) => CropperLike;

export type UseCropperOverlayParams = {
  source: RefLike<SourceImage | null>;
  session: CropSessionLike;
  cropperFactory?: CropperFactory;
};

const createDefaultCropper: CropperFactory = (image, options) => new Cropper(image, options);

const toCropRect = (data: Cropper.Data): CropRect => ({
  x: data.x,
  y: data.y,
  width: data.width,
  height: data.height,
});

export const useCropperOverlay = ({
  source,
  session,
  cropperFactory = createDefaultCropper,
}: UseCropperOverlayParams) => {
  const imageElement = ref<HTMLImageElement | null>(null);
  let cropper: CropperLike | null = null;
  let isSyncingFromState = false;

  const syncCropperFromDraft = () => {
    if (!cropper || !session.draftCrop.value) {
      return;
    }

    const current = toCropRect(cropper.getData(true));

    if (areCropRectsEqual(current, session.draftCrop.value)) {
      return;
    }

    isSyncingFromState = true;
    cropper.setData(session.draftCrop.value);
    queueMicrotask(() => {
      isSyncingFromState = false;
    });
  };

  const destroyCropper = () => {
    cropper?.destroy();
    cropper = null;
    isSyncingFromState = false;
  };

  const createCropper = async () => {
    destroyCropper();
    await nextTick();

    if (!imageElement.value || !source.value || !session.isCropMode.value) {
      return;
    }

    cropper = cropperFactory(imageElement.value, {
      viewMode: 1,
      autoCropArea: 1,
      background: false,
      responsive: true,
      movable: true,
      zoomable: true,
      rotatable: false,
      scalable: false,
      crop: () => {
        if (!cropper || isSyncingFromState) {
          return;
        }

        session.updateDraftCrop(toCropRect(cropper.getData(true)));
      },
      ready: syncCropperFromDraft,
    });
  };

  watch(
    () => [source.value?.id, session.isCropMode.value],
    () => {
      void createCropper();
    },
    { immediate: true },
  );

  watch(() => session.draftCrop.value, syncCropperFromDraft);

  onBeforeUnmount(destroyCropper);

  return {
    imageElement,
    destroyCropper,
  };
};
