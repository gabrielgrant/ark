import { type Signal, Slot, component$ } from '@qwik.dev/core'

export interface PortalProps {
  /**
   * No-op on Qwik (kept for cross-framework API parity). Content always
   * renders inline; overlay components escape stacking contexts via native
   * top-layer primitives instead of DOM relocation. See PLAN.md rule R7.
   */
  disabled?: boolean
  /**
   * Not supported on Qwik — there is no JS portal to re-parent into a custom
   * container. See PLAN.md rule R7.
   */
  container?: Signal<HTMLElement | undefined>
}

export const Portal = component$<PortalProps>(() => {
  return <Slot />
})
