import { Select, createListCollection } from '../index.ts'

interface Framework {
  label: string
  value: string
}

const collection = createListCollection<Framework>({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ],
})

export const ComponentUnderTest = (props: Omit<Select.RootProps<Framework>, 'collection'>) => (
  <Select.Root collection={collection} {...props}>
    <Select.Label>Framework</Select.Label>
    <Select.Control data-testid="control">
      <Select.Trigger data-testid="trigger">
        <Select.ValueText data-testid="value-text" placeholder="Select a framework" />
      </Select.Trigger>
      <Select.Indicator data-testid="indicator">v</Select.Indicator>
      <Select.ClearTrigger data-testid="clear-trigger">x</Select.ClearTrigger>
    </Select.Control>
    <Select.Positioner data-testid="positioner">
      <Select.Content data-testid="content">
        {collection.items.map((item) => (
          <Select.Item key={item.value} item={item} data-testid={`item-${item.value}`}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator data-testid={`indicator-${item.value}`}>✓</Select.ItemIndicator>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Positioner>
    <Select.HiddenSelect data-testid="hidden-select" />
  </Select.Root>
)
