import { mergeProps } from '@zag-js/qwik'
import type { CropChangeDetails, FlipChangeDetails, RotationChangeDetails, ZoomChangeDetails } from '@zag-js/image-cropper'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ImageCropperProvider } from './use-image-cropper-context.ts'
import { type UseImageCropperProps, useImageCropper } from './use-image-cropper.ts'

const machinePropKeys = [
  'aspectRatio',
  'cropShape',
  'defaultFlip',
  'defaultRotation',
  'defaultZoom',
  'fixedCropArea',
  'flip',
  'id',
  'ids',
  'initialCrop',
  'maxHeight',
  'maxWidth',
  'maxZoom',
  'minHeight',
  'minWidth',
  'minZoom',
  'nudgeStep',
  'nudgeStepCtrl',
  'nudgeStepShift',
  'rotation',
  'translations',
  'zoom',
  'zoomSensitivity',
  'zoomStep',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onCropChange$',
  'onFlipChange$',
  'onRotationChange$',
  'onZoomChange$',
])

export interface ImageCropperRootBaseProps extends UseImageCropperProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onCropChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onCropChange$?: QRL<(details: CropChangeDetails) => void>
  /** QRL variant of `onZoomChange`. */
  onZoomChange$?: QRL<(details: ZoomChangeDetails) => void>
  /** QRL variant of `onRotationChange`. */
  onRotationChange$?: QRL<(details: RotationChangeDetails) => void>
  /** QRL variant of `onFlipChange`. */
  onFlipChange$?: QRL<(details: FlipChangeDetails) => void>
}
export interface ImageCropperRootProps extends Assign<HTMLProps<'div'>, ImageCropperRootBaseProps> {}

export const ImageCropperRoot = component$<ImageCropperRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useImageCropper(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainCrop = record.onCropChange as ((details: CropChangeDetails) => void) | undefined
    const qrlCrop = record.onCropChange$ as QRL<(details: CropChangeDetails) => void> | undefined
    if (plainCrop || qrlCrop) {
      machineProps.onCropChange = (details: CropChangeDetails) => {
        plainCrop?.(details)
        void qrlCrop?.(details)
      }
    }

    const plainZoom = record.onZoomChange as ((details: ZoomChangeDetails) => void) | undefined
    const qrlZoom = record.onZoomChange$ as QRL<(details: ZoomChangeDetails) => void> | undefined
    if (plainZoom || qrlZoom) {
      machineProps.onZoomChange = (details: ZoomChangeDetails) => {
        plainZoom?.(details)
        void qrlZoom?.(details)
      }
    }

    const plainRotation = record.onRotationChange as ((details: RotationChangeDetails) => void) | undefined
    const qrlRotation = record.onRotationChange$ as QRL<(details: RotationChangeDetails) => void> | undefined
    if (plainRotation || qrlRotation) {
      machineProps.onRotationChange = (details: RotationChangeDetails) => {
        plainRotation?.(details)
        void qrlRotation?.(details)
      }
    }

    const plainFlip = record.onFlipChange as ((details: FlipChangeDetails) => void) | undefined
    const qrlFlip = record.onFlipChange$ as QRL<(details: FlipChangeDetails) => void> | undefined
    if (plainFlip || qrlFlip) {
      machineProps.onFlipChange = (details: FlipChangeDetails) => {
        plainFlip?.(details)
        void qrlFlip?.(details)
      }
    }

    return machineProps as UseImageCropperProps
  })

  const store = useApiStore(api)
  ImageCropperProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
