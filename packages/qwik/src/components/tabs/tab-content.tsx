import type { ContentProps } from '@zag-js/tabs'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { PresenceProvider, usePresence } from '../presence/index.ts'
import { useTabsContext } from './use-tabs-context.ts'

const ownKeySet = new Set<string>(['value'])

export interface TabContentBaseProps extends ContentProps, PolymorphicProps<'div'> {}
export interface TabContentProps extends HTMLProps<'div'>, TabContentBaseProps {}

export const TabContent = component$<TabContentProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const contentProps = { value: record.value as string }

  const api = useTabsContext()
  const renderStrategy = useRenderStrategyContext()

  const presence = usePresence(() => ({
    lazyMount: renderStrategy.lazyMount,
    unmountOnExit: renderStrategy.unmountOnExit,
    present: api?.value === contentProps.value,
    immediate: true,
  }))

  const presenceStore = useApiStore(presence)
  PresenceProvider(presenceStore)

  if (presence.unmounted) return null

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const contentApiProps = api ? api.getContentProps(contentProps) : {}
  const mergedProps = mergeProps(contentApiProps, presence.presenceProps, rest)
  // extract to a local: a member expression in JSX position is compiled to a
  // read-only WrappedSignal, which applyRef cannot write the element into (Q31)
  const contentRef = presence.ref

  return (
    <ark.div {...mergedProps} ref={contentRef}>
      <Slot />
    </ark.div>
  )
})
