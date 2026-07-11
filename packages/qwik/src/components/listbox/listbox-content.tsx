import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'

export interface ListboxContentBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxContentProps extends HTMLProps<'div'>, ListboxContentBaseProps {}

export const ListboxContent = component$<ListboxContentProps>((props) => {
  const api = useListboxContext()
  const contentProps = api ? mergeProps(api.getContentProps(), props) : props

  return (
    <ark.div {...contentProps}>
      <Slot />
    </ark.div>
  )
})
