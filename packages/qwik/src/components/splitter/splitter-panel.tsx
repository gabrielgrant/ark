import type { PanelId, PanelProps } from '@zag-js/splitter'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSplitterContext } from './use-splitter-context.ts'

const panelPropKeys = ['id'] as const

const ownKeySet = new Set<string>(panelPropKeys)

export interface SplitterPanelBaseProps extends PanelProps, PolymorphicProps<'div'> {}
export interface SplitterPanelProps extends Assign<HTMLProps<'div'>, SplitterPanelBaseProps> {}

export const SplitterPanel = component$<SplitterPanelProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const id = record.id as PanelId

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const api = useSplitterContext()
  const panelProps = api ? mergeProps(api.getPanelProps({ id }), rest) : rest

  return (
    <ark.div {...panelProps}>
      <Slot />
    </ark.div>
  )
})
