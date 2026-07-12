import { ColorPicker, parseColor } from '../index.ts'

/**
 * Slider/area thumbs render 0x0 unstyled and Playwright actionability then
 * times out (R14) -- give the interactive geometry explicit sizes, and prefer
 * keyboard interaction in browser tests.
 */
export const ComponentUnderTest = (props: ColorPicker.RootProps) => (
  <ColorPicker.Root defaultValue={parseColor('#eb5e41')} {...props}>
    <ColorPicker.Label>Color</ColorPicker.Label>
    <ColorPicker.Control data-testid="control">
      <ColorPicker.ChannelInput channel="hex" data-testid="hex-input" />
      <ColorPicker.ChannelInput channel="alpha" data-testid="alpha-input" />
      <ColorPicker.ValueText data-testid="value-text" />
      <ColorPicker.Trigger data-testid="trigger">
        <ColorPicker.ValueSwatch data-testid="value-swatch" />
      </ColorPicker.Trigger>
    </ColorPicker.Control>
    <ColorPicker.Positioner data-testid="positioner">
      <ColorPicker.Content data-testid="content">
        <ColorPicker.FormatTrigger data-testid="format-trigger">Toggle ColorFormat</ColorPicker.FormatTrigger>
        <ColorPicker.FormatSelect data-testid="format-select" />
        <ColorPicker.Area data-testid="area" style={{ width: '160px', height: '160px' }}>
          <ColorPicker.AreaBackground style={{ width: '160px', height: '160px' }} />
          <ColorPicker.AreaThumb data-testid="area-thumb" style={{ width: '12px', height: '12px' }} />
        </ColorPicker.Area>
        {/* NOTE: no ChannelSliderValueText here -- `getChannelValueText("hue")`
            throws ("Unknown color channel") when the current value is an
            RGB-format Color; the alpha slider below carries the value text. */}
        <ColorPicker.ChannelSlider channel="hue" data-testid="hue-slider" style={{ width: '160px', height: '16px' }}>
          <ColorPicker.ChannelSliderLabel>Hue</ColorPicker.ChannelSliderLabel>
          <ColorPicker.ChannelSliderTrack style={{ width: '160px', height: '16px' }} />
          <ColorPicker.ChannelSliderThumb
            data-testid="hue-slider-thumb"
            style={{ width: '12px', height: '12px', visibility: 'visible' }}
          />
        </ColorPicker.ChannelSlider>
        <ColorPicker.ChannelSlider
          channel="alpha"
          data-testid="alpha-slider"
          style={{ width: '160px', height: '16px' }}
        >
          <ColorPicker.ChannelSliderLabel>Alpha</ColorPicker.ChannelSliderLabel>
          <ColorPicker.ChannelSliderValueText data-testid="alpha-value-text" />
          <ColorPicker.TransparencyGrid />
          <ColorPicker.ChannelSliderTrack style={{ width: '160px', height: '16px' }} />
          <ColorPicker.ChannelSliderThumb
            data-testid="alpha-slider-thumb"
            style={{ width: '12px', height: '12px', visibility: 'visible' }}
          />
        </ColorPicker.ChannelSlider>
        <ColorPicker.SwatchGroup data-testid="swatch-group">
          <ColorPicker.SwatchTrigger value="red" data-testid="swatch-trigger-red">
            <ColorPicker.Swatch value="red">
              <ColorPicker.SwatchIndicator>x</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
          <ColorPicker.SwatchTrigger value="blue" data-testid="swatch-trigger-blue">
            <ColorPicker.Swatch value="blue">
              <ColorPicker.SwatchIndicator>x</ColorPicker.SwatchIndicator>
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
        </ColorPicker.SwatchGroup>
        <ColorPicker.View format="rgba" data-testid="rgba-view">
          <ColorPicker.ChannelInput channel="red" data-testid="red-input" />
          <ColorPicker.ChannelInput channel="green" data-testid="green-input" />
          <ColorPicker.ChannelInput channel="blue" data-testid="blue-input" />
        </ColorPicker.View>
        <ColorPicker.View format="hsla" data-testid="hsla-view">
          <ColorPicker.ChannelInput channel="hue" data-testid="hsl-hue-input" />
          <ColorPicker.ChannelInput channel="saturation" data-testid="saturation-input" />
          <ColorPicker.ChannelInput channel="lightness" data-testid="lightness-input" />
        </ColorPicker.View>
        <ColorPicker.EyeDropperTrigger data-testid="eye-dropper-trigger">Pick color</ColorPicker.EyeDropperTrigger>
      </ColorPicker.Content>
    </ColorPicker.Positioner>
    <ColorPicker.HiddenInput data-testid="hidden-input" />
  </ColorPicker.Root>
)
