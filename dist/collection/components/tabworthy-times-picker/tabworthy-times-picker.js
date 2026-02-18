import { h, Host } from "@stencil/core";
const defaultLabels = {
    hours: "Hours",
    minutes: "Minutes",
    am: "AM",
    pm: "PM",
    timePicker: "Time picker",
    incrementHours: "Increment hours",
    decrementHours: "Decrement hours",
    incrementMinutes: "Increment minutes",
    decrementMinutes: "Decrement minutes"
};
export class InclusiveTimesPicker {
    constructor() {
        // Current time value (24-hour format)
        this.hours = 12;
        this.minutes = 0;
        this.use12HourFormat = false;
        // Labels for accessibility and i18n
        this.labels = defaultLabels;
        // Hide labels visually but keep them for screen readers
        this.labelsSrOnly = true;
        this.disabled = false;
        this.elementClassName = "tabworthy-times-picker";
        this.internalHours = this.hours;
        this.internalMinutes = this.minutes;
        this.period = this.hours >= 12 ? "PM" : "AM";
        this.handleHourChange = (e) => {
            const value = parseInt(e.target.value, 10);
            if (this.use12HourFormat) {
                // Convert to 24-hour format based on period
                if (this.period === "AM") {
                    this.internalHours = value === 12 ? 0 : value;
                }
                else {
                    this.internalHours = value === 12 ? 12 : value + 12;
                }
            }
            else {
                this.internalHours = value;
            }
            this.emitTimeChange();
        };
        this.handleMinuteChange = (e) => {
            this.internalMinutes = parseInt(e.target.value, 10);
            this.emitTimeChange();
        };
        this.handlePeriodChange = (period) => {
            if (this.period === period || !this.use12HourFormat)
                return;
            this.period = period;
            // Convert hours based on new period
            const displayHours = this.getDisplayHours();
            if (period === "AM") {
                this.internalHours = displayHours === 12 ? 0 : displayHours;
            }
            else {
                this.internalHours = displayHours === 12 ? 12 : displayHours + 12;
            }
            this.emitTimeChange();
        };
        this.handleHourIncrement = () => {
            if (this.use12HourFormat) {
                const displayHours = this.getDisplayHours();
                const newDisplayHours = displayHours === 12 ? 1 : displayHours + 1;
                if (this.period === "AM") {
                    this.internalHours = newDisplayHours === 12 ? 0 : newDisplayHours;
                }
                else {
                    this.internalHours = newDisplayHours === 12 ? 12 : newDisplayHours + 12;
                }
            }
            else {
                this.internalHours = (this.internalHours + 1) % 24;
            }
            this.emitTimeChange();
        };
        this.handleHourDecrement = () => {
            if (this.use12HourFormat) {
                const displayHours = this.getDisplayHours();
                const newDisplayHours = displayHours === 1 ? 12 : displayHours - 1;
                if (this.period === "AM") {
                    this.internalHours = newDisplayHours === 12 ? 0 : newDisplayHours;
                }
                else {
                    this.internalHours = newDisplayHours === 12 ? 12 : newDisplayHours + 12;
                }
            }
            else {
                this.internalHours = this.internalHours === 0 ? 23 : this.internalHours - 1;
            }
            this.emitTimeChange();
        };
        this.handleMinuteIncrement = () => {
            this.internalMinutes = (this.internalMinutes + 1) % 60;
            this.emitTimeChange();
        };
        this.handleMinuteDecrement = () => {
            this.internalMinutes = this.internalMinutes === 0 ? 59 : this.internalMinutes - 1;
            this.emitTimeChange();
        };
    }
    watchHours(newValue) {
        this.internalHours = newValue;
        this.period = newValue >= 12 ? "PM" : "AM";
    }
    watchMinutes(newValue) {
        this.internalMinutes = newValue;
    }
    componentWillLoad() {
        this.internalHours = this.hours;
        this.internalMinutes = this.minutes;
        this.period = this.hours >= 12 ? "PM" : "AM";
    }
    getDisplayHours() {
        if (!this.use12HourFormat) {
            return this.internalHours;
        }
        if (this.internalHours === 0)
            return 12;
        if (this.internalHours > 12)
            return this.internalHours - 12;
        return this.internalHours;
    }
    get24HourValue() {
        if (!this.use12HourFormat) {
            return this.internalHours;
        }
        const displayHours = this.getDisplayHours();
        if (this.period === "AM") {
            return displayHours === 12 ? 0 : displayHours;
        }
        else {
            return displayHours === 12 ? 12 : displayHours + 12;
        }
    }
    emitTimeChange() {
        this.timeChanged.emit({
            hours: this.get24HourValue(),
            minutes: this.internalMinutes,
            period: this.use12HourFormat ? this.period : undefined
        });
    }
    padZero(num) {
        return num.toString().padStart(2, "0");
    }
    render() {
        const displayHours = this.getDisplayHours();
        const maxHours = this.use12HourFormat ? 12 : 23;
        const minHours = this.use12HourFormat ? 1 : 0;
        return (h(Host, { key: '826752ac3b056591e50c55198f01b232e0d914e7', class: this.elementClassName, "aria-label": this.labels.timePicker }, h("div", { key: '5e7179bcf1e2e9087f7fb8f62366af4b3432cf9b', class: `${this.elementClassName}__container` }, h("div", { key: 'f589fc8f0672b1446e0e3b9e3d2d1a134355975c', class: `${this.elementClassName}__field` }, h("label", { key: 'a35e5e1e6e1be6166d2908b200904c4ebf266170', htmlFor: `${this.elementClassName}-hours`, class: {
                [`${this.elementClassName}__label`]: true,
                [`${this.elementClassName}__label--sr-only`]: this.labelsSrOnly
            } }, this.labels.hours), h("div", { key: '7c2340bc7b58f47ccb5cf555460665fe99d2bb14', class: `${this.elementClassName}__control` }, h("button", { key: 'dd0339ee230032b0ae681b19e7ccad362454e70d', type: "button", class: `${this.elementClassName}__button ${this.elementClassName}__button--increment`, onClick: this.handleHourIncrement, disabled: this.disabled, "aria-label": this.labels.incrementHours }, h("svg", { key: 'f976e2e85f45795317a8e6f8b97f56d787075b30', fill: "none", height: "16", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "16" }, h("polyline", { key: 'd92fe17241918aa191b3bf8c1cf67d0783d6904c', points: "18 15 12 9 6 15" }))), h("input", { key: '12c6de6d83c13e437f1ec0f6e6a552c9806eee7e', id: `${this.elementClassName}-hours`, type: "number", class: `${this.elementClassName}__input`, value: this.padZero(displayHours), min: minHours, max: maxHours, onInput: this.handleHourChange, disabled: this.disabled, "aria-label": this.labels.hours }), h("button", { key: '9a3fe68583a1a92c1cb9ce82d8c79d435cc364c6', type: "button", class: `${this.elementClassName}__button ${this.elementClassName}__button--decrement`, onClick: this.handleHourDecrement, disabled: this.disabled, "aria-label": this.labels.decrementHours }, h("svg", { key: 'c52dd2da808714a53da185d830609a83165d0435', fill: "none", height: "16", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "16" }, h("polyline", { key: '759299e487f09e8047643aed7bf5c27687ba0114', points: "6 9 12 15 18 9" }))))), h("div", { key: '9839abd75a1d2fbbfd085b5090586e5b90e43582', class: `${this.elementClassName}__separator` }, ":"), h("div", { key: '40a7656ee0e1fdde1287fad6200b415361e9d8a7', class: `${this.elementClassName}__field` }, h("label", { key: '12924e2ce017f31969cdd17efc61c5bc2c7299e1', htmlFor: `${this.elementClassName}-minutes`, class: {
                [`${this.elementClassName}__label`]: true,
                [`${this.elementClassName}__label--sr-only`]: this.labelsSrOnly
            } }, this.labels.minutes), h("div", { key: '71ce2e345a98345b591e92803ad25fe10ae52ac1', class: `${this.elementClassName}__control` }, h("button", { key: 'ec85968d4d7b43fb348cbc9577f6329bc510b88b', type: "button", class: `${this.elementClassName}__button ${this.elementClassName}__button--increment`, onClick: this.handleMinuteIncrement, disabled: this.disabled, "aria-label": this.labels.incrementMinutes }, h("svg", { key: '459a04638058154613fc642ac6ec3c884b2eb3ed', fill: "none", height: "16", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "16" }, h("polyline", { key: '88747079b0a8cdc6f2d9bea21ec5b74dd334c889', points: "18 15 12 9 6 15" }))), h("input", { key: 'ccd14478435689bad16be5b3038c37fff7e55506', id: `${this.elementClassName}-minutes`, type: "number", class: `${this.elementClassName}__input`, value: this.padZero(this.internalMinutes), min: 0, max: 59, onInput: this.handleMinuteChange, disabled: this.disabled, "aria-label": this.labels.minutes }), h("button", { key: 'b645e0a9c10cf35e9b6ebfe6660f9e4770edabe7', type: "button", class: `${this.elementClassName}__button ${this.elementClassName}__button--decrement`, onClick: this.handleMinuteDecrement, disabled: this.disabled, "aria-label": this.labels.decrementMinutes }, h("svg", { key: 'e1fbeb018b7d3898af319f227d2f3257a281b141', fill: "none", height: "16", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "16" }, h("polyline", { key: '9fa1f35020d93eea906247c0eca79c6978e75c81', points: "6 9 12 15 18 9" }))))), this.use12HourFormat && (h("div", { key: '80f5d6355c5627d98e25a3d945f3224d217d350b', class: `${this.elementClassName}__period` }, h("button", { key: '7fdbfe17b0b1d50a707aeb927847626d2e4b277a', type: "button", class: {
                [`${this.elementClassName}__period-button`]: true,
                [`${this.elementClassName}__period-button--active`]: this.period === "AM"
            }, onClick: () => this.handlePeriodChange("AM"), disabled: this.disabled, "aria-label": this.labels.am, "aria-pressed": this.period === "AM" }, this.labels.am), h("button", { key: '5817fb8c5a5901077320472b9535700d3e980c3c', type: "button", class: {
                [`${this.elementClassName}__period-button`]: true,
                [`${this.elementClassName}__period-button--active`]: this.period === "PM"
            }, onClick: () => this.handlePeriodChange("PM"), disabled: this.disabled, "aria-label": this.labels.pm, "aria-pressed": this.period === "PM" }, this.labels.pm))))));
    }
    static get is() { return "tabworthy-times-picker"; }
    static get encapsulation() { return "scoped"; }
    static get properties() {
        return {
            "hours": {
                "type": "number",
                "mutable": true,
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
                "attribute": "hours",
                "defaultValue": "12"
            },
            "minutes": {
                "type": "number",
                "mutable": true,
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
                "attribute": "minutes",
                "defaultValue": "0"
            },
            "use12HourFormat": {
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
                "attribute": "use-1-2-hour-format",
                "defaultValue": "false"
            },
            "labels": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "InclusivekTimesPickerLabels",
                    "resolved": "InclusivekTimesPickerLabels",
                    "references": {
                        "InclusivekTimesPickerLabels": {
                            "location": "local",
                            "path": "/Users/damirbogdanov_1/work/tabworthy-components/src/components/tabworthy-times-picker/tabworthy-times-picker.tsx",
                            "id": "src/components/tabworthy-times-picker/tabworthy-times-picker.tsx::InclusivekTimesPickerLabels"
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
            "labelsSrOnly": {
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
                "attribute": "labels-sr-only",
                "defaultValue": "true"
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
                "defaultValue": "\"tabworthy-times-picker\""
            }
        };
    }
    static get states() {
        return {
            "internalHours": {},
            "internalMinutes": {},
            "period": {}
        };
    }
    static get events() {
        return [{
                "method": "timeChanged",
                "name": "timeChanged",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "TimeValue",
                    "resolved": "TimeValue",
                    "references": {
                        "TimeValue": {
                            "location": "local",
                            "path": "/Users/damirbogdanov_1/work/tabworthy-components/src/components/tabworthy-times-picker/tabworthy-times-picker.tsx",
                            "id": "src/components/tabworthy-times-picker/tabworthy-times-picker.tsx::TimeValue"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "hours",
                "methodName": "watchHours"
            }, {
                "propName": "minutes",
                "methodName": "watchMinutes"
            }];
    }
}
