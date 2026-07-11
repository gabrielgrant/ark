import type { FocusChangeDetails, ValueChangeDetails } from '@zag-js/accordion'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$, useStore } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type RenderStrategyProps, RenderStrategyProvider } from '../../utils/render-strategy.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { AccordionProvider } from './use-accordion-context.ts'
import { type UseAccordionProps, useAccordion } from './use-accordion.ts'

const machinePropKeys = [
  'collapsible',
  'defaultValue',
  'disabled',
  'id',
  'ids',
  'multiple',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'value',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onValueChange$',
  'onFocusChange$',
  'lazyMount',
  'unmountOnExit',
])

export interface AccordionRootBaseProps extends UseAccordionProps, RenderStrategyProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onFocusChange`. */
  onFocusChange$?: QRL<(details: FocusChangeDetails) => void>
}
export interface AccordionRootProps extends Assign<HTMLProps<'div'>, AccordionRootBaseProps> {}

export const AccordionRoot = component$<AccordionRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useAccordion(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    const plainValue = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }
    const plainFocus = record.onFocusChange as ((details: FocusChangeDetails) => void) | undefined
    const qrlFocus = record.onFocusChange$ as QRL<(details: FocusChangeDetails) => void> | undefined
    if (plainFocus || qrlFocus) {
      machineProps.onFocusChange = (details: FocusChangeDetails) => {
        plainFocus?.(details)
        void qrlFocus?.(details)
      }
    }
    return machineProps as UseAccordionProps
  })

  const store = useApiStore(api)
  AccordionProvider(store)

  const renderStrategy = useStore<RenderStrategyProps>({})
  renderStrategy.lazyMount = record.lazyMount as boolean | undefined
  renderStrategy.unmountOnExit = record.unmountOnExit as boolean | undefined
  RenderStrategyProvider(renderStrategy)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
