import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'
import { useCascadeSelectItemPropsContext } from './use-cascade-select-item-props-context.ts'

export interface CascadeSelectItemIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface CascadeSelectItemIndicatorProps extends HTMLProps<'span'>, CascadeSelectItemIndicatorBaseProps {}

/**
 * Rendered as `<span>`: typically nested inline next to
 * `<CascadeSelect.ItemText>` content (matches tree-view's `ItemIndicator`).
 */
export const CascadeSelectItemIndicator = component$<CascadeSelectItemIndicatorProps>((props) => {
  const api = useCascadeSelectContext()
  const itemProps = useCascadeSelectItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
