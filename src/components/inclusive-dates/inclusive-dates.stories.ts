import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { Components } from '../../components';

const meta: Meta<Components.InclusiveDates> = {
  title: 'Components/Inclusive Dates',
  tags: ['autodocs'],
  render: (args) => html`
    <inclusive-dates
      id=${args.id}
      .value=${args.value}
      ?range=${args.range}
      label=${args.label}
      placeholder=${args.placeholder}
      locale=${args.locale}
      ?disabled=${args.disabled}
      min-date=${args.minDate}
      max-date=${args.maxDate}
      start-date=${args.startDate}
      ?inline=${args.inline}
      ?show-year-stepper=${args.showYearStepper}
      ?show-month-stepper=${args.showMonthStepper}
      ?show-clear-button=${args.showClearButton}
      ?show-today-button=${args.showTodayButton}
      ?show-quick-buttons=${args.showQuickButtons}
      ?input-should-format=${args.formatInputOnAccept}
      ?show-keyboard-hint=${args.showKeyboardHint}
      first-day-of-week=${args.firstDayOfWeek}
    ></inclusive-dates>
  `,
};

export default meta;
type Story = StoryObj<Components.InclusiveDates>;

export const Default: Story = {
  args: {
    id: 'datepicker-default',
    label: 'Choose a date (any way you like)',
    placeholder: 'Try "tomorrow" or "in ten days"',
    showQuickButtons: true,
    showClearButton: true,
    showTodayButton: true,
    formatInputOnAccept: true,
    showKeyboardHint: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const RangeMode: Story = {
  args: {
    id: 'datepicker-range',
    range: true,
    label: 'Choose a date range',
    placeholder: 'Try "June 8 to 12" or "next week"',
    showQuickButtons: true,
    showClearButton: true,
    showTodayButton: true,
    formatInputOnAccept: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithValue: Story = {
  args: {
    id: 'datepicker-with-value',
    value: '2026-03-15',
    label: 'Date with pre-selected value',
    placeholder: 'Select a date',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const Disabled: Story = {
  args: {
    id: 'datepicker-disabled',
    disabled: true,
    label: 'Disabled date picker',
    placeholder: 'This is disabled',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithConstraints: Story = {
  args: {
    id: 'datepicker-constraints',
    label: 'Date picker with constraints',
    placeholder: 'Only dates in March 2026',
    minDate: '2026-03-01',
    maxDate: '2026-03-31',
    startDate: '2026-03-15',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const InlineCalendar: Story = {
  args: {
    id: 'datepicker-inline',
    inline: true,
    label: 'Always visible calendar',
    placeholder: 'Try any date input',
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const WithYearStepper: Story = {
  args: {
    id: 'datepicker-year-stepper',
    label: 'Date picker with year navigation',
    placeholder: 'Navigate by years',
    showYearStepper: true,
    showMonthStepper: true,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const NoQuickButtons: Story = {
  args: {
    id: 'datepicker-no-quick',
    label: 'Date picker without quick buttons',
    placeholder: 'No quick date options',
    showQuickButtons: false,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};

export const SundayFirstDay: Story = {
  args: {
    id: 'datepicker-sunday',
    label: 'Week starts on Sunday',
    placeholder: 'Sunday as first day',
    firstDayOfWeek: 0,
    locale: 'en-US',
  },
};

export const JapaneseLocale: Story = {
  args: {
    id: 'datepicker-ja',
    locale: 'ja-JP',
    label: '日付を選択',
    placeholder: '「明日」または「10日後」を試してください',
    firstDayOfWeek: 0, // Japan typically starts week on Sunday
  },
};

export const MinimalUI: Story = {
  args: {
    id: 'datepicker-minimal',
    label: 'Minimal date picker',
    placeholder: 'Select date',
    showQuickButtons: false,
    showClearButton: false,
    showTodayButton: false,
    showKeyboardHint: false,
    formatInputOnAccept: false,
    firstDayOfWeek: 1,
    locale: 'en-US',
  },
};
