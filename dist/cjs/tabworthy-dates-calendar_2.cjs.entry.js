'use strict';

var index = require('./index-C15oswCE.js');
var utils = require('./utils-y5Vtky2t.js');

const tabworthyDatesCalendarCss = () => `.visually-hidden.sc-tabworthy-dates-calendar{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%)}`;

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
const InclusiveDatesCalendar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.selectDate = index.createEvent(this, "selectDate");
        this.changeMonth = index.createEvent(this, "changeMonth");
        this.changeYear = index.createEvent(this, "changeYear");
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
        this.startDate = utils.getISODateString(new Date());
        this.init = () => {
            this.currentDate = this.startDate
                ? utils.removeTimezoneOffset(new Date(this.startDate))
                : new Date();
            this.updateWeekdays();
        };
        this.nextMonth = () => {
            this.updateCurrentDate(utils.getNextMonth(this.currentDate));
        };
        this.nextYear = () => {
            this.updateCurrentDate(utils.getNextYear(this.currentDate));
        };
        this.previousMonth = () => {
            this.updateCurrentDate(utils.getPreviousMonth(this.currentDate));
        };
        this.previousYear = () => {
            this.updateCurrentDate(utils.getPreviousYear(this.currentDate));
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
            const date = utils.removeTimezoneOffset(new Date(target.dataset.date));
            this.updateCurrentDate(date);
            this.onSelectDate(date);
        };
        this.onMonthSelect = (event) => {
            const month = +event.target.value - 1;
            const date = new Date(this.currentDate);
            if (!utils.dateIsWithinBounds(date, this.minDate, this.maxDate))
                return;
            date.setMonth(month);
            this.updateCurrentDate(date);
        };
        this.onYearSelect = (event) => {
            var _a;
            const year = +event.target.value;
            const date = new Date(this.currentDate);
            if (!utils.dateIsWithinBounds(date, this.minDate, this.maxDate))
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
                this.updateCurrentDate(utils.getPreviousDay(this.currentDate), true);
            }
            else if (event.code === "ArrowRight") {
                event.preventDefault();
                this.updateCurrentDate(utils.getNextDay(this.currentDate), true);
            }
            else if (event.code === "ArrowUp") {
                event.preventDefault();
                this.updateCurrentDate(utils.subDays(this.currentDate, 7), true);
            }
            else if (event.code === "ArrowDown") {
                event.preventDefault();
                this.updateCurrentDate(utils.addDays(this.currentDate, 7), true);
            }
            else if (event.code === "PageUp") {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(utils.getPreviousYear(this.currentDate), true);
                }
                else {
                    this.updateCurrentDate(utils.getPreviousMonth(this.currentDate), true);
                }
            }
            else if (event.code === "PageDown") {
                event.preventDefault();
                if (event.shiftKey) {
                    this.updateCurrentDate(utils.getNextYear(this.currentDate), true);
                }
                else {
                    this.updateCurrentDate(utils.getNextMonth(this.currentDate), true);
                }
            }
            else if (event.code === "Home") {
                event.preventDefault();
                this.updateCurrentDate(utils.getFirstOfMonth(this.currentDate), true);
            }
            else if (event.code === "End") {
                event.preventDefault();
                this.updateCurrentDate(utils.getLastOfMonth(this.currentDate), true);
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
            const date = utils.removeTimezoneOffset(new Date((_a = event.target.closest("td")) === null || _a === void 0 ? void 0 : _a.dataset.date));
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
            ? utils.removeTimezoneOffset(new Date(this.startDate))
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
        this.weekdays = utils.getWeekDays(this.firstDayOfWeek, this.locale);
    }
    getClassName(element) {
        return Boolean(element)
            ? `${this.elementClassName}__${element}`
            : this.elementClassName;
    }
    getCalendarRows() {
        const daysOfMonth = utils.getDaysOfMonth(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek);
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
            .querySelector(`[data-date="${utils.getISODateString(date)}"]`)) === null || _a === void 0 ? void 0 : _a.focus());
    }
    updateCurrentDate(date, moveFocus) {
        var _a, _b;
        const month = date.getMonth();
        const year = date.getFullYear();
        if (!utils.dateIsWithinLowerBounds(date, this.minDate))
            date = new Date(this.minDate);
        if (!utils.dateIsWithinUpperBounds(date, this.maxDate))
            date = new Date(this.maxDate);
        const monthChanged = month !== ((_a = this.currentDate) === null || _a === void 0 ? void 0 : _a.getMonth()) ||
            year !== this.currentDate.getFullYear();
        if (monthChanged) {
            (_b = this.changeMonth) === null || _b === void 0 ? void 0 : _b.emit({ month: utils.getMonth(date), year: utils.getYear(date) });
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
            !utils.dateIsWithinBounds(date, this.minDate, this.maxDate)) {
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
                ? [utils.getISODateString(newValue[0])]
                : [utils.getISODateString(newValue[0]), utils.getISODateString(newValue[1])];
            this.value = newValue;
            (_b = this.selectDate) === null || _b === void 0 ? void 0 : _b.emit(isoValue);
        }
        else {
            if (((_c = this.value) === null || _c === void 0 ? void 0 : _c.getTime()) === date.getTime()) {
                return;
            }
            this.value = date;
            (_d = this.selectDate) === null || _d === void 0 ? void 0 : _d.emit(utils.getISODateString(date));
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
                prev: this.disabled || (!!this.minDate && new Date(this.minDate).getFullYear() > utils.getPreviousYear(this.currentDate).getFullYear()),
                next: this.disabled || (!!this.maxDate && new Date(this.maxDate).getFullYear() < utils.getNextYear(this.currentDate).getFullYear())
            },
            month: {
                prev: this.disabled ||
                    utils.monthIsDisabled(utils.getPreviousMonth(this.currentDate).getMonth(), utils.getPreviousMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate),
                next: this.disabled ||
                    utils.monthIsDisabled(utils.getNextMonth(this.currentDate).getMonth(), utils.getNextMonth(this.currentDate).getFullYear(), this.minDate, this.maxDate)
            }
        };
        return (index.h(index.Host, { key: '79018439c3f99dc228ac0d429763d1e86fe9bb03' }, index.h("div", { key: '8863cf5d0de75a1f358723440f11b70128d7c739', class: {
                [`${this.getClassName()}-wrapper`]: true,
                [`${this.getClassName()}-wrapper--inline`]: this.inline
            } }, index.h("div", { key: 'b47630e94a50c0bb74da62f1d9e9931ed06e15ab', class: {
                [this.getClassName()]: true,
                [`${this.getClassName()}--disabled`]: this.disabled,
            } }, index.h("div", { key: '594429a8b241c0024edde2e4adb211935e3579fd', class: this.getClassName("header") }, this.showHiddenTitle && (index.h("span", { key: '3258ebc3b0a325f0f21af5126fa31c5cb0197ebb', "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle())), this.showYearStepper && (index.h("button", { key: '0f7d853b969a89b76b5794d9b8c5e03f7ece778b', "aria-label": this.labels.previousYearButton, class: this.getClassName("previous-year-button"), "aria-disabled": disabled.year.prev, innerHTML: this.previousYearButtonContent || undefined, onClick: this.previousYear, type: "button" }, index.h("svg", { key: '1d4da9d54e875a85e22beae6f608de9ec0495a03', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: '0fd84be75c074c61a0d839694e5e1b8e7efa480e', points: "11 17 6 12 11 7" }), index.h("polyline", { key: '4b1c8d3e29718cabc669d9194af749ffc2cac7aa', points: "18 17 13 12 18 7" })))), this.showMonthStepper && (index.h("button", { key: '27402a2f431d68487775e4fbe548804755c569cc', "aria-label": this.labels.previousMonthButton, class: this.getClassName("previous-month-button"), "aria-disabled": disabled.month.prev, innerHTML: this.previousMonthButtonContent || undefined, onClick: this.previousMonth, type: "button" }, index.h("svg", { key: 'b503e9f1d393c1a245da483b25edb14f473aac7d', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: '37241e518f64e1a7aba4153d0222649e62671ed4', points: "15 18 9 12 15 6" })))), index.h("span", { key: '3e87bb8129d4d7b1db718ee87f5164dec158fb1a', class: this.getClassName("current-month") }, index.h("select", { key: 'ae6c5128f2dc9ec17bd4d4c0090df4a62743b09c', "aria-label": this.labels.monthSelect, class: this.getClassName("month-select"), "aria-disabled": this.disabled, name: "month", onChange: this.onMonthSelect }, utils.getMonths(this.locale).map((month, index$1) => {
            return (index.h("option", { key: month, selected: this.currentDate.getMonth() === index$1, value: index$1 + 1, disabled: utils.monthIsDisabled(index$1, this.currentDate.getFullYear(), this.minDate, this.maxDate) }, month));
        })), index.h("input", { key: '733a5e0025571c54fc27616c200bfbf07de436cc', "aria-label": this.labels.yearSelect, class: this.getClassName("year-select"), "aria-disabled": this.disabled, max: this.maxDate ? this.maxDate.slice(0, 4) : 9999, min: this.minDate ? this.minDate.slice(0, 4) : 1, name: "year", onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && (index.h("button", { key: 'eaa9e5e613835a9108f17991ba4743020cfa3146', "aria-label": this.labels.nextMonthButton, class: this.getClassName("next-month-button"), "aria-disabled": disabled.month.next, innerHTML: this.nextMonthButtonContent || undefined, onClick: this.nextMonth, type: "button" }, index.h("svg", { key: '5729113b90336e0e8d2ade0a24952d186e12867c', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: 'a6cc05a5b83eb6f162654782466a43bd98ada883', points: "9 18 15 12 9 6" })))), this.showYearStepper && (index.h("button", { key: '6a8556ddc516e5c9a06fd9d71cfa939de48e9bbe', "aria-label": this.labels.nextYearButton, class: this.getClassName("next-year-button"), "aria-disabled": disabled.year.next, innerHTML: this.nextYearButtonContent || undefined, onClick: this.nextYear, type: "button" }, index.h("svg", { key: '17e51e43e8a378fb73e1d51c8a75bb8e890af433', fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, index.h("polyline", { key: 'bdf9cf173de2dc96beaf2bc615aea901899e5907', points: "13 17 18 12 13 7" }), index.h("polyline", { key: '638e86d7b823782b2331c2569531def9f267dce9', points: "6 17 11 12 6 7" }))))), index.h("div", { key: '8fbe9e86646e09853205865351f3aa298877c43a', class: this.getClassName("body") }, index.h("table", { key: 'bf374b391788b26485362a368a10c009b42a9d84', class: this.getClassName("calendar"), onKeyDown: this.onKeyDown, role: "grid", "aria-label": this.getTitle() }, index.h("thead", { key: '7cb065ee0fa4bd944c79a130b107d59e8e622b89', class: this.getClassName("calendar-header") }, index.h("tr", { key: '30b196641286a6f9adb3d37167172858a34f2933', class: this.getClassName("weekday-row") }, (_a = this.weekdays) === null || _a === void 0 ? void 0 : _a.map((weekday) => (index.h("th", { role: "columnheader", abbr: weekday[1], class: this.getClassName("weekday"), key: weekday[0], scope: "col" }, index.h("span", { "aria-hidden": "true" }, weekday[0]), index.h("span", { class: "visually-hidden" }, weekday[1])))))), index.h("tbody", { key: '922edf01c35e7512654d8661348301d275c67647' }, this.getCalendarRows().map((calendarRow) => {
            const rowKey = `row-${calendarRow[0].getMonth()}-${calendarRow[0].getDate()}`;
            return (index.h("tr", { class: this.getClassName("calendar-row"), key: rowKey }, calendarRow.map((day) => {
                var _a, _b, _c;
                const isCurrent = utils.isSameDay(day, this.currentDate);
                const isOverflowing = day.getMonth() !== ((_a = this.currentDate) === null || _a === void 0 ? void 0 : _a.getMonth());
                const isSelected = Array.isArray(this.value)
                    ? utils.isSameDay(day, this.value[0]) ||
                        (this.value[1] &&
                            utils.dateIsWithinBounds(day, utils.getISODateString(this.value[0]), utils.getISODateString(this.value[1])))
                    : utils.isSameDay(day, this.value);
                const isDisabled = this.disableDate(day) ||
                    !utils.dateIsWithinBounds(day, this.minDate, this.maxDate);
                const isInRange = !this.isRangeValue(this.value)
                    ? false
                    : utils.isDateInRange(day, {
                        from: (_b = this.value) === null || _b === void 0 ? void 0 : _b[0],
                        to: ((_c = this.value) === null || _c === void 0 ? void 0 : _c[1]) ||
                            this.hoveredDate ||
                            this.currentDate
                    }) && !isDisabled;
                const isToday = utils.isSameDay(day, new Date());
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
                return (index.h("td", { "aria-disabled": String(isDisabled), "aria-selected": isSelected ? "true" : undefined, class: className, "data-date": utils.getISODateString(day), key: cellKey, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, role: "gridcell", tabIndex: utils.isSameDay(day, this.currentDate) && !this.disabled
                        ? 0
                        : -1 }, index.h(Tag, { "aria-hidden": "true" }, day.getDate()), index.h("span", { class: "visually-hidden" }, getScreenReaderText())));
            })));
        })))), showFooter && (index.h("div", { key: '0a189fdb44b39bddc7a26c7bd3e4a889307fee39', class: this.getClassName("footer") }, index.h("div", { key: 'fbdf81d3a93afa19cdedba1423d2c64ab4e1fbcb', class: this.getClassName("footer-buttons") }, this.showTodayButton && (index.h("button", { key: '4faad216c53bda804e8b660d758e30e0bf538940', class: this.getClassName("today-button"), disabled: this.disabled, innerHTML: this.todayButtonContent || undefined, onClick: this.showToday, type: "button" }, this.labels.todayButton)), this.showClearButton && (index.h("button", { key: '84ad553438da2c701c0ec75328eac36d01b3daa3', class: this.getClassName("clear-button"), disabled: this.disabled, innerHTML: this.clearButtonContent || undefined, onClick: this.clear, type: "button" }, this.labels.clearButton))), this.showKeyboardHint &&
            !window.matchMedia("(pointer: coarse)").matches && (index.h("button", { key: 'f63c1d1c802173072424a098ab52fffe35df7f56', type: "button", onClick: () => alert("Todo: Add Keyboard helper!"), class: this.getClassName("keyboard-hint") }, index.h("svg", { key: '790b14010416be81d39a52549a5677116e436a63', xmlns: "http://www.w3.org/2000/svg", height: "1em", width: "1em", viewBox: "0 0 48 48", fill: "currentColor" }, index.h("path", { key: '83a801f97bf0a2fbd33f728cd00c5dfab75eb213', d: "M7 38q-1.2 0-2.1-.925Q4 36.15 4 35V13q0-1.2.9-2.1.9-.9 2.1-.9h34q1.2 0 2.1.9.9.9.9 2.1v22q0 1.15-.9 2.075Q42.2 38 41 38Zm0-3h34V13H7v22Zm8-3.25h18v-3H15Zm-4.85-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm-24.7-6.25h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3Zm6.2 0h3v-3h-3Zm6.15 0h3v-3h-3ZM7 35V13v22Z" })), this.labels.keyboardHint))))), index.h("slot", { key: '1b6c88f7c9e4e6fa7109b99ef774af1ee8de24ea', name: "after-calendar" }))));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "modalIsOpen": [{
                "watchModalIsOpen": 0
            }],
        "firstDayOfWeek": [{
                "watchFirstDayOfWeek": 0
            }],
        "locale": [{
                "watchLocale": 0
            }],
        "range": [{
                "watchRange": 0
            }],
        "startDate": [{
                "watchStartDate": 0
            }],
        "value": [{
                "watchValue": 0
            }]
    }; }
};
InclusiveDatesCalendar.style = tabworthyDatesCalendarCss();

