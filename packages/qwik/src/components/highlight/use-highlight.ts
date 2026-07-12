import { type HighlightChunk, type HighlightWordProps, highlightWord } from '@zag-js/highlight-word'

export interface UseHighlightProps extends HighlightWordProps {}

/**
 * Pure computation (no machine, no context) -- called directly during
 * render; Qwik re-runs the owning component's render function whenever its
 * props change, so no extra memoization hook is needed here (unlike solid's
 * `createMemo`, which exists because solid components render once and rely
 * on fine-grained signals for updates).
 */
export const useHighlight = (props: UseHighlightProps): HighlightChunk[] => highlightWord(props)

export type { HighlightChunk }
