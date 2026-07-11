import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'

export interface TagsInputClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface TagsInputClearTriggerProps extends HTMLProps<'button'>, TagsInputClearTriggerBaseProps {}

export const TagsInputClearTrigger = component$<TagsInputClearTriggerProps>((props) => {
  const api = useTagsInputContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
