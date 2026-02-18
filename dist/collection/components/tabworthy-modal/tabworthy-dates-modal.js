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
        return (h(Host, { key: 'dd44f82a23c471268369362e7f0899d197b6686a', showing: this.showing, ref: (r) => r && (this.el = r) }, !this.inline && this.showing && (h("div", { key: '6c5d845e75737c366defff2434f51ca345a172f3', part: "body", onKeyDown: this.onKeyDown, role: "dialog", tabindex: -1, "aria-hidden": !this.showing, "aria-label": this.label, "aria-modal": this.showing }, h("focus-trap", { key: '56beecf073b790849d2761b3ac135641612744e1' }, h("div", { key: '85aca24946135337732f404ac164553f4374c9ec', part: "content" }, h("slot", { key: 'cb7b7c57ed1012256e3e045f64b40ce8c5d8dd8b' }))))), this.inline && (h("div", { key: '0a6d50757d0c77f1cc781dfe7676a4b3f8e74c22', part: "content" }, h("slot", { key: '17e71b147f00061c3f3f4deb3b66abb465714f8a' })))));
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
