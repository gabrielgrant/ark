import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSwitchContext } from './use-switch-context.ts'

export interface SwitchThumbBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchThumbProps extends HTMLProps<'span'>, SwitchThumbBaseProps {}

export const SwitchThumb = component$<SwitchThumbProps>((props) => {
  const api = useSwitchContext()
  const thumbProps = api ? mergeProps(api.getThumbProps(), props) : props

  return (
    <ark.span {...thumbProps}>
      <Slot />
    </ark.span>
  )
})
