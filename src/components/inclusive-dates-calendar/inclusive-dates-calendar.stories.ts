import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { Components } from '../../components';
import { ifDefined } from 'lit/directives/if-defined.js';
import { within, expect, waitFor, fireEvent, userEvent } from '@storybook/test';
import { getISODateString } from '../../utils/utils';

const meta: Meta<Components.InclusiveDatesCalendar> = {
  title: 'Components/InclusiveDatesCalendar',
  tags: ['autodocs'],
  render: (args) => html`
    <inclusive-dates-calendar
      id=${ifDefined(args.id)}
      .value=${ifDefined(args.value)}
      ?range=${args.range}
      locale=${args.locale}
      min-date=${ifDefined(args.minDate)}
      max-date=${ifDefined(args.maxDate)}
      start-date=${ifDefined(args.startDate)}
      first-day-of-week=${ifDefined(args.firstDayOfWeek)}
      ?show-year-stepper=${args.showYearStepper}
      ?show-month-stepper=${args.showMonthStepper}
      ?show-clear-button=${args.showClearButton}
      show-today-button=${args.showTodayButton}
      ?show-hidden-title=${args.showHiddenTitle}
      ?disabled=${args.disabled}
      .disableDate=${args.disableDate}
    ></inclusive-dates-calendar>
  `,
};

export default meta;
type Story = StoryObj<Components.InclusiveDatesCalendar>;


export const Default: Story = {
  args: {
    id: 'calendar-default',
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    showMonthStepper: true,
    showClearButton: true,
    showTodayButton: true,
    locale: 'en-US',
  },
};

export const InitiallyShowsCurrentMonth: Story = {
  args: {
    id: 'calendar-current-month',
    firstDayOfWeek: 1,
    locale: 'en-US',
    referenceDate: '2022-01-15',
  },
  play: async ({ canvasElement }) => {
    await initiallyShowsCurrentMonth(canvasElement);
  }
};

export const ShowsConfiguredStartDate: Story = {
  args: {
    id: 'calendar-configured-date',
    startDate: '1989-05-16',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await showsConfiguredStartDate(canvasElement);
  }
};

export const ShowsWeekdayHeader: Story = {
  args: {
    id: 'calendar-weekday-header',
    startDate: '2026-02-12',
    firstDayOfWeek: 0,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await showsWeekdayHeader(canvasElement);
  }
};

export const FiresSelectDateEvents: Story = {
  args: {
    id: 'calendar-select-events',
    startDate: '2022-01-01',
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await firesSelectDateEvents(canvasElement);
  }
};

export const HighlightsCurrentDateWithKeyboard: Story = {
  args: {
    id: 'calendar-keyboard-nav',
    startDate: '2022-01-01',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await highlightsCurrentDateWithKeyboard(canvasElement);
  }
};

export const ResetsValueAfterRangeChange: Story = {
  args: {
    id: 'calendar-range-reset',
    startDate: '2022-01-01',
    value: new Date('1989-05-16'),
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await resetsValueAfterRangeChange(canvasElement);
  }
};

export const DisablesDates: Story = {
  args: {
    id: 'calendar-disable-dates',
    startDate: '2022-01-01',
    firstDayOfWeek: 1,
    locale: 'en-US',
    disableDate: (date: Date) => {
      return getISODateString(date) === '2022-01-01';
    }
  },
  play: async ({ canvasElement }) => {
    await disablesDates(canvasElement);
  }
};

export const RespectsMinDate: Story = {
  args: {
    id: 'calendar-min-date',
    startDate: '2022-01-15',
    minDate: '2022-01-05',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await respectsMinDate(canvasElement);
  }
};

export const RespectsMaxDate: Story = {
  args: {
    id: 'calendar-max-date',
    startDate: '2022-01-15',
    maxDate: '2022-01-29',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await respectsMaxDate(canvasElement);
  }
};

