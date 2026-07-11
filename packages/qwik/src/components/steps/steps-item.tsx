import type { ItemProps } from '@zag-js/steps'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'
import { StepsItemPropsProvider } from './use-steps-item-props-context.ts'

const itemPropKeys = ['index'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface StepsItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface StepsItemProps extends Assign<HTMLProps<'div'>, StepsItemBaseProps> {}

export const StepsItem = component$<StepsItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useStepsContext()
  StepsItemPropsProvider(itemProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const stepsItemProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.div {...stepsItemProps}>
      <Slot />
    </ark.div>
  )
})
