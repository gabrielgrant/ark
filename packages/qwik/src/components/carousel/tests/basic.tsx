import { Carousel } from '../index.ts'

const itemCount = 5

export const ComponentUnderTest = (props: Partial<Carousel.RootProps>) => (
  <Carousel.Root {...props} slideCount={props.slideCount ?? itemCount}>
    <Carousel.Control data-testid="control">
      <Carousel.PrevTrigger data-testid="prev-trigger">Prev</Carousel.PrevTrigger>
      <Carousel.ItemGroup data-testid="item-group">
        {Array.from({ length: itemCount }, (_, index) => (
          <Carousel.Item key={index} index={index} data-testid={`item-${index}`}>
            Slide {index}
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
      <Carousel.NextTrigger data-testid="next-trigger">Next</Carousel.NextTrigger>
    </Carousel.Control>
    <Carousel.IndicatorGroup data-testid="indicator-group">
      {Array.from({ length: itemCount }, (_, index) => (
        <Carousel.Indicator key={index} index={index} data-testid={`indicator-${index}`} />
      ))}
    </Carousel.IndicatorGroup>
    <Carousel.AutoplayTrigger data-testid="autoplay-trigger">
      <Carousel.AutoplayIndicator data-testid="autoplay-indicator" fallback="Play">
        Pause
      </Carousel.AutoplayIndicator>
    </Carousel.AutoplayTrigger>
    <Carousel.ProgressText data-testid="progress-text" />
  </Carousel.Root>
)
