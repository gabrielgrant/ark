import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAvatarContext } from './use-avatar-context.ts'

export interface AvatarFallbackBaseProps extends PolymorphicProps<'span'> {}
export interface AvatarFallbackProps extends HTMLProps<'span'>, AvatarFallbackBaseProps {}

export const AvatarFallback = component$<AvatarFallbackProps>((props) => {
  const api = useAvatarContext()
  const fallbackProps = api ? mergeProps(api.getFallbackProps(), props) : props

  return (
    <ark.span {...fallbackProps}>
      <Slot />
    </ark.span>
  )
})
