import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ScrollAreaProvider } from './use-scroll-area-context.ts'
import { type UseScrollAreaProps, useScrollArea } from './use-scroll-area.ts'

const machinePropKeys = ['id', 'ids'] as const

const ownKeySet = new Set<string>(machinePropKeys)

export interface ScrollAreaRootBaseProps extends UseScrollAreaProps, PolymorphicProps<'div'> {}
export interface ScrollAreaRootProps extends Assign<HTMLProps<'div'>, ScrollAreaRootBaseProps> {}

export const ScrollAreaRoot = component$<ScrollAreaRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useScrollArea(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }
    return machineProps as UseScrollAreaProps
  })

  const store = useApiStore(api)
  ScrollAreaProvider(store)

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
