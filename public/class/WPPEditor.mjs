import {WPP} from "./WPP.mjs";
import {EventEmitter} from "./EventEmitter.mjs";

export class WPPEditor extends EventEmitter {
    container;
    editor;
    datalistProperties;
    datalistTypes;

    _wpp = [];
    appendix;

    error = false;

    alert;
    alertText;


    static suggestTypes = [
        "Character"
    ];
    static suggestProperties = [
        "Age", "Gender", "Appearance", "Description", "Frame", "Mind", "Personality", "Likes", "Dislikes", "Occupation", "Hobbies", "Sexual Orientation"
    ];

    /**
     *
     * @param options
     *  container: HTMLDivElement
     *  wpp?: WPPObject | string
     */
    constructor(options) {
        super();
        this.container = options.container;
            this.container.classList.add("wpp-editor");
        // help
        /*let help = document.createElement("div");
            help.classList.add("help");
            help.appendChild(document.createTextNode("?"));
            this.container.appendChild(help);*/
        this.editor = document.createElement("div");
            this.editor.classList.add("editor");
            this.container.appendChild(this.editor);
        this.editor.onchange = function(event) {
            if(event && event.target instanceof HTMLInputElement) {
                if(event.target.value && event.target.value.length) {
                    event.target.classList.remove("empty");
                } else {
                    event.target.classList.add("empty");
                }
            }
        };
        this.editor.onkeyup = this.editor.onchange;
        this.editor.onpaste = this.editor.onchange;
        this.editor.oncut = this.editor.onchange;
        // datalists for suggestions
        this.datalistProperties = document.createElement("datalist");
            this.datalistProperties.setAttribute("id", "datalist-" + Number(Math.round(Math.random()*100000000)));
            this.container.appendChild(this.datalistProperties);
            WPPEditor.suggestProperties.sort();
            WPPEditor.suggestProperties.forEach(suggestion => {
                let opt = document.createElement("option");
                opt.setAttribute("value", suggestion);
                this.datalistProperties.appendChild(opt);
            });
        this.datalistTypes = document.createElement("datalist");
            this.datalistTypes.setAttribute("id", "datalist-" + Number(Math.round(Math.random()*100000000)));
            this.container.appendChild(this.datalistTypes);
            WPPEditor.suggestTypes.forEach(suggestion => {
                let opt = document.createElement("option");
                opt.setAttribute("value", suggestion);
                this.datalistTypes.appendChild(opt);
            });
        this.alert = document.createElement("div");
            this.alert.classList.add("alert");
            this.alert.classList.add("hidden");
        this.container.appendChild(this.alert);
        this.alertText = document.createElement("div");
            this.alertText.classList.add("text");
        this.alert.appendChild(this.alertText);
        let ok = document.createElement("div")
            this.alert.appendChild(ok);
            ok.setAttribute("title", "Close");
            ok.innerHTML = "🞬";
            ok.classList.add("close");
            ok.addEventListener("click", function() {
                this.classList.add("hidden");
            }.bind(this.alert));

        if(options.wpp) {
            if(typeof value === "string") {
                this.text = options.wpp;
            } else {
                this.wpp = options.wpp;
            }
        } else {
            this.refresh();
        }
    }

    refresh() {
        this.editor.innerHTML = "";
        this.alert.classList.add("hidden");
        if(!this._wpp.length) {
            this._wpp.push({});
        }
        let maxIndex = 0;
        this._wpp.forEach((w, index) => {
            this.editor.appendChild(this.createCategory(w, index));
            maxIndex = index;
        });
        this.editor.appendChild(this.createCategory(null, maxIndex+1));
    }

    createCategory(w, index) {
        if(w) {
            if(!w.type) { w.type = ""; }
            if(!w.name) { w.name = ""; }
            if(!w.properties) { w.properties = {}; }
        }
        // container
        let cont = document.createElement("div");
        // type and name
        let iType = this.createInput(w ? w.type : "", this.updateType.bind(this));
        iType.setAttribute("title", "Type");
        iType.propertyIndex = index;
        iType.setAttribute("list", this.datalistTypes.getAttribute("id"));
        cont.appendChild(iType);
        let iName = this.createInput(w ? w.name : "", this.updateName.bind(this));
        iName.setAttribute("title", "Name");
        iName.propertyIndex = index;
        cont.appendChild(iName);
        // minimize button
        let cb = document.createElement("input");
        let cbId = "wwpe-" + Number(Math.round(Math.random()*100000000));
        cb.setAttribute("id", cbId);
        cb.setAttribute("type", "checkbox");
        cb.checked = !(w && w.type && w.type.length && w.name && w.name.length);
        cont.appendChild(cb);
        let lab = document.createElement("label");
        lab.setAttribute("for", cbId);
        lab.appendChild(document.createTextNode("▽"));
        cont.appendChild(lab);

        let props = document.createElement("div");
        props.classList.add("props");
        cont.appendChild(props);

        if(w) {
            for(let key in w.properties) {
                props.appendChild(this.createRow(index, key));
            }
        }
        props.appendChild(this.createRow(index, null));
        return cont;
    }

