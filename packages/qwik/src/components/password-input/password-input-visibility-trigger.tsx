import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePasswordInputContext } from './use-password-input-context.ts'

export interface PasswordInputVisibilityTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PasswordInputVisibilityTriggerProps
  extends HTMLProps<'button'>, PasswordInputVisibilityTriggerBaseProps {}

export const PasswordInputVisibilityTrigger = component$<PasswordInputVisibilityTriggerProps>((props) => {
  const api = usePasswordInputContext()
  const visibilityTriggerProps = api ? mergeProps(api.getVisibilityTriggerProps(), props) : props

  return (
    <ark.button {...visibilityTriggerProps}>
      <Slot />
    </ark.button>
  )
})
