import {EventEmitter} from "./EventEmitter.mjs";
import {UICharPerson} from "./UICharPerson.mjs";
import {CharacterManager} from "./CharacterManager.mjs";

export class UICharFolder extends EventEmitter {
    static SORTERS = {
        NAME: (a, b) => {
            if((a.folder && b.folder) || (!a.folder && !b.folder)) return a.name.localeCompare(b.name);
            return a.folder ? -1 : 1;
        },
        NAME_DESC: (a, b) => {
            if((a.folder && b.folder) || (!a.folder && !b.folder)) return b.name.localeCompare(a.name);
            return a.folder ? -1 : 1;
        },
        DATE_ADD: (a, b) => {
            if(a.folder && b.folder) return a.name.localeCompare(b.name);
            if(!a.folder && !b.folder) return a.add_date_local - b.add_date_local;
            return a.folder ? -1 : 1;
        },
        DATE_ADD_DESC: (a, b) => {
            if(a.folder && b.folder) return b.name.localeCompare(a.name);
            if(!a.folder && !b.folder) return b.add_date_local - a.add_date_local;
            return a.folder ? -1 : 1;
        },
        DATE_ACTION: (a, b) => {
            if(a.folder && b.folder) return a.name.localeCompare(b.name);
            if(!a.folder && !b.folder) return a.last_action_date - b.last_action_date;
            return a.folder ? -1 : 1;
        },
        DATE_ACTION_DESC: (a, b) => {
            if(a.folder && b.folder) return a.name.localeCompare(b.name);
            if(!a.folder && !b.folder) return b.last_action_date - a.last_action_date;
            return a.folder ? -1 : 1;
        }
    }
    static LAST_SORT = UICharFolder.SORTERS.NAME;

    static FOLDER_DELETED = "folder_delete";
    static SAVE_NEEDED = "save_needed";

    container;
    childContainer;
    nameTag;
    opened;
    children;
    folder = true;
    name;
    parent;

    constructor(datum, characters) {
        super();
        this.opened = datum.opened;
        this.name = datum.name;
        this.activeFolder = this;

        this.container = document.createElement("li");
        this.container.classList.add("folder_select");
        this.container.classList.add("folder");

        let main = document.createElement("div");
        this.container.appendChild(main);

        if(this.opened) {
            this.container.classList.add("opened");
        } else {
            this.container.classList.remove("opened");
        }

        let avatar = document.createElement("div");
            avatar.classList.add("avatar");
            main.appendChild(avatar);
        this.nameTag = document.createElement("div");
            this.nameTag.classList.add("ch_name_menu");
            this.nameTag.appendChild(document.createTextNode(datum.name));
            main.appendChild(this.nameTag);

        let del = document.createElement("div");
            del.classList.add("delete");
            del.onclick = this.delete.bind(this);
            del.setAttribute("title", "Delete folder");
            main.appendChild(del);

        let ren = document.createElement("div");
            ren.classList.add("rename");
            ren.onclick = this.rename.bind(this);
            ren.setAttribute("title", "Rename folder");
            main.appendChild(ren);

        this.childContainer = document.createElement("ul");
        this.childContainer.classList.add("children");

        this.container.appendChild(this.childContainer);

        this.children = [];

        (datum.children || []).forEach(child => {
            let instance;
            if(child.folder) {
                instance = new UICharFolder(child, characters);
                instance.on(UICharPerson.CHARACTER_SELECT, function(event) {
                    this.emit(UICharPerson.CHARACTER_SELECT, event);
                }.bind(this));
                instance.on(UICharPerson.CHARACTER_DELETE, this.onCharacterDelete.bind(this));
                instance.on(UICharFolder.SAVE_NEEDED, this.itemMoved.bind(this));
                instance.parent = this;
                this.children.push(instance);
                this.childContainer.appendChild(instance.container);
            } else {
                let char;
                characters.every((ch, i) => {
                    if(ch.filename === child.filename) {
                        char = characters.splice(i, 1)[0];
                        return false;
                    }
                    return true;
                });
                if(char) {
                    this.addCharacter(char);
                }
            }
        });
        this.sort();

        if(!this.children.length) {
            this.container.classList.add("empty");
        }

        main.onclick = this.onClick.bind(this, false);

        this.container.setAttribute("draggable", "true");

        this.container.ondrop = this.onDrop.bind(this);
        this.container.ondragover = this.onDragOver.bind(this);
        this.container.ondragleave = this.onDragLeave.bind(this);
        this.container.ondrag = this.onDrag.bind(this);
    }

    onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        CharacterManager.dragged = this;
    }

    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        let item;
        CharacterManager.activeFolder.children.every((child, i) => {
            if(child.name === CharacterManager.dragged.name) {
                item = CharacterManager.activeFolder.children.splice(i, 1)[0];
                return false;
            }
            return true;
        });
        if(item) {
            if(this === CharacterManager.activeFolder) {
                item.container.classList.add("hidden");
                this.parent.children.push(item);
                this.parent.sort();
                this.parent.refreshEmpty();
            } else {
                this.children.push(item);
                this.sort();
            }
            this.refreshEmpty();
        }
        CharacterManager.dragged = null;
        this.container.classList.remove("dragover");
        this.emit(UICharFolder.SAVE_NEEDED, {});
        this.refreshEmpty();
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
        let instance = new UICharFolder(options, {});
        instance.on(UICharFolder.SAVE_NEEDED, this.itemMoved.bind(this));
        instance.parent = this;
        this.children.push(instance);
        this.childContainer.appendChild(instance.container);
        this.sort();
        return null;
    }

    addCharacter(datum) {
        if(this.children.filter(item => item.filename === datum.filename).length > 0) {
            return;
        }
        let instance = new UICharPerson(datum);
        instance.on(UICharPerson.CHARACTER_SELECT, function(event) {
            this.emit(UICharPerson.CHARACTER_SELECT, event);
        }.bind(this));
        instance.on(UICharPerson.CHARACTER_DELETE, this.onCharacterDelete.bind(this));
        instance.on(UICharFolder.SAVE_NEEDED, this.itemMoved.bind(this));
        instance.parent = this;
        this.children.push(instance);
        this.childContainer.appendChild(instance.container);
        return instance;
    }

    folderDeleted(event) {
        if(!event.nested) {
            this.children.forEach((child, i) => {
                if(child.folder && child.name === event.name) {
                    this.childContainer.removeChild(child.container);
                    this.children.splice(i, 1)[0];
                }
            });
            event.children.forEach((child, i) => {
                this.children.push(child);
            });
            event.active = this;
            event.nested = true;
            this.sort();
        }
    }

    itemMoved(event) {
        event.nested = true;
        this.emit(UICharFolder.SAVE_NEEDED, event);
        this.refreshEmpty();
    }

    onCharacterDelete(event) {
        this.emit(UICharPerson.CHARACTER_DELETE, event);
    }

    delete(event) {
        event.preventDefault();
        event.stopPropagation();
        if(confirm("Delete \"" + this.name + "\"? All contents will be moved to parent folder.")) {
            this.parent.children.forEach((ch, i) => {
                if(ch.folder && ch.name === this.name) {
                    this.parent.children.splice(i, 1);
                    i--;
                }
            });
            this.children.forEach(child => {
                this.parent.children.push(child);
                child.parent = this.parent;
                child.off(UICharPerson.CHARACTER_SELECT);
                child.off(UICharPerson.CHARACTER_DELETE);
                child.off(UICharFolder.SAVE_NEEDED);
                if(child.folder) {
                    child.on(UICharPerson.CHARACTER_SELECT, function(event) {
                        this.parent.emit(UICharPerson.CHARACTER_SELECT, event);
                    }.bind(this.parent));
                    child.on(UICharFolder.SAVE_NEEDED, this.itemMoved.bind(this.parent));
                } else {
                    child.on(UICharPerson.CHARACTER_SELECT, function(event) {
                        this.emit(UICharPerson.CHARACTER_SELECT, event);
                    }.bind(this.parent));
                    child.on(UICharPerson.CHARACTER_DELETE, this.onCharacterDelete.bind(this.parent));
                    child.on(UICharFolder.SAVE_NEEDED, this.itemMoved.bind(this.parent));
                }
            });
            this.parent.sort();
            this.onClick(false);
            this.destroy();
            this.emit(UICharFolder.SAVE_NEEDED, {});
        }
    }

    rename(event) {
        event.preventDefault();
        event.stopPropagation();
        let candidate = prompt("Rename folder \"" + this.name + "\" to:", this.name);
        if(candidate === this.name) {
            return;
        }
        this.name = this.getFolderName(candidate);
        this.nameTag.innerHTML = this.name;
        this.emit(UICharFolder.SAVE_NEEDED, {});
    }

    sort(sorter) {
        if(!sorter) {
            sorter = UICharFolder.LAST_SORT;
        }
        this.children.sort(sorter);
        this.children.forEach(child => {
            this.childContainer.appendChild(child.container);
            if(child.folder) {
                child.sort(sorter);
            }
        });
    }

    show() {
        this.opened = true;
        this.container.classList.remove("hiddenParent");
        this.container.classList.remove("hidden");
        this.children.forEach(child => {
            child.container.classList.remove("hidden");
        });
    }

    hide(isParent) {
        this.opened = true;
        if(isParent) {
            this.container.classList.add("hiddenParent");
            this.container.classList.remove("hidden");
            this.children.forEach(child => {
                child.container.classList.add("hidden");
            });
        } else {
            this.container.classList.remove("hiddenParent");
            this.container.classList.add("hidden");
            this.children.forEach(child => {
                child.container.classList.remove("hidden");
            });
        }
    }

    onClick(noEmit, event) {
        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.opened = !this.opened;
        if(this.opened) {
            this.parent.hide(true);
            this.container.classList.add("opened");
            this.container.classList.remove("hidden");
            CharacterManager.activeFolder = this;
        } else {
            this.parent.show();
            this.container.classList.remove("opened");
            CharacterManager.activeFolder = this.parent;
        }
    }

    refreshEmpty() {
        if(this.children.length) {
            this.container.classList.remove("empty");
        } else {
            this.container.classList.add("empty");
        }
    }

    getSimple() {
        return {
            name: this.name,
            folder: true,
            /*opened: this.opened,*/
            children: this.children.map(ch => ch.getSimple())
        };
    }

    getFolderName(candidate) {
        let match = false;
        let suffix = "";
        let i = 0;
        do {
            match = false;
            suffix = i === 0 ? "" : " #" + i;
            this.children.every(child => {
                if(child.folder && child.name.toLowerCase() === candidate.toLowerCase() + suffix) {
                    match = true;
                    return false;
                }
                return true;
            });
            i++;
        } while(match);
        return candidate + suffix;
    }

    findCharacterNode(options) {
        let result;
        this.children.every(item => {
            if(item.folder) {
                result = item.findCharacterNode(options);
            } else {
                if(options.filename && item.filename === options.filename) {
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
            valid.sort(UICharFolder.LAST_SORT).forEach(child => {
                this.childContainer.appendChild(child.container);
            });
        }
        if(!rules && !root) {
            this.sort();
        }
        return valid;
    }

    destroy() {
        super.destroy();
        this.children = null;
        this.parent = null;
        if(this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}