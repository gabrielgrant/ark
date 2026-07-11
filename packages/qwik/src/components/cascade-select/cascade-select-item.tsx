import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'
import { useCascadeSelectItemPropsContext } from './use-cascade-select-item-props-context.ts'

export interface CascadeSelectItemBaseProps extends PolymorphicProps<'div'> {}
export interface CascadeSelectItemProps extends HTMLProps<'div'>, CascadeSelectItemBaseProps {}

export const CascadeSelectItem = component$<CascadeSelectItemProps>((props) => {
  const api = useCascadeSelectContext()
  const itemProps = useCascadeSelectItemPropsContext()
  const itemDivProps = api ? mergeProps(api.getItemProps(itemProps), props) : props

  return (
    <ark.div {...itemDivProps}>
      <Slot />
    </ark.div>
  )
})
