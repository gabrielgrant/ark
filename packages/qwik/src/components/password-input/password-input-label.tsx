import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePasswordInputContext } from './use-password-input-context.ts'

export interface PasswordInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface PasswordInputLabelProps extends HTMLProps<'label'>, PasswordInputLabelBaseProps {}

export const PasswordInputLabel = component$<PasswordInputLabelProps>((props) => {
  const api = usePasswordInputContext()
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & PasswordInputLabelProps,
      )
    : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
