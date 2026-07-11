import type { HoverChangeDetails, ValueChangeDetails } from '@zag-js/rating-group'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { RatingGroupProvider } from './use-rating-group-context.ts'
import { type UseRatingGroupProps, useRatingGroup } from './use-rating-group.ts'

const machinePropKeys = [
  'allowHalf',
  'autoFocus',
  'count',
  'defaultValue',
  'disabled',
  'form',
  'id',
  'ids',
  'name',
  'onHoverChange',
  'onValueChange',
  'readOnly',
  'required',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onValueChange$', 'onHoverChange$'])

export interface RatingGroupRootBaseProps extends UseRatingGroupProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onValueChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onHoverChange`. */
  onHoverChange$?: QRL<(details: HoverChangeDetails) => void>
}
export interface RatingGroupRootProps extends Assign<HTMLProps<'div'>, RatingGroupRootBaseProps> {}

export const RatingGroupRoot = component$<RatingGroupRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useRatingGroup(() => {
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
    const plainHover = record.onHoverChange as ((details: HoverChangeDetails) => void) | undefined
    const qrlHover = record.onHoverChange$ as QRL<(details: HoverChangeDetails) => void> | undefined
    if (plainHover || qrlHover) {
      machineProps.onHoverChange = (details: HoverChangeDetails) => {
        plainHover?.(details)
        void qrlHover?.(details)
      }
    }
    return machineProps as UseRatingGroupProps
  })

  const store = useApiStore(api)
  RatingGroupProvider(store)

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