/**
 * Traverses the slots of the open shadowroots and returns all children matching the query.
 * @param {ShadowRoot | HTMLElement} root
 * @param skipNode
 * @param isMatch
 * @param {number} maxDepth
 * @param {number} depth
 * @returns {HTMLElement[]}
 */
function queryShadowRoot(root, skipNode, isMatch, maxDepth = 20, depth = 0) {
    let matches = [];
    // If the depth is above the max depth, abort the searching here.
    if (depth >= maxDepth) {
        return matches;
    }
    // Traverses a slot element
    const traverseSlot = ($slot) => {
        // Only check nodes that are of the type Node.ELEMENT_NODE
        // Read more here https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        const assignedNodes = $slot.assignedNodes().filter(node => node.nodeType === 1);
        if (assignedNodes.length > 0) {
            return queryShadowRoot(assignedNodes[0].parentElement, skipNode, isMatch, maxDepth, depth + 1);
        }
        return [];
    };
    // Go through each child and continue the traversing if necessary
    // Even though the typing says that children can't be undefined, Edge 15 sometimes gives an undefined value.
    // Therefore we fallback to an empty array if it is undefined.
    const children = Array.from(root.children || []);
    for (const $child of children) {
        // Check if the node and its descendants should be skipped
        if (skipNode($child)) {
            continue;
        }
        // If the child matches we always add it
        if (isMatch($child)) {
            matches.push($child);
        }
        if ($child.shadowRoot != null) {
            matches.push(...queryShadowRoot($child.shadowRoot, skipNode, isMatch, maxDepth, depth + 1));
        }
        else if ($child.tagName === "SLOT") {
            matches.push(...traverseSlot($child));
        }
        else {
            matches.push(...queryShadowRoot($child, skipNode, isMatch, maxDepth, depth + 1));
        }
    }
    return matches;
}

