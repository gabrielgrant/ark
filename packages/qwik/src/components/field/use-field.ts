import { ariaAttr, dataAttr } from '@zag-js/dom-query'
import { type Signal, useId, useSignal, useVisibleTask$ } from '@qwik.dev/core'
import { useFieldsetContext } from '../fieldset/use-fieldset-context.ts'
import { parts } from './field.anatomy.ts'

export interface ElementIds {
  root?: string
  control?: string
  label?: string
  errorText?: string
  helperText?: string
}

export interface UseFieldProps {
  /**
   * The id of the field.
   */
  id?: string
  /**
   * The ids of the field parts.
   */
  ids?: ElementIds
  /**
   * Indicates whether the field is required.
   */
  required?: boolean
  /**
   * Indicates whether the field is disabled.
   */
  disabled?: boolean
  /**
   * Indicates whether the field is invalid.
   */
  invalid?: boolean
  /**
   * Indicates whether the field is read-only.
   */
  readOnly?: boolean
  /**
   * The target field item value the label should point to.
   */
  target?: string
}

export type UseFieldReturn = ReturnType<typeof useField>

export const useField = (props: () => UseFieldProps) => {
  const fieldset = useFieldsetContext()

  const hasErrorTextSig = useSignal(false)
  const hasHelperTextSig = useSignal(false)
  const rootRef: Signal<Element | undefined> = useSignal<Element>()

  const autoId = useId()
  const fieldProps = props()
  const id = fieldProps.id ?? autoId
  const disabled = Boolean(fieldProps.disabled ?? fieldset?.disabled)
  const invalid = Boolean(fieldProps.invalid ?? fieldset?.invalid)
  const required = Boolean(fieldProps.required)
  const readOnly = Boolean(fieldProps.readOnly)

  const rootId = fieldProps.ids?.control ?? `field::${id}`
  const errorTextId = fieldProps.ids?.errorText ?? `field::${id}::error-text`
  const helperTextId = fieldProps.ids?.helperText ?? `field::${id}::helper-text`
  const labelId = fieldProps.ids?.label ?? `field::${id}::label`

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

  const targetControlId = fieldProps.target ? `field::${id}::item::${fieldProps.target}` : undefined

  const getControlProps = (): Record<string, any> => ({
    'aria-describedby': labelIds().join(' ') || undefined,
    'aria-invalid': ariaAttr(invalid),
    'data-invalid': dataAttr(invalid),
    'data-required': dataAttr(required),
    'data-readonly': dataAttr(readOnly),
    id,
    required,
    disabled,
    readOnly: readOnly || undefined,
  })

  return {
    ariaDescribedby: labelIds().join(' '),
    ids: {
      control: id,
      label: labelId,
      errorText: errorTextId,
      helperText: helperTextId,
    },
    refs: {
      rootRef,
    },
    disabled,
    invalid,
    readOnly,
    required,
    getRootProps: (): Record<string, any> => ({
      ...parts.root.attrs,
      id: rootId,
      role: 'group',
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
      'data-readonly': dataAttr(readOnly),
    }),
    getLabelProps: (): Record<string, any> => ({
      ...parts.label.attrs,
      id: labelId,
      'data-disabled': dataAttr(disabled),
      'data-invalid': dataAttr(invalid),
      'data-readonly': dataAttr(readOnly),
      'data-required': dataAttr(required),
      for: targetControlId ?? id,
    }),
    getControlProps,
    getInputProps: (): Record<string, any> => ({ ...getControlProps(), ...parts.input.attrs }),
    getTextareaProps: (): Record<string, any> => ({ ...getControlProps(), ...parts.textarea.attrs }),
    getSelectProps: (): Record<string, any> => ({ ...getControlProps(), ...parts.select.attrs }),
    getHelperTextProps: (): Record<string, any> => ({
      id: helperTextId,
      ...parts.helperText.attrs,
      'data-disabled': dataAttr(disabled),
    }),
    getErrorTextProps: (): Record<string, any> => ({
      id: errorTextId,
      ...parts.errorText.attrs,
      'aria-live': 'polite' as const,
    }),
    getRequiredIndicatorProps: (): Record<string, any> => ({
      'aria-hidden': true,
      ...parts.requiredIndicator.attrs,
    }),
  }
}
