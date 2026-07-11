import { $, component$, useSignal } from '@qwik.dev/core'
import { Combobox, createListCollection } from '../index.ts'

interface Framework {
  label: string
  value: string
  disabled?: boolean
}

const collection = createListCollection<Framework>({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
  ],
})

export const ComponentUnderTest = (props: Omit<Combobox.RootProps<Framework>, 'collection'>) => (
  <Combobox.Root collection={collection} {...props}>
    <Combobox.Label>Framework</Combobox.Label>
    <Combobox.Control data-testid="control">
      <Combobox.Input data-testid="input" />
      <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
      <Combobox.ClearTrigger data-testid="clear-trigger">Clear</Combobox.ClearTrigger>
    </Combobox.Control>
    <Combobox.Positioner data-testid="positioner">
      <Combobox.Content data-testid="content">
        <Combobox.ItemGroup>
          <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
          {collection.items.map((item) => (
            <Combobox.Item key={item.value} item={item} data-testid={`item-${item.value}`}>
              <Combobox.ItemText>{item.label}</Combobox.ItemText>
              <Combobox.ItemIndicator data-testid={`indicator-${item.value}`}>{'✓'}</Combobox.ItemIndicator>
            </Combobox.Item>
          ))}
        </Combobox.ItemGroup>
        <Combobox.List data-testid="list" />
      </Combobox.Content>
    </Combobox.Positioner>
  </Combobox.Root>
)

/**
 * Filtering is a userland pattern (not a machine prop): `onInputValueChange`
 * narrows a signal-stored item list and a fresh `ListCollection` is built
 * from it each render, mirroring the solid `useListCollection` example
 * fixture (packages/solid/src/components/combobox/examples/basic.tsx).
 *
 * This fixture must live in a plain (non `*.test.tsx`) module: a `component$`
 * whose event handler closes over a module-level array constant gets its
 * lazy-loaded QRL segment compiled as an import of the *originating* module.
 * When that module is a vitest test file, the dev server re-executes its
 * top-level `it(...)` calls a second time when the segment loads, which
 * vitest's collector rejects. Verified by bisection: identical code fails
 * when the constant + component live in a `*.browser.test.tsx` file and
 * succeeds once moved here.
 */
interface Fruit {
  label: string
  value: string
}

const allFruits: Fruit[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Mango', value: 'mango' },
]

export const FilterableCombobox = component$(() => {
  const items = useSignal<Fruit[]>(allFruits)
  const collection = createListCollection<Fruit>({ items: items.value })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange$={$((details: Combobox.InputValueChangeDetails) => {
        const query = details.inputValue.toLowerCase()
        items.value = allFruits.filter((item) => item.label.toLowerCase().includes(query))
      })}
    >
      <Combobox.Label>Fruit</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input data-testid="input" />
        <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Positioner data-testid="positioner">
        <Combobox.Content data-testid="content">
          {items.value.map((item) => (
            <Combobox.Item key={item.value} item={item} data-testid={`item-${item.value}`}>
              <Combobox.ItemText>{item.label}</Combobox.ItemText>
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  )
})