/**
 * Returns whether the element is hidden.
 * @param $elem
 */
function isHidden($elem) {
    return $elem.hasAttribute("hidden")
        || ($elem.hasAttribute("aria-hidden") && $elem.getAttribute("aria-hidden") !== "false")
        // A quick and dirty way to check whether the element is hidden.
        // For a more fine-grained check we could use "window.getComputedStyle" but we don't because of bad performance.
        // If the element has visibility set to "hidden" or "collapse", display set to "none" or opacity set to "0" through CSS
        // we won't be able to catch it here. We accept it due to the huge performance benefits.
        || $elem.style.display === `none`
        || $elem.style.opacity === `0`
        || $elem.style.visibility === `hidden`
        || $elem.style.visibility === `collapse`;
    // If offsetParent is null we can assume that the element is hidden
    // https://stackoverflow.com/questions/306305/what-would-make-offsetparent-null
    //|| $elem.offsetParent == null;
}
/**
 * Returns whether the element is disabled.
 * @param $elem
 */
function isDisabled($elem) {
    return $elem.hasAttribute("disabled")
        || ($elem.hasAttribute("aria-disabled") && $elem.getAttribute("aria-disabled") !== "false");
}
/**
 * Determines whether an element is focusable.
 * Read more here: https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus/1600194#1600194
 * Or here: https://stackoverflow.com/questions/18261595/how-to-check-if-a-dom-element-is-focusable
 * @param $elem
 */
