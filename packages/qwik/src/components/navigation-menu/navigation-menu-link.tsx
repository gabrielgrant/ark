import type { LinkProps } from '@zag-js/navigation-menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { useNavigationMenuItemPropsContext } from './use-navigation-menu-item-props-context.ts'

const linkPropKeys = ['current', 'onSelect', 'value', 'closeOnClick'] as const

const ownKeySet = new Set<string>(linkPropKeys)

export interface NavigationMenuLinkBaseProps extends Partial<LinkProps>, PolymorphicProps<'a'> {}
export interface NavigationMenuLinkProps extends Assign<HTMLProps<'a'>, NavigationMenuLinkBaseProps> {}

/**
 * `onSelect`'s `event.defaultPrevented` is read SYNCHRONOUSLY right after the
 * machine dispatches its `link.select` CustomEvent (to decide whether the
 * click should close the menu) -- a QRL invocation is async, so this stays
 * plain-function-only (R12), like tabs' `navigate`.
 */
export const NavigationMenuLink = component$<NavigationMenuLinkProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const itemContext = useNavigationMenuItemPropsContext()

  const linkProps = {} as LinkProps
  for (const key of linkPropKeys) {
    if (key in record) (linkProps as unknown as Record<string, unknown>)[key] = record[key]
  }
  if (linkProps.value === undefined && itemContext?.value !== undefined) {
    linkProps.value = itemContext.value
  }

  const api = useNavigationMenuContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const linkAnchorProps = api ? mergeProps(api.getLinkProps(linkProps), rest) : rest

  return (
    <ark.a {...linkAnchorProps}>
      <Slot />
    </ark.a>
  )
})
