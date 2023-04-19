import {encode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Resizable} from "./Resizable.mjs";
import {UIFactory} from "./UIFactory.mjs";
import {UIWorldInfoDetails} from "./UIWorldInfoDetails.mjs";

/**
 * "Notes" window
 */
export class UIWorldInfoMain extends Resizable {
    select;
    timerSave;
    durationSave = 300;
    data;
    editor;

    buttonDelete;

    detailsMaster;
    details = {};

    worldName = null;
    worldNames = [];

    /**
     * @param options
     *      root (JQuery root element of the message)
     *      save (function to call to initiate data save)
     */
    constructor(options) {
        super({
            root: options.root,
            uid: "worldinfo",
            top: 0.3,
            left: 0.3,
            right: 0.7,
            bottom: 0.7
        });
        this.worldName = options.worldName || null;
        this.metaSave = options.metaSave || null;

        this.select = this.findChildWithType("select", this.header);
        this.buttonDelete = this.findChildWithClass("delete", this.header);
        this.buttonDelete.setAttribute("disabled", "disabled");
        this.buttonDelete.onclick = this.deleteWorld.bind(this);
        this.findChildWithClass("create", this.header).onclick = this.createWorld.bind(this);
        this.editor = this.content;

        let imp = document.getElementById("world_import_file");
        if(imp) {
            imp.onchange = function(inputImport, event) {
                if(!inputImport.files || !inputImport.files[0]) { return; }
                if(event.target.nextElementSibling) {
                    event.target.nextElementSibling.value = event.target.files[0].name;
                    event.target.nextElementSibling.setAttribute("value", event.target.files[0].name);
                }
                this.importWorld(inputImport.parentNode, event.target.files[0].name, event.target.files[0]);
            }.bind(this, imp)
        }

        this.detailsMaster = document.getElementById("shadow_worldinfo_details_popup");
        if(this.detailsMaster) {
            this.detailsMaster.parentNode.removeChild(this.detailsMaster);
        }

        // load
        this.refreshSelect();
        try {
            if(this.worldName) {
                this.loadWorld(this.worldName);
            }
        } catch(e) {
            // no world probably
            this.worldName = null;
            if(this.metaSave) {
                this.metaSave(null);
            }
        }

        document.getElementById("option_toggle_worldinfo").onclick = this.show.bind(this);
    }

    get entriesArray() {
        return Object.values(this.data.entries);
    }
    set entriesArray(arr) {
        this.data.entries = {};
        arr.forEach((v, i) => {
            this.data.entries[v.uid] = v;
        });
    }

    getEntry(index) {
        return this.data.entries[index] || null;
    }

    setEntry(index, value) {
        return this.data.entries[index] = value;
    }

    hide() {
        for(let key in this.details) {
            this.details[key].hide();
        }
        super.hide();
    }

    getSelects() {
        return [ document.getElementById("worldinfo_select"), this.select ];
    }

    /*
    show() {
        for(let key in this.details) {
            this.details[key].show();
        }
        super.show();
    }
    */

    async refreshSelect() {
        this.requestWorldNames().then(worldNames => {
            this.getSelects().forEach(sel => {
                sel.onchange = this.onSelect.bind(this);
                sel.innerHTML = "";
                let opt = document.createElement("option");
                opt.setAttribute("value", "");
                if(!this.worldName) {
                    opt.setAttribute("selected", "selected");
                }
                opt.appendChild(document.createTextNode("(none)"));
                sel.appendChild(opt);
                this.worldNames = worldNames;
                worldNames.forEach(name => {
                    let opt = document.createElement("option");
                    opt.setAttribute("value", name);
                    if(this.worldName === name) {
                        opt.setAttribute("selected", "selected");
                    }
                    opt.appendChild(document.createTextNode(name.replace(/_/g, " ")));
                    sel.appendChild(opt);
                });
                sel.value = this.worldName || "";
            });
        }, e => {
            console.error("UIWorldInfoMain could not load list of existing world names.");
            return;
        });
    }

