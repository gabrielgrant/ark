import { dataAttr } from '@zag-js/dom-query'
import { type Signal, useId, useSignal, useVisibleTask$ } from '@qwik.dev/core'
import { parts } from './fieldset.anatomy.ts'

export interface UseFieldsetProps {
  /**
   * The id of the fieldset.
   */
  id?: string
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean
  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean
}

export type UseFieldsetReturn = ReturnType<typeof useFieldset>

export const useFieldset = (props: () => UseFieldsetProps) => {
  const hasErrorTextSig = useSignal(false)
  const hasHelperTextSig = useSignal(false)
  const rootRef: Signal<Element | undefined> = useSignal<Element>()

  const autoId = useId()
  const fieldsetProps = props()
  const id = fieldsetProps.id ?? autoId
  const disabled = Boolean(fieldsetProps.disabled)
  const invalid = Boolean(fieldsetProps.invalid)

  const legendId = `fieldset::${id}::legend`
  const errorTextId = `fieldset::${id}::error-text`
  const helperTextId = `fieldset::${id}::helper-text`

  // biome-ignore lint/correctness/noQwikUseVisibleTask: mutation-observer needs the committed DOM (mirrors solid's onMount)
  useVisibleTask$(
    ({ track, cleanup }) => {
      const rootNode = track(() => rootRef.value)
      if (!rootNode) return

      const checkTextElements = () => {
        const docOrShadowRoot = rootNode.getRootNode() as Document | ShadowRoot
        hasErrorTextSig.value = !!docOrShadowRoot.getElementById(errorTextId)
        hasHelperTextSig.value = !!docOrShadowRoot.getElementById(helperTextId)
      }

      checkTextElements()

      const win = rootNode.ownerDocument.defaultView ?? window
      const observer = new win.MutationObserver(checkTextElements)
      observer.observe(rootNode, { childList: true, subtree: true })
      cleanup(() => observer.disconnect())
    },
    { strategy: 'document-ready' },
  )

  const labelIds = () => {
    const ids: string[] = []
    if (hasErrorTextSig.value && invalid) ids.push(errorTextId)
    if (hasHelperTextSig.value) ids.push(helperTextId)
    return ids
  }

  return {
    refs: {
      rootRef,
    },
    ids: {
      legend: legendId,
      errorText: errorTextId,
      helperText: helperTextId,
    },
    disabled,
    invalid,
    getRootProps: (): Record<string, any> => ({
      ...parts.root.attrs,
      disabled,
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
      'aria-labelledby': legendId,
      'aria-describedby': labelIds().join(' ') || undefined,
    }),
    getLegendProps: (): Record<string, any> => ({
      id: legendId,
      ...parts.legend.attrs,
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
    }),
    getHelperTextProps: (): Record<string, any> => ({
      id: helperTextId,
      ...parts.helperText.attrs,
    }),
    getErrorTextProps: (): Record<string, any> => ({
      id: errorTextId,
      ...parts.errorText.attrs,
      'aria-live': 'polite' as const,
    }),
  }
}
