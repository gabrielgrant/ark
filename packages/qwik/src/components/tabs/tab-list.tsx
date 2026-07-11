import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTabsContext } from './use-tabs-context.ts'

export interface TabListBaseProps extends PolymorphicProps<'div'> {}
export interface TabListProps extends HTMLProps<'div'>, TabListBaseProps {}

export const TabList = component$<TabListProps>((props) => {
  const api = useTabsContext()
  const listProps = api ? mergeProps(api.getListProps(), props) : props

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
