import { Menu } from '../index.ts'

export const NestedMenu = (props: Menu.RootProps) => (
  <Menu.Root {...props}>
    <Menu.Trigger data-testid="trigger">
      File
      <Menu.Indicator data-testid="indicator">v</Menu.Indicator>
    </Menu.Trigger>
    <Menu.Positioner data-testid="positioner">
      <Menu.Content data-testid="content">
        <Menu.Item value="new" data-testid="item-new">
          <Menu.ItemText>New File</Menu.ItemText>
        </Menu.Item>
        <Menu.Root>
          <Menu.TriggerItem data-testid="item-share">
            <Menu.ItemText>Share</Menu.ItemText>
          </Menu.TriggerItem>
          <Menu.Positioner data-testid="sub-positioner">
            <Menu.Content data-testid="sub-content">
              <Menu.Item value="email" data-testid="item-email">
                <Menu.ItemText>Email</Menu.ItemText>
              </Menu.Item>
              <Menu.Item value="link" data-testid="item-link">
                <Menu.ItemText>Copy Link</Menu.ItemText>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
)