function isFocusable($elem) {
    // Discard elements that are removed from the tab order.
    if ($elem.getAttribute("tabindex") === "-1" || isHidden($elem) || isDisabled($elem)) {
        return false;
    }
    return (
    // At this point we know that the element can have focus (eg. won't be -1) if the tabindex attribute exists
    $elem.hasAttribute("tabindex")
        // Anchor tags or area tags with a href set
        || ($elem instanceof HTMLAnchorElement || $elem instanceof HTMLAreaElement) && $elem.hasAttribute("href")
        // Form elements which are not disabled
        || ($elem instanceof HTMLButtonElement
            || $elem instanceof HTMLInputElement
            || $elem instanceof HTMLTextAreaElement
            || $elem instanceof HTMLSelectElement)
        // IFrames
        || $elem instanceof HTMLIFrameElement);
}

const timeouts = new Map();
/**
 * Debounces a callback.
 * @param cb
 * @param ms
 * @param id
 */
function debounce(cb, ms, id) {
    // Clear current timeout for id
    const timeout = timeouts.get(id);
    if (timeout != null) {
        window.clearTimeout(timeout);
    }
    // Set new timeout
    timeouts.set(id, window.setTimeout(() => {
        cb();
        timeouts.delete(id);
    }, ms));
}

/**
 * Template for the focus trap.
 */
