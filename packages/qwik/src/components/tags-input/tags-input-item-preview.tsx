import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context.ts'

export interface TagsInputItemPreviewBaseProps extends PolymorphicProps<'div'> {}
export interface TagsInputItemPreviewProps extends HTMLProps<'div'>, TagsInputItemPreviewBaseProps {}

export const TagsInputItemPreview = component$<TagsInputItemPreviewProps>((props) => {
  const api = useTagsInputContext()
  const itemProps = useTagsInputItemPropsContext()
  const previewProps = api ? mergeProps(api.getItemPreviewProps(itemProps), props) : props

  return (
    <ark.div {...previewProps}>
      <Slot />
    </ark.div>
  )
})
