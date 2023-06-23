import {EventEmitter} from "./EventEmitter.mjs";
import {token, requestTimeout, characterAddedSign} from "../script.js";
import {CharacterView} from "./CharacterView.mjs";
import {CharacterEditor} from "./CharacterEditor.mjs";
import {Tavern} from "./Tavern.js";

export class CharacterModel extends EventEmitter {
    static EVENT_WIPE_CHAT = "clear_chat";
    static EVENT_ERROR = "error";
    static EVENT_EDITOR_CLOSED = "characters_editor_closed";
    static EVENT_CHARACTER_UPDATED = "character_update";

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
    view;
    editor;

    constructor(options) {
        super();

        this.view = new CharacterView({
            parent: this,
            container: options.container,
            input: options.input || {},
        });
        this.view.on(CharacterView.EVENT_CHARACTER_SELECT, this.onCharacterSelect.bind(this));
        this.view.on(CharacterView.EVENT_CHARACTER_DELETE, this.onCharacterDelete.bind(this));
        this.view.on(CharacterView.EVENT_FILES_IMPORT, this.onFilesImport.bind(this));
        this.view.on(CharacterView.EVENT_SAVE_FOLDERS, this.onSaveFolders.bind(this));

        this.editor = new CharacterEditor({
            parent: this,
            container: options.containerEditor,
            containerAdvanced: options.containerEditorAdvanced
        });
        this.editor.on(CharacterEditor.EVENT_SAVE, this.onCharacterSave.bind(this));
        this.editor.on(CharacterEditor.EVENT_CREATE, this.onCharacterCreate.bind(this));
        this.editor.on(CharacterEditor.EVENT_DELETE, this.onCharacterDelete.bind(this));
        this.editor.on(CharacterEditor.EVENT_SHOWN, function() {}.bind(this));
        this.editor.on(CharacterEditor.EVENT_HIDDEN, function() {
            this.view.refreshImages();
            this.emit(CharacterModel.EVENT_EDITOR_CLOSED, {});
        }.bind(this));
    }

    get id() {
        return this.characters;
    }

    deleteCharacter(filename) {
        let candidate = this.view.findContent({ uid: filename });
        if(candidate) {
            candidate.delete();
        }
    }

    // event handlers
    onCharacterSelect(event) {
        event.is_this_character_selected = false;
        if(this.selectedID !== undefined){
            if(this.selectedID === this.getIDbyFilename(event.target)){
                event.is_this_character_selected = true;
            }
        }
        this.selectedID = this.getIDbyFilename(event.target);
        this.editor.chardata = this.id[this.selectedID];
        this.emit(CharacterView.EVENT_CHARACTER_SELECT, event);
    }

    onCharacterDelete(event) {
        let id = this.getIDbyFilename(event.target);
        jQuery.ajax({
            method: 'POST',
            url: '/deletecharacter',
            beforeSend: function(){},
            data: JSON.stringify({
                filename: event.target
            }),
            cache: false,
            dataType: "json",
            contentType: "application/json",
            processData: false,
            success: function(html){
                this.characters = this.characters.filter(
                    ch => ch.filename != event.target
                );
                this.view.characters = this.characters;
                if(this.selectedID == id) {
                    Tavern.mode = 'chat';
                    this.selectedID = null;
                    this.emit(CharacterModel.EVENT_WIPE_CHAT, {});
                    document.getElementById("chat_header_back_button").click();
                }
                this.saveFolders();
            }.bind(this)
        });
    }

