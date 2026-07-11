import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'

export interface TagsInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface TagsInputLabelProps extends HTMLProps<'label'>, TagsInputLabelBaseProps {}

export const TagsInputLabel = component$<TagsInputLabelProps>((props) => {
  const api = useTagsInputContext()
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & TagsInputLabelProps,
      )
    : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
