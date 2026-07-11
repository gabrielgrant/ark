import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'

export interface TagsInputInputBaseProps extends PolymorphicProps<'input'> {}
export interface TagsInputInputProps extends HTMLProps<'input'>, TagsInputInputBaseProps {}

export const TagsInputInput = component$<TagsInputInputProps>((props) => {
  const api = useTagsInputContext()
  const inputProps = api ? mergeProps(api.getInputProps(), props) : props

  return <ark.input {...inputProps} />
})
