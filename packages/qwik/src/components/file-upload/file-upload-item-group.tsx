import type { ItemGroupProps } from '@zag-js/file-upload'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { FileUploadItemGroupPropsProvider } from './use-file-upload-item-group-props-context.ts'

const itemGroupPropKeys = ['type'] as const

const ownKeySet = new Set<string>(itemGroupPropKeys)

export interface FileUploadItemGroupBaseProps extends PolymorphicProps<'ul'>, ItemGroupProps {}
export interface FileUploadItemGroupProps extends Assign<HTMLProps<'ul'>, FileUploadItemGroupBaseProps> {}

export const FileUploadItemGroup = component$<FileUploadItemGroupProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemGroupProps = {} as ItemGroupProps
  for (const key of itemGroupPropKeys) {
    if (key in record) (itemGroupProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useFileUploadContext()

  FileUploadItemGroupPropsProvider(itemGroupProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemGroupUlProps = api ? mergeProps(api.getItemGroupProps(itemGroupProps), rest) : rest

  return (
    <ark.ul {...itemGroupUlProps}>
      <Slot />
    </ark.ul>
  )
})