const template = document.createElement("template");
template.innerHTML = `
	<div id="start"></div>
	<div id="backup"></div>
	<slot></slot>
	<div id="end"></div>
`;
/**
 * Focus trap web component.
 * @customElement focus-trap
 * @slot - Default content.
 */
class FocusTrap extends HTMLElement {
    /**
     * Attaches the shadow root.
     */
    constructor() {
        super();
        // The debounce id is used to distinguish this focus trap from others when debouncing
        this.debounceId = Math.random().toString();
        this._focused = false;
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
        this.$backup = shadow.querySelector("#backup");
        this.$start = shadow.querySelector("#start");
        this.$end = shadow.querySelector("#end");
        this.focusLastElement = this.focusLastElement.bind(this);
        this.focusFirstElement = this.focusFirstElement.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
    }
    // Whenever one of these attributes changes we need to render the template again.
    static get observedAttributes() {
        return [
            "inactive"
        ];
    }
    /**
     * Determines whether the focus trap is active or not.
     * @attr
     */
    get inactive() {
        return this.hasAttribute("inactive");
    }
    set inactive(value) {
        value ? this.setAttribute("inactive", "") : this.removeAttribute("inactive");
    }
    /**
     * Returns whether the element currently has focus.
     */
    get focused() {
        return this._focused;
    }
    /**
     * Hooks up the element.
     */
    connectedCallback() {
        this.$start.addEventListener("focus", this.focusLastElement);
        this.$end.addEventListener("focus", this.focusFirstElement);
        // Focus out is called every time the user tabs around inside the element
        this.addEventListener("focusin", this.onFocusIn);
        this.addEventListener("focusout", this.onFocusOut);
        this.render();
    }
    /**
     * Tears down the element.
     */
    disconnectedCallback() {
        this.$start.removeEventListener("focus", this.focusLastElement);
        this.$end.removeEventListener("focus", this.focusFirstElement);
        this.removeEventListener("focusin", this.onFocusIn);
        this.removeEventListener("focusout", this.onFocusOut);
    }
    /**
     * When the attributes changes we need to re-render the template.
     */
    attributeChangedCallback() {
        this.render();
    }
    /**
     * Focuses the first focusable element in the focus trap.
     */
    focusFirstElement() {
        this.trapFocus();
    }
    /**
     * Focuses the last focusable element in the focus trap.
     */
    focusLastElement() {
        this.trapFocus(true);
    }
    /**
     * Returns a list of the focusable children found within the element.
     */
    getFocusableElements() {
        return queryShadowRoot(this, isHidden, isFocusable);
    }
    /**
     * Focuses on either the last or first focusable element.
     * @param {boolean} trapToEnd
     */
    trapFocus(trapToEnd) {
        if (this.inactive)
            return;
        let focusableChildren = this.getFocusableElements();
        if (focusableChildren.length > 0) {
            if (trapToEnd) {
                focusableChildren[focusableChildren.length - 1].focus();
            }
            else {
                focusableChildren[0].focus();
            }
            this.$backup.setAttribute("tabindex", "-1");
        }
        else {
            // If there are no focusable children we need to focus on the backup
            // to trap the focus. This is a useful behavior if the focus trap is
            // for example used in a dialog and we don't want the user to tab
            // outside the dialog even though there are no focusable children
            // in the dialog.
            this.$backup.setAttribute("tabindex", "0");
            this.$backup.focus();
        }
    }
    /**
     * When the element gains focus this function is called.
     */
    onFocusIn() {
        this.updateFocused(true);
    }
    /**
     * When the element looses its focus this function is called.
     */
    onFocusOut() {
        this.updateFocused(false);
    }
    /**
     * Updates the focused property and updates the view.
     * The update is debounced because the focusin and focusout out
     * might fire multiple times in a row. We only want to render
     * the element once, therefore waiting until the focus is "stable".
     * @param value
     */
    updateFocused(value) {
        debounce(() => {
            if (this.focused !== value) {
                this._focused = value;
                this.render();
            }
        }, 0, this.debounceId);
    }
    /**
     * Updates the template.
     */
    render() {
        this.$start.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
        this.$end.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
        this.focused ? this.setAttribute("focused", "") : this.removeAttribute("focused");
    }
}
window.customElements.define("focus-trap", FocusTrap);

