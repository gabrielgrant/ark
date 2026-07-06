import type { JSXOutput, QwikIntrinsicElements } from '@qwik.dev/core'

type ElementType = keyof QwikIntrinsicElements

type ParentProps<T extends ElementType> = (props: QwikIntrinsicElements[T]) => JSXOutput

/**
 * `asChild` (polymorphic render-as-child) is not yet implemented on the Qwik
 * adapter — Qwik has no `cloneElement`/children-as-function and QRLs cannot be
 * invoked synchronously during render. Tracked in PLAN.md (§7). The `T` param
 * is retained for API parity with the other framework packages.
 */
export interface PolymorphicProps<T extends ElementType = ElementType> {
  asChild?: never & ParentProps<T>
}

export type HTMLProps<E extends ElementType> = QwikIntrinsicElements[E]
export type HTMLArkProps<E extends ElementType> = QwikIntrinsicElements[E] & PolymorphicProps<E>

type ArkComponent<E extends ElementType> = (props: HTMLArkProps<E>) => JSXOutput

type JsxElements = {
  [E in ElementType]: ArkComponent<E>
}

/**
 * Ark elements are Qwik **inline components** (plain functions), not
 * `component$`: the Qwik optimizer only transforms statically-analyzable
 * `component$`/`$` calls, so a runtime `Proxy` of `component$` (as in the
 * React/Solid factories) would never be optimized. Inline components are
 * bundled with their parent, need no transform, and accept `children` directly.
 */
const cache = new Map<string, ArkComponent<ElementType>>()

const createArkComponent = (tag: string): ArkComponent<ElementType> => {
  const ArkComponent: ArkComponent<ElementType> = (props) => {
    const { children, ...rest } = props as Record<string, unknown> & { children?: JSXOutput }
    const Tag = tag as unknown as ArkComponent<ElementType>
    return <Tag {...rest}>{children}</Tag>
  }
  return ArkComponent
}

export const ark = new Proxy({} as JsxElements, {
  get(_, element: string) {
    if (!cache.has(element)) {
      cache.set(element, createArkComponent(element))
    }
    return cache.get(element)
  },
})
