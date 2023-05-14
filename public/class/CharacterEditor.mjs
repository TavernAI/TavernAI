import {Resizable} from "./Resizable.mjs";
import {EventEmitter} from "./EventEmitter.mjs";
import {WPPEditor} from "./WPPEditor.mjs";
import {encode, decode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {max_context} from "../script.js";

export class CharacterEditor extends EventEmitter {
    static EVENT_SAVE = "charedit_save";
    static EVENT_CREATE = "charedit_create";
    static EVENT_DELETE = "charedit_delete";
    static EVENT_HIDDEN = "charedit_hidden";
    static EVENT_SHOWN = "charedit_shown";

    static DurationSave = 300;
    _timerSave;

    container;
    advancedWindow;

    _chardata = {};
    _editMode = false;

    name = {
        input: null,
        block: null,
    }

    avatar = {
        input: null,
        previewImg: null,
        filenameDiv: null,
        filenameInput: null,
    }
    
    description = {
        textarea: null,
        wppEditor: null,
        checkbox: null,
    }
    
    other = {
        firstMessageTextarea: null,
        nameInput: null,
        personalityInput: null,
        scenarioInput: null,
        exampleDialogueTextarea: null,
    }

    token = {
        counter: null,
        limitLow: 512,
        limitHigh: 1024,
        limitLeft: 768,
        warning: {
            left: null,
            leftCounter: null,
            count: null,
            countCounter: null
        }
    }
    
    button = {
        delete: null,
        submit: null,
        advanced: null,
        online: null,
        close: null,
        export: null,
    }

    /**
     * container
     * containerAdvanced
     */
    constructor(options) {
        super({
            parent: options.parent
        });
        this.container = options.container;

        options.token = options.token || {};

        // name handling
        this.name.input = this.findChildWithClass("chareditor-name-input", this.container, true);
        this.name.block = this.findChildWithClass("chareditor-name-block", this.container, true);

        // avatar handling
        this.avatar.previewImg = this.findChildWithClass("chareditor-avatar-preview", this.container, true);
        this.avatar.filenameDiv = this.findChildWithClass("chareditor-avatar-filename", this.container, true);
        this.avatar.filenameInput = this.findChildWithClass("chareditor-avatar-filename-input", this.container, true);
        this.avatar.input = this.findChildWithClass("chareditor-avatar", this.container, true);
        this.avatar.input.value = null;
        this.avatar.input.onchange = this.onAvatarChanged.bind(this);


        // description & WPP editor
        this.description.textarea = this.findChildWithClass("chareditor-description-text", this.container, true);
        this.description.textarea.onkeyup = this.syncDescriptionTextareaToWPP.bind(this);
        this.description.textarea.oncut = this.description.textarea.onkeyup;
        this.description.textarea.onpaste = this.description.textarea.onkeyup;

        let wppContainer = document.createElement("div");
        this.description.textarea.parentNode.insertBefore(wppContainer, this.description.textarea);
        this.description.wppEditor = new WPPEditor({
            container: wppContainer,
        });
        this.description.wppEditor.on("change", this.syncDescriptionWppToTextarea.bind(this));
        this.description.wppEditor.container.style.display = "none";

        this.description.checkbox = this.findChildWithClass("toggle_checkbox", this.description.textarea.parentNode, true);
        this.description.checkbox.onchange = this.toggleDescriptionWPP.bind(this);
        this.description.checkbox.checked = false;

        // "advanced" window
        this.advancedWindow = new Resizable({
            root: options.containerAdvanced,
            uid: "chareditor-advanced",
            top: 0.1,
            left: 0.1,
            right: 0.9,
            bottom: 0.9
        });

        // other
        this.other.firstMessageTextarea = this.findChildWithClass("chareditor-firstmessage-text", this.container, true);

        this.other.personalityInput = this.advancedWindow.findChildWithClass("chareditor-personality");
        this.other.scenarioInput = this.advancedWindow.findChildWithClass("chareditor-scenario");
        this.other.exampleDialogueTextarea = this.advancedWindow.findChildWithClass("chareditor-dialogue");

        // token count and warnings
        this.token.counter = this.findChildWithClass("chareditor-token-counter", this.container, true);
        this.token.warning.count = this.findChildWithClass("chareditor-token-warning-count", this.container, true);
        this.token.warning.countCounter = this.token.warning.count.children[0];
        this.token.warning.left = this.findChildWithClass("chareditor-token-warning-left", this.container, true);
        this.token.warning.leftCounter = this.token.warning.left.children[0];

        // buttons
        this.button.advanced = this.findChildWithClass("chareditor-button-advanced", this.container, true);
        this.button.advanced.onclick = this.advancedWindow.toggle.bind(this.advancedWindow);

        this.button.delete = this.findChildWithClass("chareditor-button-delete", this.container, true);
        this.button.delete.onclick = this.onDelete.bind(this, true);

        this.button.online = this.findChildWithClass("chareditor-button-online", this.container, true);
        // this.button.online.onclick = //?

        this.button.submit = this.findChildWithClass("chareditor-button-submit", this.container, true);

        this.button.close = this.findChildWithClass("chareditor-button-close", this.container, true);
        this.button.close.onclick = this.hide.bind(this);

        this.button.export = this.findChildWithClass("chareditor-button-export", this.container, true);
        this.button.export.onclick = this.export.bind(this);

        // global events
        this.container.onkeyup = this.save.bind(this, false);
        this.container.oncut = this.container.onkeyup;
        this.container.onpaste = this.container.onkeyup;

        this.button.submit.onclick = this.onSubmit.bind(this);

        this.advancedWindow.container.onkeyup = this.save.bind(this, false);
        this.advancedWindow.container.oncut = this.advancedWindow.container.onkeyup;
        this.advancedWindow.container.onpaste = this.advancedWindow.container.onkeyup;

        this.chardata = options.chardata || {};
        this.editMode = options.edit || this.editMode;
        if(!options.show) {
            this.hide();
        }
    }

    findChildWithClass = Resizable.prototype.findChildWithClass;

    findChildWithType = Resizable.prototype.findChildWithType;

    syncDescriptionWppToTextarea(event) {
        this.description.textarea.value = event.target.text;
        this.save(false);
    }
    syncDescriptionTextareaToWPP(event) {
        this.description.wppEditor.text = event.target.value;
    }

    toggleDescriptionWPP(event) {
        if(event.target.checked) {
            this.description.wppEditor.container.style.display = null;
            this.description.textarea.style.display = "none";
        } else {
            this.description.wppEditor.container.style.display = "none";
            this.description.textarea.style.display = null;
        }
    }

    save(immediate) {
        this.updateTokenCount();
        this.updateSubmitButton();
        if(!this.editMode) {
            return;
        }
        if(immediate) {
            if(this._timerSave) {
                clearTimeout(this._timerSave);
            }
            this._timerSave = null;
            this.onSubmit();
        } else {
            if(this._timerSave) {
                clearTimeout(this._timerSave);
            }
            this._timerSave = setTimeout(() => {
                this._timerSave = null;
                this.onSubmit();
            }, CharacterEditor.DurationSave);
        }
    }

    export() {
        window.open("characters/" + this.avatar.filenameDiv.innerHTML);
    }

    updateSubmitButton() {
        if(!this.name.input.value || !this.name.input.value.length) {
            this.button.submit.setAttribute("disabled", "true");
        } else {
            this.button.submit.removeAttribute("disabled");
        }
    }

    updateTokenCount() {
        let min = this.tokenCountMin;
        let max = this.tokenCountMax;
        let remaining = max_context - min;

        this.token.counter.innerHTML = min === max ? min : min + "-" + max;

        this.token.warning.left.parentNode.classList.forEach(name => {
            this.token.warning.left.parentNode.classList.remove(name);
        });

        if(remaining < this.token.limitLeft) {
            this.token.warning.leftCounter.innerHTML = remaining > 0 ? "only " + remaining : "no";
            this.token.warning.left.parentNode.classList.add("error");
            this.token.warning.count.style.opacity = null;
            this.token.warning.count.style.display = "none";
            this.token.warning.left.style.display = null;
        } else if(min > this.token.limitHigh) {
            this.token.warning.countCounter.innerHTML = this.token.limitHigh;
            this.token.warning.left.parentNode.classList.add("error");
            this.token.warning.count.style.opacity = null;
            this.token.warning.count.style.display = null;
            this.token.warning.left.style.display = "none";
        } else if(min > this.token.limitLow) {
            this.token.warning.countCounter.innerHTML = this.token.limitLow;
            this.token.warning.left.parentNode.classList.add("warning");
            this.token.warning.count.style.opacity = null;
            this.token.warning.count.style.display = null;
            this.token.warning.left.style.display = "none";
        } else {
            this.token.warning.count.style.opacity = "0";
            this.token.warning.left.style.display = "none";
        }
    }

    onAvatarChanged(event) {
        if(this.avatar.input.files && this.avatar.input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if(!this.editMode) {
                    this._chardata.filename = this.avatar.input.files[0].name;
                }
                this.refresh();
                // actually gives data:image, so an override after refresh uses an assumed pathfile has to be made
                this.avatar.previewImg.setAttribute("src", e.target.result);
                this.save();
            }.bind(this);
            reader.readAsDataURL(this.avatar.input.files[0]);
        }
    }

    onSubmit(event) {
        let formData = new FormData(this.container);
        if(!this.chardata.name || !this.chardata.name.length) {
            document.getElementById("result_info").innerHTML = "Name not entered";
            return;
        }

        if(!this.editMode) {
            this.enabled = false;
            this.button.submit.setAttribute("value", "Creating...");
            this.emit(CharacterEditor.EVENT_CREATE, {
                data: formData,
                resolve: function(data){
                    this.editMode = true;
                    this.enabled = true;
                    //this.emit(CharacterEditor.EVENT_HIDDEN);
                    
                }.bind(this),
                reject: function (jqXHR, exception) {
                    this.enabled = true;
                    console.error("Error creating character");
                    console.error(jqXHR);
                    console.error(exception);
                }.bind(this)
            });
        } else {
            this.enabled = false;
            this.button.submit.setAttribute("value", "Saving...");
            this.emit(CharacterEditor.EVENT_SAVE, {
                data: formData,
                filename: this.avatar.filenameDiv.innerHTML,
                resolve: function(data) {
                    this.editMode = true;
                    this.enabled = true;
                }.bind(this),
                reject: function (jqXHR, exception) {
                    this.enabled = true;
                    console.error("Error editing character");
                    console.error(jqXHR);
                    console.error(exception);
                }.bind(this)
            });
            // make sure to load character and refresh chat!
        }
    }

    onDelete() {
        if(confirm("Delete the character?")) {
            this.emit(CharacterEditor.EVENT_DELETE, {
                target: this.chardata.filename
            });
        }
    }

    get editMode() {
        return this._editMode;
    }

    get enabled() {
        return !this.button.submit.getAttribute("disabled");
    }

    set enabled(value) {
        if(value) {
            this.button.submit.setAttribute("disabled", "true");
        } else {
            this.button.submit.removeAttribute("disabled");
        }
    }

    set editMode(value) {
        this._editMode = value;
        this.name.block.style.visible = this._editMode ? null : "none";
        if(this._editMode) {
            this.button.submit.setAttribute("value", "Save");
            this.button.delete.removeAttribute("disabled");
            this.button.export.removeAttribute("disabled");
            this.container.classList.add("edit");
            this.container.classList.remove("create");
        } else {
            this.button.submit.setAttribute("value", "Create");
            this.button.delete.setAttribute("disabled", "true");
            this.button.export.setAttribute("disabled", "true");
            this.container.classList.remove("edit");
            this.container.classList.add("create");
        }
        //this.button.online.style.visible = !this._editMode ? null : "none";
    }

    set chardata(chardata) {
        this._chardata = chardata || {};
        this.editMode = chardata && chardata.name && chardata.name.length;
        this.refresh(true);
    }
    
    get chardata() {
        this._chardata = this._chardata || {};
        this._chardata.name = this.name.input.value && this.name.input.value.length ? this.name.input.value : "";
        this._chardata.description = this.description.textarea.value || "";
        this._chardata.first_mes = this.other.firstMessageTextarea.value || "";
        this._chardata.personality = this.other.personalityInput.value || "";
        this._chardata.scenario = this.other.scenarioInput.value || "";
        this._chardata.mes_example = this.other.exampleDialogueTextarea.value || "";
        return this._chardata;
    }

    get tokenCountMin() {
        let data = this.chardata;
        return encode(JSON.stringify(data.description + data.personality + data.scenario)).length;
    }

    get tokenCountMax() {
        let data = this.chardata;
        return encode(JSON.stringify(data.description + data.personality + data.scenario + data.mes_example)).length;
    }

    hide() {
        this.advancedWindow.hide();
        this.emit(CharacterEditor.EVENT_HIDDEN, {});
    }

    show() {
        this.container.style.display = null;
        this.emit(CharacterEditor.EVENT_SHOWN, {});
    }
    
    refresh(useImageUrl) {
        this.avatar.filenameDiv.innerHTML = this._chardata.filename || "";
        if(this._chardata.filename && this._chardata.filename.length) {
            if(useImageUrl) {
                this.avatar.previewImg.setAttribute("src", "characters/" + this._chardata.filename + "?v=" + Date.now());
            }
            this.avatar.filenameInput.value = this._chardata.filename;
        } else {
            if(useImageUrl) {
                this.avatar.previewImg.setAttribute("src", "img/fluffy.png");
            }
            this.avatar.filenameInput.value = null;
            this.avatar.input.value = null;
        }

        this.name.input.value = this._chardata.name || "";
        this.updateSubmitButton();

        this.description.checkbox.checked = false;
        this.description.wppEditor.container.style.display = "none";
        this.description.textarea.style.display = null;
        this.description.textarea.value = this._chardata.description || "";
        this.description.wppEditor.text = this._chardata.description || "";

        this.other.firstMessageTextarea.value = this._chardata.first_mes || "";
        this.other.personalityInput.value = this._chardata.personality || "";
        this.other.scenarioInput.value = this._chardata.scenario || "";
        this.other.exampleDialogueTextarea.value = this._chardata.mes_example || "";

        this.updateTokenCount();
    }
}
