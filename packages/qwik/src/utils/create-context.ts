import { type ContextId, createContextId, useContext, useContextProvider } from '@qwik.dev/core'

export interface CreateContextOptions<T> {
  name?: string
  strict?: boolean
  hookName?: string
  providerName?: string
  errorMessage?: string
  defaultValue?: T
}

export type CreateContextReturn<T> = [(value: T) => void, () => T, ContextId<T>]

function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`
}

// Serializable sentinel: lets `useContext` return a "not provided" marker
// instead of throwing (Q8) or serializing a non-serializable default (Q3).
const NOT_FOUND = { __arkContextNotFound: true }

let count = 0

export function createContext<T>(options: CreateContextOptions<T> = {}) {
  const {
    name = `ark.context.${count++}`,
    strict = true,
    hookName = 'useContext',
    providerName = 'Provider',
    errorMessage,
    defaultValue,
  } = options

  const contextId = createContextId<T>(name)

  const provider = (value: T) => useContextProvider(contextId, value)

  const consumer = (): T => {
    // NOTE: pass a serializable sentinel as the default — handing Qwik's
    // `useContext` a non-serializable default (e.g. the environment's
    // `getRootNode` function) throws Q3, and passing `undefined`/no default
    // throws Q8 when no provider exists. Resolve the real fallback in JS.
    const context = useContext(contextId, NOT_FOUND as T)
    if ((context as unknown) === NOT_FOUND) {
      if (strict) {
        const error = new Error(errorMessage ?? getErrorMessage(hookName, providerName))
        error.name = 'ContextError'
        throw error
      }
      return defaultValue as T
    }
    return context
  }

  return [provider, consumer, contextId] as CreateContextReturn<T>
}
