import { type FileMimeType, downloadFile } from '@zag-js/file-utils'
import { $, type QRL, noSerialize } from '@qwik.dev/core'
import type { MaybePromise } from '../../types.ts'

export type DownloadableData = string | Blob | File

export interface UseDownloadProps {
  /**
   * The name of the file to download.
   */
  fileName: string
  /**
   * The MIME type of the data to download.
   */
  mimeType: FileMimeType
  /**
   * The data to download. Plain function props cannot be serialized when the
   * component is server-rendered -- prefer `data$` in Qwik apps.
   */
  data?: DownloadableData | (() => MaybePromise<DownloadableData>)
  /**
   * QRL variant of `data` (R9). Since the resolved value is already awaited
   * (both a plain function's return value and a QRL invocation may be a
   * `Promise`), this is safe to offer even though `data` produces the value
   * the trigger consumes -- unlike a notification callback there is exactly
   * one data source per call, so `data$` takes priority over `data` when
   * both are given.
   */
  data$?: QRL<() => MaybePromise<DownloadableData>>
}

export interface UseDownloadReturn {
  /**
   * Triggers the download, resolving `data`/`data$` first if either is a
   * function (or QRL) or a promise.
   *
   * A real `QRL` (not a plain function): Qwik's `onClick$`-style event
   * handlers are themselves QRLs whose closures are serialized, and a plain
   * function capture (e.g. `$(() => { download() })`) fails Qwik's
   * serializability check (Q3) because a bare function isn't a valid
   * captured value. `download` being a QRL itself is the supported way to
   * reference it from another QRL's closure.
   */
  download: QRL<() => Promise<void>>
}

/**
 * Unlike the machine-backed `use-<x>.ts` hooks elsewhere in this package,
 * `props` here is a plain (already-current) value, not a getter -- the
 * returned `download` QRL captures a snapshot of `fileName`/`mimeType`/
 * `data`/`data$` at the point `useDownload` is called (during render), same
 * as any other QRL created in a `component$` body.
 */
export const useDownload = (props: UseDownloadProps): UseDownloadReturn => {
  const { fileName, mimeType, data, data$ } = props

  // `data` may be a `Blob`/`File` class instance -- tag it (R15) before it is
  // captured by the `$()` closure below, the same pattern as listbox's
  // `collection` prop.
  if (typeof data === 'object' && data !== null) {
    noSerialize(data)
  }

  const download = $(async () => {
    const saveToDisk = (value: DownloadableData) => {
      // Always the real browser window: this only ever runs client-side in
      // response to a real click, so there is no custom-root-node/SSR
      // concern that would justify going through the environment provider.
      downloadFile({ file: value, name: fileName, type: mimeType, win: window })
    }

    if (data$) {
      saveToDisk(await data$())
      return
    }

    if (typeof data === 'function') {
      const maybePromise = (data as () => MaybePromise<DownloadableData>)()
      saveToDisk(maybePromise instanceof Promise ? await maybePromise : maybePromise)
      return
    }

    if (data !== undefined) saveToDisk(data as DownloadableData)
  })

  return { download }
}
