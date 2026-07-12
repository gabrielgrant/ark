import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useImageCropperContext } from './use-image-cropper-context.ts'

export interface ImageCropperViewportBaseProps extends PolymorphicProps<'div'> {}
export interface ImageCropperViewportProps extends Assign<HTMLProps<'div'>, ImageCropperViewportBaseProps> {}

export const ImageCropperViewport = component$<ImageCropperViewportProps>((props) => {
  const api = useImageCropperContext()
  const viewportProps = api ? mergeProps(api.getViewportProps(), props) : props

  return (
    <ark.div {...viewportProps}>
      <Slot />
    </ark.div>
  )
})
