import { type JSXOutput, Slot, component$, useSignal, useVisibleTask$ } from '@qwik.dev/core'

export interface ClientOnlyProps {
  fallback?: JSXOutput
}

/**
 * Renders `fallback` (or nothing) during SSR and the initial client render,
 * then switches to the projected `<Slot/>` content once a `useVisibleTask$`
 * confirms the component is running on the client.
 *
 * Deliberate exception to R11 ("never render `<Slot/>` conditionally"): R11
 * exists because an unclaimed `<Slot/>` leaves a stray `<q:template>` marker
 * that trips Qwik's SSR content-model check (Q12) inside restricted parents
 * (buttons, etc.). `ClientOnly`'s entire purpose is the opposite of that
 * rule's assumption -- it must NOT render the real projected subtree during
 * SSR (that subtree may read browser-only APIs, or exist specifically to
 * avoid a hydration mismatch), so unconditionally claiming the `<Slot/>` and
 * hiding it (the usual R11 fix) would defeat the component. If a consumer
 * hits Q12 by using `<ClientOnly>` as the sole child of a strict
 * content-model parent, wrap the parent's content model requirement with a
 * `fallback` that satisfies it instead.
 */
export const ClientOnly = component$<ClientOnlyProps>((props) => {
  const isClient = useSignal(false)

  // biome-ignore lint/correctness/noQwikUseVisibleTask: the entire point of this component is detecting the client (no SSR-computable equivalent)
  useVisibleTask$(
    () => {
      isClient.value = true
    },
    // `document-ready`: pre-activation the component may render nothing (no
    // DOM element), which the `intersection-observer` default strategy needs
    // as an anchor -- see `FileUploadItemPreviewImage` for the same fix.
    { strategy: 'document-ready' },
  )

  if (!isClient.value) return props.fallback ?? null

  return <Slot />
})
