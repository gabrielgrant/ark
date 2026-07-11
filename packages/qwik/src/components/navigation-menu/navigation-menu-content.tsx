import type { ContentProps } from '@zag-js/navigation-menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import { usePresence } from '../presence/index.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { useNavigationMenuItemPropsContext } from './use-navigation-menu-item-props-context.ts'

export interface NavigationMenuContentBaseProps extends Partial<ContentProps>, PolymorphicProps<'div'> {}
export interface NavigationMenuContentProps extends Assign<HTMLProps<'div'>, NavigationMenuContentBaseProps> {}

/**
 * Solid/React can render this part into a shared `<NavigationMenu.Viewport>`
 * via a JS portal (`isViewportRendered`/`getViewportNode`), sizing the
 * viewport to the active item's content. Qwik avoids JS portals over SSR
 * (R7) -- this port always renders Content INLINE within its `<Item>`
 * (matching the solid/react FALLBACK branch taken whenever no `Viewport` is
 * mounted). `Viewport`/`ViewportPositioner` are still ported for API parity,
 * but Content never portals into them; document as an R7-style limitation.
 */
export const NavigationMenuContent = component$<NavigationMenuContentProps>((props) => {
  const api = useNavigationMenuContext()
  const itemContext = useNavigationMenuItemPropsContext()
  const record = props as unknown as Record<string, unknown>
  const value = (record.value as string | undefined) ?? itemContext?.value

  const renderStrategy = useRenderStrategyContext()
  const presenceApi = usePresence(() => ({
    lazyMount: renderStrategy.lazyMount,
    unmountOnExit: renderStrategy.unmountOnExit,
    present: api?.value === value,
  }))

  if (presenceApi.unmounted) return null

  const contentProps: ContentProps = { value: value as string }

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'value') rest[key] = record[key]
  }

  const mergedProps = api
    ? mergeProps(api.getContentProps(contentProps), presenceApi.presenceProps, rest)
    : mergeProps(presenceApi.presenceProps, rest)
  // extract to a local: a member expression in JSX position is compiled to a
  // read-only WrappedSignal, which applyRef cannot write the element into (Q31)
  const contentRef = presenceApi.ref

  return (
    <ark.div {...mergedProps} ref={contentRef}>
      <Slot />
    </ark.div>
  )
})
