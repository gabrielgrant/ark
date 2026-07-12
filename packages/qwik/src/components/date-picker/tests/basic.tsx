import { Slot, component$ } from '@qwik.dev/core'
import { DatePicker } from '../index.ts'
import { useDatePickerContext } from '../use-date-picker-context.ts'
import { useDatePickerViewContext } from '../use-date-picker-view-props-context.ts'

/**
 * Other frameworks iterate `api.weeks`/`api.weekDays`/`api.getMonthsGrid()`/
 * `api.getYearsGrid()` via `DatePicker.Context` (children-as-function). Qwik
 * omits render-prop "Context" parts (R6); `useDatePickerContext()` is the
 * public escape hatch instead -- these small `component$` helpers call it
 * directly to build each view's table body (matches the "for" rendering
 * convention used throughout the port; `.map()` for JSX lists per the
 * `select-hidden-select.tsx` precedent).
 */
const DayTableBody = component$(() => {
  const api = useDatePickerContext()
  if (!api) return null
  return (
    <>
      <DatePicker.TableHead>
        <DatePicker.TableRow>
          {api.weekDays.map((weekDay) => (
            <DatePicker.TableHeader key={weekDay.long}>{weekDay.short}</DatePicker.TableHeader>
          ))}
        </DatePicker.TableRow>
      </DatePicker.TableHead>
      <DatePicker.TableBody>
        {api.weeks.map((week, weekIndex) => (
          <DatePicker.TableRow key={weekIndex}>
            {week.map((day) => (
              <DatePicker.TableCell key={day.toString()} value={day}>
                <DatePicker.TableCellTrigger data-testid={`day-${day.toString()}`}>{day.day}</DatePicker.TableCellTrigger>
              </DatePicker.TableCell>
            ))}
          </DatePicker.TableRow>
        ))}
      </DatePicker.TableBody>
    </>
  )
})

const MonthTableBody = component$(() => {
  const api = useDatePickerContext()
  if (!api) return null
  return (
    <DatePicker.TableBody>
      {api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, rowIndex) => (
        <DatePicker.TableRow key={rowIndex}>
          {months.map((month) => (
            <DatePicker.TableCell key={month.value} value={month.value}>
              <DatePicker.TableCellTrigger data-testid={`month-${month.value}`}>{month.label}</DatePicker.TableCellTrigger>
            </DatePicker.TableCell>
          ))}
        </DatePicker.TableRow>
      ))}
    </DatePicker.TableBody>
  )
})

const YearTableBody = component$(() => {
  const api = useDatePickerContext()
  if (!api) return null
  return (
    <DatePicker.TableBody>
      {api.getYearsGrid({ columns: 4 }).map((years, rowIndex) => (
        <DatePicker.TableRow key={rowIndex}>
          {years.map((year) => (
            <DatePicker.TableCell key={year.value} value={year.value}>
              <DatePicker.TableCellTrigger data-testid={`year-${year.value}`}>{year.label}</DatePicker.TableCellTrigger>
            </DatePicker.TableCell>
          ))}
        </DatePicker.TableRow>
      ))}
    </DatePicker.TableBody>
  )
})

const ViewBody = component$(() => {
  const view = useDatePickerViewContext()
  return (
    <>
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger data-testid={`${view.view}-prev`}>Prev</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger data-testid={`${view.view}-view-trigger`}>
          <DatePicker.RangeText />
        </DatePicker.ViewTrigger>
        <DatePicker.NextTrigger data-testid={`${view.view}-next`}>Next</DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.Table data-testid={`${view.view}-table`}>
        {view.view === 'day' && <DayTableBody />}
        {view.view === 'month' && <MonthTableBody />}
        {view.view === 'year' && <YearTableBody />}
      </DatePicker.Table>
      <Slot />
    </>
  )
})

export const ComponentUnderTest = (props: DatePicker.RootProps) => (
  <DatePicker.Root {...props}>
    <DatePicker.Label>Date</DatePicker.Label>
    <DatePicker.Control data-testid="control">
      <DatePicker.Input data-testid="input" />
      <DatePicker.Trigger data-testid="trigger">Open</DatePicker.Trigger>
      <DatePicker.ClearTrigger data-testid="clear-trigger">Clear</DatePicker.ClearTrigger>
    </DatePicker.Control>
    <DatePicker.PresetTrigger data-testid="preset-trigger" value="last7Days">
      Last 7 days
    </DatePicker.PresetTrigger>
    <DatePicker.Positioner data-testid="positioner">
      <DatePicker.Content data-testid="content">
        <DatePicker.YearSelect data-testid="year-select" />
        <DatePicker.MonthSelect data-testid="month-select" />
        <DatePicker.View view="day" data-testid="day-view">
          <ViewBody />
        </DatePicker.View>
        <DatePicker.View view="month" data-testid="month-view">
          <ViewBody />
        </DatePicker.View>
        <DatePicker.View view="year" data-testid="year-view">
          <ViewBody />
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker.Root>
)
