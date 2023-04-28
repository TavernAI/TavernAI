import {encode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Resizable} from "./Resizable.mjs";
import {WPPEditor} from "./WPPEditor.mjs";
import {WPP} from "./WPP.mjs";

/**
 * "Notes" window
 */
export class Notes extends Resizable {
    _wpp;
    appendix;
    textarea;
    tokens;
    select;
    timerSave;
    durationSave = 300;
    saveFunction;

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
        this.saveFunction = options.save || null;

        this.tokens = this.findChildWithClass("notes_token_stat", this.header).children[0];
        let chb = this.findChildWithClass("wpp-checkbox", this.header)
        chb.checked = false;
        chb.onchange = function(event) {
            if(event.target.checked) {
                this.textarea.style.display = "none";
                this._wpp.container.style.display = null;
            } else {
                this.textarea.style.display = null;
                this._wpp.container.style.display = "none";
            }
        }.bind(this);
        this.textarea = this.findChildWithType("textarea", this.content);
        this._wpp = new WPPEditor({
            container: this.findChildWithClass("wpp-editor", this.content)
        });
        this.select = this.findChildWithClass("notes_strategy", this.footer);

        //
        if(this.select) {
            this.select.onchange = function() {
                if(this.select.value === "wpp") {
                    this.textarea.style.display = "none";
                    this._wpp.display = null;
                } else {
                    this.textarea.style.display = null;
                    this._wpp.display = "none";
                }
                this.updateNotesTokenCount();
                if(this.saveFunction) {
                    this.saveFunction();
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
        if(this._wpp) {
            this._wpp.display = "none";
            this._wpp.on("change", function() {
                this.updateNotesTokenCount();
                this.save();
                let text = this._wpp.getText();
                this.textarea.value = text + (this.appendix ? this.appendix : "");
            }.bind(this));
        }

        this.textarea.onkeyup = function() {
            this.updateNotesTokenCount();
            this.save();
            let parsed = WPP.parseExtended(this.textarea.value);
            this.appendix = parsed.appendix || null;
            this._wpp.clear();
            this.wpp = parsed.wpp;
        }.bind(this);
        this.textarea.oncut = this.textarea.onkeyup;
        this.textarea.onpaste = this.textarea.onkeyup;

        $(document).on('click', '.option_toggle_notes', this.toggle.bind(this));
    }

    /** w++ contents */
    set wpp(value) {
        if(!this.container) { return; }
        if(!this._wpp) { return; }
        this._wpp.wpp = value;
        this.updateNotesTokenCount();
    }
    
    get wpp() {
        if(!this.container) { return; }
        if(!this._wpp) { return; }
        return this._wpp.wpp;
    }

    /** W++Extended contents */
    set wppx(wppx) {
        if(!wppx.wpp) { return; }
        this.appendix = wppx.appendix && wppx.appendix.length ? wppx.appendix : null;
        this.wpp = wppx.wpp;
    }

    get wppx() {
        return {
            wpp: this.wpp,
            appendix: this.appendix && this.appendix.length ? this.appendix : null
        }
    }

    /** Sets textarea contents */
    set text(value) {
        if(!this.container) { return; }
        if(!this.textarea) { return; }
        this.textarea.value = value.replace(/\r/g, "");
        this._wpp.clear();
        try {
            let parsed = WPP.parseExtended(this.textarea.value);
            this._wpp.wpp = parsed.wpp;
            this.appendix = parsed.appendix;
        } catch (e) {
            this.appendix = this.textarea.value;
        }
        this.updateNotesTokenCount();
    }

    /** Returns textarea contents */
    get text() {
        if(!this.textarea) { return; }
        return this.textarea.value;
    }

    /** Startegy select */
    set strategy(value) {
        if(!this.select) { return; }
        for(let i = 0; i < this.select.children.length; i++) {
            const v = this.select.children[i];
            if(v.value === value) {
                v.setAttribute("selected", "selected");
            } else {
                v.removeAttribute("selected");
            }
        }
    }
    get strategy() {
        if(!this.select) { return; }
        return this.select.value;
    }

    save() {
        if(!this.saveFunction) { return; }
        if(this.timerSave) {
            clearTimeout(this.timerSave);
        }
        this.timerSave = setTimeout(() => {
            this.timerSave = null;
            if(this.saveFunction) {
                this.saveFunction();
            }
        }, this.durationSave);
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
    updateNotesTokenCount() {
        if(!this.container) { return; }
        let text = this.textarea.value
            .trim()
            .replace(/\s\s+/g, " ")
            .replace(/\n/g, " ");

        this.tokens.innerHTML = (text && text.length ? this.getTokenCount(text) : 0).toString();
    }
    
}