import type { EditChangeDetails, ValueChangeDetails } from '@zag-js/editable'
import { mergeProps } from '@zag-js/qwik'
import { type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { EditableProvider } from './use-editable-context.ts'
import { type UseEditableProps, useEditable } from './use-editable.ts'

const machinePropKeys = [
  'activationMode',
  'autoResize',
  'defaultEdit',
  'defaultValue',
  'disabled',
  'edit',
  'finalFocusEl',
  'form',
  'id',
  'ids',
  'invalid',
  'maxLength',
  'name',
  'onEditChange',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'onValueChange',
  'onValueCommit',
  'onValueRevert',
  'placeholder',
  'readOnly',
  'required',
  'selectOnFocus',
  'submitMode',
  'translations',
  'value',
] as const

const ownKeySet = new Set<string>([
  ...machinePropKeys,
  'onEditChange$',
  'onValueChange$',
  'onValueCommit$',
  'onValueRevert$',
])

export interface EditableRootBaseProps extends UseEditableProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onEditChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered, so
   * `onEditChange` only works for client-only usage.
   */
  onEditChange$?: QRL<(details: EditChangeDetails) => void>
  /**
   * QRL variant of `onValueChange`. See `onEditChange$`.
   */
  onValueChange$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueCommit`. See `onEditChange$`.
   */
  onValueCommit$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * QRL variant of `onValueRevert`. See `onEditChange$`.
   */
  onValueRevert$?: QRL<(details: ValueChangeDetails) => void>
  /**
   * `onFocusOutside`/`onInteractOutside`/`onPointerDownOutside` stay plain-
   * function-only (R12): the machine consumes `event.preventDefault()`
   * synchronously, which a QRL cannot provide (async invocation).
   */
}
export interface EditableRootProps extends Assign<HTMLProps<'div'>, EditableRootBaseProps> {}

export const EditableRoot = component$<EditableRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useEditable(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainEdit = record.onEditChange as ((details: EditChangeDetails) => void) | undefined
    const qrlEdit = record.onEditChange$ as QRL<(details: EditChangeDetails) => void> | undefined
    if (plainEdit || qrlEdit) {
      machineProps.onEditChange = (details: EditChangeDetails) => {
        plainEdit?.(details)
        void qrlEdit?.(details)
      }
    }

    const plainChange = record.onValueChange as ((details: ValueChangeDetails) => void) | undefined
    const qrlChange = record.onValueChange$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainChange || qrlChange) {
      machineProps.onValueChange = (details: ValueChangeDetails) => {
        plainChange?.(details)
        void qrlChange?.(details)
      }
    }

    const plainCommit = record.onValueCommit as ((details: ValueChangeDetails) => void) | undefined
    const qrlCommit = record.onValueCommit$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainCommit || qrlCommit) {
      machineProps.onValueCommit = (details: ValueChangeDetails) => {
        plainCommit?.(details)
        void qrlCommit?.(details)
      }
    }

    const plainRevert = record.onValueRevert as ((details: ValueChangeDetails) => void) | undefined
    const qrlRevert = record.onValueRevert$ as QRL<(details: ValueChangeDetails) => void> | undefined
    if (plainRevert || qrlRevert) {
      machineProps.onValueRevert = (details: ValueChangeDetails) => {
        plainRevert?.(details)
        void qrlRevert?.(details)
      }
    }

    return machineProps as UseEditableProps
  })

  const store = useApiStore(api)
  EditableProvider(store)

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
