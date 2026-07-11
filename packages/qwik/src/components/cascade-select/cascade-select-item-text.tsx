import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'
import { useCascadeSelectItemPropsContext } from './use-cascade-select-item-props-context.ts'

export interface CascadeSelectItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface CascadeSelectItemTextProps extends HTMLProps<'span'>, CascadeSelectItemTextBaseProps {}

export const CascadeSelectItemText = component$<CascadeSelectItemTextProps>((props) => {
  const api = useCascadeSelectContext()
  const itemProps = useCascadeSelectItemPropsContext()
  const itemTextProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.span {...itemTextProps}>
      <Slot />
    </ark.span>
  )
})
