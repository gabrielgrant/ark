import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePaginationContext } from './use-pagination-context.ts'

export interface PaginationPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PaginationPrevTriggerProps extends HTMLProps<'button'>, PaginationPrevTriggerBaseProps {}

export const PaginationPrevTrigger = component$<PaginationPrevTriggerProps>((props) => {
  const api = usePaginationContext()
  const prevTriggerProps = api ? mergeProps(api.getPrevTriggerProps(), props) : props

  return (
    <ark.button {...prevTriggerProps}>
      <Slot />
    </ark.button>
  )
})
