import {UIFolderContent} from "./UIFolderContent.mjs";

export class UIFolder extends UIFolderContent {
    static SORTERS = {
        NAME: (a, b) => {
            if((a.folder && b.folder) || (!a.folder && !b.folder)) return a.name.localeCompare(b.name);
            return a.folder ? -1 : 1;
        },
        NAME_DESC: (a, b) => {
            if((a.folder && b.folder) || (!a.folder && !b.folder)) return b.name.localeCompare(a.name);
            return a.folder ? -1 : 1;
        }
    }

    static EVENT_DROP_ITEM = "folder_drop_item";

    lastSorter = UIFolder.SORTERS.NAME;

    folder = true;
    _opened = false;

    children;
    childContainer;

    constructor(options) {
        super(options);

        this.opened = options.opened || !this.parent;
        this.hidden = this.parent ? !this.parent.opened : false;

        this.container.classList.remove("folder_content");
        this.container.classList.add("folder");

        this.childContainer = document.createElement("ul");
        this.childContainer.classList.add("children");

        this.container.appendChild(this.childContainer);

        this.children = [];

        (options.children || []).forEach(child => {
            let instance;
            child.parent = this;
            child.sorter = options.sorter || this.lastSorter;
            if(child.children) {
                instance = new UIFolder(child);
            } else {
                instance = new UIFolderContent(child);
            }
            if(instance) {
                this.children.push(instance);
                this.childContainer.appendChild(instance.container);
            }
        });
        this.sort(options.sorter || this.lastSorter);
        this.updateEmpty();

        this.on(UIFolderContent.EVENT_SELECTED, this.onSelected.bind(this));

        this.main.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.emit(UIFolderContent.EVENT_SELECTED, { propagate: true });
        }.bind(this);

