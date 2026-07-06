import { createContext } from './create-context.ts'
import { createSplitProps } from './create-split-props.ts'

export interface RenderStrategyProps {
  /**
   * Whether to enable lazy mounting
   * @default false
   */
  lazyMount?: boolean
  /**
   * Whether to unmount on exit.
   * @default false
   */
  unmountOnExit?: boolean
}

export const [RenderStrategyProvider, useRenderStrategyContext] = createContext<RenderStrategyProps>({
  name: 'ark.render-strategy',
  hookName: 'useRenderStrategyContext',
  providerName: '<RenderStrategyProvider />',
  strict: false,
  defaultValue: {},
})

export const splitRenderStrategyProps = <T extends RenderStrategyProps>(props: T) =>
  createSplitProps<RenderStrategyProps>()(props, ['lazyMount', 'unmountOnExit'])
