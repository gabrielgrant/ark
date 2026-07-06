type EnsureKeys<ExpectedKeys extends (keyof Target)[], Target> = keyof Target extends ExpectedKeys[number]
  ? unknown
  : `Missing required keys: ${Exclude<keyof Target, ExpectedKeys[number]> & string}`

export const createSplitProps =
  <Target extends Record<never, never>>() =>
  <Keys extends (keyof Target)[], Props extends Target = Target>(
    props: Props,
    keys: Keys & EnsureKeys<Keys, Target>,
  ): [Pick<Props, Keys[number]>, Omit<Props, Keys[number]>] => {
    const picked = {} as Pick<Props, Keys[number]>
    const rest = {} as Omit<Props, Keys[number]>
    const keySet = new Set(keys as readonly PropertyKey[])
    for (const key in props) {
      if (keySet.has(key)) {
        ;(picked as Record<string, unknown>)[key] = props[key]
      } else {
        ;(rest as Record<string, unknown>)[key] = props[key]
      }
    }
    return [picked, rest]
  }
