import { Listbox, createListCollection } from '../index.ts'

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

export const ComponentUnderTest = (props: Omit<Listbox.RootProps<Framework>, 'collection'>) => (
  <Listbox.Root collection={collection} {...props}>
    <Listbox.Label>Framework</Listbox.Label>
    <Listbox.Content data-testid="content">
      {collection.items.map((item) => (
        <Listbox.Item key={item.value} item={item} data-testid={`item-${item.value}`}>
          <Listbox.ItemText>{item.label}</Listbox.ItemText>
          <Listbox.ItemIndicator data-testid={`indicator-${item.value}`}>✓</Listbox.ItemIndicator>
        </Listbox.Item>
      ))}
    </Listbox.Content>
    <Listbox.ValueText data-testid="value-text" placeholder="Select a framework" />
  </Listbox.Root>
)
