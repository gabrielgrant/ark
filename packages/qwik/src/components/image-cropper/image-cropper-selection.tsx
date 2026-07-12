import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useImageCropperContext } from './use-image-cropper-context.ts'

export interface ImageCropperSelectionBaseProps extends PolymorphicProps<'div'> {}
export interface ImageCropperSelectionProps extends Assign<HTMLProps<'div'>, ImageCropperSelectionBaseProps> {}

export const ImageCropperSelection = component$<ImageCropperSelectionProps>((props) => {
  const api = useImageCropperContext()
  const selectionProps = api ? mergeProps(api.getSelectionProps(), props) : props

  return (
    <ark.div {...selectionProps}>
      <Slot />
    </ark.div>
  )
})
