import { component$ } from '@qwik.dev/core'
import { TagsInput } from '../index.ts'
import { useTagsInputContext } from '../use-tags-input-context.ts'

/**
 * Solid/React ship a `<TagsInput.Context>` render-prop (or a plain
 * `tagsInput.value.map(...)`) so consumers can iterate the machine-managed
 * `value` array reactively. Qwik omits `Context`/`RootProvider` (R6) --
 * `useTagsInputContext()` is the escape hatch: a small `component$` that
 * reads the store subscribes to it like any other part, so it re-renders
 * whenever `value` changes (add/remove/clear).
 */
const TagsInputItems = component$(() => {
  const api = useTagsInputContext()

  return (
    <>
      {api?.value.map((value, index) => (
        <TagsInput.Item key={value} index={index} value={value} data-testid={`item-${value}`}>
          <TagsInput.ItemPreview data-testid={`preview-${value}`}>
            <TagsInput.ItemText>{value}</TagsInput.ItemText>
            <TagsInput.ItemDeleteTrigger data-testid={`delete-${value}`}>Delete</TagsInput.ItemDeleteTrigger>
          </TagsInput.ItemPreview>
          <TagsInput.ItemInput />
        </TagsInput.Item>
      ))}
    </>
  )
})

export const ComponentUnderTest = (props: TagsInput.RootProps) => (
  <TagsInput.Root defaultValue={['react', 'solid', 'vue']} {...props}>
    <TagsInput.Label>Frameworks</TagsInput.Label>
    <TagsInput.Control data-testid="control">
      <TagsInputItems />
      <TagsInput.Input data-testid="input" placeholder="Add tag" />
    </TagsInput.Control>
    <TagsInput.ClearTrigger data-testid="clear-trigger">Clear all</TagsInput.ClearTrigger>
    <TagsInput.HiddenInput data-testid="hidden-input" />
  </TagsInput.Root>
)