        this.main.ondrop = this.onDrop.bind(this);
    }

    get opened() { return this._opened; }
    set opened(value) {
        this._opened = value;
        if(this._opened) {
            this.container.classList.add("opened");
        } else {
            this.container.classList.remove("opened");
        }
    }

    updateEmpty() {
        if(this.children.length) {
            this.container.classList.remove("empty");
        } else {
            this.container.classList.add("empty");
        }
    }

    onDrop(event) {
        event.preventDefault();
        /*
        if(event.dataTransfer.items.length) {
            UIFolderContent.dragged = null;
            return;
        }
        */
        event.stopPropagation();
        if(!UIFolderContent.dragged || UIFolderContent.dragged === this) {
            UIFolderContent.dragged = null;
            return;
        }
        let target = this;
        if(UIFolderContent.dragged.parent && UIFolderContent.dragged.parent === this && this.parent) {
            target = this.parent;
        }
        target.appendChild(UIFolderContent.dragged);
        target.sort();
        this.container.classList.remove("dragover");
        let wasDragged = UIFolderContent.dragged;
        UIFolderContent.dragged = null;
        this.emit(UIFolder.EVENT_DROP_ITEM, { item: wasDragged, propagate: true });
    }

    appendChild(target) {
        if(target.parent) {
            target.parent.removeChild(target);
        }
        target.parent = this;
        this.children.push(target);
        this.childContainer.appendChild(target.container);
        if(this.opened) {
            target.hidden = false;
        } else {
            target.hidden = true;
        }
        if(target.children) {
            target.opened = false;
        }
        this.updateEmpty();
    }

    removeChild(target) {
        let index = this.children.indexOf(target);
        if(index < 0) { return; }
        this.children.splice(index, 1);
        if(target.container.parentNode) {
            target.container.parentNode.removeChild(target.container);
        }
        this.updateEmpty();
    }

    addFolder(options) {
        options.name = (options.name || "")
            .trim()
            .replace(/\s+/g, " ");
        if(!options.name || !options.name.length) {
            return "Cannot use this folder name.";
        }
        if(this.children.filter(child => child.folder && child.name.toLowerCase() == options.name.toLowerCase()).length > 0) {
            return "Folder already exists.";
        }
        options.parent = this;
        let instance = new UIFolder(options);
        this.children.push(instance);
        this.childContainer.appendChild(instance.container);
        this.sort();
        return instance;
    }

    addContent(options) {
        options.name = (options.name || "")
            .trim()
            .replace(/\s+/g, " ");
        if(!options.name || !options.name.length) {
            return "Cannot use this content name.";
        }
        if(this.children.filter(child => !child.folder && child.name.toLowerCase() === options.name.toLowerCase()).length > 0) {
            return "Content already exists";
        }
        options.parent = this;
        let instance = new UIFolderContent(options);
        this.children.push(instance);
        this.childContainer.appendChild(instance.container);
        this.updateEmpty();
        this.sort();
        return instance;
    }

    findContent(terms) {
        let ret;
        this.children.every(child => {
            if(child.children) {
                ret = child.findContent(terms);
            } else if(
                (terms.uid && terms.uid === child.uid) ||
                (terms.name && terms.name === child.name)
            ) {
                ret = child;
            }
            return !ret;
        });
        return ret;
    }

    sort(sorter) {
        if(!sorter) {
            sorter = this.lastSorter;
        }
        this.lastSorter = sorter;
        this.children.sort(sorter);
        this.children.forEach(child => {
            this.childContainer.appendChild(child.container);
            if(child.folder) {
                child.sort(sorter);
            }
        });
    }

    onSelected(event) {
        this.hidden = false;
        if(event.target === this) {
            if(event.opened !== undefined) {
                this.opened = !event.opened;
            }
            if(this.opened) {
                this.opened = false;
            } else {
                this.opened = true;
                this.children.forEach(child => {
                    child.hidden = false;
                    if(child.folder) {
                        child.opened = false;
                    }
                });
            }
        } else {
            this.opened = !event.bubbled ? !event.target.opened : false;
            this.children.forEach(child => {
                if(child !== event.emitter) {
                    child.hidden = event.bubbled ? true : event.target.opened;
                    if(child.folder) {
                        child.opened = false;
                    }
                }
            });
            event.bubbled = true;
        }
    }

    getSimple() {
        return {
            name: this.name,
            /*opened: this.opened,*/
            children: this.children.map(ch => ch.getSimple())
        };
    }

    getValidName(candidate, notFolder = false) {
        if(!candidate) { candidate = "(new)"; }
        candidate = candidate.trim().replace(/\s+/g, " ");
        let match = false;
        let suffix = "";
        let i = 0;
        do {
            match = false;
            suffix = i === 0 ? "" : "#" + i;
            this.children.every(child => {
                if(child.folder === !notFolder && child.name.toLowerCase() === candidate.toLowerCase() + suffix) {
                    match = true;
                    return false;
                }
                return true;
            });
            i++;
        } while(match);
        return candidate + (suffix ? " " + suffix : "");
    }

    findCharacterNode(compareFn) {
        if(!compareFn || typeof compareFn !== "function") {
            return;
        }
        let result;
        this.children.every(item => {
            if(item.folder) {
                result = item.findCharacterNode(compareFn);
            } else {
                console.warn(item.name);
                if(compareFn(item)) {
                    result = item;
                }
            }
            return result ? false : true;
        });
        return result;
    }

    filter(rules, root = true) {
        let valid = [];
        this.children.forEach(child => {
            if(child.folder) {
                valid = valid.concat(
                    child.filter(rules, false)
                );
            } else {
                if(rules && rules.name && rules.name.length) {
                    if(child.name.toLowerCase().match(rules.name.toLowerCase())) {
                        child.container.classList.remove("hidden");
                        valid.push(child);
                    } else {
                        child.container.classList.add("hidden");
                    }
                } else {
                    child.container.classList.remove("hidden");
                }
            }
        });
        if(root) {
            valid.sort(this.lastSorter).forEach(child => {
                this.childContainer.appendChild(child.container);
            });
        }
        if(!rules && !root) {
            this.sort();
        }
        return valid;
    }

    refreshImages() {
        super.refreshImages();
        this.children.forEach(child => {
            child.refreshImages();
        });
    }

    dialogueDelete(event) {
        event.preventDefault();
        event.stopPropagation();
        if(!confirm("Remove folder \"" + this.name + "\"? All contents will be moved to the parent folder.")) { return; }
        this.delete();
    }
    delete(recursive, noEmit = false) {
        if(recursive) {
            this.children.forEach(child => {
                child.delete(recursive, noEmit);
            });
        } else if(this.parent) {
            this.children.forEach(child => {
                this.parent.appendChild(child);
            });
            this.parent.sort();
        }
        this.children.length = 0;
        this.off();
        if(UIFolderContent.dragged === this) {
            UIFolderContent.dragged = null;
        }
        let oldParent = this.parent;
        if(this.parent) {
            this.parent.removeChild(this);
        }
        if(this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        if(!noEmit) {
            this.emit(UIFolderContent.EVENT_DELETED, { parent: oldParent, propagate: true, target: this });
        }
        this.parent = null;
    }
}