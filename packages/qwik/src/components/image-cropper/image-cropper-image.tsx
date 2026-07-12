import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useImageCropperContext } from './use-image-cropper-context.ts'

export interface ImageCropperImageBaseProps extends PolymorphicProps<'img'> {}
export interface ImageCropperImageProps extends Assign<HTMLProps<'img'>, ImageCropperImageBaseProps> {}

export const ImageCropperImage = component$<ImageCropperImageProps>((props) => {
  const api = useImageCropperContext()
  const imageProps = api ? mergeProps(api.getImageProps(), props as Record<string, unknown>) : props

  // biome-ignore lint/correctness/useImageSize: headless component; sizing is the consumer's concern
  return <ark.img {...imageProps} />
})
