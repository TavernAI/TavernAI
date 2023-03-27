import { WPP } from "./WPP.mjs";
import { EventEmitter } from "./EventEmitter.mjs";

export class WPPEditor extends EventEmitter {
    /** @type {HTMLDivElement} */ container;
    /** @type {HTMLDivElement} */ editor;
    /** @type {HTMLDataListElement} */ datalistProperties;
    /** @type {HTMLDataListElement} */ datalistTypes;

    /** @type {import("../../types/WPlusPlusArray.js").default} */ _wpp = [];
    /** @type {(string | null | undefined)=} */ appendix;

    error = false;

    /** @type {HTMLDivElement} */ alert;
    /** @type {HTMLDivElement} */ alertText;

    static suggestTypes = ["Character"];
    static suggestProperties = [
        "Age",
        "Gender",
        "Appearance",
        "Description",
        "Frame",
        "Mind",
        "Personality",
        "Likes",
        "Dislikes",
        "Occupation",
        "Hobbies",
        "Sexual Orientation",
    ];

    /**
     * @param {object} options
     * @param {HTMLDivElement} options.container
     * @param {(import("../../types/WPlusPlusArray.js").default | string)=} options.wpp
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
        this.editor.onchange = function (event) {
            if (event && event.target instanceof HTMLInputElement) {
                if (event.target.value && event.target.value.length) {
                    event.target.classList.remove("empty");
                } else {
                    event.target.classList.add("empty");
                }
            }
        };
        this.editor.onkeyup = this.editor.onchange;
        this.editor.onpaste = (ev) => this.editor.onchange?.(ev);
        this.editor.oncut = (ev) => this.editor.onchange?.(ev);
        // datalists for suggestions
        this.datalistProperties = document.createElement("datalist");
        this.datalistProperties.setAttribute(
            "id",
            "datalist-" + Number(Math.round(Math.random() * 100000000))
        );
        this.container.appendChild(this.datalistProperties);
        WPPEditor.suggestProperties.sort();
        WPPEditor.suggestProperties.forEach((suggestion) => {
            let opt = document.createElement("option");
            opt.setAttribute("value", suggestion);
            this.datalistProperties.appendChild(opt);
        });
        this.datalistTypes = document.createElement("datalist");
        this.datalistTypes.setAttribute(
            "id",
            "datalist-" + Number(Math.round(Math.random() * 100000000))
        );
        this.container.appendChild(this.datalistTypes);
        WPPEditor.suggestTypes.forEach((suggestion) => {
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
        let ok = document.createElement("div");
        this.alert.appendChild(ok);
        ok.setAttribute("title", "Close");
        ok.innerHTML = "🞬";
        ok.classList.add("close");
        ok.addEventListener(
            "click",
            function () {
                this.classList.add("hidden");
            }.bind(this.alert)
        );

        if (options.wpp) {
            if (typeof options.wpp === "string") {
                this.text = options.wpp;
            } else {
                this.wpp = options.wpp;
            }
        } else {
            this.refresh();
        }
    }

    /**
     * @returns {void}
     */
    refresh() {
        this.editor.innerHTML = "";
        this.alert.classList.add("hidden");
        if (!this._wpp.length) {
            this._wpp.push({ properties: {} });
        }
        let maxIndex = 0;
        this._wpp.forEach((w, index) => {
            this.editor.appendChild(this.createCategory(w, index));
            maxIndex = index;
        });
        this.editor.appendChild(this.createCategory(null, maxIndex + 1));
    }

