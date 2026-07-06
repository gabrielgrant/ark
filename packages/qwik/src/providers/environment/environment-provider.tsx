import { getDocument, getWindow } from '@zag-js/dom-query'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { EnvironmentContextProvider, type RootNode } from './use-environment-context.ts'

export interface EnvironmentProviderProps {
  children?: JSXOutput
  value?: RootNode
}

/**
 * NOTE (spike): a custom `value` is shared as a non-serializable closure, so it
 * does not survive SSR -> resume across child `component$` boundaries. The
 * default (document-based) environment works without a provider. Full support
 * needs the same store-based treatment as the machine api (PLAN.md §2).
 */
export const EnvironmentProvider = component$<EnvironmentProviderProps>((props) => {
  const getRootNode = () => props.value ?? globalThis.document

  EnvironmentContextProvider({
    getRootNode,
    getDocument: () => getDocument(getRootNode()),
    getWindow: () => getWindow(getRootNode()),
  })

  return <Slot />
})
