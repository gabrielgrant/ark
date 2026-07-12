import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useSignal, useVisibleTask$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMarqueeContext } from './use-marquee-context.ts'

export interface MarqueeContentBaseProps extends PolymorphicProps<'div'> {}
export interface MarqueeContentProps extends Assign<HTMLProps<'div'>, MarqueeContentBaseProps> {}

/**
 * The machine renders `contentCount` copies of the same content (index 0 is
 * the real, accessible copy; index 1+ are `aria-hidden`/`role="presentation"`
 * visual duplicates that make the CSS scroll loop seamless -- see the doc
 * comment on `MarqueeApi.contentCount` in `@zag-js/marquee`).
 *
 * Qwik has no mechanism to project the same `<Slot/>` content into more than
 * one location: only the first `<Slot/>` encountered in a component's render
 * receives the projected children -- every subsequent occurrence renders
 * empty (verified empirically; not documented behavior). So only the index-0
 * wrapper claims the real `<Slot/>`; the clone wrappers are populated by
 * mirroring the rendered (real) DOM subtree client-side via a
 * `MutationObserver`, matching the machine's own accessibility contract
 * (clones are presentational only, so DOM-cloning them instead of re-running
 * user render logic is not an accessibility regression). This does not
 * re-sync if `contentCount` grows later (e.g. a resize crossing a duplication
 * threshold adds a new clone wrapper) -- a known gap of the single-projection
 * limitation above, not of the mirroring approach itself.
 */
export const MarqueeContent = component$<MarqueeContentProps>((props) => {
  const api = useMarqueeContext()
  const contentCount = api?.contentCount ?? 1
  const primaryRef = useSignal<HTMLDivElement>()

  // biome-ignore lint/correctness/noQwikUseVisibleTask: mirrors the projected DOM into presentation-only clone wrappers -- there is no non-DOM (server-computable) way to do this, see the doc comment above
  useVisibleTask$(({ cleanup }) => {
    const primary = primaryRef.value
    if (!primary) return

    const sync = () => {
      const parent = primary.parentElement
      if (!parent) return
      for (const clone of parent.querySelectorAll(':scope > [data-clone]')) {
        clone.innerHTML = primary.innerHTML
      }
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(primary, { childList: true, subtree: true, characterData: true, attributes: true })
    cleanup(() => observer.disconnect())
  })

  return (
    <>
      {Array.from({ length: contentCount }, (_, index) => {
        const contentProps = api ? mergeProps(api.getContentProps({ index }), props) : props
        if (index === 0) {
          return (
            <ark.div key={index} {...contentProps} ref={primaryRef}>
              <Slot />
            </ark.div>
          )
        }
        return <ark.div key={index} {...contentProps} />
      })}
    </>
  )
})
