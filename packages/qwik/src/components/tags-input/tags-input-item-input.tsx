import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTagsInputContext } from './use-tags-input-context.ts'
import { useTagsInputItemPropsContext } from './use-tags-input-item-props-context.ts'

export interface TagsInputItemInputBaseProps extends PolymorphicProps<'input'> {}
export interface TagsInputItemInputProps extends HTMLProps<'input'>, TagsInputItemInputBaseProps {}

export const TagsInputItemInput = component$<TagsInputItemInputProps>((props) => {
  const api = useTagsInputContext()
  const itemProps = useTagsInputItemPropsContext()
  const inputProps = api ? mergeProps(api.getItemInputProps(itemProps), props) : props

  return <ark.input {...inputProps} />
})
