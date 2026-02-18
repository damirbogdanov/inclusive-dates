import { h, Host } from "@stencil/core";
import { addDays, dateIsWithinLowerBounds, dateIsWithinUpperBounds, getDaysOfMonth, getFirstOfMonth, getISODateString, getLastOfMonth, getMonth, getMonths, getNextDay, getNextMonth, getNextYear, getPreviousDay, getPreviousMonth, getPreviousYear, getWeekDays, getYear, isDateInRange, isSameDay, monthIsDisabled, removeTimezoneOffset, subDays } from "../../../../shared/utils/utils";
import { dateIsWithinBounds } from "../../../../shared/utils/utils";
const defaultLabels = {
    clearButton: "Clear value",
    monthSelect: "Select month",
    nextMonthButton: "Next month",
    nextYearButton: "Next year",
    picker: "Choose date",
    previousMonthButton: "Previous month",
    previousYearButton: "Previous year",
    todayButton: "Show today",
    yearSelect: "Select year",
    keyboardHint: "Keyboard commands",
    selected: "Selected date",
    chooseAsStartDate: "choose as start date",
    chooseAsEndDate: "choose as end date"
};
export class InclusiveDatesCalendar {
    constructor() {
        this.disabled = false;
        this.modalIsOpen = false;
        this.disableDate = () => false;
        this.elementClassName = "tabworthy-dates-calendar";
        this.firstDayOfWeek = 0;
        this.range = false;
        this.labels = defaultLabels;
        this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
        this.inline = false;
        this.showClearButton = false;
        this.showMonthStepper = true;
        this.showTodayButton = true;
        this.showYearStepper = false;
        this.showKeyboardHint = false;
        this.showHiddenTitle = true;
        this.startDate = getISODateString(new Date());
        this.init = () => {
            this.currentDate = this.startDate
                ? removeTimezoneOffset(new Date(this.startDate))
                : new Date();
            this.updateWeekdays();
        };
        this.nextMonth = () => {
            this.updateCurrentDate(getNextMonth(this.currentDate));
        };
        this.nextYear = () => {
            this.updateCurrentDate(getNextYear(this.currentDate));
        };
        this.previousMonth = () => {
            this.updateCurrentDate(getPreviousMonth(this.currentDate));
        };
        this.previousYear = () => {
            this.updateCurrentDate(getPreviousYear(this.currentDate));
        };
        this.showToday = () => {
            this.updateCurrentDate(new Date(), true);
        };
        this.clear = () => {
            var _a;
            this.value = undefined;
            (_a = this.selectDate) === null || _a === void 0 ? void 0 : _a.emit(undefined);
        };
        this.onClick = (event) => {
            if (this.disabled) {
                return;
            }
            const target = event.target.closest("[data-date]");
            if (!Boolean(target)) {
                return;
            }
            const date = removeTimezoneOffset(new Date(target.dataset.date));
            this.updateCurrentDate(date);
            this.onSelectDate(date);
        };
        this.onMonthSelect = (event) => {
            const month = +event.target.value - 1;
            const date = new Date(this.currentDate);
            if (!dateIsWithinBounds(date, this.minDate, this.maxDate))
                return;
            date.setMonth(month);
            this.updateCurrentDate(date);
        };
        this.onYearSelect = (event) => {
            var _a;
            const year = +event.target.value;
            const date = new Date(this.currentDate);
            if (!dateIsWithinBounds(date, this.minDate, this.maxDate))
                return;
            date.setFullYear(year);
            (_a = this.changeYear) === null || _a === void 0 ? void 0 : _a.emit({ year });
            this.updateCurrentDate(date);
        };
        this.onKeyDown = (event) => {
            if (this.disabled) {
                return;
            }
            if (event.code === "ArrowLeft") {
                event.preventDefault();
                this.updateCurrentDate(getPreviousDay(this.currentDate), true);
            }
            else if (event.code === "ArrowRight") {
                event.preventDefault();
                this.updateCurrentDate(getNextDay(this.currentDate), true);
            }
            else if (event.code === "ArrowUp") {
                event.preventDefault();
                this.updateCurrentDate(subDays(this.currentDate, 7), true);
            }
            else if (event.code === "ArrowDown") {
                event.preventDefault();
                this.updateCurrentDate(addDays(this.currentDate, 7), true);
            }
            else if (event.code === "PageUp") {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(getPreviousYear(this.currentDate), true);
                }
                else {
                    this.updateCurrentDate(getPreviousMonth(this.currentDate), true);
                }
            }
            else if (event.code === "PageDown") {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(getNextYear(this.currentDate), true);
                }
                else {
                    this.updateCurrentDate(getNextMonth(this.currentDate), true);
                }
            }
            else if (event.code === "Home") {
                event.preventDefault();
                this.updateCurrentDate(getFirstOfMonth(this.currentDate), true);
            }
            else if (event.code === "End") {
                event.preventDefault();
                this.updateCurrentDate(getLastOfMonth(this.currentDate), true);
            }
            else if (event.code === "Space" || event.code === "Enter") {
                event.preventDefault();
                this.onSelectDate(this.currentDate);
            }
        };
        this.onMouseEnter = (event) => {
            var _a;
            if (this.disabled) {
                return;
            }
            const date = removeTimezoneOffset(new Date((_a = event.target.closest("td")) === null || _a === void 0 ? void 0 : _a.dataset.date));
            this.hoveredDate = date;
        };
        this.onMouseLeave = () => {
            this.hoveredDate = undefined;
        };
    }
    componentWillLoad() {
        this.init();
    }
    watchModalIsOpen() {
        if (this.modalIsOpen === true) {
            this.moveFocusOnModalOpen = true;
        }
    }
    watchFirstDayOfWeek() {
        this.updateWeekdays();
    }
    watchLocale() {
        if (!Boolean(this.locale)) {
            this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "en-US";
        }
        this.updateWeekdays();
    }
    watchRange() {
        var _a;
        this.value = undefined;
        (_a = this.selectDate) === null || _a === void 0 ? void 0 : _a.emit(undefined);
    }
    watchStartDate() {
        this.currentDate = this.startDate
            ? removeTimezoneOffset(new Date(this.startDate))
            : new Date();
    }
    watchValue() {
        if (Boolean(this.value)) {
            if (Array.isArray(this.value) && this.value.length >= 1) {
                this.currentDate = this.value[0];
            }
            else if (this.value instanceof Date) {
                this.currentDate = this.value;
            }
        }
    }
    componentDidRender() {
        if (this.moveFocusAfterMonthChanged) {
            this.focusDate(this.currentDate);
            this.moveFocusAfterMonthChanged = false;
        }
        if (this.moveFocusOnModalOpen) {
            // Timeout added to stop VoiceOver from crashing Safari when openin the calendar. TODO: Investigate a neater solution
            setTimeout(() => {
                this.focusDate(this.currentDate);
                this.moveFocusOnModalOpen = false;
            }, 100);
        }
    }
    updateWeekdays() {
        this.weekdays = getWeekDays(this.firstDayOfWeek, this.locale);
    }
    getClassName(element) {
        return Boolean(element)
            ? `${this.elementClassName}__${element}`
            : this.elementClassName;
    }
    getCalendarRows() {
        const daysOfMonth = getDaysOfMonth(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek);
        const calendarRows = [];
        for (let i = 0; i < daysOfMonth.length; i += 7) {
            const row = daysOfMonth.slice(i, i + 7);
            calendarRows.push(row);
        }
        return calendarRows;
    }
    getTitle() {
        if (!Boolean(this.currentDate)) {
            return;
        }
        return Intl.DateTimeFormat(this.locale, {
            month: "long",
            year: "numeric"
        }).format(this.currentDate);
    }
    focusDate(date) {
        var _a;
        date && ((_a = this.el
            .querySelector(`[data-date="${getISODateString(date)}"]`)) === null || _a === void 0 ? void 0 : _a.focus());
    }
    updateCurrentDate(date, moveFocus) {
        var _a, _b;
        const month = date.getMonth();
        const year = date.getFullYear();
        if (!dateIsWithinLowerBounds(date, this.minDate))
            date = new Date(this.minDate);
        if (!dateIsWithinUpperBounds(date, this.maxDate))
            date = new Date(this.maxDate);
        const monthChanged = month !== ((_a = this.currentDate) === null || _a === void 0 ? void 0 : _a.getMonth()) ||
            year !== this.currentDate.getFullYear();
        if (monthChanged) {
            (_b = this.changeMonth) === null || _b === void 0 ? void 0 : _b.emit({ month: getMonth(date), year: getYear(date) });
            if (moveFocus) {
                this.moveFocusAfterMonthChanged = true;
            }
        }
        this.currentDate = date;
        if (moveFocus) {
            this.focusDate(this.currentDate);
        }
    }
    onSelectDate(date) {
        var _a, _b, _c, _d;
        if (this.disableDate(date) ||
            !dateIsWithinBounds(date, this.minDate, this.maxDate)) {
            return;
        }
        if (this.isRangeValue(this.value)) {
            const newValue = ((_a = this.value) === null || _a === void 0 ? void 0 : _a[0]) === undefined || this.value.length === 2
                ? [date]
                : [this.value[0], date];
            if (newValue.length === 2 && newValue[0] > newValue[1]) {
                newValue.reverse();
            }
            const isoValue = newValue[1] === undefined
                ? [getISODateString(newValue[0])]
                : [getISODateString(newValue[0]), getISODateString(newValue[1])];
            this.value = newValue;
            (_b = this.selectDate) === null || _b === void 0 ? void 0 : _b.emit(isoValue);
        }
        else {
            if (((_c = this.value) === null || _c === void 0 ? void 0 : _c.getTime()) === date.getTime()) {
                return;
            }
            this.value = date;
            (_d = this.selectDate) === null || _d === void 0 ? void 0 : _d.emit(getISODateString(date));
        }
    }
    isRangeValue(_value) {
        return !!this.range;
    }
    render() {
        var _a;
        const showFooter = this.showTodayButton || this.showClearButton || this.showKeyboardHint;
        const disabled = {
            year: {
                prev: this.disabled || (!!this.minDate && new Date(this.minDate).getFullYear() > getPreviousYear(this.currentDate).getFullYear()),
                next: this.disabled || (!!this.maxDate && new Date(this.maxDate).getFullYear() < getNextYear(this.currentDate).getFullYear())
            },
            month: {
                prev: this.disabled ||
                    monthIsDisabled(getPreviousMonth(this.currentDate).getMonth(), getPreviousMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate),
                next: this.disabled ||
                    monthIsDisabled(getNextMonth(this.currentDate).getMonth(), getNextMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate)
            }
        };
        return (h(Host, { key: '79018439c3f99dc228ac0d429763d1e86fe9bb03' }, h("div", { key: '8863cf5d0de75a1f358723440f11b70128d7c739', class: {
                [`${this.getClassName()}-wrapper`]: true,
                [`${this.getClassName()}-wrapper--inline`]: this.inline
            } }, h("div", { key: 'b47630e94a50c0bb74da62f1d9e9931ed06e15ab', class: {
                [this.getClassName()]: true,
                [`${this.getClassName()}--disabled`]: this.disabled,
            } }, h("div", { key: '594429a8b241c0024edde2e4adb211935e3579fd', class: this.getClassName("header") }, this.showHiddenTitle && (h("span", { key: '3258ebc3b0a325f0f21af5126fa31c5cb0197ebb', "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle())), this.showYearStepper && (h("button", { key: '0f7d853b969a89b76b5794d9b8c5e03f7ece778b', "aria-label": this.labels.previousYearButton, class: this.getClassName("previous-year-button"), "aria-disabled": disabled.year.prev, innerHTML: this.previousYearButtonContent || undefined, onClick: this.previousYear, type: "button" }, h("svg", { key: '1d4da9d54e875a85e22beae6f608de9ec0495a03', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { key: '0fd84be75c074c61a0d839694e5e1b8e7efa480e', points: "11 17 6 12 11 7" }), h("polyline", { key: '4b1c8d3e29718cabc669d9194af749ffc2cac7aa', points: "18 17 13 12 18 7" })))), this.showMonthStepper && (h("button", { key: '27402a2f431d68487775e4fbe548804755c569cc', "aria-label": this.labels.previousMonthButton, class: this.getClassName("previous-month-button"), "aria-disabled": disabled.month.prev, innerHTML: this.previousMonthButtonContent || undefined, onClick: this.previousMonth, type: "button" }, h("svg", { key: 'b503e9f1d393c1a245da483b25edb14f473aac7d', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { key: '37241e518f64e1a7aba4153d0222649e62671ed4', points: "15 18 9 12 15 6" })))), h("span", { key: '3e87bb8129d4d7b1db718ee87f5164dec158fb1a', class: this.getClassName("current-month") }, h("select", { key: 'ae6c5128f2dc9ec17bd4d4c0090df4a62743b09c', "aria-label": this.labels.monthSelect, class: this.getClassName("month-select"), "aria-disabled": this.disabled, name: "month", onChange: this.onMonthSelect }, getMonths(this.locale).map((month, index) => {
            return (h("option", { key: month, selected: this.currentDate.getMonth() === index, value: index + 1, disabled: monthIsDisabled(index, this.currentDate.getFullYear(), this.minDate, this.maxDate) }, month));
        })), h("input", { key: '733a5e0025571c54fc27616c200bfbf07de436cc', "aria-label": this.labels.yearSelect, class: this.getClassName("year-select"), "aria-disabled": this.disabled, max: this.maxDate ? this.maxDate.slice(0, 4) : 9999, min: this.minDate ? this.minDate.slice(0, 4) : 1, name: "year", onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && (h("button", { key: 'eaa9e5e613835a9108f17991ba4743020cfa3146', "aria-label": this.labels.nextMonthButton, class: this.getClassName("next-month-button"), "aria-disabled": disabled.month.next, innerHTML: this.nextMonthButtonContent || undefined, onClick: this.nextMonth, type: "button" }, h("svg", { key: '5729113b90336e0e8d2ade0a24952d186e12867c', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { key: 'a6cc05a5b83eb6f162654782466a43bd98ada883', points: "9 18 15 12 9 6" })))), this.showYearStepper && (h("button", { key: '6a8556ddc516e5c9a06fd9d71cfa939de48e9bbe', "aria-label": this.labels.nextYearButton, class: this.getClassName("next-year-button"), "aria-disabled": disabled.year.next, innerHTML: this.nextYearButtonContent || undefined, onClick: this.nextYear, type: "button" }, h("svg", { key: '17e51e43e8a378fb73e1d51c8a75bb8e890af433', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { key: 'bdf9cf173de2dc96beaf2bc615aea901899e5907', points: "13 17 18 12 13 7" }), h("polyline", { key: '638e86d7b823782b2331c2569531def9f267dce9', points: "6 17 11 12 6 7" }))))), h("div", { key: '8fbe9e86646e09853205865351f3aa298877c43a', class: this.getClassName("body") }, h("table", { key: 'bf374b391788b26485362a368a10c009b42a9d84', class: this.getClassName("calendar"), onKeyDown: this.onKeyDown, role: "grid", "aria-label": this.getTitle() }, h("thead", { key: '7cb065ee0fa4bd944c79a130b107d59e8e622b89', class: this.getClassName("calendar-header") }, h("tr", { key: '30b196641286a6f9adb3d37167172858a34f2933', class: this.getClassName("weekday-row") }, (_a = this.weekdays) === null || _a === void 0 ? void 0 : _a.map((weekday) => (h("th", { role: "columnheader", abbr: weekday[1], class: this.getClassName("weekday"), key: weekday[0], scope: "col" }, h("span", { "aria-hidden": "true" }, weekday[0]), h("span", { class: "visually-hidden" }, weekday[1])))))), h("tbody", { key: '922edf01c35e7512654d8661348301d275c67647' }, this.getCalendarRows().map((calendarRow) => {
            const rowKey = `row-${calendarRow[0].getMonth()}-${calendarRow[0].getDate()}`;
            return (h("tr", { class: this.getClassName("calendar-row"), key: rowKey }, calendarRow.map((day) => {
                var _a, _b, _c;
                const isCurrent = isSameDay(day, this.currentDate);
                const isOverflowing = day.getMonth() !== ((_a = this.currentDate) === null || _a === void 0 ? void 0 : _a.getMonth());
                const isSelected = Array.isArray(this.value)
                    ? isSameDay(day, this.value[0]) ||
                        (this.value[1] &&
                            dateIsWithinBounds(day, getISODateString(this.value[0]), getISODateString(this.value[1])))
                    : isSameDay(day, this.value);
                const isDisabled = this.disableDate(day) ||
                    !dateIsWithinBounds(day, this.minDate, this.maxDate);
                const isInRange = !this.isRangeValue(this.value)
                    ? false
                    : isDateInRange(day, {
                        from: (_b = this.value) === null || _b === void 0 ? void 0 : _b[0],
                        to: ((_c = this.value) === null || _c === void 0 ? void 0 : _c[1]) ||
                            this.hoveredDate ||
                            this.currentDate
                    }) && !isDisabled;
                const isToday = isSameDay(day, new Date());
                const cellKey = `cell-${day.getMonth()}-${day.getDate()}`;
                const getScreenReaderText = () => {
                    if (this.range) {
                        let suffix = !this.value
                            ? `, ${this.labels.chooseAsStartDate}.`
                            : "";
                        if (Array.isArray(this.value)) {
                            suffix = {
                                1: `, ${this.labels.chooseAsEndDate}.`,
                                2: `, ${this.labels.chooseAsStartDate}.`
                            }[this.value.length];
                        }
                        return `${isSelected ? `${this.labels.selected}, ` : ""}${Intl.DateTimeFormat(this.locale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }).format(day)}${suffix}`;
                    }
                    else {
                        return `${isSelected ? `${this.labels.selected}, ` : ""}${Intl.DateTimeFormat(this.locale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }).format(day)}`;
                    }
                };
                const className = {
                    [this.getClassName("date")]: true,
                    [this.getClassName("date--current")]: isCurrent,
                    [this.getClassName("date--disabled")]: isDisabled,
                    [this.getClassName("date--overflowing")]: isOverflowing,
                    [this.getClassName("date--today")]: isToday,
                    [this.getClassName("date--selected")]: isSelected,
                    [this.getClassName("date--in-range")]: isInRange
                };
                const Tag = isSelected
                    ? "strong"
                    : isToday
                        ? "em"
                        : "span";
                return (h("td", { "aria-disabled": String(isDisabled), "aria-selected": isSelected ? "true" : undefined, class: className, "data-date": getISODateString(day), key: cellKey, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, role: "gridcell", tabIndex: isSameDay(day, this.currentDate) && !this.disabled
                        ? 0
                        : -1 }, h(Tag, { "aria-hidden": "true" }, day.getDate()), h("span", { class: "visually-hidden" }, getScreenReaderText())));
            })));
        })))), showFooter && (h("div", { key: '0a189fdb44b39bddc7a26c7bd3e4a889307fee39', class: this.getClassName("footer") }, h("div", { key: 'fbdf81d3a93afa19cdedba1423d2c64ab4e1fbcb', class: this.getClassName("footer-buttons") }, this.showTodayButton && (h("button", { key: '4faad216c53bda804e8b660d758e30e0bf538940', class: this.getClassName("today-button"), disabled: this.disabled, innerHTML: this.todayButtonContent || undefined, onClick: this.showToday, type: "button" }, this.labels.todayButton)), this.showClearButton && (h("button", { key: '84ad553438da2c701c0ec75328eac36d01b3daa3', class: this.getClassName("clear-button"), disabled: this.disabled, innerHTML: this.clearButtonContent || undefined, onClick: this.clear, type: "button" }, this.labels.clearButton))), this.showKeyboardHint &&
            !window.matchMedia("(pointer: coarse)").matches && (h("button", { key: 'f63c1d1c802173072424a098ab52fffe35df7f56', type: "button", onClick: () => alert("Todo: Add Keyboard helper!"), class: this.getClassName("keyboard-hint") }, h("svg", { key: '790b14010416be81d39a52549a5677116e436a63', xmlns: "http://www.w3.org/2000/svg", height: "1em", width: "1em", viewBox: "0 0 48 48", fill: "currentColor" }, h("path", { key: '83a801f97bf0a2fbd33f728cd00c5dfab75eb213', d: "M7 38q-1.2 0-2.1-.925Q4 36.15 4 35V13q0-1.2.9-2.1.9-.9 2.1-.9h34q1.2 0 2.1.9.9.9.9 2.1v22q0 1.15-.9 2.075Q42.2 38 41 38Zm0-3h34V13H7v22Zm8-3.25h18v-3H15Zm-4.85-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm-24.7-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3ZM7 35V13v22Z" })), this.labels.keyboardHint))))), h("slot", { key: '1b6c88f7c9e4e6fa7109b99ef774af1ee8de24ea', name: "after-calendar" }))));
    }
    static get is() { return "tabworthy-dates-calendar"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "$": ["tabworthy-dates-calendar.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["tabworthy-dates-calendar.css"]
        };
    }
    static get properties() {
        return {
            "clearButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "clear-button-content"
            },
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "modalIsOpen": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "modal-is-open",
                "defaultValue": "false"
            },
            "disableDate": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(date: Date) => boolean",
                    "resolved": "(date: Date) => boolean",
                    "references": {
                        "Date": {
                            "location": "global",
                            "id": "global::Date"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "defaultValue": "() => false"
            },
            "elementClassName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "element-class-name",
                "defaultValue": "\"tabworthy-dates-calendar\""
            },
            "firstDayOfWeek": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "first-day-of-week",
                "defaultValue": "0"
            },
            "range": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "range",
                "defaultValue": "false"
            },
            "labels": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "DatesCalendarLabels",
                    "resolved": "{ clearButton: string; monthSelect: string; nextMonthButton: string; nextYearButton: string; picker: string; previousMonthButton: string; previousYearButton: string; todayButton: string; yearSelect: string; keyboardHint: string; selected: string; chooseAsStartDate: string; chooseAsEndDate: string; }",
                    "references": {
                        "DatesCalendarLabels": {
                            "location": "local",
                            "path": "/Users/damirbogdanov_1/work/tabworthy-components/src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx",
                            "id": "src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx::DatesCalendarLabels"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "defaultValue": "defaultLabels"
            },
            "locale": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "locale",
                "defaultValue": "navigator?.language || \"en-US\""
            },
            "nextMonthButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "next-month-button-content"
            },
            "nextYearButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "next-year-button-content"
            },
            "previousMonthButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "previous-month-button-content"
            },
            "previousYearButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "previous-year-button-content"
            },
            "minDate": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "min-date"
            },
            "maxDate": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "max-date"
            },
            "inline": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "inline",
                "defaultValue": "false"
            },
            "showClearButton": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-clear-button",
                "defaultValue": "false"
            },
            "showMonthStepper": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-month-stepper",
                "defaultValue": "true"
            },
            "showTodayButton": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-today-button",
                "defaultValue": "true"
            },
            "showYearStepper": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-year-stepper",
                "defaultValue": "false"
            },
            "showKeyboardHint": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-keyboard-hint",
                "defaultValue": "false"
            },
            "showHiddenTitle": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "show-hidden-title",
                "defaultValue": "true"
            },
            "startDate": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "start-date",
                "defaultValue": "getISODateString(new Date())"
            },
            "todayButtonContent": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "today-button-content"
            },
            "value": {
                "type": "unknown",
                "mutable": true,
                "complexType": {
                    "original": "Date | Date[] | null",
                    "resolved": "Date | Date[]",
                    "references": {
                        "Date": {
                            "location": "global",
                            "id": "global::Date"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
    static get states() {
        return {
            "currentDate": {},
            "hoveredDate": {},
            "weekdays": {}
        };
    }
    static get events() {
        return [{
                "method": "selectDate",
                "name": "selectDate",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "string | string[] | undefined",
                    "resolved": "string | string[]",
                    "references": {}
                }
            }, {
                "method": "changeMonth",
                "name": "changeMonth",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "MonthChangedEventDetails",
                    "resolved": "MonthChangedEventDetails",
                    "references": {
                        "MonthChangedEventDetails": {
                            "location": "local",
                            "path": "/Users/damirbogdanov_1/work/tabworthy-components/src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx",
                            "id": "src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx::MonthChangedEventDetails"
                        }
                    }
                }
            }, {
                "method": "changeYear",
                "name": "changeYear",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "YearChangedEventDetails",
                    "resolved": "YearChangedEventDetails",
                    "references": {
                        "YearChangedEventDetails": {
                            "location": "local",
                            "path": "/Users/damirbogdanov_1/work/tabworthy-components/src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx",
                            "id": "src/components/tabworthy-dates-calendar/tabworthy-dates-calendar.tsx::YearChangedEventDetails"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "modalIsOpen",
                "methodName": "watchModalIsOpen"
            }, {
                "propName": "firstDayOfWeek",
                "methodName": "watchFirstDayOfWeek"
            }, {
                "propName": "locale",
                "methodName": "watchLocale"
            }, {
                "propName": "range",
                "methodName": "watchRange"
            }, {
                "propName": "startDate",
                "methodName": "watchStartDate"
            }, {
                "propName": "value",
                "methodName": "watchValue"
            }];
    }
}
