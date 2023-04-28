import {encode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Resizable} from "./Resizable.mjs";
import {UIFactory} from "./UIFactory.mjs";
import {WPP} from "./WPP.mjs";

export class UIWorldInfoDetails extends Resizable {
    saveFunction;
    master;
    _data;

    tokenCount;

    key;
    keysecondary;

    textarea;
    wpp;
    wppEditor;

    comment;

    constant;
    selective;
    prepend;

    master;
    entryIndex;

    datalistTypes;

    static suggestTypes = [
        "Place", "Object", "Category", "Faction", "Person", "Concept", "Animal", "Plant", "Resource"
    ];

    constructor(options) {
        super(options);
        this.root.classList.add("shadow_popup");
        this.root.classList.add("through");
        this.saveFunction = options.save || null;

        this.master = options.master;
        this.entryIndex = options.index;

        this.tokenCount = this.findChildWithClass("notes_token_stat", this.header).children[0];
        this.key = this.findChildWithClass("keys-editor", this.content);
        this.keysecondary = this.findChildWithClass("secondary-keys-editor", this.content);
        this.textarea = this.findChildWithType("textarea", this.content);
        this.wppEditor = this.findChildWithClass("wpp-editor-field", this.content);

        let checkbox = this.findChildWithClass("wpp-checkbox", this.header);
        checkbox.checked = false;
        this.wppEditor.style.display = "none";
        checkbox.onchange = function(event) {
            if(event.target.checked) {
                this.textarea.style.display = "none";
                this.wppEditor.style.display = null;
            } else {
                this.textarea.style.display = null;
                this.wppEditor.style.display = "none";
            }
        }.bind(this);

        this.comment = this.findChildWithClass("comment", this.footer);
        this.comment.value = this.data.comment || "";
        if(this.comment.value.length) {
            this.comment.classList.remove("empty");
        } else {
            this.comment.classList.add("empty");
        }
        this.comment.onkeyup = function(event) {
            setTimeout(function(event) {
                this.data.comment = event.target.value;
                if(this.data.comment) {
                    event.target.classList.remove("empty");
                } else {
                    event.target.classList.add("empty");
                }
                this.save();
            }.bind(this, event), 0);
        }.bind(this);
        this.comment.oncut = this.comment.onkeyup;
        this.comment.onpaste = this.comment.onkeyup;

        this.constant = this.findChildWithClass("constant", this.footer);
        this.constant.checked = this.data.constant;
        this.constant.onchange = function(event) {
            this.data.constant = event.target.value === "on";
            this.save();
        }.bind(this);
        this.selective = this.findChildWithClass("selective", this.footer);
        this.selective.checked = this.data.selective;
        this.selective.onchange = function(event) {
            this.data.selective = event.target.value === "on";
            this.save();
        }.bind(this);
        this.prepend = this.findChildWithClass("prepend", this.footer);
        this.prepend.checked = this.data.prepend;
        this.prepend.onchange = function(event) {
            this.data.prepend = event.target.value === "on";
            this.save();
        }.bind(this);

        this.datalistTypes = document.createElement("datalist");
        this.datalistTypes.setAttribute("id", "datalist-" + Number(Math.round(Math.random()*100000000)));
        this.container.appendChild(this.datalistTypes);
        UIWorldInfoDetails.suggestTypes.sort().forEach(suggestion => {
            let opt = document.createElement("option");
            opt.setAttribute("value", suggestion);
            this.datalistTypes.appendChild(opt);
        });

        this.refresh();
    }

    get data() {
        if(!this._data) {
            this._data = this.master ? this.master.getEntry(this.entryIndex) : null;
        }
        return this._data;
    }

    get tokens() {
        return encode(WPP.stringifySingle(this.wpp)).length;
    }

    save() {
        if(this.master) {
            this.master.setEntry(this.entryIndex, this._data);
        }
        if(this.saveFunction) {
            this.saveFunction();
        }
    }

    refresh() {
        if(!this.master) {
            console.error("WorldInfoDetails");
        }
        const data = this.data;
        if(!data) {
            console.error("WorldInfoDetails could not access index " + this.entryIndex);
            return;
        }

        data.key.forEach((key, index) => {
            this.key.appendChild(UIFactory.createInputText({
                value: key,
                onall: this.updateKey.bind(this, index, false)
            }));
        });
        this.key.appendChild(UIFactory.createInputText({
            value: null,
            onall: this.updateKey.bind(this, data.key.length, false)
        }));

        data.keysecondary.forEach((key, index) => {
            this.keysecondary.appendChild(UIFactory.createInputText({
                value: key,
                onall: this.updateKey.bind(this, index, true)
            }));
        });
        this.keysecondary.appendChild(UIFactory.createInputText({
            value: null,
            onall: this.updateKey.bind(this, data.key.length, true)
        }));

        this.textarea.innerHTML = data.content;
        this.textarea.onkeyup = function(event) {
            setTimeout(function(){;
                this.data.content = this.textarea.value;
                this.wpp = WPP.parseSingle(this.data.content);
                this.refreshWPP();
                this.updateTokens();
                this.save();
            }.bind(this), 0);
        }.bind(this);
        this.textarea.oncut = this.textarea.onkeyup;
        this.textarea.onpaste = this.textarea.onkeyup;

        this.wpp = WPP.parseSingle(data.content);
        this.refreshWPP();

        this.updateTokens();
    }

