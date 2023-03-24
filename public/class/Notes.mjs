import {encode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Resizable} from "./Resizable.mjs";
import {WPPEditor} from "./WPPEditor.mjs";

/**
 * "Notes" window
 */
export class Notes extends Resizable {
    wpp;
    textarea;
    tokens;
    select;
    timerSave;
    durationSave = 300;
    save;

    /**
     * @param options
     *      root (JQuery root element of the message)
     *      save (function to call to initiate data save)
     */
    constructor(options) {
        super({
            root: options.root,
            uid: "notes",
            top: 0.3,
            left: 0.3,
            right: 0.7,
            bottom: 0.7
        });
        this.save = options.save || null;

        for(let i = 0; i < this.container.children.length; i++) {
            const child = this.container.children[i];
            if(!this.textarea && child instanceof HTMLTextAreaElement) {
                this.textarea = child;
            }
            if(!this.select && child instanceof HTMLSelectElement) {
                this.select = child;
            }
            if(!this.wpp && child.classList.contains("wpp-editor")) {
                this.wpp = new WPPEditor({
                    container: child
                });
            }
            if(!this.tokens && child.classList.contains("notes_token_stat")) {
                if(child.children.length) {
                    this.tokens = child.children[0];
                }
            }
        }

        if(this.wpp) {
            this.wpp.display = "none";
            this.wpp.on("change", function() {
                this.updateNotesTokenCount(true);
                if(this.timerSave) {
                    clearTimeout(this.timerSave);
                }
                this.timerSave = setTimeout(() => {
                    this.timerSave = null;
                    if(this.save) {
                        this.save();
                    }
                }, this.durationSave);
            }.bind(this));
        }
        if(this.select) {
            this.select.onchange = function() {
                if(this.select.value === "wpp") {
                    this.updateNotesTokenCount(true);
                    this.textarea.style.display = "none";
                    this.wpp.display = null;
                } else {
                    this.updateNotesTokenCount();
                    this.textarea.style.display = null;
                    this.wpp.display = "none";
                }
            }.bind(this);
            for(let index = 0; index < this.select.children.length; index++) {
                const child = this.select.children[index];
                if(index) {
                    child.removeAttribute("selected");
                } else {
                    child.setAttribute("selected", "selected");
                }
            }
        }

        this.textarea.onkeyup = function() {
            this.updateNotesTokenCount();
            if(this.timerSave) {
                clearTimeout(this.timerSave);
            }
            this.timerSave = setTimeout(() => {
                this.timerSave = null;
                if(this.save) {
                    this.save();
                }
            }, this.durationSave);
        }.bind(this);
        this.textarea.oncut = this.textarea.onkeyup;
        this.textarea.onpaste = this.textarea.onkeyup;

        $(document).on('click', '.option_toggle_notes', this.toggle.bind(this));
    }

    /** Sets w++ contents */
    set wpp(value) {
        if(!this.container) { return; }
        if(!this.wpp) { return; }
        this.wpp.wpp = value;
        this.updateNotesTokenCount();
    }

    /** Returns w++ contents */
    get wppText() {
        if(!this.wpp) { return; }
        return this.wpp.text;
    }
    get wppTextLine() {
        if(!this.wpp) { return; }
        return this.wpp.getText("line");
    }
    /** Sets w++ contents */
    set wppText(value) {
        if(!this.container) { return; }
        if(!this.wpp) { return; }
        this.wpp.clear();
        this.wpp.text = value;
        this.updateNotesTokenCount();
    }

    /** Returns w++ contents */
    get wpp() {
        if(!this.wpp) { return; }
        return this.wpp.wpp;
    }

    /** Sets textarea contents */
    set text(value) {
        if(!this.container) { return; }
        if(!this.textarea) { return; }
        this.textarea.value = value;
        this.updateNotesTokenCount();
    }

    /** Returns textarea contents */
    get text() {
        if(!this.textarea) { return; }
        return this.getText("raw");
    }

    /** Gets value of injection strategy selector (char/wpp/none) */
    get strategy() {
        if(!this.select) { return; }
        return this.select.value;
    }

    /** Returns formatted text
     * @param format raw|singleline (raw includes newlines)
     * */
    getText(format) {
        let raw = (this.textarea.value || "").trim().replace(/\s\s+/g, " ");
        switch(format) {
            case "raw":
                return raw;
            default:    // singleline
                return raw.replace(/\n+/g, " ");
        }
    }

    /** Gets token count for given text */
    getTokenCount(text = "") {
        return encode(JSON.stringify(text)).length;
    }

    /** Updates notes count */
    updateNotesTokenCount(wpp = false) {
        if(!this.container) { return; }
        let text = this.textarea.value
            .trim()
            .replace(/\s\s+/g, " ")
            .replace(/\n/g, " ");
        let value;
        if(wpp) {
            value = (this.wpp ? "Up to " + this.getTokenCount(this.wppText) : 0).toString();
            this.tokens.setAttribute("title", "W++ will be merged with whatever W++ is in character definitions. If there is no new information in notes, there will be zero increase in token count.");
        } else {
            value = (text && text.length ? this.getTokenCount(text) : 0).toString();
            this.tokens.removeAttribute("title");
        }
        this.tokens.innerHTML = value;
    }
}