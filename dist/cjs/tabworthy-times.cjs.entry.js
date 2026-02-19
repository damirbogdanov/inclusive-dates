'use strict';

var index = require('./index-C15oswCE.js');
var moment = require('./moment-CdViwxPQ.js');
var utils = require('./utils-y5Vtky2t.js');

const defaultLabels = {
    selected: "selected",
    openCalendar: "Open date and time picker",
    calendar: "date and time picker",
    invalidDateError: "We could not find a matching date",
    minDateError: `Please fill in a date after `,
    maxDateError: `Please fill in a date before `,
    rangeOutOfBoundsError: `Please enter a valid range of dates`,
    disabledDateError: `Please choose an available date`,
    to: "to",
    startDate: "Start date",
    timeLabel: "Time"
};
const InclusiveTimes = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.selectDateTime = index.createEvent(this, "selectDateTime");
        this.changeYear = index.createEvent(this, "changeYear");
        this.componentReady = index.createEvent(this, "componentReady");
        // Enable or disable range mode
        this.range = false;
        // A label for the text field
        this.label = "Choose a date and time";
        // A placeholder for the text field
        this.placeholder = "";
        // Locale used for internal translations and date parsing
        this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
        // If the datetime picker is disabled
        this.disabled = false;
        // Which date to be displayed when calendar is first opened
        this.startDate = utils.getISODateString(new Date());
        // Reference date used for Chrono date parsing. Equals "today"
        this.referenceDate = utils.getISODateString(new Date());
        // Use 12-hour format with AM/PM
        this.use12HourFormat = true;
        // Labels used for internal translations
        this.timesLabels = defaultLabels;
        // Prevent hiding the calendar
        this.inline = false;
        // Current error state of the input field
        this.hasError = false;
        // Show or hide the next/previous year buttons
        this.showYearStepper = false;
        // Show or hide the next/previous month buttons
        this.showMonthStepper = true;
        // Show or hide the clear button
        this.showClearButton = true;
        // Show or hide the today button
        this.showTodayButton = true;
        // Function to disable individual dates
        this.disableDate = () => false;
        // Component name used to generate CSS classes
        this.elementClassName = "tabworthy-times";
        // Which day that should start the week (0 is sunday, 1 is monday)
        this.firstDayOfWeek = 1;
        // Format for the value prop (input/output format). Defaults to ISO 8601 format.
        this.format = "YYYY-MM-DDTHH:mm:ss";
        // If true, format input on blur/accept (like dates)
        this.inputShouldFormat = true;
        this.selectedHours = 12;
        this.selectedMinutes = 0;
        this.errorState = this.hasError;
        this.disabledState = this.disabled;
        this.errorMessage = "";
        this.handlePickerSelection = async (dateString) => {
            const dates = dateString.split(",");
            if (this.range && dates.length === 2) {
                const startDate = utils.removeTimezoneOffset(new Date(dates[0]));
                const endDate = utils.removeTimezoneOffset(new Date(dates[1]));
                this.updateValue([startDate, endDate]);
                // Update calendar with selected dates
                if (this.pickerRef) {
                    this.pickerRef.value = [startDate, endDate];
                }
            }
            else {
                const date = utils.removeTimezoneOffset(new Date(dates[0]));
                this.updateValue(date);
                // Update calendar with selected date
                if (this.pickerRef) {
                    this.pickerRef.value = date;
                }
            }
        };
        this.handleTimeChange = (event) => {
            this.selectedHours = event.detail.hours;
            this.selectedMinutes = event.detail.minutes;
            // Update the value if we have a selected date
            if (this.selectedDate) {
                this.updateValue(this.selectedDate);
            }
        };
        this.handleCalendarButtonClick = async () => {
            if (this.modalRef) {
                await this.modalRef.setTriggerElement(this.calendarButtonRef);
                await this.modalRef.open();
            }
        };
        this.handleYearChange = (eventDetail) => {
            if (this.changeYear) {
                this.changeYear.emit(eventDetail);
            }
        };
        this.handleChangedMonths = (_eventDetail) => {
            // Can be used for month change tracking
        };
        this.handleInputBlur = () => {
            if (this.shouldInputFormat()) {
                this.formatInput();
            }
        };
        this.handleInputChange = (event) => {
            const value = event.target.value;
            // Try to parse the input value as a datetime
            const parsed = moment.hooks(value);
            if (parsed.isValid()) {
                this.selectedHours = parsed.hours();
                this.selectedMinutes = parsed.minutes();
                this.updateValue(parsed.toDate());
            }
        };
    }
    shouldInputFormat() {
        if (typeof this.inputShouldFormat === "string") {
            return this.inputShouldFormat === "true";
        }
        return !!this.inputShouldFormat;
    }
    watchValue(_newValue) {
        this.syncFromValueProp();
    }
    watchDisabled(newValue) {
        this.disabledState = newValue;
    }
    watchHasError(newValue) {
        this.errorState = newValue;
    }
    componentDidLoad() {
        this.syncFromValueProp();
        this.componentReady.emit();
        if (!this.id) {
            console.error('tabworthy-times: The "id" prop is required for accessibility');
        }
    }
    syncFromValueProp() {
        if (this.value) {
            this.internalValue = this.value;
            // Parse the first datetime value to set time picker
            const firstValue = Array.isArray(this.value) ? this.value[0] : this.value;
            if (firstValue) {
                const parsed = moment.hooks(firstValue, this.format);
                if (parsed.isValid()) {
                    this.selectedDate = parsed.toDate();
                    this.selectedHours = parsed.hours();
                    this.selectedMinutes = parsed.minutes();
                }
            }
        }
        else {
            this.internalValue = null;
        }
    }
    updateValue(date) {
        if (Array.isArray(date)) {
            // Range mode
            const formattedDates = date.map((d) => {
                const m = moment.hooks(d);
                m.hours(this.selectedHours);
                m.minutes(this.selectedMinutes);
                m.seconds(0);
                return m.format(this.format);
            });
            this.internalValue = formattedDates;
            this.value = formattedDates;
            this.selectDateTime.emit(formattedDates);
        }
        else {
            // Single date mode
            const m = moment.hooks(date);
            m.hours(this.selectedHours);
            m.minutes(this.selectedMinutes);
            m.seconds(0);
            const formatted = m.format(this.format);
            this.internalValue = formatted;
            this.value = formatted;
            this.selectedDate = date;
            this.selectDateTime.emit(formatted);
        }
        this.errorState = false;
        if (this.shouldInputFormat()) {
            this.formatInput();
        }
    }
    formatInput() {
        if (!this.internalValue)
            return;
        if (Array.isArray(this.internalValue)) {
            // Format range
            const formatted = this.internalValue
                .map((v) => moment.hooks(v, this.format).format("lll"))
                .join(` ${this.timesLabels.to} `);
            this.inputRef.value = formatted;
        }
        else {
            // Format single datetime
            this.inputRef.value = moment.hooks(this.internalValue, this.format).format("lll");
        }
    }
    getClassName(suffix) {
        return `${this.elementClassName}__${suffix}`;
    }
    async clearValue() {
        this.internalValue = null;
        this.value = undefined;
        this.selectedDate = undefined;
        this.inputRef.value = "";
        if (this.pickerRef) {
            this.pickerRef.value = null;
        }
        this.selectDateTime.emit(undefined);
    }
    render() {
        var _a;
        return (index.h(index.Host, { key: '4c2b4df711aef3ecab43e101650d8af27088813b', class: this.elementClassName, "has-error": this.errorState, disabled: this.disabledState }, index.h("label", { key: 'bd4a9fcbfb146dac1bf856cfc3f5b5e250714f9c', htmlFor: `${this.id}-input`, class: this.getClassName("label") }, this.label), index.h("div", { key: '845800995b3d9b88f6f0a0d02486de2821fdaaef', class: this.getClassName("input-container") }, index.h("input", { key: 'bc8033523f88c72205d62068bda4199b666ef674', id: `${this.id}-input`, ref: (r) => (this.inputRef = r), type: "text", class: this.getClassName("input"), placeholder: this.placeholder, disabled: this.disabledState, value: (_a = this.internalValue) === null || _a === void 0 ? void 0 : _a.toString(), onBlur: this.handleInputBlur, onChange: this.handleInputChange, "aria-describedby": this.errorState ? `${this.id}-error` : undefined, "aria-invalid": this.errorState }), !this.inline && (index.h("button", { key: '02d49c8b78edfbdd3cbbb6a738323d4de10ac46d', type: "button", ref: (r) => (this.calendarButtonRef = r), onClick: this.handleCalendarButtonClick, class: this.getClassName("calendar-button"), disabled: this.disabledState }, this.calendarButtonContent ? (index.h("span", { innerHTML: this.calendarButtonContent })) : (this.timesLabels.openCalendar)))), index.h("tabworthy-dates-modal", { key: '6e03950ffd59ce6d7391e878479359d5d8ecf665', label: this.timesLabels.calendar, ref: (el) => (this.modalRef = el), onOpened: () => {
                if (this.pickerRef) {
                    this.pickerRef.modalIsOpen = true;
                }
            }, onClosed: () => {
                if (this.pickerRef) {
                    this.pickerRef.modalIsOpen = false;
                }
            }, inline: this.inline }, index.h("div", { key: '8e29281638aaa80d71220ad08dab482bf5a3c1e4', class: this.getClassName("picker-container") }, index.h("tabworthy-dates-calendar", { key: '5e0129fe76d1de0b760201d462ce446132fc7003', range: this.range, locale: this.locale, onSelectDate: (event) => this.handlePickerSelection(event.detail), onChangeMonth: (event) => this.handleChangedMonths(event.detail), onChangeYear: (event) => this.handleYearChange(event.detail), labels: this.datesCalendarLabels, ref: (el) => (this.pickerRef = el), startDate: this.startDate, firstDayOfWeek: this.firstDayOfWeek, showHiddenTitle: true, disabled: this.disabledState, showMonthStepper: this.showMonthStepper, showYearStepper: this.showYearStepper, showClearButton: this.showClearButton, showTodayButton: this.showTodayButton, disableDate: this.disableDate, minDate: this.minDate, maxDate: this.maxDate, inline: this.inline }, index.h("div", { key: '4d2da22f4da3460a9626c886b61e22eb66c0a23f', slot: "after-calendar", class: this.getClassName("time-section") }, index.h("tabworthy-times-picker", { key: '2d9a9a8ce12e0659f4f1c82f1f8d64d829fc183b', hours: this.selectedHours, minutes: this.selectedMinutes, use12HourFormat: this.use12HourFormat, disabled: this.disabledState, onTimeChanged: this.handleTimeChange }))))), this.errorState && (index.h("div", { key: 'df2cdfcd866f26108032c75a3f8c2f55ba5c9b10', class: this.getClassName("input-error"), id: this.id ? `${this.id}-error` : undefined, role: "status" }, this.errorMessage))));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "value": [{
                "watchValue": 0
            }],
        "disabled": [{
                "watchDisabled": 0
            }],
        "hasError": [{
                "watchHasError": 0
            }]
    }; }
};

exports.tabworthy_times = InclusiveTimes;
