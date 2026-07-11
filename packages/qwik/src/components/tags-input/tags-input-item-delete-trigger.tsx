import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context.ts'

export interface TagsInputItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface TagsInputItemDeleteTriggerProps extends HTMLProps<'button'>, TagsInputItemDeleteTriggerBaseProps {}

export const TagsInputItemDeleteTrigger = component$<TagsInputItemDeleteTriggerProps>((props) => {
  const api = useTagsInputContext()
  const itemProps = useTagsInputItemPropsContext()
  const deleteTriggerProps = api ? mergeProps(api.getItemDeleteTriggerProps(itemProps), props) : props

  return (
    <ark.button {...deleteTriggerProps}>
      <Slot />
    </ark.button>
  )
})
