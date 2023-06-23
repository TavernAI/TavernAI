import {UIFolder} from "./UIFolder.mjs";
import {UIFolderContent} from "./UIFolderContent.mjs";
import {EventEmitter} from "./EventEmitter.mjs";
import {filterFiles} from "../script.js";

export class CharacterView extends EventEmitter {
    static SORTERS_NAMES = {
        NAME: "A → Z",
        NAME_DESC: "Z → A",
        DATE_ADD: "Import ↓",
        DATE_ADD_DESC: "Import ↑",
        DATE_ACTION: "Chatted ↓",
        DATE_ACTION_DESC: "Chatted ↑"
    }
    static SORTERS = {
        NAME: (a, b) => {
            if((a.children && b.children) || (!a.children && !b.children)) return a.name.localeCompare(b.name);
            return a.children ? -1 : 1;
        },
        NAME_DESC: (a, b) => {
            if((a.children && b.children) || (!a.children && !b.children)) return b.name.localeCompare(a.name);
            return a.children ? -1 : 1;
        },
        DATE_ADD: (a, b) => {
            if(a.children && b.children) return b.name.localeCompare(a.name);
            if(!a.children && !b.children) return b.payload.add_date_local - a.payload.add_date_local;
            return a.children ? -1 : 1;
            
        },
        DATE_ADD_DESC: (a, b) => {
            if(a.children && b.children) return a.name.localeCompare(b.name);
            if(!a.children && !b.children) return a.payload.add_date_local - b.payload.add_date_local;
            return a.children ? -1 : 1;
        },
        DATE_ACTION: (a, b) => {
            if(a.children && b.children) return a.name.localeCompare(b.name);
            if(!a.children && !b.children) return b.payload.last_action_date - a.payload.last_action_date;
            return a.children ? -1 : 1;
            
        },
        DATE_ACTION_DESC: (a, b) => {
            if(a.children && b.children) return a.name.localeCompare(b.name);
            if(!a.children && !b.children) return a.payload.last_action_date - b.payload.last_action_date;
            return a.children ? -1 : 1;
        }
    }

    static EVENT_CHARACTER_SELECT = "character_select";
    static EVENT_CHARACTER_DELETE = "character_delete";
    static EVENT_FILES_IMPORT = "characters_files_import";
    static EVENT_SAVE_FOLDERS = "character_save_folders";

    static EVENT_FILES_TYPE = {
        FORM: "form",
        DROP: "drop"
    }

    container;
    controller;

    folderData;
    characters;

    activeFolder;

    constructor(options) {
        super(options.parent);
        this.container = options.container;
        this.container.classList.add("folders");
        this.container.classList.add("character-screen");

        if(options.input) {
            (options.input.addFolder || []).forEach(item => {
                item.onclick = this.dialogueAddFolder.bind(this);
            });
            (options.input.importFiles || []).forEach(item => {
                item.onchange = this.onFilesFromForm.bind(this);
            });
            if(options.input.sortSelect) {
                let selected;
                for(let key in CharacterView.SORTERS) {
                    let opt = document.createElement("option");
                    opt.appendChild(document.createTextNode(CharacterView.SORTERS_NAMES[key]));
                    opt.setAttribute("value", key);
                    if(!selected) {
                        opt.setAttribute("selected", "selected");
                        selected = key;
                    }
                    options.input.sortSelect.appendChild(opt);
                }
                options.input.sortSelect.value = selected;
                options.input.sortSelect.onchange = function(event) {
                    if(CharacterView.SORTERS[event.target.value.toUpperCase()]) {
                        this.controller.sort(CharacterView.SORTERS[event.target.value.toUpperCase()]);
                    }
                }.bind(this);
            }

            if(options.input.searchInput) {
                options.input.searchInput.onkeyup = this.search.bind(this);
                options.input.searchInput.oncut = this.search.bind(this);
                options.input.searchInput.onpaste = this.search.bind(this);
            }
        }

        window.addEventListener('drop', this.onDrop.bind(this));
        this.container.ondragover = this.onDragover.bind(this);
    }

    refresh(dataIn, characters) {
        // reset
        if(this.controller) {
            this.container.removeChild(this.controller.container);
            this.controller.off();
            this.controller.delete(true);
        }

        this.folderData = dataIn || this.folderData || { children: [] };
        this.characters = characters || this.characters || [];

        let chars = [];
        this.characters.forEach(ch => {
            chars.push(ch);
        });

        let data = JSON.parse(JSON.stringify(this.folderData));

        // create new UI
        let buildOptions = CharacterView.createBuildData(data, chars);
        if(chars.length) {
            chars.forEach(char => {
                buildOptions.children.push(CharacterView.createBuildData({
                    uid: char.filename,
                    name: char.name,
                }, [ char ]));
            });
        }
        this.controller = new UIFolder(buildOptions);
        this.controller.container.classList.add("root");
        this.activeFolder = this.controller;

        this.container.appendChild(this.controller.container);

        // event handling
        this.controller.on(UIFolderContent.EVENT_SELECTED, this.onSelected.bind(this));
        this.controller.on(UIFolderContent.EVENT_BUTTON, this.onButton.bind(this));
        this.controller.on(UIFolderContent.EVENT_DELETED, this.onDeleted.bind(this));
        this.controller.on(UIFolderContent.EVENT_RENAMED, this.onRenamed.bind(this));
        this.controller.on(UIFolder.EVENT_DROP_ITEM, this.onDropItem.bind(this));

        // finalization
        this.controller.sort();
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
    }

