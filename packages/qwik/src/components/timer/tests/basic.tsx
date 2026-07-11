import { Timer } from '../index.ts'

export const ComponentUnderTest = (props: Timer.RootProps) => (
  <Timer.Root data-testid="root" countdown startMs={2000} interval={50} {...props}>
    <Timer.Area data-testid="area">
      <Timer.Item data-testid="item-minutes" type="minutes" />
      <Timer.Separator data-testid="separator">:</Timer.Separator>
      <Timer.Item data-testid="item-seconds" type="seconds" />
    </Timer.Area>
    <Timer.Control data-testid="control">
      <Timer.ActionTrigger data-testid="start" action="start">
        Start
      </Timer.ActionTrigger>
      <Timer.ActionTrigger data-testid="resume" action="resume">
        Resume
      </Timer.ActionTrigger>
      <Timer.ActionTrigger data-testid="pause" action="pause">
        Pause
      </Timer.ActionTrigger>
      <Timer.ActionTrigger data-testid="reset" action="reset">
        Reset
      </Timer.ActionTrigger>
    </Timer.Control>
  </Timer.Root>
)
