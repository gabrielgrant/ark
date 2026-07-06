import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { FieldProvider } from './use-field-context.ts'
import { type UseFieldProps, useField } from './use-field.ts'

const fieldPropKeys = ['id', 'ids', 'disabled', 'invalid', 'readOnly', 'required', 'target'] as const
const fieldKeySet = new Set<string>(fieldPropKeys)

export interface FieldRootBaseProps extends UseFieldProps, PolymorphicProps<'div'> {}
export interface FieldRootProps extends HTMLProps<'div'>, FieldRootBaseProps {}

export const FieldRoot = component$<FieldRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useField(() => {
    const fieldProps: Record<string, unknown> = {}
    for (const key of fieldPropKeys) {
      if (key in record) fieldProps[key] = record[key]
    }
    return fieldProps as UseFieldProps
  })

  const store = useApiStore(api)
  FieldProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!fieldKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)
  const rootRef = api.refs.rootRef

  return (
    <ark.div {...rootProps} ref={rootRef}>
      <Slot />
    </ark.div>
  )
})
