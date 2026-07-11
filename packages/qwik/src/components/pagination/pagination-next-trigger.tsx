import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePaginationContext } from './use-pagination-context.ts'

export interface PaginationNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PaginationNextTriggerProps extends HTMLProps<'button'>, PaginationNextTriggerBaseProps {}

export const PaginationNextTrigger = component$<PaginationNextTriggerProps>((props) => {
  const api = usePaginationContext()
  const nextTriggerProps = api ? mergeProps(api.getNextTriggerProps(), props) : props

  return (
    <ark.button {...nextTriggerProps}>
      <Slot />
    </ark.button>
  )
})
