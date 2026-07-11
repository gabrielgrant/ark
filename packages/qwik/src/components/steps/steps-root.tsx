import type { StepChangeDetails, StepInvalidDetails } from '@zag-js/steps'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { StepsProvider } from './use-steps-context.ts'
import { type UseStepsProps, useSteps } from './use-steps.ts'

const machinePropKeys = [
  'count',
  'defaultStep',
  'id',
  'ids',
  'isStepSkippable',
  'isStepValid',
  'linear',
  'onStepChange',
  'onStepComplete',
  'onStepInvalid',
  'orientation',
  'step',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onStepChange$', 'onStepComplete$', 'onStepInvalid$'])

export interface StepsRootBaseProps extends UseStepsProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onStepChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onStepChange$?: QRL<(details: StepChangeDetails) => void>
  /**
   * QRL variant of `onStepComplete`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onStepComplete$?: QRL<() => void>
  /**
   * QRL variant of `onStepInvalid`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onStepInvalid$?: QRL<(details: StepInvalidDetails) => void>
  /**
   * `isStepValid`/`isStepSkippable` are consumed synchronously by the machine
   * for their boolean return value, so (per rule R12) they have no QRL
   * variant — QRL invocation is async and cannot supply a synchronous
   * return.
   */
}
export interface StepsRootProps extends Assign<HTMLProps<'div'>, StepsRootBaseProps> {}

export const StepsRoot = component$<StepsRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useSteps(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainChange = record.onStepChange as ((details: StepChangeDetails) => void) | undefined
    const qrlChange = record.onStepChange$ as QRL<(details: StepChangeDetails) => void> | undefined
    if (plainChange || qrlChange) {
      machineProps.onStepChange = (details: StepChangeDetails) => {
        plainChange?.(details)
        void qrlChange?.(details)
      }
    }

    const plainComplete = record.onStepComplete as (() => void) | undefined
    const qrlComplete = record.onStepComplete$ as QRL<() => void> | undefined
    if (plainComplete || qrlComplete) {
      machineProps.onStepComplete = () => {
        plainComplete?.()
        void qrlComplete?.()
      }
    }

    const plainInvalid = record.onStepInvalid as ((details: StepInvalidDetails) => void) | undefined
    const qrlInvalid = record.onStepInvalid$ as QRL<(details: StepInvalidDetails) => void> | undefined
    if (plainInvalid || qrlInvalid) {
      machineProps.onStepInvalid = (details: StepInvalidDetails) => {
        plainInvalid?.(details)
        void qrlInvalid?.(details)
      }
    }

    return machineProps as UseStepsProps
  })

  const store = useApiStore(api)
  StepsProvider(store)

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
