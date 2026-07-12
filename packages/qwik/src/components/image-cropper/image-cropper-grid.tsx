import type { GridProps } from '@zag-js/image-cropper'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useImageCropperContext } from './use-image-cropper-context.ts'

const gridPropKeys = ['axis'] as const

const ownKeySet = new Set<string>(gridPropKeys)

export interface ImageCropperGridBaseProps extends GridProps, PolymorphicProps<'div'> {}
export interface ImageCropperGridProps extends Assign<HTMLProps<'div'>, ImageCropperGridBaseProps> {}

export const ImageCropperGrid = component$<ImageCropperGridProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const gridProps = {} as GridProps
  for (const key of gridPropKeys) {
    if (key in record) (gridProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useImageCropperContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const gridDivProps = api ? mergeProps(api.getGridProps(gridProps), rest) : rest

  return (
    <ark.div {...gridDivProps}>
      <Slot />
    </ark.div>
  )
})
