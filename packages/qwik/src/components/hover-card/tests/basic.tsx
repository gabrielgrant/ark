import { component$, useSignal } from '@qwik.dev/core'
import { HoverCard } from '../index.ts'

export const ComponentUnderTest = (props: HoverCard.RootProps) => (
  <HoverCard.Root {...props}>
    <HoverCard.Trigger data-testid="trigger">Hover me</HoverCard.Trigger>
    <HoverCard.Positioner data-testid="positioner">
      <HoverCard.Content data-testid="content">
        <HoverCard.Arrow data-testid="arrow">
          <HoverCard.ArrowTip data-testid="arrow-tip" />
        </HoverCard.Arrow>
        Hover card content
      </HoverCard.Content>
    </HoverCard.Positioner>
  </HoverCard.Root>
)

export const PositionRerenderFixture = component$(() => {
  const tick = useSignal(0)
  const positionerRef = useSignal<Element>()
  return (
    <div>
      <button type="button" data-testid="rerender" onClick$={() => tick.value++}>
        rerender
      </button>
      <span data-testid="ref-tag">{positionerRef.value ? 'positioner' : 'none'}</span>
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger data-testid="trigger">Hover me</HoverCard.Trigger>
        <HoverCard.Positioner data-testid="positioner" ref={positionerRef} style={{ outlineWidth: `${tick.value}px` }}>
          <HoverCard.Content data-testid="content">Hover card content</HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>
    </div>
  )
})
