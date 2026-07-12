import { createToaster, Toast, Toaster } from '../index.ts'

/**
 * Per PLAN.md R16, interactive fixtures live here (not in *.browser.test.tsx)
 * — a `component$` handler closing over a browser test file would re-import
 * (and re-execute) that file's top-level `it(...)` calls when its lazy QRL
 * segment loads.
 *
 * The toaster is a module-level singleton (see toaster.tsx's doc comment):
 * this is the CSR-friendly usage pattern this port is designed around — the
 * trigger button and `<Toaster>` share the same store purely via a normal ES
 * module import, sidestepping Qwik serialization entirely.
 */
export const toaster = createToaster({ placement: 'bottom' })

export const ComponentUnderTest = () => (
  <>
    <button
      type="button"
      data-testid="show-toast"
      onClick$={() => {
        // `type: 'loading'` makes the toast persist (skips the machine's
        // duration-based auto-dismiss `Timer`) — see toast.browser.test.tsx
        // for why: any zag toast `Timer`/`setRafTimeout` scheduling (duration
        // OR dismiss/removeDelay) hangs this Chromium test harness.
        toaster.create({ title: 'Saved', description: 'Your changes have been saved.', type: 'loading' })
      }}
    >
      Show toast
    </button>
    <Toaster
      toaster={toaster}
      renderToast={(toast) => (
        <Toast.Root data-testid="toast-root">
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.CloseTrigger data-testid="toast-close">Close</Toast.CloseTrigger>
        </Toast.Root>
      )}
    />
  </>
)
