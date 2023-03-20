import {encode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Resizable} from "./Resizable.mjs";

/**
 * "Notes" window
 */
export class Notes extends Resizable {
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

        this.container.find('#notes_textarea').on('keyup paste cut', function() {
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
        }.bind(this));
        $(document).on('click', '.option_toggle_notes', this.toggle.bind(this));
    }

    /** Sets textarea contents */
    set text(value) {
        if(!this.container) { return; }
        this.container.find("#notes_textarea")[0].value = value;
        this.updateNotesTokenCount();
    }

    /** Returns textarea contents */
    get text() {
        return this.getText("raw");
    }

    /** Gets value of injection strategy selector (char/chat/wpp_ez/wpp/none) */
    get strategy() {
        let sel = this.container.find(".notes_strategy");
        if(!sel) { return null; }
        return sel[0].value;
    }

    /** Returns formatted text
     * @param format raw|singleline (raw includes newlines)
     * */
    getText(format) {
        let raw = (this.container.find("#notes_textarea")[0].value || "").trim().replace(/\s\s+/g, " ");
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
        let text = this.container.find("#notes_textarea")[0].value
            .trim()
            .replace(/\s\s+/g, " ")
            .replace(/\n/g, " ");
        this.container.find("#notes_tokens").empty();
        this.container.find("#notes_tokens").append((text && text.length ? this.getTokenCount(text) : 0).toString());
    }
}