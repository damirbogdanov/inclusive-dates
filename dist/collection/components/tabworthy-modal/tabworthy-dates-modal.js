import { h, Host } from "@stencil/core";
import "@a11y/focus-trap";
import { hideOthers } from "aria-hidden";
/**
 * @slot slot - The dialog content
 */
export class InclusiveDatesModal {
    constructor() {
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
        return (h(Host, { key: '773d9edf7cf6598394c1210a1fab91af0bcb951e', showing: this.showing, ref: (r) => r && (this.el = r) }, !this.inline && this.showing && (h("div", { key: 'c456932007f7ea9a9c3727d9d08fd8fbea5b8670', part: "body", onKeyDown: this.onKeyDown, role: "dialog", tabindex: -1, "aria-hidden": !this.showing, "aria-label": this.label, "aria-modal": this.showing }, h("focus-trap", { key: 'c1355fe48117067d62ede321afd1f90bf9bf4c22' }, h("div", { key: 'fbd3ec5e0e7069574f1dbd6c38b40e409b837045', part: "content" }, h("slot", { key: 'bad04015cc3945efbb68a52de623ee1f4b584868' }))))), this.inline && (h("div", { key: 'b0577b12dd1bec091de967ccd0ac297451576ad8', part: "content" }, h("slot", { key: '5457a9bd5d08feac90adb2ee061d60fb5fb94657' })))));
    }
    static get is() { return "tabworthy-dates-modal"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["tabworthy-dates-modal.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["tabworthy-dates-modal.css"]
        };
    }
    static get properties() {
        return {
            "label": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": true,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label"
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
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "inline",
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "closing": {},
            "showing": {}
        };
    }
    static get events() {
        return [{
                "method": "opened",
                "name": "opened",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                }
            }, {
                "method": "closed",
                "name": "closed",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "any",
                    "resolved": "any",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "open": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Open the dialog.",
                    "tags": []
                }
            },
            "close": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Close the dialog.",
                    "tags": []
                }
            },
            "getState": {
                "complexType": {
                    "signature": "() => Promise<boolean>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<boolean>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            },
            "setTriggerElement": {
                "complexType": {
                    "signature": "(element: HTMLElement) => Promise<void>",
                    "parameters": [{
                            "name": "element",
                            "type": "HTMLElement",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "HTMLElement": {
                            "location": "global",
                            "id": "global::HTMLElement"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
    static get listeners() {
        return [{
                "name": "click",
                "method": "handleClick",
                "target": "window",
                "capture": true,
                "passive": false
            }];
    }
}
