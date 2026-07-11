import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTabsContext } from './use-tabs-context.ts'

export interface TabIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TabIndicatorProps extends HTMLProps<'div'>, TabIndicatorBaseProps {}

export const TabIndicator = component$<TabIndicatorProps>((props) => {
  const api = useTabsContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