var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function (parent, targets) {
    return targets.map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    }).filter(function (x) { return Boolean(x); });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */
var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                var attr = node.getAttribute(controlAttribute);
                var alreadyHidden = attr !== null && attr !== 'false';
                var counterValue = (counterMap.get(node) || 0) + 1;
                var markerValue = (markerCounter.get(node) || 0) + 1;
                counterMap.set(node, counterValue);
                markerCounter.set(node, markerValue);
                hiddenNodes.push(node);
                if (counterValue === 1 && alreadyHidden) {
                    uncontrolledNodes.set(node, true);
                }
                if (markerValue === 1) {
                    node.setAttribute(markerName, 'true');
                }
                if (!alreadyHidden) {
                    node.setAttribute(controlAttribute, 'true');
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-aria-hidden'; }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    // we should not hide ariaLive elements - https://github.com/theKashey/aria-hidden/issues/10
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live]')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};

const tabworthyDatesModalCss = () => `:host::part(body){position:absolute;width:-moz-fit-content;width:fit-content;z-index:1200;margin-top:0.5rem}:host::part(backdrop){}:host::part(content){}`;

const InclusiveDatesModal = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.opened = index.createEvent(this, "opened");
        this.closed = index.createEvent(this, "closed");
        this.inline = false;
        this.closing = false;
        this.showing = this.inline || false;
        this.onKeyDown = (event) => {
            if (event.code === "Escape") {
                this.close();
            }
        };
    }
    /**
     * Open the dialog.
     */
    async open() {
        if (this.inline)
            return;
        this.showing = true;
        this.undo = hideOthers(this.el);
        this.opened.emit(undefined);
    }
    /**
     * Close the dialog.
     */
    async close() {
        if (this.inline)
            return;
        this.showing = false;
        this.closed.emit(undefined);
        this.undo();
        if (this.triggerElement)
            this.triggerElement.focus();
    }
    async getState() {
        return this.showing;
    }
    async setTriggerElement(element) {
        this.triggerElement = element;
    }
    handleClick(event) {
        if (this.showing && !this.el.contains(event.target)) {
            this.close();
        }
    }
    render() {
        return (index.h(index.Host, { key: 'dd44f82a23c471268369362e7f0899d197b6686a', showing: this.showing, ref: (r) => r && (this.el = r) }, !this.inline && this.showing && (index.h("div", { key: '6c5d845e75737c366defff2434f51ca345a172f3', part: "body", onKeyDown: this.onKeyDown, role: "dialog", tabindex: -1, "aria-hidden": !this.showing, "aria-label": this.label, "aria-modal": this.showing }, index.h("focus-trap", { key: '56beecf073b790849d2761b3ac135641612744e1' }, index.h("div", { key: '85aca24946135337732f404ac164553f4374c9ec', part: "content" }, index.h("slot", { key: 'cb7b7c57ed1012256e3e045f64b40ce8c5d8dd8b' }))))), this.inline && (index.h("div", { key: '0a6d50757d0c77f1cc781dfe7676a4b3f8e74c22', part: "content" }, index.h("slot", { key: '17e71b147f00061c3f3f4deb3b66abb465714f8a' })))));
    }
};
InclusiveDatesModal.style = tabworthyDatesModalCss();

exports.tabworthy_dates_calendar = InclusiveDatesCalendar;
exports.tabworthy_dates_modal = InclusiveDatesModal;
