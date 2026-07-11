import { NavigationMenu } from '../index.ts'

export const ComponentUnderTest = (props: NavigationMenu.RootProps) => (
  <NavigationMenu.Root {...props}>
    <NavigationMenu.List data-testid="list">
      <NavigationMenu.Item data-testid="item-features" value="features">
        <NavigationMenu.Trigger data-testid="trigger-features">Features</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="content-features">
          <NavigationMenu.Link data-testid="link-overview" href="#overview">
            Overview
          </NavigationMenu.Link>
          <NavigationMenu.Link data-testid="link-features" href="#features">
            Features
          </NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item data-testid="item-docs" value="docs">
        <NavigationMenu.Trigger data-testid="trigger-docs">Documentation</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="content-docs">
          <NavigationMenu.Link data-testid="link-intro" href="#introduction">
            Introduction
          </NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item data-testid="item-about" value="about">
        <NavigationMenu.Link data-testid="link-about" href="#about">
          About
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Indicator data-testid="indicator">
      <NavigationMenu.Arrow data-testid="arrow" />
    </NavigationMenu.Indicator>

    <NavigationMenu.ViewportPositioner data-testid="viewport-positioner">
      <NavigationMenu.Viewport data-testid="viewport" />
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
)
