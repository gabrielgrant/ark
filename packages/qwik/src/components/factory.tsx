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
 * `ark.<tag>` resolves to the **tag string**, so `<ark.div {...props}>` compiles
 * to `jsx("div", props)` — a host element. This is required for events: Qwik
 * only wires DOM event delegation for spread `on*$` handlers on host elements.
 * Routing them through an inline-component boundary (`<ArkDiv {...handlers}>`,
 * which re-spreads onto an inner element) makes Qwik treat the handlers as
 * component props instead, and trusted clicks never fire (verified in the
 * browser). `asChild` will therefore need a different mechanism (PLAN.md §7).
 */
export const ark = new Proxy({} as JsxElements, {
  get(_, element: string) {
    return element
  },
}) as JsxElements
