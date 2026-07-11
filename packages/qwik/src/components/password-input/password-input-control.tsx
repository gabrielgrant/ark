import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePasswordInputContext } from './use-password-input-context.ts'

export interface PasswordInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface PasswordInputControlProps extends HTMLProps<'div'>, PasswordInputControlBaseProps {}

export const PasswordInputControl = component$<PasswordInputControlProps>((props) => {
  const api = usePasswordInputContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