    /**
     * @param {import("../../types/WPlusPlusArray.js").default[number] | null | undefined} w
     * @param {number} index
     * @returns {HTMLDivElement}
     */
    createCategory(w, index) {
        if (w) {
            if (!w.type) {
                w.type = "";
            }
            if (!w.name) {
                w.name = "";
            }
            if (!w.properties) {
                w.properties = {};
            }
        }
        // container
        let cont = document.createElement("div");
        // type and name
        let iType = this.createInput(
            w ? w.type ?? "" : "",
            this.updateType.bind(this)
        );
        iType.setAttribute("title", "Type");
        iType.dataset.propertyIndex = index.toString();
        iType.setAttribute("list", this.datalistTypes.getAttribute("id") ?? "");
        cont.appendChild(iType);
        let iName = this.createInput(
            w ? w.name ?? "" : "",
            this.updateName.bind(this)
        );
        iName.setAttribute("title", "Name");
        iName.dataset.propertyIndex = index.toString();
        cont.appendChild(iName);
        // minimize button
        let cb = document.createElement("input");
        let cbId = "wwpe-" + Number(Math.round(Math.random() * 100000000));
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

        if (w) {
            for (let key in w.properties) {
                props.appendChild(this.createRow(index, key));
            }
        }
        props.appendChild(this.createRow(index, null));
        return cont;
    }

    createRow(index, key) {
        let row = document.createElement("div");
        let pName = this.createInput(key, this.updatePropertyName.bind(this));
        pName.setAttribute(
            "list",
            this.datalistProperties.getAttribute("id") ?? ""
        );
        pName.setAttribute("title", "Property name");
        pName.dataset.propertyName = key;
        pName.dataset.propertyIndex = index;
        row.appendChild(pName);
        if (this._wpp[index] && this._wpp[index].properties[key]) {
            this._wpp[index].properties[key].forEach((p, j) => {
                let pValue = this.createInput(
                    p,
                    this.updatePropertyValue.bind(this)
                );
                pValue.setAttribute("title", "Property value");
                pValue.dataset.propertyName = key;
                pValue.dataset.propertyIndex = index;
                pValue.dataset.valueIndex = j.toString();
                row.appendChild(pValue);
            });
        }
        let pValue = this.createInput("", this.updatePropertyValue.bind(this));
        pValue.dataset.propertyName = key;
        pValue.dataset.propertyIndex = index;
        pValue.dataset.valueIndex =
            this._wpp[index] && this._wpp[index].properties[key]
                ? this._wpp[index].properties[key].length.toString()
                : (0).toString();
        if (!key) {
            pValue.disabled = true;
        }
        row.appendChild(pValue);
        return row;
    }

    /**
     * @param {string} value
     * @param {(ev: Event) => void} callback
     * @returns {HTMLInputElement}
     */
    createInput(value, callback) {
        let item = document.createElement("input");
        item.setAttribute("type", "text");
        item.value = value || "";
        if (!item.value || !item.value.length) {
            item.classList.add("empty");
        }
        item.onchange = function (event) {
            callback(event);
        };
        return item;
    }

