import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToastContext } from './use-toast-context.ts'

export interface ToastRootBaseProps extends PolymorphicProps<'div'> {}
export interface ToastRootProps extends HTMLProps<'div'>, ToastRootBaseProps {}

export const ToastRoot = component$<ToastRootProps>((props) => {
  const api = useToastContext()
  const rootProps = api ? mergeProps(api.getRootProps(), props) : props
  const ghostBeforeProps = api ? (api.getGhostBeforeProps() as Record<string, unknown>) : {}
  const ghostAfterProps = api ? (api.getGhostAfterProps() as Record<string, unknown>) : {}

  return (
    <ark.div {...rootProps}>
      <ark.div {...ghostBeforeProps} />
      <Slot />
      <ark.div {...ghostAfterProps} />
    </ark.div>
  )
})
