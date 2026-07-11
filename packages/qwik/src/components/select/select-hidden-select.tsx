import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { useFieldContext } from '../field/use-field-context.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectHiddenSelectBaseProps extends PolymorphicProps<'select'> {}
export interface SelectHiddenSelectProps extends HTMLProps<'select'>, SelectHiddenSelectBaseProps {}

export const SelectHiddenSelect = component$<SelectHiddenSelectProps>((props) => {
  const api = useSelectContext()
  const field = useFieldContext()
  const hiddenSelectProps = api
    ? mergeProps(
        api.getHiddenSelectProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & SelectHiddenSelectProps,
      )
    : props
  const isValueEmpty = (api?.value.length ?? 0) === 0

  return (
    <ark.select aria-describedby={field?.ariaDescribedby} {...hiddenSelectProps}>
      {isValueEmpty ? <ark.option value="" /> : null}
      {api?.collection.items.map((item) => (
        <ark.option
          key={api.collection.getItemValue(item) ?? ''}
          value={api.collection.getItemValue(item) ?? ''}
          disabled={api.collection.getItemDisabled(item)}
        >
          {api.collection.stringifyItem(item) ?? ''}
        </ark.option>
      ))}
    </ark.select>
  )
})
