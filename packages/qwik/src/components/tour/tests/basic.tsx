import { component$ } from '@qwik.dev/core'
import { Tour, useTourContext } from '../index.ts'

const steps: Tour.StepDetails[] = [
  {
    id: 'step-1',
    type: 'dialog',
    title: 'Welcome',
    description: 'This is the first step of the tour.',
  },
  {
    id: 'step-2',
    type: 'dialog',
    title: 'Second step',
    description: 'This is the second step of the tour.',
  },
]

/**
 * Per PLAN.md R16, interactive fixtures live here (not in *.browser.test.tsx).
 * There is no `Tour.Trigger` part (starting a tour is always an app-level
 * concern) — `TourStarter` shows the supported idiom: a `component$` reads
 * `useTourContext()` at render top-level and references it inside `onClick$`.
 * Verified empirically that capturing a `useXContext()` value inside an
 * `onClick$` handler defined in the SAME component works fine (both
 * typechecks and runs correctly in a real browser).
 */
const TourStarter = component$(() => {
  const api = useTourContext()
  return (
    <button type="button" data-testid="start-tour" onClick$={() => api?.start()}>
      Start tour
    </button>
  )
})

export const ComponentUnderTest = () => (
  <Tour.Root steps={steps}>
    <TourStarter />
    <Tour.Positioner>
      <Tour.Content data-testid="content">
        <Tour.Title data-testid="title" />
        <Tour.Description data-testid="description" />
        <Tour.ProgressText data-testid="progress" />
        <Tour.ActionTrigger data-testid="next" action={{ label: 'Next', action: 'next' }} />
        <Tour.ActionTrigger data-testid="prev" action={{ label: 'Prev', action: 'prev' }} />
        <Tour.CloseTrigger data-testid="close">Close</Tour.CloseTrigger>
      </Tour.Content>
    </Tour.Positioner>
    <Tour.Backdrop data-testid="backdrop" />
  </Tour.Root>
)