    refresh() {
        for(let key in this.details) {
            this.details[key].destroy();
            delete this.details[key];
        }
        this.editor.innerHTML = "";
        if(!this.data || !this.data.entries) { return; }
        let arr = this.entriesArray;
        this.entriesArray = arr.sort((a, b) => (a.order !== undefined ? a.order : 9999) - (b.order !== undefined ? b.order : 9999));
        let max = 0;
        arr.forEach((v, i) => {
            v.order = i;
            this.editor.appendChild(this.createEntry(i, v));
            max = i;
        });

        this.adder = this.createAddEntry();
        this.editor.appendChild(this.adder);

        this.evaluateOrder();
    }
    
    getRow(node) {
        while(node && !node.classList.contains("row")) {
            node = node.parentNode;
        }
        return node;
    }

    createEntry(index, data) {
        let row = document.createElement("div");
        row.classList.add("row");
        row.index = index;
        row.uid = data.uid;

        row.appendChild(UIFactory.createButton({
            image: "img/arrow_up.png", class: "inline button-up", title: "Move up", onclick: this.onMoveItem.bind(this, { by: -1 })
        }));
        row.appendChild(UIFactory.createButton({
            image: "img/arrow_down.png", class: "inline button-down", title: "Move down", onclick: this.onMoveItem.bind(this, { by: 1 })
        }));

        let tags = document.createElement("span");
            tags.classList.add("tags");
            tags.appendChild(document.createTextNode(data.key.join(", ")));
            tags.setAttribute("title", "Edit entry");
            tags.onclick = this.onOpenDetail.bind(this, {});
        row.appendChild(tags);

        let tokens = document.createElement("span");
            tokens.classList.add("tokens");
            tokens.setAttribute("title", "Number of tokens for this entry");
            tokens.innerHTML = this.getTokenCount(data).toString();
        row.appendChild(tokens);

        /*row.appendChild(UIFactory.createButton({
            image: "img/clone.png", class: "inline", title: "Create a copy", onclick: this.onCloneItem.bind(this, { })
        }));*/
        row.appendChild(UIFactory.createButton({
            image: "img/del_mes.png", class: "inline", title: "Delete", onclick: this.onDeleteItem.bind(this, { })
        }));

        return row;
    }

    createAddEntry() {
        let row = document.createElement("div");
        row.classList.add("row");
        row.classList.add("add");
        row.appendChild(document.createTextNode("Add new entry..."));
        row.onclick = function(event) {
            this.onAddEntry({ index: event.target.index, uid: event.target.uid }, event);
        }.bind(this);
        return row;
    }

    normalizeName(name) {
        return (name || "")
            .trim()
            .replace(/s+/g, " ")
            .replace(/ /g, "_");
    }

    evaluateOrder() {
        for(let i = 0; i < this.editor.children.length; i++) {
            if(this.data.entries[this.editor.children[i].index]) {
                this.data.entries[this.editor.children[i].index].order = i;
            }
            for(let j = 0; j < this.editor.children[i].children.length; j++) {
                this.editor.children[i].index = i;
                const child = this.editor.children[i].children[j];
                if(child.classList.contains("button-up")) {
                    if(i === 0) {
                        child.setAttribute("disabled", "disabled");
                    } else {
                        child.removeAttribute("disabled");
                    }
                }
                if(child.classList.contains("button-down")) {
                    if(i === this.editor.children.length-1) {
                        child.setAttribute("disabled", "disabled");
                    } else {
                        child.removeAttribute("disabled");
                    }
                }
            }
        }
        if(this.data.entries) {
            let uidList = [];
            let max = 0;
            for(let key in this.data.entries) {
                uidList.push(this.data.entries[key].uid);
                max++;
            }
            uidList.sort();
            let i = 0;
            for(; i < uidList.length; i++) {
                if(uidList[i] !== i) {
                    break;
                }
            }
            this.adder.index = max;
            this.adder.uid = i;
        }
    }

