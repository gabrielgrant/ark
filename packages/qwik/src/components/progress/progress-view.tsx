import type { ViewProps } from '@zag-js/progress'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressViewBaseProps extends ViewProps, PolymorphicProps<'span'> {}
export interface ProgressViewProps extends HTMLProps<'span'>, ProgressViewBaseProps {}

export const ProgressView = component$<ProgressViewProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const state = record.state as ViewProps['state']

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'state') rest[key] = record[key]
  }

  const api = useProgressContext()
  const viewProps = api ? mergeProps(api.getViewProps({ state }), rest) : rest

  return (
    <ark.span {...viewProps}>
      <Slot />
    </ark.span>
  )
})