    /**
     * @returns {void}
     */
    recalculate() {
        for (let index = 0; index < this.editor.childNodes.length; index++) {
            // @ts-ignore
            for (let i = 0; i < this.editor.childNodes[index].length; i++) {
                this.editor.childNodes[index][i].propertyIndex = index;
                if (
                    this.editor.childNodes[index][i].classList.contains("props")
                ) {
                    for (
                        let j = 0;
                        j < this.editor.childNodes[index][i].childNodes.length;
                        j++
                    ) {
                        // rows
                        for (
                            let k = 0;
                            k <
                            this.editor.childNodes[index][i].childNodes[j]
                                .childNodes.length;
                            k++
                        ) {
                            const t =
                                this.editor.childNodes[index][i].childNodes[j]
                                    .childNodes[k];
                            t.propertyIndex = index;
                            if (k > 0) {
                                t.valueIndex = k - 1;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {Event & { target: HTMLInputElement }} event
     * @returns {void}
     */
    updateType(event) {
        if (!this._wpp[event.target.dataset.propertyIndex ?? "0"]) {
            this._wpp[event.target.dataset.propertyIndex ?? "0"] = {
                type: null,
                name: null,
                properties: {},
            };
        }
        this._wpp[event.target.dataset.propertyIndex ?? "0"].type =
            event.target.value;
        const r = this._wpp[event.target.dataset.propertyIndex ?? "0"];
        let c = 0;
        for (let k in r.properties) {
            c++;
        }
        if ((!r.type || !r.type.length) && (!r.name || !r.name.length) && !c) {
            this._wpp.splice(
                Number.parseInt(event.target.dataset.propertyIndex ?? "0", 10),
                1
            );
            if (event.target.parentNode?.nextSibling) {
                event.target.parentNode.parentNode?.removeChild(
                    event.target.parentNode
                );
                this.recalculate();
            }
        } else if (!event.target.parentNode?.nextSibling) {
            this.createCategory(
                null,
                Number.parseInt(event.target.dataset.propertyIndex ?? "0", 10) +
                    1
            );
        }
        this.emitChange();
    }

    updateName(event) {
        if (!this._wpp[event.target.propertyIndex]) {
            return;
        }
        this._wpp[event.target.propertyIndex].name = event.target.value;
        this.emitChange();
    }

    /**
     * @param {Event & { target: HTMLInputElement }} event
     * @returns {void}
     */
    updatePropertyName(event) {
        if (!this._wpp[event.target.dataset.propertyIndex ?? "0"]) {
            return;
        }
        if (event.target.dataset.propertyName) {
            // this doesn't maintain order
            /** @type {Record<string, string[]>} */ let newProps = {};
            for (let key in this._wpp[event.target.dataset.propertyIndex ?? "0"]
                .properties) {
                if (key === event.target.dataset.propertyName) {
                    newProps[event.target.value] =
                        this._wpp[
                            event.target.dataset.propertyIndex ?? "0"
                        ].properties[key].slice();
                } else {
                    newProps[key] =
                        this._wpp[
                            event.target.dataset.propertyIndex ?? "0"
                        ].properties[key].slice();
                }
            }
            this._wpp[event.target.dataset.propertyIndex ?? "0"].properties =
                newProps;
        } else {
            if (event.target.value && event.target.value.length) {
                this._wpp[event.target.dataset.propertyIndex ?? "0"].properties[
                    event.target.value
                ] = [];
            }
        }
        delete this._wpp[event.target.dataset.propertyIndex ?? "0"].properties[
            event.target.dataset.propertyName
        ];
        if (event.target.value && event.target.value.length) {
            event.target.dataset.propertyName = event.target.value;
            if (event.target.parentNode) {
                for (
                    let i = 1;
                    i < (event.target.parentNode?.childNodes.length ?? 0);
                    i++
                ) {
                    /** @type {HTMLInputElement} */ (
                        event.target.parentNode.childNodes[i]
                    ).disabled = false;
                }
            }
        } else {
            if (event.target.parentNode) {
                for (
                    let i = 1;
                    i < (event.target.parentNode.childNodes.length ?? 0);
                    i++
                ) {
                    /** @type {HTMLInputElement} */ (
                        event.target.parentNode.childNodes[i]
                    ).disabled = true;
                }
            }
        }
        let next = /** @type {HTMLInputElement} */ (event.target.nextSibling);
        while (next) {
            next.dataset.propertyName = event.target.value;
            next = /** @type {HTMLInputElement} */ (next.nextSibling);
        }
        if (
            event.target.value &&
            event.target.value.length &&
            !event.target.parentNode?.nextSibling
        ) {
            event.target.parentNode?.parentNode?.appendChild(
                this.createRow(event.target.dataset.propertyIndex, null)
            );
        }
        if (!event.target.value || !event.target.value.length) {
            let allEmpty = true;
            for (
                let i = 0;
                i < (event.target.parentNode?.childNodes.length ?? 0);
                i++
            ) {
                if (
                    /** @type {HTMLInputElement} */ (
                        event.target.parentNode?.childNodes[i]
                    ).value &&
                    /** @type {HTMLInputElement} */ (
                        event.target.parentNode?.childNodes[i]
                    ).value.length
                ) {
                    allEmpty = false;
                    break;
                }
            }
            if (allEmpty) {
                if (event.target.value) {
                    delete this._wpp[event.target.dataset.propertyIndex ?? "0"]
                        .properties[event.target.value];
                }
                event.target.parentNode?.parentNode?.removeChild(
                    event.target.parentNode
                );
            }
        }
        this.emitChange();
    }

    /**
     * @param {Event & { target: HTMLInputElement }} event
     * @returns {void}
     */
    updatePropertyValue(event) {
        if (!this._wpp[event.target.dataset.propertyIndex ?? "0"]) {
            return;
        }
        this._wpp[event.target.dataset.propertyIndex ?? "0"].properties[
            event.target.dataset.propertyName
        ][event.target.dataset.valueIndex] = event.target.value;
        if (!event.target.nextSibling) {
            let pValue = this.createInput(
                "",
                this.updatePropertyValue.bind(this)
            );
            pValue.dataset.propertyName = event.target.dataset.propertyName;
            pValue.dataset.propertyIndex = event.target.dataset.propertyIndex;
            pValue.dataset.valueIndex = (
                Number.parseInt(event.target.dataset.valueIndex ?? "0", 10) + 1
            ).toString();
            pValue.classList.add("empty");
            event.target.parentNode?.appendChild(pValue);
        }
        if (!event.target.value || !event.target.value.length) {
            event.target.classList.add("empty");
        } else {
            event.target.classList.remove("empty");
        }
        if (
            (!event.target.value || !event.target.value.length) &&
            event.target.nextSibling
        ) {
            let parent = event.target.parentNode;
            this._wpp[event.target.dataset.propertyIndex ?? "0"].properties[
                event.target.dataset.propertyName
            ].splice(event.target.dataset.valueIndex, 1);
            if (parent) {
                parent.removeChild(event.target);
                for (let i = 1; i < parent.childNodes.length; i++) {
                    /** @type {HTMLInputElement} */ (
                        parent.childNodes[i]
                    ).dataset.valueIndex = (i - 1).toString();
                }
            }
        }
        this.emitChange();
    }

    /**
     * @param {string} error
     * @returns {void}
     */
    processError(error) {
        this.alertText.innerHTML = "";
        switch (error) {
            case WPP.ErrorNoGroups:
                return; // nop
            case WPP.ErrorNoType:
                return; // nop
            case WPP.ErrorTypeHasMultipleNames:
                this.alertText.innerHTML =
                    "W++ type (character) has multiple names";
                break; // nop
            case WPP.ErrorBadAttribute:
                this.alertText.innerHTML = "Error parsing W++ attribute";
                break; // nop; // nop
            default:
                this.alertText.innerHTML = error;
                break;
        }
        this.alert.classList.remove("hidden");
        this.error = true;
        this.emit("error", { target: this, error: error });
    }

    /**
     * @returns {void}
     */
    clear() {
        this._wpp = [];
        this.appendix = null;
        this.editor.innerHTML = "";
        this.alert.classList.add("hidden");
    }

    /**
     * @param {import("../../types/WPlusPlusArray.js").default} value
     * @returns {void}
     */
    set wpp(value) {
        try {
            WPP.validate(value);
            this._wpp = JSON.parse(JSON.stringify(value)); // make copy
            this.error = false;
        } catch (e) {
            this.processError(e);
        } finally {
            this.refresh();
        }
    }

    /**
     * @returns {import("../../types/WPlusPlusArray.js").default}
     */
    get wpp() {
        return WPP.validate(this._wpp);
    }

    /**
     * @param {string} value
     * @returns {void}
     */
    set text(value) {
        try {
            let parsed = WPP.parseExtended(value);
            this._wpp = parsed.wpp;
            this.appendix = parsed.appendix ? parsed.appendix.trim() : null;
            this.error = false;
        } catch (e) {
            this.appendix = value;
            this.processError(e);
        } finally {
            this.refresh();
        }
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.getText();
    }

    /**
     * @returns {string}
     */
    get display() {
        return this.container.style.display;
    }

    /**
     * @param {string} value
     * @returns {void}
     */
    set display(value) {
        this.container.style.display = value;
    }

    /**
     * @param {("line")=} format
     * @returns {string}
     */
    getText(format) {
        let str = WPP.stringify(WPP.trim(this._wpp), format) || "";
        if (format === "line") {
            return (
                str +
                (this.appendix ? " " + this.appendix.replace(/\n/g, "") : "")
            );
        } else {
            return (
                str +
                (this.appendix
                    ? (str && str.length ? "\n" : "") + this.appendix
                    : "")
            );
        }
    }

    /**
     * Event emitting
     * @returns {void}
     */
    emitChange() {
        this.emit("change", {
            target: this,
        });
    }
}
