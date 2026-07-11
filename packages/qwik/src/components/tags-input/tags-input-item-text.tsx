import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context.ts'

export interface TagsInputItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface TagsInputItemTextProps extends HTMLProps<'span'>, TagsInputItemTextBaseProps {}

export const TagsInputItemText = component$<TagsInputItemTextProps>((props) => {
  const api = useTagsInputContext()
  const itemProps = useTagsInputItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
