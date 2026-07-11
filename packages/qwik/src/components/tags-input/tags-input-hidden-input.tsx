import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useTagsInputContext } from './use-tags-input-context.ts'

export interface TagsInputHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface TagsInputHiddenInputProps extends HTMLProps<'input'>, TagsInputHiddenInputBaseProps {}

export const TagsInputHiddenInput = component$<TagsInputHiddenInputProps>((props) => {
  const api = useTagsInputContext()
  const field = useFieldContext()
  const describedBy: Record<string, unknown> = field?.ariaDescribedby
    ? { 'aria-describedby': field.ariaDescribedby }
    : {}
  const hiddenInputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, unknown>)
    : mergeProps(describedBy, props as Record<string, unknown>)

  return <ark.input {...hiddenInputProps} />
})
