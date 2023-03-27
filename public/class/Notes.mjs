import { encode } from "../scripts/gpt-2-3-tokenizer/mod.js";
import { Resizable } from "./Resizable.mjs";
import { WPPEditor } from "./WPPEditor.mjs";
import { WPP } from "./WPP.mjs";

/**
 * "Notes" window
 */
export class Notes extends Resizable {
    /** @type {WPPEditor} */ _wpp;
    /** @type {string | null | undefined} */ appendix;
    /** @type {HTMLTextAreaElement} */ textarea;
    /** @type {HTMLElement} */ tokens;
    /** @type {HTMLSelectElement} */ select;
    timerSave;
    durationSave = 300;
    /** @type {() => void} */ saveFunction;

    /**
     * @param {object} options
     * @param {HTMLDivElement} options.root
     * @param {() => void} options.save
     */
    constructor(options) {
        super({
            root: options.root,
            uid: "notes",
            top: 0.3,
            left: 0.3,
            right: 0.7,
            bottom: 0.7,
        });
        this.saveFunction = options.save || null;

        for (let i = 0; i < this.container.children.length; i++) {
            const child = /** @type {HTMLElement} */ (
                this.container.children[i]
            );
            if (!this.textarea && child instanceof HTMLTextAreaElement) {
                this.textarea = child;
            }
            if (!this.select && child instanceof HTMLSelectElement) {
                this.select = child;
            }
            if (
                !this._wpp &&
                child instanceof HTMLDivElement &&
                child.classList.contains("wpp-editor")
            ) {
                this._wpp = new WPPEditor({
                    container: child,
                });
            }
            if (!this.tokens && child.classList.contains("notes_token_stat")) {
                if (child.children.length) {
                    this.tokens = /** @type {HTMLElement} */ (
                        child.children[0]
                    );
                }
            }
            if (
                child instanceof HTMLInputElement &&
                child.classList.contains("wpp-checkbox")
            ) {
                child.checked = false;
                child.onchange = function (event) {
                    if (event.target.checked) {
                        this.textarea.style.display = "none";
                        this._wpp.container.style.display = null;
                    } else {
                        this.textarea.style.display = null;
                        this._wpp.container.style.display = "none";
                    }
                }.bind(this);
            }
        }

        //
        if (this.select) {
            this.select.onchange = function () {
                if (this.select.value === "wpp") {
                    this.textarea.style.display = "none";
                    this._wpp.display = null;
                } else {
                    this.textarea.style.display = null;
                    this._wpp.display = "none";
                }
                this.updateNotesTokenCount();
                if (this.saveFunction) {
                    this.saveFunction();
                }
            }.bind(this);
            for (let index = 0; index < this.select.children.length; index++) {
                const child = this.select.children[index];
                if (index) {
                    child.removeAttribute("selected");
                } else {
                    child.setAttribute("selected", "selected");
                }
            }
        }
        if (this._wpp) {
            this._wpp.display = "none";
            this._wpp.on(
                "change",
                function () {
                    this.updateNotesTokenCount();
                    this.save();
                    let text = this._wpp.getText();
                    this.textarea.value =
                        text + (this.appendix ? this.appendix : "");
                }.bind(this)
            );
        }

        this.textarea.onkeyup = () => {
            this.updateNotesTokenCount();
            this.save();
            let parsed = WPP.parseExtended(this.textarea.value);
            this.appendix = parsed.appendix || null;
            this._wpp.clear();
            this.wpp = parsed.wpp;
        };
        this.textarea.oncut = (ev) =>
            this.textarea.onkeyup?.(/** @type {any} */ (ev));
        this.textarea.onpaste = (ev) =>
            this.textarea.onkeyup?.(/** @type {any} */ (ev));

        $(document).on("click", ".option_toggle_notes", this.toggle.bind(this));
    }

    /**
     * w++ contents
     * @param {import("../../types/WPlusPlusArray.js").default | undefined} value
     */
    set wpp(value) {
        if (!this.container) {
            return;
        }
        if (!this._wpp) {
            return;
        }
        this._wpp.wpp = value ?? [];
        this.updateNotesTokenCount();
    }

    /**
     * @returns {import("../../types/WPlusPlusArray.js").default | undefined}
     */
    get wpp() {
        if (!this.container) {
            return;
        }
        if (!this._wpp) {
            return;
        }
        return this._wpp.wpp;
    }

    /** W++Extended contents */
    set wppx(wppx) {
        if (!wppx.wpp) {
            return;
        }
        this.appendix =
            wppx.appendix && wppx.appendix.length ? wppx.appendix : null;
        this.wpp = wppx.wpp;
    }

    get wppx() {
        return {
            wpp: this.wpp,
            appendix:
                this.appendix && this.appendix.length ? this.appendix : null,
        };
    }

    /**
     * Sets textarea contents
     * @param {string} value
     * @returns {void}
     */
    set text(value) {
        if (!this.container) {
            return;
        }
        if (!this.textarea) {
            return;
        }
        this.textarea.value = value.replace(/\r/g, "");
        this._wpp.clear();
        let parsed = WPP.parseExtended(this.textarea.value);
        this._wpp.wpp = parsed.wpp;
        this.appendix = parsed.appendix;
        this.updateNotesTokenCount();
    }

    /**
     * Returns textarea contents
     * @returns {string}
     */
    get text() {
        if (!this.textarea) {
            return "";
        }
        return this.textarea.value;
    }

    /**
     * Startegy select
     * @param {string} value
     * @returns {void}
     */
    set strategy(value) {
        if (!this.select) {
            return;
        }
        for (let i = 0; i < this.select.children.length; i++) {
            const v = /** @type {HTMLOptionElement} */ (
                this.select.children[i]
            );
            if (v.value === value) {
                v.setAttribute("selected", "selected");
            } else {
                v.removeAttribute("selected");
            }
        }
    }

    /**
     * @returns {string}
     */
    get strategy() {
        if (!this.select) {
            return "";
        }
        return this.select.value;
    }

    /**
     * @returns {void}
     */
    save() {
        if (!this.saveFunction) {
            return;
        }
        if (this.timerSave) {
            clearTimeout(this.timerSave);
        }
        this.timerSave = setTimeout(() => {
            this.timerSave = null;
            if (this.saveFunction) {
                this.saveFunction();
            }
        }, this.durationSave);
    }

    /**
     * Returns formatted text
     * @param {"raw" | "singleline"} format (raw includes newlines)
     * @returns {string}
     */
    getText(format) {
        let raw = (this.textarea.value || "").trim().replace(/\s\s+/g, " ");
        switch (format) {
            case "raw":
                return raw;
            default: // singleline
                return raw.replace(/\n+/g, " ");
        }
    }

    /**
     * Gets token count for given text
     * @param {string} text
     * @returns {number}
     */
    getTokenCount(text = "") {
        return encode(JSON.stringify(text)).length;
    }

    /**
     * Updates notes count
     * @returns {void}
     */
    updateNotesTokenCount() {
        if (!this.container) {
            return;
        }
        let text = this.textarea.value
            .trim()
            .replace(/\s\s+/g, " ")
            .replace(/\n/g, " ");

        this.tokens.innerHTML = (
            text && text.length ? this.getTokenCount(text) : 0
        ).toString();
    }
}
