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
