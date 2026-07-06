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
    const context = useContext(contextId, defaultValue as T)
    if (context === undefined && strict) {
      const error = new Error(errorMessage ?? getErrorMessage(hookName, providerName))
      error.name = 'ContextError'
      throw error
    }
    return context
  }

  return [provider, consumer, contextId] as CreateContextReturn<T>
}
