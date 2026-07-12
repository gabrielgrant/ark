import type { HandleProps } from '@zag-js/image-cropper'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useImageCropperContext } from './use-image-cropper-context.ts'

const handlePropKeys = ['position'] as const

const ownKeySet = new Set<string>(handlePropKeys)

export interface ImageCropperHandleBaseProps extends HandleProps, PolymorphicProps<'div'> {}
export interface ImageCropperHandleProps extends Assign<HTMLProps<'div'>, ImageCropperHandleBaseProps> {}

export const ImageCropperHandle = component$<ImageCropperHandleProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const handleProps = {} as HandleProps
  for (const key of handlePropKeys) {
    if (key in record) (handleProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useImageCropperContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const handleDivProps = api ? mergeProps(api.getHandleProps(handleProps), rest) : rest

  return (
    <ark.div {...handleDivProps}>
      <Slot />
    </ark.div>
  )
})
