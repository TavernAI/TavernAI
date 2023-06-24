import {EventEmitter} from "./EventEmitter.mjs";
import {UIFactory} from "./UIFactory.mjs";

export class UIFolderContent extends EventEmitter {
    static EVENT_SELECTED = "folder_content_selected";
    static EVENT_BUTTON = "folder_content_button";
    static EVENT_DELETED = "folder_content_deleted";
    static EVENT_RENAMED = "folder_content_renamed";

    static dragged;

    name;
    uid;

    parent;
    container;
    main;

    folder = false;
    payload;

    _hidden = false;

    constructor(options) {
        super();
        this.name = options.name;
        this.uid = options.uid;
        this.payload = options.payload || {};
        this.parent = options.parent;
        this.filesAllowed = options.filesAllowed || null;

        this.container = document.createElement("li");
        this.container.classList.add("folder-content");
        this.container.setAttribute("filename", options.uid);
        this.container.setAttribute("draggable", "true");

        this.main = document.createElement("div");
        this.container.appendChild(this.main);

        if(options.content) {
            options.content.forEach(c => {
                this.main.appendChild(UIFactory.create(c));
            });
        }

        if(options.buttons) {
            for(let key in options.buttons) {
                let val = options.buttons[key];
                if(typeof val === "boolean") {
                    let item;
                    switch(key.toLowerCase()) {
                        case "rename":
                            item = UIFactory.create({
                                nodeName: "button",
                                class: "rename",
                                attributes: {
                                    title: "Change name",
                                },
                                onclick: this.dialogueRename.bind(this)
                            });
                            break;
                        case "delete":
                            item = UIFactory.create({
                                nodeName: "button",
                                class: "delete",
                                attributes: {
                                    title: "Delete"
                                },
                                onclick: this.dialogueDelete.bind(this)
                            });
                            break;
                        case "deleteRecursive":
                            item = UIFactory.create({
                                nodeName: "button",
                                class: "delete",
                                attributes: {
                                    title: "Delete this and any children",
                                },
                                onclick: this.dialogueDelete.bind(this, true)
                            });
                            break;
                    }
                    if(item) {
                        this.main.appendChild(item);
                    }
                } else {
                    let item = UIFactory.create(val);
                    item.onclick = function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.emit(UIFolderContent.EVENT_BUTTON, { action: val.action, propagate: true });
                    }.bind(this)
                    this.main.appendChild(item);
                }
            }
        }

        this.main.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.emit(UIFolderContent.EVENT_SELECTED, { propagate: true });
        }.bind(this);

        this.container.ondrag = this.onDrag.bind(this);
        this.container.ondragover = this.onDragOver.bind(this);
        this.container.ondragleave = this.onDragLeave.bind(this);
        this.container.ondrop = this.onDropContainer.bind(this);
        this.main.ondrop = this.onDrop.bind(this);
    }

    get hidden() { return this._hidden; }
    set hidden(value) {
        this._hidden = value;
        if(this._hidden) {
            this.container.classList.add("hidden");
        } else {
            this.container.classList.remove("hidden");
        }
    }

    onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        UIFolderContent.dragged = this;
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.container.classList.add("dragover");
    }

    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.container.classList.remove("dragover");
    }

    onDrop(event) {
        event.preventDefault();
        if(event.dataTransfer.items.length) {
            UIFolderContent.dragged = null;
            return;
        }
        event.stopPropagation();
        this.container.classList.remove("dragover");
        UIFolderContent.dragged = null;
    }

    onDropContainer(event) {
        event.preventDefault();
        this.container.classList.remove("dragover");
        UIFolderContent.dragged = null;
    }

    dialogueDelete(event) {
        event.preventDefault();
        event.stopPropagation();
        if(!confirm("Delete \"" + this.name + "\"?")) { return; }
        this.delete();
    }
    dialogueRename(event) {
        event.preventDefault();
        event.stopPropagation();
        let candidate = prompt("Rename \"" + this.name + "\" to:", this.name);
        if(!candidate) { return; }
        this.rename(candidate);
    }

    delete(recursive, noEmit = false) {
        this.off();
        let oldParent = this.parent;
        if(this.parent) {
            this.parent.removeChild(this);
        }
        if(this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        if(!noEmit) {
            this.emit(UIFolderContent.EVENT_DELETED, { parent: oldParent, propagate: true });
        }
        this.parent = null;
        this.payload = null;
    }

    rename(candidate) {
        let oldName = this.name;
        if(candidate === this.name) {
            return;
        }
        this.name = this.parent.getValidName(candidate, true);
        for(let key = 0; key < this.main.children.length; key++) {
            const child = this.main.children[key];
            if(child.classList.contains("name")) {
                child.innerHTML = this.name;
            }
        }
        this.emit(UIFolderContent.EVENT_RENAMED, { oldName: oldName, propagate: true });
    }

    refreshImages() {
        let els = this.container.getElementsByTagName("img");
        for(let i = 0; i < els.length; i++) {
            let src = els[i].getAttribute("src");
            if(src) {
                els[i].setAttribute("src", src.replace(/\?.*/, "?v=" + Date.now()));
            }
        }
    }

    getSimple() {
        return {
            name: this.name,
            uid: this.uid
        };
    }
}