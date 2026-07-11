import { mergeProps } from '@zag-js/qwik'
import type { HighlightChangeDetails, InputValueChangeDetails, ValidityChangeDetails, ValueChangeDetails } from '@zag-js/tags-input'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { TagsInputProvider } from './use-tags-input-context.ts'
import { type UseTagsInputProps, useTagsInput } from './use-tags-input.ts'

const machinePropKeys = [
  'addOnPaste',
  'allowDuplicates',
  'allowOverflow',
  'autoFocus',
  'blurBehavior',
  'defaultInputValue',
  'defaultValue',
  'delimiter',
  'disabled',
  'editable',
  'form',
  'id',
  'ids',
  'inputValue',
  'invalid',
  'max',
  'maxLength',
  'name',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'placeholder',
  'readOnly',
  'required',
  'sanitizeValue',
  'translations',
  'validate',
  'value',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onHighlightChange$',
  'onInputValueChange$',
  'onValueChange$',
  'onValueInvalid$',
])

export interface TagsInputRootBaseProps extends UseTagsInputProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onHighlightChange`. Prefer this in Qwik apps: plain
   * function props cannot be serialized when the component is server-rendered.
   */
  onHighlightChange$?: QRL<(details: HighlightChangeDetails) => void>
  /** QRL variant of `onInputValueChange`. */
  onInputValueChange$?: QRL<(details: InputValueChangeDetails) => void>
  /** QRL variant of `onValueChange`. */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /** QRL variant of `onValueInvalid`. */
  onValueInvalid$?: QRL<(details: ValidityChangeDetails) => void>
}
export interface TagsInputRootProps extends Assign<HTMLProps<'div'>, TagsInputRootBaseProps> {}

export const TagsInputRoot = component$<TagsInputRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useTagsInput(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainHighlight = record.onHighlightChange as ((details: HighlightChangeDetails) => void) | undefined
    const qrlHighlight = record.onHighlightChange$ as QRL<(details: HighlightChangeDetails) => void> | undefined
    if (plainHighlight || qrlHighlight) {
      machineProps.onHighlightChange = (details: HighlightChangeDetails) => {
        plainHighlight?.(details)
        void qrlHighlight?.(details)
      }
    }

    const plainInputValue = record.onInputValueChange as ((details: InputValueChangeDetails) => void) | undefined
    const qrlInputValue = record.onInputValueChange$ as QRL<(details: InputValueChangeDetails) => void> | undefined
    if (plainInputValue || qrlInputValue) {
      machineProps.onInputValueChange = (details: InputValueChangeDetails) => {
        plainInputValue?.(details)
        void qrlInputValue?.(details)
      }
    }

    const plainValue = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlValue = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainValue || qrlValue) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainValue?.(details)
        void qrlValue?.(details)
      }
    }

    const plainInvalid = record.onValueInvalid as ((details: ValidityChangeDetails) => void) | undefined
    const qrlInvalid = record.onValueInvalid$ as QRL<(details: ValidityChangeDetails) => void> | undefined
    if (plainInvalid || qrlInvalid) {
      machineProps.onValueInvalid = (details: ValidityChangeDetails) => {
        plainInvalid?.(details)
        void qrlInvalid?.(details)
      }
    }

    return machineProps as UseTagsInputProps
  })

  const store = useApiStore(api)
  TagsInputProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
