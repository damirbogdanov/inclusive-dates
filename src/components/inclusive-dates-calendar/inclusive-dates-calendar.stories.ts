import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { Components } from '../../components';

const meta: Meta<Components.InclusiveDatesCalendar> = {
  title: 'Components/Inclusive Dates Calendar',
  tags: ['autodocs'],
  render: (args) => html`
    <inclusive-dates-calendar
      .value=${args.value}
      ?range=${args.range}
      locale=${args.locale}
      min-date=${args.minDate}
      max-date=${args.maxDate}
      start-date=${args.startDate}
      first-day-of-week=${args.firstDayOfWeek}
      ?show-year-stepper=${args.showYearStepper}
      ?show-month-stepper=${args.showMonthStepper}
      ?show-clear-button=${args.showClearButton}
      ?show-today-button=${args.showTodayButton}
    ></inclusive-dates-calendar>
  `,
};

export default meta;
type Story = StoryObj<Components.InclusiveDatesCalendar>;

export const Default: Story = {
  args: {
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    showMonthStepper: true,
    showClearButton: true,
    showTodayButton: true,
    locale: 'en-US',
  },
};

export const RangeMode: Story = {
  args: {
    range: true,
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    showMonthStepper: true,
    locale: 'en-US',
  },
};

export const WithYearStepper: Story = {
  args: {
    startDate: '2026-02-12',
    showYearStepper: true,
    showMonthStepper: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithSelectedDate: Story = {
  args: {
    value: new Date('2026-02-15'),
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithSelectedRange: Story = {
  args: {
    range: true,
    value: [new Date('2026-02-10'), new Date('2026-02-15')],
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithConstraints: Story = {
  args: {
    minDate: '2026-02-05',
    maxDate: '2026-02-25',
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const SundayFirstDay: Story = {
  args: {
    startDate: '2026-02-12',
    firstDayOfWeek: 0,
    locale: 'en-US',
  },
};

export const FrenchLocale: Story = {
  args: {
    locale: 'fr-FR',
    startDate: '2026-02-12',
    firstDayOfWeek: 1,
  },
};

export const MinimalCalendar: Story = {
  args: {
    startDate: '2026-02-12',
    showYearStepper: false,
    showMonthStepper: false,
    showClearButton: false,
    showTodayButton: false,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};
