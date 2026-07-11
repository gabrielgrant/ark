import { component$ } from '@qwik.dev/core'
import { CascadeSelect, createTreeCollection } from '../index.ts'
import { useCascadeSelectItemContext } from '../use-cascade-select-item-context.ts'

interface Node {
  label: string
  value: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.value,
  nodeToString: (node) => node.label,
  nodeToChildren: (node) => node.children ?? [],
  rootNode: {
    label: '',
    value: 'ROOT',
    children: [
      {
        label: 'Asia',
        value: 'asia',
        children: [
          { label: 'India', value: 'india' },
          { label: 'Japan', value: 'japan' },
        ],
      },
      {
        label: 'Europe',
        value: 'europe',
        children: [
          { label: 'France', value: 'france' },
          { label: 'Germany', value: 'germany' },
        ],
      },
    ],
  },
})

interface ItemRowProps {
  item: Node
}

const CascadeItemRow = component$<ItemRowProps>((props) => {
  const itemState = useCascadeSelectItemContext()

  return (
    <CascadeSelect.Item data-testid={`item-${props.item.value}`}>
      <CascadeSelect.ItemText data-testid={`item-text-${props.item.value}`}>{props.item.label}</CascadeSelect.ItemText>
      <CascadeSelect.ItemIndicator data-testid={`item-indicator-${props.item.value}`}>{'✓'}</CascadeSelect.ItemIndicator>
      {itemState?.hasChildren ? <span data-testid={`chevron-${props.item.value}`}>{'>'}</span> : null}
    </CascadeSelect.Item>
  )
})

interface LevelProps {
  item: Node
  indexPath: number[]
  value: string[]
}

const CascadeLevelBody = component$<LevelProps>((props) => {
  const itemState = useCascadeSelectItemContext()
  const children = collection.getNodeChildren(props.item)

  return (
    <>
      <CascadeSelect.List
        item={props.item}
        indexPath={props.indexPath}
        value={props.value}
        data-testid={`list-${props.indexPath.length}`}
      >
        {children.map((child, index) => {
          const childIndexPath = [...props.indexPath, index]
          const childValue = [...props.value, collection.getNodeValue(child)]
          return (
            <CascadeSelect.ItemProvider key={child.value} item={child} indexPath={childIndexPath} value={childValue}>
              <CascadeItemRow item={child} />
            </CascadeSelect.ItemProvider>
          )
        })}
      </CascadeSelect.List>
      {itemState?.highlightedChild && collection.isBranchNode(itemState.highlightedChild) ? (
        <CascadeLevel
          item={itemState.highlightedChild}
          indexPath={[...props.indexPath, itemState.highlightedIndex]}
          value={[...props.value, collection.getNodeValue(itemState.highlightedChild)]}
        />
      ) : null}
    </>
  )
})

const CascadeLevel = component$<LevelProps>((props) => (
  <CascadeSelect.ItemProvider item={props.item} indexPath={props.indexPath} value={props.value}>
    <CascadeLevelBody item={props.item} indexPath={props.indexPath} value={props.value} />
  </CascadeSelect.ItemProvider>
))

export const ComponentUnderTest = (props: Omit<CascadeSelect.RootProps<Node>, 'collection'>) => (
  <CascadeSelect.Root collection={collection} {...props}>
    <CascadeSelect.Label data-testid="label">Location</CascadeSelect.Label>
    <CascadeSelect.Control data-testid="control">
      <CascadeSelect.Trigger data-testid="trigger">
        <CascadeSelect.ValueText data-testid="value-text" placeholder="Select a location" />
        <CascadeSelect.Indicator data-testid="indicator">{'v'}</CascadeSelect.Indicator>
      </CascadeSelect.Trigger>
      <CascadeSelect.ClearTrigger data-testid="clear-trigger">{'x'}</CascadeSelect.ClearTrigger>
    </CascadeSelect.Control>
    <CascadeSelect.Positioner data-testid="positioner">
      <CascadeSelect.Content data-testid="content">
        <CascadeLevel item={collection.rootNode} indexPath={[]} value={[]} />
      </CascadeSelect.Content>
    </CascadeSelect.Positioner>
    <CascadeSelect.HiddenInput data-testid="hidden-input" />
  </CascadeSelect.Root>
)
