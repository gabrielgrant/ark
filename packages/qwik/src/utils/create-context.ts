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
const NOT_FOUND_KEY = '__ark_context_not_found__'
const NOT_FOUND = { [NOT_FOUND_KEY]: true }

// Detect by marker property, NOT identity: Qwik serializes the useContext
// default into the sequential scope, so after SSR -> resume the sentinel is a
// deserialized copy with a different object identity.
const isNotFound = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && NOT_FOUND_KEY in value

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
    if (isNotFound(context)) {
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