    refreshImages() {
        this.controller.refreshImages();
    }

    static createBuildData = function(data, characters) {
        characters = characters || [];
        let item = {};
        item.name = data.name;
        item.content = [
            {
                nodeName: "div",
                class: [ "nameTag", "name" ],
                children: data.name ? [ data.name ] : []
            }
        ];
        if(data.children) {
            item.content.unshift(
                {
                    nodeName: "div",
                    class: "avatar"
                }
            );
            item.buttons = {
                delete: true,
                rename: true
            };
            item.children = [];
            data.children.forEach(child => {
                let built = CharacterView.createBuildData(child, characters);
                if(built) {
                    item.children.push(built);
                }
            });
        } else {
            characters.every((ch, i) => {
                if(ch.filename === data.uid) {
                    let char = characters.splice(i, 1)[0];
                    item.payload = char;
                    item.uid = char.filename;
                    item.content.unshift(
                        {
                            nodeName: "div",
                            class: "avatar",
                            children: [{
                                nodeName: "img",
                                attributes: {
                                    src: "characters/" + char.filename + "?v="+Date.now()
                                }
                            }]
                        }
                    );
                    item.buttons = {
                        delete: true
                    };
                    return false;
                }
                return true;
            });
            if(!item.uid) {
                item = null;
            }
        }
        return item;
    }

    findContent(terms) {
        if(!this.controller) {
            return null;
        }
        return this.controller.findContent(terms);
    }

    search(event) {
        let match = event.target.value;
        if(!match || !match.length) {
            //this.refresh();
            //this.controller.filter();
            this.controller.container.classList.remove("flat");
            $('#rm_folder_order').change();
            
        } else {
            this.controller.container.classList.add("flat");
            this.controller.filter({
                name: match
            });
        }
    }

    getSimple() {
        return this.controller.getSimple();
    }

    // adding
    addCharacter(characterData) {
        let char = new UIFolderContent(
            CharacterView.createBuildData({
                name: characterData.name,
                uid: characterData.filename
            }, [ characterData ])
        );
        this.characters.push(characterData);
        let targetFolder = (this.activeFolder || this.controller);
        targetFolder.appendChild(char);
        targetFolder.sort();
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
        return char;
    }

    dialogueAddFolder(event) {
        let targetFolder = (this.activeFolder || this.controller);
        let name = targetFolder.getValidName("new folder");
        name = prompt("Enter new folder name", name);
        if(!name) { return; }
        name = targetFolder.getValidName(name);
        targetFolder.addFolder(CharacterView.createBuildData({
            name: name,
            children: []
        }));
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
    }

    addFolder(folderName) {
        let fold = new UIFolder(
            CharacterView.createBuildData({
                name: folderName,
                children: []
            }, [])
        );
        let targetFolder = (this.activeFolder || this.controller);
        targetFolder.appendChild(fold);
        targetFolder.sort();
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
    }

    // event handlers
    // native events
    onDragover(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        if(event.dataTransfer.items) {
            let filtered = filterFiles(event.dataTransfer.items, [ "image/webp", "image/png" ]);
            if(filtered.length) {
                this.emit(CharacterView.EVENT_FILES_IMPORT, { files: filtered.map(item => item.getAsFile()), type: CharacterView.EVENT_FILES_TYPE.DROP });
            }
        }
    }

    onFilesFromForm(event) {
        if(!event.target.files.length) {
            return;
        }
        let filtered = filterFiles(event.target.files, [ "image/webp", "image/png", "application/json" ]);
        if(!filtered.length) {
            return;
        }
        this.emit(CharacterView.EVENT_FILES_IMPORT, { files: filtered, type: CharacterView.EVENT_FILES_TYPE.FORM });
    }

    // folder events
    onSelected(event) {
        event.propagate = false;
        if(event.target.children) {
            if(event.target.opened) {
                this.activeFolder = event.target;
            } else if(event.target.parent) {
                this.activeFolder = event.target.parent;
            }
        } else {
            this.emit(CharacterView.EVENT_CHARACTER_SELECT, { target: event.target.uid });
        }
    }
    onButton(event) {
        event.propagate = false;
        // no action
    }
    onDropItem(event) {
        event.propagate = false;
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
    }
    onDeleted(event) {
        event.propagate = false;
        if(event.target.children) {
            this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
        } else {
            this.emit(CharacterView.EVENT_CHARACTER_DELETE, { target: event.target.uid });
        }
    }
    onRenamed(event) {
        event.propagate = false;
        this.emit(CharacterView.EVENT_SAVE_FOLDERS, {});
    }
}