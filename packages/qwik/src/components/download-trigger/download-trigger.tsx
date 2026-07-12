import { $, type QRL, Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { type UseDownloadProps, useDownload } from './use-download.ts'

export interface DownloadTriggerBaseProps extends PolymorphicProps<'button'>, UseDownloadProps {}
export interface DownloadTriggerProps extends Assign<HTMLProps<'button'>, DownloadTriggerBaseProps> {}

const ownKeySet = new Set<string>(['fileName', 'mimeType', 'data', 'data$', 'onClick$'])

export const DownloadTrigger = component$<DownloadTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const { download } = useDownload({
    fileName: record.fileName as string,
    mimeType: record.mimeType as UseDownloadProps['mimeType'],
    data: record.data as UseDownloadProps['data'],
    data$: record.data$ as UseDownloadProps['data$'],
  })

  const userOnClick = record.onClick$ as QRL<(event: PointerEvent, target: HTMLButtonElement) => void> | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  return (
    <ark.button
      {...rest}
      type="button"
      onClick$={$(async (event: PointerEvent, target: HTMLButtonElement) => {
        await userOnClick?.(event, target)
        if (event.defaultPrevented) return
        await download()
      })}
    >
      <Slot />
    </ark.button>
  )
})
