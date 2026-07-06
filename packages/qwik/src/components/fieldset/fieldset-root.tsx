import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { FieldsetProvider } from './use-fieldset-context.ts'
import { type UseFieldsetProps, useFieldset } from './use-fieldset.ts'

const ownKeys = ['disabled', 'invalid'] as const

export interface FieldsetRootBaseProps extends UseFieldsetProps, PolymorphicProps<'fieldset'> {}
export interface FieldsetRootProps extends HTMLProps<'fieldset'>, FieldsetRootBaseProps {}

export const FieldsetRoot = component$<FieldsetRootProps>((props) => {
  const record = props as Record<string, unknown>

  const api = useFieldset(() => ({
    id: record.id as string | undefined,
    disabled: record.disabled as boolean | undefined,
    invalid: record.invalid as boolean | undefined,
  }))

  const store = useApiStore(api)
  FieldsetProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!(ownKeys as readonly string[]).includes(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)
  const rootRef = api.refs.rootRef

  return (
    <ark.fieldset {...rootProps} ref={rootRef}>
      <Slot />
    </ark.fieldset>
  )
})