    getTokenCount(item) {
        return encode(item.use_wpp && item.wpp ? JSON.stringify(item.wpp) : item.content).length;
    }

    onMoveItem(options, event) {
        let row = this.getRow(event.target);
        options.index = options.index !== undefined ? options.index : row.index;
        options.to = options.to !== undefined ? options.to : options.by !== undefined ? options.index + options.by : undefined;
        if(options.to === undefined) { return; }
        if(options.to < 0 || options.to >= this.data.length) { return; }
        let arr = this.entriesArray;
        let item = arr.splice(options.index, 1)[0];
        arr.splice(options.to > options.index ? options.to : options.to+1, 0, item);
        arr.forEach((v, i) => { v.order = i; });
        this.entriesArray = arr;
        if(options.to >= options.index) {
            row.parentNode.insertBefore(row, row.nextSibling.nextSibling);
        } else {
            if(row.previousSibling) {
                row.parentNode.insertBefore(row, row.previousSibling);
            }
        }
        this.evaluateOrder();
        this.save();
    }

    /* obsolete */
    onCloneItem(options, event) {
        if(!confirm("Make a copy of this item?")) { return; }
        let row = this.getRow(event.target);
        options.index = options.index !== undefined ? options.index : row.index;
        let clone = JSON.parse(JSON.stringify(this.data.entries[options.index]));
        let arr = this.entriesArray;
            arr.splice(options.index, 0, clone);
        this.entriesArray = arr;
        row.parentNode.insertBefore(row.cloneNode(true), row);
        this.evaluateOrder();
        this.save();
    }

    onDeleteItem(options, event) {
        if(!confirm("Are you sure you want to delete this item?")) { return; }
        let row = this.getRow(event.target);
        options.uid = options.uid !== undefined ? options.uid : row.uid;
        if(!this.data.entries[options.uid]) {
            console.error("Cannot find uid: " + options.uid);
            return;
        }
        let order = this.data.entries[options.uid].order;
        if(this.details[options.uid]) {
            this.details[options.uid].destroy();
            delete this.details[options.uid];
            this.details[options.uid] = null;
        }
        row.parentNode.removeChild(row);
        delete this.data.entries[options.uid];
        if(order !== undefined && order !== null) {
            let shared = false;
            for(let uid in this.data.entries) {
                if(this.data.entries[uid].order == order) {
                    shared = true;
                    break;
                }
            }
            if(!shared) {
                for(let uid in this.data.entries) {
                    this.data.entries[uid].order = this.data.entries[uid].order >= order ? this.data.entries[uid].order-1 : this.data.entries[uid].order;
                }
            }
        }
        this.evaluateOrder();
        this.save();
    }

    onSelect(event) {
        this.loadWorld(event.target.value || null);
        this.getSelects().forEach(sel => {
            if(sel !== event.target.value) {
                sel.onselect = null;
                for(let i = 0; i < sel.children.length; i++) {
                    const child = sel.children[i];
                    if(child.getAttribute("value") === event.target.value) {
                        child.setAttribute("selected", "selected");
                    } else {
                        child.removeAttribute("selected");
                    }
                }
                sel.value = event.target.value || "";
                sel.onselect = this.onSelect.bind(this);
            }
        });
        if(this.metaSave) {
            this.metaSave(this.worldName);
        }
    }

    onOpenDetail(options, event) {
        let row = this.getRow(event.target);
        options.index = options.index !== undefined ? options.index : row.index;
        const entry = this.data.entries[options.index];
        for(let key in this.details) {
            this.details[key].unfocus();
        }
        if(!this.details[entry.uid]) {
            this.details[entry.uid] = new UIWorldInfoDetails({
                uid: "worldinfo-" + this.normalizeName(this.worldName) + "-" + entry.uid + "-details",
                root: this.detailsMaster.cloneNode(true),
                top: 0.3,
                left: 0.3,
                right: 0.7,
                bottom: 0.7,

                master: this,
                index: entry.uid,
                save: function(entry) {
                    this.save();
                    event.target.innerHTML = entry.key.join(", ");
                    if(event.target.nextElementSibling) {
                        event.target.nextElementSibling.innerHTML = this.getTokenCount(entry).toString();
                    }
                }.bind(this, entry)
            });
            this.root.parentNode.appendChild(this.details[entry.uid].root);
        }
        this.details[entry.uid].show();
        this.details[entry.uid].focus();
    }

