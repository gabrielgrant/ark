import { ToggleGroup } from '../index.ts'

const frameworks = ['React', 'Solid', 'Vue']

export const ComponentUnderTest = (props: ToggleGroup.RootProps) => (
  <ToggleGroup.Root data-testid="root" {...props}>
    {frameworks.map((framework) => (
      <ToggleGroup.Item key={framework} value={framework} data-testid={`item-${framework}`}>
        {framework}
      </ToggleGroup.Item>
    ))}
  </ToggleGroup.Root>
)