    createRow(index, key) {
        let row = document.createElement("div");
        let pName = this.createInput(key, this.updatePropertyName.bind(this));
        pName.setAttribute("list", this.datalistProperties.getAttribute("id"));
        pName.setAttribute("title", "Property name");
        pName.propertyName = key;
        pName.propertyIndex = index;
        row.appendChild(pName);
        if(this._wpp[index] && this._wpp[index].properties[key]) {
            this._wpp[index].properties[key].forEach((p, j) => {
                let pValue = this.createInput(p, this.updatePropertyValue.bind(this));
                pValue.setAttribute("title", "Property value");
                pValue.propertyName = key;
                pValue.propertyIndex = index;
                pValue.valueIndex = j;
                row.appendChild(pValue);
            });
        }
        let pValue = this.createInput("", this.updatePropertyValue.bind(this));
        pValue.propertyName = key;
        pValue.propertyIndex = index;
        pValue.valueIndex = this._wpp[index] && this._wpp[index].properties[key] ? this._wpp[index].properties[key].length : 0;
        if(!key) {
            pValue.disabled = true;
        }
        row.appendChild(pValue);
        return row;
    }

    createInput(value, callback) {
        let item = document.createElement("input");
            item.setAttribute("type", "text");
            item.value = value || "";
            if(!item.value || !item.value.length) {
                item.classList.add("empty");
            }
            item.onchange = function(event) { callback(event); };
        return item;
    }

    recalculate() {
        for(let index = 0; index < this.editor.childNodes.length; index++) {
            for(let i = 0; i < this.editor.childNodes[index].length; i++) {
                this.editor.childNodes[index][i].propertyIndex = index;
                if(this.editor.childNodes[index][i].classList.contains("props")) {
                    for(let j = 0; j < this.editor.childNodes[index][i].childNodes.length; j++) {       // rows
                        for(let k = 0; k < this.editor.childNodes[index][i].childNodes[j].childNodes.length; k++) {
                            const t = this.editor.childNodes[index][i].childNodes[j].childNodes[k];
                            t.propertyIndex = index;
                            if(k > 0) {
                                t.valueIndex = k-1;
                            }
                        }
                    }
                }
            }
        }
    }

    updateType(event) {
        if(!this._wpp[event.target.propertyIndex]) {
            this._wpp[event.target.propertyIndex] = {
                type: null,
                name: null,
                properties: {}
            }
        }
        this._wpp[event.target.propertyIndex].type = event.target.value;
        const r = this._wpp[event.target.propertyIndex];
        let c = 0;
        for(let k in r.properties) { c++; }
        if((!r.type || !r.type.length) && (!r.name || !r.name.length) && !c) {
            this._wpp.splice(event.target.propertyIndex, 1);
            if(event.target.parentNode.nextSibling) {
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                this.recalculate();
            }
        } else if(!event.target.parentNode.nextSibling) {
            this.createCategory(null, event.target.propertyIndex+1);
        }
        this.emitChange();
    }

    updateName(event) {
        if(!this._wpp[event.target.propertyIndex]) { return; }
        this._wpp[event.target.propertyIndex].name = event.target.value;
        this.emitChange();
    }

