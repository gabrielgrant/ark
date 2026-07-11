import { Tabs } from '../index.ts'

const frameworks = ['React', 'Solid', 'Vue']

export const ComponentUnderTest = (props: Tabs.RootProps) => (
  <Tabs.Root {...props}>
    <Tabs.List>
      {frameworks.map((framework) => (
        <Tabs.Trigger key={framework} value={framework} data-testid={`trigger-${framework}`}>
          {framework}
        </Tabs.Trigger>
      ))}
      <Tabs.Indicator data-testid="indicator" />
    </Tabs.List>
    {frameworks.map((framework) => (
      <Tabs.Content key={framework} value={framework} data-testid={`content-${framework}`}>
        {`Content for ${framework}`}
      </Tabs.Content>
    ))}
  </Tabs.Root>
)