export const ChangesMonths: Story = {
  args: {
    id: 'calendar-change-months',
    startDate: '2022-02-01',
    minDate: '2022-02-01',
    maxDate: '2022-05-30',
    showHiddenTitle: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await changesMonths(canvasElement);
  }
};

export const ChangesYear: Story = {
  args: {
    id: 'calendar-change-year',
    startDate: '2022-01-01',
    minDate: '1988-01-01',
    maxDate: '2025-12-31',
    showHiddenTitle: true,
    showYearStepper: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await changesYear(canvasElement);
  }
};

export const JumpsToCurrentMonth: Story = {
  args: {
    id: 'calendar-today-button',
    startDate: '1989-01-01',
    showHiddenTitle: true,
    showTodayButton: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await jumpsToCurrentMonth(canvasElement);
  }
};

export const ClearsValue: Story = {
  args: {
    id: 'calendar-clear-button',
    startDate: '2022-01-01',
    showClearButton: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await clearsValue(canvasElement);
  }
};

export const CanBeDisabled: Story = {
  args: {
    id: 'calendar-disabled',
    startDate: '2022-01-01',
    disabled: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
  play: async ({ canvasElement }) => {
    await canBeDisabled(canvasElement);
  }
};

export const RangeMode: Story = {
  args: {
    id: 'calendar-range',
    range: true,
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    showMonthStepper: true,
    locale: 'en-US',
  },
};

export const WithYearStepper: Story = {
  args: {
    id: 'calendar-year-stepper',
    startDate: '2026-02-12',
    showYearStepper: true,
    showMonthStepper: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithSelectedDate: Story = {
  args: {
    id: 'calendar-selected-date',
    value: new Date('2026-02-15'),
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithSelectedRange: Story = {
  args: {
    id: 'calendar-selected-range',
    range: true,
    value: [new Date('2026-02-10'), new Date('2026-02-15')],
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithConstraints: Story = {
  args: {
    id: 'calendar-constraints',
    minDate: '2026-02-05',
    maxDate: '2026-02-25',
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const SundayFirstDay: Story = {
  args: {
    id: 'calendar-sunday',
    startDate: '2026-02-12',
    firstDayOfWeek: 0,
    locale: 'en-US',
  },
};

export const FrenchLocale: Story = {
  args: {
    id: 'calendar-french',
    locale: 'fr-FR',
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
  },
};

export const MinimalCalendar: Story = {
  args: {
    id: 'calendar-minimal',
    startDate: '2026-02-12',
    showYearStepper: false,
    showMonthStepper: false,
    showClearButton: false,
    showTodayButton: false,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

async function initiallyShowsCurrentMonth(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');


  const currentDate = new Date();
  const selectedMonth = getSelectedMonth(canvasElement);
  const selectedYear = getSelectedYear(canvasElement);

  expect(selectedMonth).toBe(currentDate.getMonth() + 1);
  expect(selectedYear).toBe(currentDate.getFullYear());
}

async function showsConfiguredStartDate(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  const selectedMonth = getSelectedMonth(canvasElement);
  const selectedYear = getSelectedYear(canvasElement);

  expect(selectedMonth).toBe(5);
  expect(selectedYear).toBe(1989);
}

async function showsWeekdayHeader(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  const weekdaysHeader = getWeekdaysHeader(canvasElement);

  // Results in double weekday names due to screen reader text
  expect(weekdaysHeader[0]).toContain('S');
  expect(weekdaysHeader[0]).toContain('u');
}

async function firesSelectDateEvents(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLInclusiveDatesCalendarElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const events: string[] = [];
  calendar.addEventListener('selectDate', (e: any) => {
    events.push(e.detail);
  });

  const firstDate = calendar.querySelector<HTMLTableCellElement>('.inclusive-dates-calendar__date');
  await fireEvent.click(firstDate!);

  triggerKeyDown(calendar, 'ArrowRight');
  triggerKeyDown(calendar, 'Space');

  triggerKeyDown(calendar, "ArrowDown");
  triggerKeyDown(calendar, "Enter");

  triggerKeyDown(calendar, "ArrowUp");
  triggerKeyDown(calendar, "Enter");

  triggerKeyDown(calendar, "ArrowLeft");
  triggerKeyDown(calendar, "Enter");

  await waitFor(() => expect(events.length).toBeGreaterThanOrEqual(2));

  expect(events[0]).toEqual("2021-12-26");
  expect(events[1]).toEqual("2021-12-27");
  expect(events[2]).toEqual("2022-01-03");
  expect(events[3]).toEqual("2021-12-27");
  expect(events[4]).toEqual("2021-12-26");
}

async function highlightsCurrentDateWithKeyboard(calendar: HTMLElement) {
  const canvas = within(calendar);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  triggerKeyDown(calendar, 'ArrowRight');
  await waitFor(() => {
    const current = calendar.querySelector('.inclusive-dates-calendar__date--current')?.children[0];
    expect(current?.innerHTML).toBe('2');
  });

  triggerKeyDown(calendar, 'ArrowDown');
  await waitFor(() => {
    const current = calendar.querySelector('.inclusive-dates-calendar__date--current')?.children[0];
    expect(current?.innerHTML).toBe('9');
  });

  triggerKeyDown(calendar, 'End');
  await waitFor(() => {
    const current = calendar.querySelector('.inclusive-dates-calendar__date--current')?.children[0];
    expect(current?.innerHTML).toBe('31');
  });

  triggerKeyDown(calendar, 'Home');
  await waitFor(() => {
    const current = calendar.querySelector('.inclusive-dates-calendar__date--current')?.children[0];
    expect(current?.innerHTML).toBe('1');
  });
}

async function resetsValueAfterRangeChange(calendar: HTMLElement) {
  const canvas = within(calendar);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  const events: any[] = [];
  calendar.addEventListener('selectDate', (e: any) => {
    events.push(e.detail);
  });

  calendar.setAttribute('range', 'true');
  await waitFor(() => {
    expect(calendar.value).toBeUndefined();
  });
}

async function disablesDates(calendar: HTMLElement) {
  const canvas = within(calendar);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  const dateCell = Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>('.inclusive-dates-calendar__date')
  ).find((el) => el.dataset.date === '2022-01-01');

  expect(dateCell?.getAttribute('aria-disabled')).toBe('true');
}

async function respectsMinDate(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const disabledDateCell = Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>('.inclusive-dates-calendar__date')
  ).find((el) => el.dataset.date === '2022-01-04');

  const nonDisabledDateCell = Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>('.inclusive-dates-calendar__date')
  ).find((el) => el.dataset.date === '2022-01-05');

  expect(disabledDateCell?.getAttribute('aria-disabled')).toBe('true');
  expect(nonDisabledDateCell?.getAttribute('aria-disabled')).toBe('false');
}

async function respectsMaxDate(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const disabledDateCell = Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>('.inclusive-dates-calendar__date')
  ).find((el) => el.dataset.date === '2022-01-30');

  const nonDisabledDateCell = Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>('.inclusive-dates-calendar__date')
  ).find((el) => el.dataset.date === '2022-01-29');

  expect(disabledDateCell?.getAttribute('aria-disabled')).toBe('true');
  expect(nonDisabledDateCell?.getAttribute('aria-disabled')).toBe('false');
}

async function changesMonths(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const monthSelect = calendar.querySelector<HTMLSelectElement>('.inclusive-dates-calendar__month-select');
  const header = calendar.querySelector<HTMLElement>('.inclusive-dates-calendar__header');

  expect(header?.innerText.startsWith('February')).toBeTruthy();

  monthSelect!.value = '5';
  await fireEvent.change(monthSelect!);

  await waitFor(() => expect(header?.innerText.startsWith('May')).toBeTruthy());

  const previousButton = calendar.querySelector<HTMLButtonElement>('.inclusive-dates-calendar__previous-month-button');
  await fireEvent.click(previousButton!);

  await waitFor(() => expect(header?.innerText.startsWith('April')).toBeTruthy());
}

async function changesYear(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const yearSelect = calendar.querySelector<HTMLInputElement>('.inclusive-dates-calendar__year-select');
  const header = calendar.querySelector<HTMLElement>('.inclusive-dates-calendar__header');

  expect(header?.innerText.includes('2022')).toBeTruthy();

  yearSelect!.value = '1989';
  await fireEvent.change(yearSelect!);

  await waitFor(() => expect(header?.innerText.includes('1989')).toBeTruthy());

  const previousButton = calendar.querySelector<HTMLButtonElement>('.inclusive-dates-calendar__previous-year-button');
  await fireEvent.click(previousButton!);

  await waitFor(() => expect(header?.innerText.includes('1988')).toBeTruthy());
}

async function jumpsToCurrentMonth(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const todayButton = calendar.querySelector<HTMLButtonElement>('.inclusive-dates-calendar__today-button');
  const header = calendar.querySelector<HTMLElement>('.inclusive-dates-calendar__header');

  expect(header?.innerText.includes('January 1989')).toBeTruthy();

  await fireEvent.click(todayButton!);

  const today = new Date();
  const expectedMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today);

  await waitFor(() => expect(header?.innerText.includes(expectedMonth)).toBeTruthy());
}

async function clearsValue(calendar: HTMLElement) {
  const canvas = within(calendar);

  await canvas.findByLabelText('Select month');
  await canvas.findByLabelText('Select year');

  const events: any[] = [];
  calendar.addEventListener('selectDate', (e: any) => {
    events.push(e.detail);
  });

  const firstDate = calendar.querySelector<HTMLTableCellElement>('.inclusive-dates-calendar__date');
  await fireEvent.click(firstDate!);

  await waitFor(() => expect(events.length).toBe(1));
  expect(events[0]).toBe('2021-12-27');

  const clearButton = calendar.querySelector<HTMLButtonElement>('.inclusive-dates-calendar__clear-button');
  await fireEvent.click(clearButton!);

  await waitFor(() => expect(events.length).toBe(2));
  expect(events[1]).toBe(null);
}

async function canBeDisabled(canvasElement: HTMLElement) {
  const calendar = canvasElement.querySelector('inclusive-dates-calendar') as HTMLInclusiveDatesCalendarElement;
  await waitFor(() => expect(calendar).toBeTruthy());

  const events: any[] = [];
  calendar.addEventListener('selectDate', (e: any) => {
    events.push(e.detail);
  });

  const firstDate = calendar.querySelector<HTMLTableCellElement>('.inclusive-dates-calendar__date');
  await fireEvent.click(firstDate!);

  expect(calendar.children[0].classList.contains('inclusive-dates-calendar--disabled')).toBeTruthy();
  expect(events.length).toBe(0);
}

// Helper functions
function getDisplayedDates(calendar: HTMLElement) {
  return Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>(
      ".inclusive-dates-calendar__date"
    )
  ).map((el) => +(el.children[0] as HTMLElement).innerText);
}

function getSelectedMonth(calendar: HTMLElement) {
  const select = calendar.querySelector<HTMLSelectElement>(".inclusive-dates-calendar__month-select");
  return +(select?.value as string);
}

function getSelectedYear(calendar: HTMLElement) {
  return +(calendar.querySelector<HTMLInputElement>(".inclusive-dates-calendar__year-select")?.value as string);
}

function getWeekdaysHeader(calendar: HTMLElement) {
  return Array.from(
    calendar.querySelectorAll<HTMLTableCellElement>(
      ".inclusive-dates-calendar__weekday"
    )
  ).map((el) => el.innerText);
}

function triggerKeyDown(calendar: HTMLElement, code: string) {
  calendar.querySelector(".inclusive-dates-calendar__calendar")?.dispatchEvent(
    new KeyboardEvent("keydown", { code, bubbles: true })
  );
}
