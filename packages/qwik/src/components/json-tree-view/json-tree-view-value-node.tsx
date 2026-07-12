import type { JsonNodeHastElement } from '@zag-js/json-tree-utils'
import type { JSXOutput } from '@qwik.dev/core'

export interface JsonTreeViewValueNodeProps {
  node: JsonNodeHastElement
}

/**
 * A plain (non-`component$`) recursive helper, not a Qwik component: it
 * calls no hooks, so it can safely recurse an arbitrary (data-dependent)
 * number of times within its caller's render without disturbing Qwik's
 * per-component hook-call bookkeeping (unlike `JsonTreeViewNode`, which does
 * read tree-view context and therefore must be a real `component$` per
 * instance -- see the note there).
 *
 * `renderValue` (a custom value-render callback in solid/react) is not
 * offered here: it would need to be a `QRL` to cross this component's
 * serialization boundary, and invoking a `QRL` for every leaf value in a
 * large tree (each requiring its own `await`) adds real complexity for a
 * purely cosmetic hook. Documented gap; default value rendering (the
 * `JsonNodeHastElement` produced by `jsonNodeToElement`) always applies.
 */
export const JsonTreeViewValueNode = (props: JsonTreeViewValueNodeProps): JSXOutput => {
  const { node } = props

  if (node.type === 'text') {
    return <>{node.value}</>
  }

  const Tag = node.tagName

  return (
    <Tag
      data-root={node.properties.root ? '' : undefined}
      data-type={node.properties.nodeType}
      data-kind={node.properties.kind}
    >
      {node.children.map((child, index) => (
        <JsonTreeViewValueNode key={index} node={child} />
      ))}
    </Tag>
  )
}
