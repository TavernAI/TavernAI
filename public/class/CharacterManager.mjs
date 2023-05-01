import {UICharFolder} from "./UICharFolder.mjs";
import {UICharPerson} from "./UICharPerson.mjs";
import {EventEmitter} from "./EventEmitter.mjs";
import {token} from "../script.js";

export class CharacterManager extends EventEmitter {
    static WIPE_CHAT = "clear_chat";

    static dragged;
    static activeFolder;

    /**  data structure
     * interface IFolderDatum = {
     *      children?: IFolderDatum[],
     *      name: string,
     *      id?: number, (for images)
     *      folder: boolean
     */
    data = {};
    characters = [];
    selectedID;
    root;
    flat = false;

    container;

    constructor(options) {
        super();
        this.container = options.container;

        let sel = document.getElementById("rm_folder_order");
        sel.onchange = function(event) {
            if(UICharFolder.SORTERS[event.target.value.toUpperCase()]) {
                this.root.sort(UICharFolder.SORTERS[event.target.value.toUpperCase()]);
            }
        }.bind(this);
        sel.value = "NAME";

        let ser = document.getElementById("rm_search_bar");
        ser.onkeyup = this.search.bind(this);
        ser.oncut = ser.onkeyup;
        ser.onpaste = ser.onkeyup;
    }

    get id() {
        return this.characters;
    }

    refresh(chars) {
        if(!this.container) {
            return;
        }
        if(chars) {
            this.characters = chars;
        }
        this.flat = false;

        let i = 0;
        this.container.innerHTML = null;

        let characters = JSON.parse(JSON.stringify(this.characters));

        this.root = new UICharFolder(this.data, characters);
        this.root.container.classList.add("root");
        this.root.on(UICharPerson.CHARACTER_SELECT, this.onCharacterSelect.bind(this));

        for(let key in characters) {
            this.root.addCharacter(characters[key]);
        }

        this.root.on(UICharPerson.CHARACTER_DELETE, this.deleteCharacter.bind(this));
        this.root.on(UICharFolder.FOLDER_DELETED, this.onFolderDeleted.bind(this));
        this.root.on(UICharFolder.SAVE_NEEDED, function(event) {
            this.save();
        }.bind(this));

        this.root.sort();

        CharacterManager.activeFolder = this.root;

        this.container.appendChild(this.root.container);

        this.save();
    }

    onCharacterSelect(event) {
        this.emit(UICharPerson.CHARACTER_SELECT, event);
    }

    deleteCharacter(event) {
        let id = this.getIDbyFilename(event.filename);
        jQuery.ajax({
            method: 'POST',
            url: '/deletecharacter',
            beforeSend: function(){},
            data: JSON.stringify({
                filename: event.filename
            }),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            processData: false,
            success: function(html){
                let char = this.characters[id];         // global
                if(char) {
                    let localChar = this.root.findCharacterNode({
                        filename: char.filename
                    });
                    if(localChar && localChar.container.parentNode) {
                        localChar.container.parentNode.removeChild(localChar.container);
                    }
                    if(localChar.parent) {
                        localChar.parent.children.forEach((ch, i) => {
                            if(ch.filename === event.filename) {
                                localChar.parent.children.splice(i, 1);
                                i--;
                            }
                        });
                        localChar.parent.refreshEmpty();
                    }
                    localChar.parent = null;
                }
                this.characters = this.characters.filter(
                    ch => ch.filename != event.filename
                );
                if(this.selectedID == id) {
                    this.selectedID = null;
                    this.emit(CharacterManager.WIPE_CHAT);
                    $('#chat_header_back_button').click();
                }
                this.save();
            }.bind(this)
        });
    }

    onFolderDeleted(event) {
        CharacterManager.activeFolder = event.active;
        CharacterManager.activeFolder.show();
        this.emit(UICharFolder.FOLDER_DELETED, event);
        this.save();
    }

    addFolder(name) {
        let out = CharacterManager.activeFolder.addFolder({
            name: name
        });
        if(!out) {
            this.save();
        }
        return out;
    }

    addCharacter(datum) {
        let char = this.root.addCharacter(datum);
        if(char) {
            this.characters.push(char);
        }
    }

    getFolderName(candidate) {
        return CharacterManager.activeFolder.getFolderName(candidate);
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            this.loadCharacters().then(characters => {
                this.loadFolders().then(folders => {
                    this.data = folders || {};
                    this.refresh(Object.values(characters));
                }, () => {});
            }, error => {
                reject(error);
            });
        });
    }

    loadCharacters() {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST', //
                url: '/getcharacters',
                beforeSend: function () {},
                cache: false,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": token
                },
                success: function(data) {
                    resolve(data);
                }.bind(this),
                error: function (jqXHR, exception) {
                    console.error(jqXHR);
                    console.error(exception);
                    reject(this.handleError(jqXHR));
                }.bind(this)
            })
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            let data = this.root.getSimple();
            jQuery.ajax({
                type: 'POST',
                url: '/savefolders',
                data: JSON.stringify(data),
                beforeSend: function(){},
                cache: false,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": token
                },
                success: function(){
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

    loadFolders() {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST',
                url: '/loadfolders',
                data: null,
                beforeSend: function(){},
                cache: false,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": token
                },
                success: function(data){
                    resolve(data);
                }.bind(this),
                error: function (jqXHR, exception) {
                    console.warn("Could not load folders. Defaulting to none.");
                    resolve({});
                }.bind(this)
            });
        });
    }

    handleError(jqXHR) { // Need to make one handleError and in script.js and in charaCloud.js
        let msg;
        let status;
        try {
            let msg_json = JSON.parse(jqXHR.responseText);
            msg = msg_json.error;
            if(msg.error !== undefined){
                msg = msg.error;
            }
        } catch {
            msg = 'Unique error';
        }
        if(jqXHR.status !== undefined){
            status = jqXHR.status;
        }else{
            status = 400;
        }
        if(status === 504){
            msg = 'Server is not responding';
        }
        if(status === 429){
            msg = 'Too many requests';
        }
        console.log(`Status: ${status}`);
        console.log(msg);
        return {'status': status, 'msg':msg};
    }

    getIDbyFilename(filename){
        return this.characters.findIndex(char => char.filename === filename);
    }
    getIDbyPublicID(public_id){
        return this.characters.findIndex(char => char.public_id === public_id);
    }
    sort(key) {
        if(!this.root) {
            return;
        }
        let sorter;
        if(!key || !UICharFolder.SORTERS[key.toUpperCase()]) {
            sorter = UICharFolder.LAST_SORT
        } else {
            sorter = UICharFolder.SORTERS[key.toUpperCase()];
        }
        this.root.sort(sorter);
    }

    search(event) {
        let match = event.target.value;
        if(!match || !match.length) {
            this.refresh();
            this.root.filter();
            this.root.container.classList.remove("flat");
        } else {
            this.root.container.classList.add("flat");
            this.root.filter({
                name: match
            });
        }
    }
}

