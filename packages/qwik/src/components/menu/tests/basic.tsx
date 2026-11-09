import { component$, useSignal } from '@qwik.dev/core'
import { Menu } from '../index.ts'

export const ComponentUnderTest = (props: Menu.RootProps) => (
  <Menu.Root {...props}>
    <Menu.Trigger data-testid="trigger">
      Actions
      <Menu.Indicator data-testid="indicator">v</Menu.Indicator>
    </Menu.Trigger>
    <Menu.Positioner data-testid="positioner">
      <Menu.Content data-testid="content">
        <Menu.Item value="new" data-testid="item-new">
          <Menu.ItemText>New File</Menu.ItemText>
        </Menu.Item>
        <Menu.Item value="copy" data-testid="item-copy">
          <Menu.ItemText>Copy</Menu.ItemText>
        </Menu.Item>
        <Menu.Separator data-testid="separator" />
        <Menu.Item value="delete" disabled data-testid="item-delete">
          <Menu.ItemText>Delete</Menu.ItemText>
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
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
      <Menu.Root defaultOpen>
        <Menu.Trigger data-testid="trigger">Actions</Menu.Trigger>
        <Menu.Positioner data-testid="positioner" ref={positionerRef} style={{ outlineWidth: `${tick.value}px` }}>
          <Menu.Content data-testid="content">
            <Menu.Item value="new" data-testid="item-new">
              <Menu.ItemText>New File</Menu.ItemText>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  )
})