    onAddEntry(options, event) {
        let row = this.getRow(event.target);
        options.index = options.index !== undefined ? options.index : row.index;
        this.data.entries[options.index] = {
            uid: options.uid,
            key: [],
            keysecondary: [],
            comment: "",
            content: "",
            constant: false,
            selective: false,
            order: this.entriesArray.length,
        };
        row.index = options.index+1;
        let newRow = this.createEntry(options.index, this.data.entries[options.index]);
        row.parentNode.insertBefore(newRow, row);
        if(this.details[options.index]) {
            this.details[options.index].destroy();
            delete this.details[options.index];
        }
        this.save();
        this.onOpenDetail({ index: options.uid }, event);
    }

    /* requests */
    async requestWorldNames() {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST',
                url: '/getworldnames',
                data: "{}",
                beforeSend: function(){},
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function(data){
                    resolve(data.world_names || []);
                },
                error: function (jqXHR, exception) {
                    console.error(jqXHR);
                    console.error(exception);
                    reject(jqXHR, exception);
                }
            });
        });
    }

    save() {
        if(this.timerSave) {
            clearTimeout(this.timerSave);
        }
        this.timerSave = setTimeout(() => {
            this.timerSave = null;
            this.saveWorld().catch(e => {
                console.error("Error saving world.");
                console.error(e);
            });
        }, this.durationSave);
    }

    saveWorld() {
        return new Promise((resolve, reject) => {
            if(!this.worldName || !this.worldName.length) {
                return reject("No world loaded");
            }
            jQuery.ajax({
                type: 'POST',
                url: '/saveworld',
                data: JSON.stringify({
                    world_name: this.worldName,
                    data: this.data
                }),
                beforeSend: function(){},
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function(data){
                    resolve();
                },
                error: function (jqXHR, exception) {
                    console.error(jqXHR);
                    console.error(exception);
                    reject(jqXHR, exception);
                }
            });
        });
    }

    loadWorld(name) {
        this.worldName = name === undefined ? null : name && name.length ? name : null;
        this.editor.innerHTML = "";
        if(!name || !name.length) {
            this.buttonDelete.setAttribute("disabled", "disabled");
            return;
        }
        this.buttonDelete.removeAttribute("disabled");

        for(let key in this.details) {
            this.details[key].hide();
            this.details[key].destroy();
        }
        this.details = {};

        jQuery.ajax({
            type: 'POST',
            url: '/loadworld',
            data: JSON.stringify({
                world_name: this.worldName
            }),
            beforeSend: function(){},
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function(data){
                this.data = data || {};
                this.refresh();
            }.bind(this),
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    createWorld() {
        let name = prompt("Enter the world's name.", "Eternal realm of Bob");
        name = this.normalizeName(name);
        if(!name || !name.length) {
            alert("This name cannot be used.");
            return;
        }
        if(this.worldNames.map(v => v.toLowerCase()).indexOf(name.toLowerCase()) >= 0) {
            alert("This name is already in use.");
            return;
        }
        this.worldName = name;
        this.data = { entries: {} };
        this.saveWorld().then(() => {
            this.refreshSelect();
            this.refresh();
        });
    }

    deleteWorld() {
        if(!this.worldName || !this.worldName.length) { return; }
        if(!confirm("Are you sure you want to delete the world: \""+this.worldName+"\"?\n This can't be reversed.")) { return; }

        jQuery.ajax({
            type: 'POST',
            url: '/deleteworld',
            data: JSON.stringify({
                world_name: this.worldName
            }),
            beforeSend: function(){},
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function(data){
                this.worldName = null;
                this.data = data || {};
                this.hide();
                this.refreshSelect();
                if(this.metaSave) {
                    this.metaSave(this.worldName);
                }
            }.bind(this),
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    importWorld(form, worldName, file) {
        let norm = this.normalizeName(worldName.replace(/\.json$/, "")).toLowerCase();
        if(this.worldNames.map(v => v.toLowerCase()).indexOf(norm.toLowerCase()) >= 0) {
            alert("Cannot import. There is already a world named \"" + norm + "\"");
            return;
        }
        let formData = new FormData(form);

        jQuery.ajax({
            type: 'POST',
            url: '/importworld',
            data: formData,
            beforeSend: function(){},
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                this.loadWorld(data.world_name);
                this.refreshSelect();
            }.bind(this),
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    evaluate(messages, sorted) {
        if(!messages || !Array.isArray(messages) || !messages.length) {
            return {
                prepend: [],
                append: [],
            };
        }
        if(!sorted) {
            sorted = this.entriesArray.sort((a, b) => (a.order !== undefined ? a.order : 9999) - (b.order !== undefined ? b.order : 9999));
        }
        let append = [];
        let prepend = [];
        let hasPrimary = [];

        messages.every(msg => {
            if(!msg || !msg.length) {
                return true;
            }
            const message = msg.toLowerCase();
            // primary keys
            for(let i = 0; i < sorted.length; i++) {
                const entry = sorted[i];
                entry.key = entry.key || [];
                if(entry.constant) {
                    (entry.prepend ? prepend : append).push(sorted.splice(i, 1)[0].content);
                    (entry.prepend ? append : prepend).push(null);
                    i--;
                    continue;
                }
                let included = false;
                for(let j = 0; j < entry.key.length; j++) {
                    if(message.includes(entry.key[j].trim().toLowerCase())) {
                        included = true;
                        break;
                    }
                }
                if(included) {
                    if(entry.selective) {
                        hasPrimary.push(entry);
                    } else {
                        (entry.prepend ? prepend : append).push(sorted.splice(i, 1)[0].content);
                        (entry.prepend ? append : prepend).push(null);
                        i--;
                    }
                    continue;
                }
            }
            // secondary keys
            for(let i = 0; i < sorted.length; i++) {
                const entry = sorted[i];
                entry.keysecondary = entry.keysecondary || [];
                if(entry.constant) {
                    (entry.prepend ? prepend : append).push(sorted.splice(i, 1)[0].content);
                    (entry.prepend ? append : prepend).push(null);
                    i--;
                    continue;
                }
                let included = false;
                for(let j = 0; j < entry.keysecondary.length; j++) {
                    if(message.includes(entry.keysecondary[j].trim().toLowerCase())) {
                        included = true;
                        break;
                    }
                }
                if(included) {
                    if(entry.selective) {
                        let inPrimary = hasPrimary.indexOf(entry);
                        if(inPrimary >= 0) {
                            (entry.prepend ? prepend : append).push(hasPrimary.splice(inPrimary, 1)[0].content);
                            (entry.prepend ? append : prepend).push(null);
                            sorted.splice(i, 1);
                            i--;
                        }
                    } else {
                        (entry.prepend ? prepend : append).push(sorted.splice(i, 1)[0].content);
                        (entry.prepend ? append : prepend).push(null);
                        i--;
                    }
                    continue;
                }
            }

            if(prepend.length) {
                let prependReplaces = this.evaluate(prepend.slice(), sorted);
                prepend = prepend.concat(prependReplaces.prepend);
                append = append.concat(prependReplaces.append);
            }
            if(append.length) {
                let appendReplaces = this.evaluate(append.slice(), sorted);
                prepend = prepend.concat(appendReplaces.prepend);
                append = append.concat(appendReplaces.append);
            }
            return true;
        });
        return {
            prepend: prepend,
            append: append
        };
    }

    /* Event emitting */
    emitChange() {
        this.emit("change", {
            target: this
        });
    }
}