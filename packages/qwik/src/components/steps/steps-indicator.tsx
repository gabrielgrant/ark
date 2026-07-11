import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'
import { useStepsItemPropsContext } from './use-steps-item-props-context.ts'

export interface StepsIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface StepsIndicatorProps extends HTMLProps<'span'>, StepsIndicatorBaseProps {}

/**
 * Rendered as `<span>`, not `<div>`: this part is typically nested inside
 * `<Steps.Trigger>` (a `<button>`), and Qwik's SSR enforces HTML content
 * models strictly (error Q12) — a `<div>` is not permitted inside button
 * phrasing content. See AccordionItemIndicator for the same fix (R11).
 */
export const StepsIndicator = component$<StepsIndicatorProps>((props) => {
  const api = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(itemProps), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