    refreshWPP() {
        this.wppEditor.innerHTML = "";
        if(!this.wpp) {
            this.wpp = WPP.parseSingle(this.data.content);
        }
        if(!this.wpp.wpp) {
            this.wpp.wpp = {
                name: null,
                value: null,
                properties: []
            }
        }
        let nameInput = UIFactory.createInputText({
            value: this.wpp.wpp.name || null,
            class: [ "wpp-name" ],
            onall: function(event) {
                this.wpp.wpp.name = event.target.value;
                this.updateWPP();
            }.bind(this)
        });
        nameInput.setAttribute("list", this.datalistTypes.getAttribute("id"));
        nameInput.setAttribute("title", "The suggested values are not the only possible values, merely common examples.");
        this.wppEditor.appendChild(nameInput);
        this.wppEditor.appendChild(UIFactory.createInputText({
            value: this.wpp.wpp.value || null,
            class: [ "wpp-value" ],
            onall: function(event) {
                this.wpp.wpp.value = event.target.value;
                this.updateWPP();
            }.bind(this)
        }));
        this.wpp.wpp.properties.forEach((prop, index) => {
            this.wppEditor.appendChild(UIFactory.createInputText({
                value: prop || null,
                onall: this.updateWPPProperty.bind(this, index)
            }));
        });
        this.wppEditor.appendChild(UIFactory.createInputText({
            value: null,
            onall: this.updateWPPProperty.bind(this, this.wpp.wpp.properties.length)
        }));
    }

    updateWPP() {
        this.data.content = (WPP.stringifySingle(this.wpp));
        this.textarea.innerHTML = WPP.stringifySingle(this.wpp);
        this.updateTokens();
        this.save();
    }

    updateWPPProperty(index, event) {
        this.wpp.wpp.properties[index] = event.target.value;
        if(event.target.value && event.target.value.length) {
            event.target.classList.remove("empty");
        } else {
            event.target.classList.add("empty");
        }
        if(!event.target.value || !event.target.value.length) {
            if(event.target.nextSibling) {
                const parent = event.target.parentNode;
                let next = event.target.nextSibling;
                let i = index;
                while(next) {
                    next.onchange = setTimeout.bind(this,
                        this.updateWPPProperty.bind(this, i),
                        0
                    );
                    next.onkeyup = next.onchange;
                    next.oncut = next.onchange;
                    next.onpaste = next.onchange;
                    next = next.nextSibling;
                    i++;
                }
                event.target.parentNode.removeChild(event.target);
                next = parent.children[0];
                while(next) {
                    if(!next.value || !next.value.length) {
                        next.focus();
                        break;
                    }
                    next = next.nextSibling;
                }
            }
            this.wpp.wpp.properties.splice(index, 1);
        } else if(!event.target.nextSibling) {
            if(event.target.value && event.target.value.length) {
                event.target.parentNode.appendChild(
                    UIFactory.createInputText({
                        value: null,
                        onall: this.updateWPPProperty.bind(this, index+1)
                    })
                );
            } else {
                this.wpp.wpp.properties.splice(index, 1);
            }
        }
        this.updateWPP();
    }

    updateKey(index, minor, event) {
        (minor ? this.data.keysecondary : this.data.key)[index] = event.target.value;
        if(event.target.value && event.target.value.length) {
            event.target.classList.remove("empty");
        } else {
            event.target.classList.add("empty");
        }
        if(!event.target.value || !event.target.value.length) {
            if(event.target.nextSibling) {
                const parent = event.target.parentNode;
                let next = event.target.nextSibling;
                let i = index;
                while(next) {
                    next.onchange = setTimeout.bind(this,
                        this.updateKey.bind(this, i, minor),
                        0
                    );
                    next.onkeyup = next.onchange;
                    next.oncut = next.onchange;
                    next.onpaste = next.onchange;
                    next = next.nextSibling;
                    i++;
                }
                event.target.parentNode.removeChild(event.target);
                next = parent.children[0];
                while(next) {
                    if(!next.value || !next.value.length) {
                        next.focus();
                        break;
                    }
                    next = next.nextSibling;
                }
            }
            (minor ? this.data.keysecondary : this.data.key).splice(index, 1);
        } else if(!event.target.nextSibling) {
            if(event.target.value && event.target.value.length) {
                event.target.parentNode.appendChild(
                    UIFactory.createInputText({
                        value: null,
                        onall: this.updateKey.bind(this, index+1, minor)
                    })
                );
            } else {
                (minor ? this.data.keysecondary : this.data.key).splice(index, 1);
            }
        }
        this.save();
    }

    updateTokens() {
        if(!this.tokenCount) { return; }
        this.tokenCount.innerHTML = this.tokens;
    }

    destroy() {
        this.master = null;
        super.destroy();
    }
}