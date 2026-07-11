import type { ResizeTriggerId, ResizeTriggerProps } from '@zag-js/splitter'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSplitterContext } from './use-splitter-context.ts'

const resizeTriggerPropKeys = ['disabled', 'id'] as const

const ownKeySet = new Set<string>(resizeTriggerPropKeys)

export interface SplitterResizeTriggerBaseProps extends ResizeTriggerProps, PolymorphicProps<'button'> {}
export interface SplitterResizeTriggerProps extends Assign<HTMLProps<'button'>, SplitterResizeTriggerBaseProps> {}

export const SplitterResizeTrigger = component$<SplitterResizeTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const resizeTriggerProps = {} as ResizeTriggerProps
  for (const key of resizeTriggerPropKeys) {
    if (key in record) (resizeTriggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }
  resizeTriggerProps.id = record.id as ResizeTriggerId

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const api = useSplitterContext()
  const triggerProps = api ? mergeProps(api.getResizeTriggerProps(resizeTriggerProps), rest) : rest

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
