import type { EdgeProps } from '@zag-js/marquee'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMarqueeContext } from './use-marquee-context.ts'

const edgePropKeys = ['side'] as const

const ownKeySet = new Set<string>(edgePropKeys)

export interface MarqueeEdgeBaseProps extends EdgeProps, PolymorphicProps<'div'> {}
export interface MarqueeEdgeProps extends Assign<HTMLProps<'div'>, MarqueeEdgeBaseProps> {}

export const MarqueeEdge = component$<MarqueeEdgeProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const edgeProps = {} as EdgeProps
  for (const key of edgePropKeys) {
    if (key in record) (edgeProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useMarqueeContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const edgeDivProps = api ? mergeProps(api.getEdgeProps(edgeProps), rest) : rest

  return <ark.div {...edgeDivProps} />
})