    onCharacterSave(event) {
        let newname = event.data.get("avatar").name;
        let filename = event.data.get("filename");
        let id = this.getIDbyFilename(filename);
        jQuery.ajax({
            type: 'POST',
            url: '/editcharacter',
            beforeSend: function(){},
            data: event.data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                this.characters = this.characters.filter(
                    ch => ch.filename != event.target
                );
                if(this.selectedID == id && newname) {
                    this.emit(CharacterModel.EVENT_CHARACTER_UPDATED, {});
                }
                this.saveFolders();
                if(event.resolve) {
                    event.resolve(data);
                }
            }.bind(this),
            error: event.reject || function (jqXHR, exception) {
                console.error("Error editing character");
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }
    thisCharacterSave() {
        var formData = new FormData($("#form_create").get(0));
        formData.append('last_action_date', Date.now());
        jQuery.ajax({
            
            type: 'POST',
            url: '/editcharacter',
            beforeSend: function(){},
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){

            },
            error: function (jqXHR, exception) {
                console.error("Error editing character");
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    onCharacterCreate(event) {
        jQuery.ajax({
            type: 'POST',
            url: '/createcharacter',
            beforeSend: function(){},
            data: event.data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data.file_name !== undefined){
                    this.loadCharacters(data.file_name.replace(/\.[^\.]*/, "")).then(data => {
                        characterAddedSign(data[0].filename.replace(/\.[^\.]*/, ""), 'Character created');
                        if(data && data[0]) {
                            this.characters.push(data[0]);
                            let char = this.view.addCharacter(data[0]);
                            this.saveFolders();
                            if(event.resolve) {
                                event.resolve(char);
                            }
                        } else {
                            if(event.reject) {
                                reject("Unknown error");
                            }
                        }
                    });
                }
            }.bind(this),
            error: event.reject || function (jqXHR, exception) {
                console.error("Error editing character");
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    onFilesImport(event) {
        if(event.files.length == 1) {
            this.importCharacter(event.files[0]).then(char => {
                characterAddedSign(char.name, 'Character imported');
            }, error => {
                document.getElementById("create_button").removeAttribute("disabled");
            });
            return;
        }

        this.importCharacters(event.files).then(resolve => {
            if(event.type === CharacterView.EVENT_FILES_TYPE.FORM) {
                if(resolve.failures.length) {
                    console.error("Failure to load " + resolve.failures.length + "/" + (resolve.successes.length+resolve.failures.length) + " files");
                    characterAddedSign(null, resolve.successes.length + "/" + (resolve.successes.length+resolve.failures.length) + " characters imported");
                } else {
                    characterAddedSign(null, resolve.successes.length + " characters imported");
                }
            }
        }, reject => {});
    }
    onSaveFolders(event) {
        this.saveFolders();
    }

    // loading
    loadAll() {
        return new Promise((resolve, reject) => {
            this.loadCharacters().then(characters => {
                this.loadFolders().then(folders => {
                    this.characters = Object.values(characters);
                    this.view.refresh(folders, this.characters);
                    $('#rm_folder_order').change();
                    resolve();
                }, () => {});
            }, error => {
                
                reject(error);
            });
        });
    }

    loadCharacters(filename) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST', //
                url: '/getcharacters',
                beforeSend: function () {},
                cache: false,
                dataType: "json",
                data: filename ? JSON.stringify({ filename: filename }) : JSON.stringify({ }),
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": token
                },
                success: function(data) {
                    resolve(data);
                }.bind(this),
                error: function (jqXHR, exception) {
                    reject(this.handleError(jqXHR));
                }.bind(this)
            })
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
                    resolve();
                }.bind(this)
            });
        });
    }

    // saving
    saveFolders() {
        return new Promise((resolve, reject) => {
            let data = this.view.getSimple();
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

    // error handler
    handleError(jqXHR) {
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
        this.emit(CharacterModel.EVENT_ERROR, { status: status, message: msg });
        return {'status': status, 'msg':msg};
    }

    // lookup
    getIDbyFilename(filename){
        return this.characters.findIndex(char => char.filename === filename);
    }
    getIDbyPublicID(public_id){
        return this.characters.findIndex(char => char.public_id === public_id);
    }

    // import
    importCharacters(files, strict = false, successes = [], failures = []) {
        return new Promise((resolve, reject) => {
            this.importCharacter(files.shift())
                .then(success => {
                    successes.push(success);
                    if(files.length) {
                        this.importCharacters(files, strict, successes, failures).then(resolve, reject);
                    } else {
                        return resolve({ successes, failures });
                    }
                }, failure => {
                    failures.push(failure);
                    if(strict) {
                        return reject({ successes, failures });
                    }
                    if(files.length) {
                        this.importCharacters(files, strict, successes, failures).then(resolve, reject);
                    } else {
                        return resolve({ successes, failures });
                    }
                })
        });
    }

    importCharacter(file) {
        return new Promise((resolve, reject) => {
            
            if(!file) { return reject("No file given."); }

            let filename = file.name.replace(/\.[^\.]*/, "").trim().replace(/ /g, "_");
            let filetype = file.type.replace(/.*\//, "");
            function getUniqueFilename(filename, characters) {
                let baseName = filename.replace(/\.[^\.]*/, "").trim().replace(/ /g, "_").toLowerCase();
                let counter = 1;
                while (characters.some(char => char.filename.toLowerCase() === `${baseName}${counter}`)) {
                    counter++;
                }
                return `${baseName}${counter}`;
            }

            // Check if the filename exists in the array
            if (this.characters.some(char => char.filename.toLowerCase() === filename.toLowerCase())) {
                // If it exists, get a unique filename
                filename = getUniqueFilename(filename, this.characters);
            }

            var formData = new FormData();
            formData.append("avatar", file, file.name);
            formData.append("file_type", filetype);

            jQuery.ajax({
                type: 'POST',
                url: '/importcharacter',
                data: formData,
                beforeSend: function() {},
                cache: false,
                timeout: requestTimeout,
                contentType: false,
                processData: false,
                success: function(data){
                    if(data.file_name !== undefined){
                        this.loadCharacters(data.file_name.replace(/\.[^\.]*/, "")).then(data => {
                            if(data && data[0]) {
                                this.characters.push(data[0]);
                                let char = this.view.addCharacter(data[0]);
                                this.saveFolders();
                                resolve(char);
                            } else {
                                reject("Unknown error");
                            }
                        });
                    }
                }.bind(this),
                error: function (jqXHR, exception) {
                    console.error(jqXHR);
                    console.error(exception);
                    reject(jqXHR);
                }
            });
        });
    }

    addCharacter(data) {
        this.characters.push(data);
        let char = this.view.addCharacter(data);
        this.saveFolders();
        return char;
    }
}

