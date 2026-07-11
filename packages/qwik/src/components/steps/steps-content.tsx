import type { ItemProps } from '@zag-js/steps'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

const contentPropKeys = ['index'] as const

const ownKeySet = new Set<string>(contentPropKeys)

export interface StepsContentBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface StepsContentProps extends Assign<HTMLProps<'div'>, StepsContentBaseProps> {}

export const StepsContent = component$<StepsContentProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of contentPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const api = useStepsContext()
  const contentProps = api ? mergeProps(api.getContentProps(itemProps), rest) : rest

  return (
    <ark.div {...contentProps}>
      <Slot />
    </ark.div>
  )
})
