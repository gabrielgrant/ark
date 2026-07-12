import { Format } from '../index.ts'

export const NumberUnderTest = (props: Format.NumberProps) => (
  <span data-testid="number">
    <Format.Number {...props} />
  </span>
)

export const ByteUnderTest = (props: Format.ByteProps) => (
  <span data-testid="byte">
    <Format.Byte {...props} />
  </span>
)

export const RelativeTimeUnderTest = (props: Format.RelativeTimeProps) => (
  <span data-testid="relative-time">
    <Format.RelativeTime {...props} />
  </span>
)

export const TimeUnderTest = (props: Format.TimeProps) => (
  <span data-testid="time">
    <Format.Time {...props} />
  </span>
)