    updatePropertyName(event) {
        if(!this._wpp[event.target.propertyIndex]) { return; }
        if(event.target.propertyName) {
            // this doesn't maintain order
            let newProps = {};
            for(let key in this._wpp[event.target.propertyIndex].properties) {
                if(key === event.target.propertyName) {
                    newProps[event.target.value] = (this._wpp[event.target.propertyIndex].properties[key]).slice();
                } else {
                    newProps[key] = (this._wpp[event.target.propertyIndex].properties[key]).slice();
                }
            }
            delete this._wpp[event.target.propertyIndex].properties;
            this._wpp[event.target.propertyIndex].properties = newProps;
        } else {
            if(event.target.value && event.target.value.length) {
                this._wpp[event.target.propertyIndex].properties[event.target.value] = [];
            }
        }
        delete this._wpp[event.target.propertyIndex].properties[event.target.propertyName];
        if(event.target.value && event.target.value.length) {
            event.target.propertyName = event.target.value;
            for(let i = 1; i < event.target.parentNode.childNodes.length; i++) {
                event.target.parentNode.childNodes[i].disabled = false;
            }
        } else {
            for(let i = 1; i < event.target.parentNode.childNodes.length; i++) {
                event.target.parentNode.childNodes[i].disabled = true;
            }
        }
        let next = event.target.nextSibling;
        while(next) {
            next.propertyName = event.target.value;
            next = next.nextSibling;
        }
        if(event.target.value && event.target.value.length && !event.target.parentNode.nextSibling) {
            event.target.parentNode.parentNode.appendChild(this.createRow(event.target.propertyIndex, null));
        }
        if((!event.target.value || !event.target.value.length)) {
            let allEmpty = true;
            for(let i = 0; i < event.target.parentNode.childNodes.length; i++) {
                if(event.target.parentNode.childNodes[i].value && event.target.parentNode.childNodes[i].value.length) {
                    allEmpty = false;
                    break;
                }
            }
            if(allEmpty) {
                if(event.target.value) {
                    delete this._wpp[event.target.propertyIndex].properties[event.target.value];
                }
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            }
        }
        this.emitChange();
    }

    updatePropertyValue(event) {
        if(!this._wpp[event.target.propertyIndex]) { return; }
        this._wpp[event.target.propertyIndex].properties[event.target.propertyName][event.target.valueIndex] = event.target.value;
        if(!event.target.nextSibling) {
            let pValue = this.createInput("", this.updatePropertyValue.bind(this));
                pValue.propertyName = event.target.propertyName;
                pValue.propertyIndex = event.target.propertyIndex;
                pValue.valueIndex = event.target.valueIndex+1;
                pValue.classList.add("empty");
            event.target.parentNode.appendChild(pValue);
        }
        if(!event.target.value || !event.target.value.length) {
            event.target.classList.add("empty");
        } else {
            event.target.classList.remove("empty");
        }
        if((!event.target.value || !event.target.value.length) && event.target.nextSibling) {
            let parent = event.target.parentNode;
            this._wpp[event.target.propertyIndex].properties[event.target.propertyName].splice(event.target.valueIndex, 1);
            parent.removeChild(event.target);
            for(let i = 1; i < parent.childNodes.length; i++) {
                parent.childNodes[i].valueIndex = i-1;
            }
        }
        this.emitChange();
    }

    processError(error) {
        this.alertText.innerHTML = "";
        switch(error) {
            case WPP.ErrorNoGroups: return; // nop
            case WPP.ErrorNoType: return; // nop
            case WPP.ErrorTypeHasMultipleNames:
                this.alertText.innerHTML("W++ type (character) has multiple names");
                break; // nop
            case WPP.ErrorBadAttribute:
                this.alertText.innerHTML("Error parsing W++ attribute");
                break; // nop; // nop
            default:
                this.alertText.innerHTML = error;
                break;
        }
        this.alert.classList.remove("hidden");
        this.error = true;
        this.emit("error", { target: this, error: error });
    }

    clear() {
        this._wpp = [];
        this.appendix = null;
        this.editor.innerHTML = "";
        this.alert.classList.add("hidden");
    }

    set wpp(value) {
        try {
            WPP.validate(value);
            this._wpp = JSON.parse(JSON.stringify(value));     // make copy
            this.error = false;
        } catch(e) {
            this.processError(e);
        } finally {
            this.refresh();
        }
    }

    get wpp() {
        return WPP.validate(this._wpp);
    }

    set text(value) {
        try {
            let parsed = WPP.parseExtended(value);
            this._wpp = parsed.wpp;
            this.appendix = parsed.appendix ? parsed.appendix.trim() : null;
            this.error = false;
        } catch(e) {
            this.appendix = value;
            this.processError(e);
        } finally {
            this.refresh();
        }
    }

    get text() {
        return this.getText();
    }

    get display() {
        return this.container.style.display;
    }

    set display(value) {
        this.container.style.display = value;
    }

    getText(format) {
        let str = WPP.stringify(WPP.trim(this._wpp), format) || "";
        if(format === "line") {
            return str + (this.appendix ? " " + this.appendix.replace(/\n/g, "") : "");
        } else {
            return str + (this.appendix ? (str && str.length ? "\n" : "") + this.appendix : "");
        }
    }

    /* Event emitting */
    emitChange() {
        this.emit("change", {
            target: this
        });
    }
}