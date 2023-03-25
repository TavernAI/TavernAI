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
    save;
    strategy = "chat";

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
            if(!this._wpp && child.classList.contains("wpp-editor")) {
                this._wpp = new WPPEditor({
                    container: child
                });
            }
            if(!this.tokens && child.classList.contains("notes_token_stat")) {
                if(child.children.length) {
                    this.tokens = child.children[0];
                }
            }
            if(child.classList.contains("wpp-checkbox")) {
                child.checked = false;
                child.onchange = function(event) {
                    if(event.target.checked) {
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
        if(this.select) {
            this.select.onchange = function() {
                if(this.select.value === "wpp") {
                    this.updateNotesTokenCount(true);
                    this.textarea.style.display = "none";
                    this._wpp.display = null;
                } else {
                    this.updateNotesTokenCount();
                    this.textarea.style.display = null;
                    this._wpp.display = "none";
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
                if(this.timerSave) {
                    clearTimeout(this.timerSave);
                }
                this.timerSave = setTimeout(() => {
                    this.timerSave = null;
                    if(this.save) {
                        this.save();
                    }
                }, this.durationSave);
                let text = this._wpp.getText();
                this.textarea.value = text + (this.appendix ? this.appendix : "");
            }.bind(this));
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
            let parsed = WPP.parseExtended(this.textarea.value);
            this.appendix = parsed.appendix || null;
            this._wpp.clear();
            this.wpp = parsed.wpp;
        }.bind(this);
        this.textarea.oncut = this.textarea.onkeyup;
        this.textarea.onpaste = this.textarea.onkeyup;

        $(document).on('click', '.option_toggle_notes', this.toggle.bind(this));
    }

    /** Sets w++ contents */
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

    /** Sets textarea contents */
    set text(value) {
        if(!this.container) { return; }
        if(!this.textarea) { return; }
        this.textarea.value = value.replace(/\r/g, "");
        this._wpp.clear();
        let parsed = WPP.parseExtended(this.textarea.value);
        this._wpp.wpp = parsed.wpp;
        this.appendix = parsed.appendix;
        this.updateNotesTokenCount();
    }

    /** Returns textarea contents */
    get text() {
        if(!this.textarea) { return; }
        let text = this._wpp.getText("line") || "";
        text += (this.appendix ? this.appendix : "");
        return text;
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