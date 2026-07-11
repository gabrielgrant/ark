import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectListBaseProps extends PolymorphicProps<'div'> {}
export interface SelectListProps extends HTMLProps<'div'>, SelectListBaseProps {}

export const SelectList = component$<SelectListProps>((props) => {
  const api = useSelectContext()
  const listProps = api ? mergeProps(api.getListProps(), props) : props

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
