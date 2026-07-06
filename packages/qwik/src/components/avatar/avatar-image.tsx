import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAvatarContext } from './use-avatar-context.ts'

export interface AvatarImageBaseProps extends PolymorphicProps<'img'> {}
export interface AvatarImageProps extends HTMLProps<'img'>, AvatarImageBaseProps {}

export const AvatarImage = component$<AvatarImageProps>((props) => {
  const api = useAvatarContext()
  const imageProps = api ? mergeProps(api.getImageProps(), props as Record<string, any>) : props

  // biome-ignore lint/correctness/useImageSize: headless component; sizing is the consumer's concern
  return <ark.img {...imageProps} />
})
