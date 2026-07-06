import { getDocument, getWindow } from '@zag-js/dom-query'
import { createContext } from '../../utils/create-context.ts'

export type RootNode = Document | ShadowRoot | Node

export interface Environment {
  getRootNode: () => RootNode
  getDocument: () => Document
  getWindow: () => Window
}

const getDefaultRootNode = (): RootNode => globalThis.document

export const [EnvironmentContextProvider, useEnvironmentContext] = createContext<Environment>({
  name: 'ark.environment',
  hookName: 'useEnvironmentContext',
  providerName: '<EnvironmentProvider />',
  strict: false,
  defaultValue: {
    getRootNode: getDefaultRootNode,
    getDocument: () => getDocument(getDefaultRootNode()),
    getWindow: () => getWindow(getDefaultRootNode()),
  },
})
