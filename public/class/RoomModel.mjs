import {EventEmitter} from "./EventEmitter.mjs";
import { CharacterModel } from "./CharacterModel.mjs";
import {token, requestTimeout, characterAddedSign} from "../script.js";
import {RoomEditor} from "./RoomEditor.mjs";
import {Resizable} from "./Resizable.mjs";

export class RoomModel extends EventEmitter {
    static EVENT_ROOM_SELECT = "room_select";
    static EVENT_ROOM_UPDATED = "room_updated";

    selectedIDs = []; // IDs of character
    selectedNames = []; // Names of character
    rooms = []; // Each item is an object, each object has a filename and chat, which includes the chat history and metadata of the room
    activeId;
    characters; // Question: should we use characters.selectedID or this.activeId instead?
    selectedRoom; // Name of file, without the .jsonl extension
    editor;
    // activeName; // Shouldn't need reference to character name, can do it in the main script file (script.js) since a list of characters (and their information) is kept there (I.e., Characters.id[someID].name)

    constructor(options) {
        super();
        this.characters = options.characters;

        this.editor = new RoomEditor({
            parent: this,
            characters: this.characters
        });
        this.editor.on(RoomEditor.EVENT_CREATE, this.onRoomCreate.bind(this));
        this.editor.on(RoomEditor.EVENT_SHOWN, this.onRoomShown.bind(this));
        this.editor.on(RoomEditor.EVENT_SAVE, this.onRoomSave.bind(this));
    }

    get id() {
        return this.rooms;
    }

    get selectedCharacters() {
        return this.selectedIDs;
    }

    set selectedCharacters(ch_ids) {
        this.selectedIDs = ch_ids;
        return;
    }

    get selectedCharacterNames() {
        return this.selectedNames;
    }

    set selectedCharacterNames(ch_names) {
        this.selectedNames = ch_names;
        return;
    }

    get selectedRoomId() {
        let id = -1;
        console.log(this.rooms);
        console.log(this.selectedRoom);
        this.rooms.forEach(function(room, i) {
            if(room.filename == this.selectedRoom+".jsonl")
            {
                id = i;
                return;
            }
        }.bind(this));
        return id;
    }

    // Get the index of the character about to speak next, note that this index is NOT the character's ID
    get activeCharacterIndex() {
        return this.selectedIDs.indexOf(this.activeId);
    }

    // // Get the index of the character about to speak next, note that this index is NOT the character's ID
    // get activeCharacterIndex() {
    //     return this.selectedIDs.indexOf(this.characters.selectedID);
    // }

    findChildWithClass = Resizable.prototype.findChildWithClass;

    // Accepts an object representing ONE chat message, particularly the last one
    activeCharacterIdInit(lastChat) {
        if(lastChat)
        {
            this.activeId = lastChat.chid;

            // Below needs to be done since the character speaking would be the next character in order, not the last character who
            // has spoken (I.e., the character after the character speaking in the last message)
            this.setNextActiveCharacter();
        }
        else
            this.activeId = this.selectedIDs[0]; // Select the first character in order if there's no chat object given
        // this.activeName = lastChat.name;
    }

    // chatHistory is the chat list, this function is used to determine the next active speaker when chat has been changed,
    // e.g., when a message has been deleted
    setActiveCharacterId(chatHistory) {
        let found = false;
        for(var i = chatHistory.length-1; i >= 0; i--)
        {
            if(!chatHistory[i]['is_user']) // We want to get the latest message by a character, not user (user's chid == -1)
            {
                this.activeCharacterIdInit(chatHistory[i]);
                found = true;
                break;
            }
        }
        if(!found)
            this.activeCharacterIdInit();
    }

    setNextActiveCharacter() {
        // this.selectedIDs.length-1 needed since the last array element is always 1 less than the array length
        if(this.activeCharacterIndex >= this.selectedIDs.length-1)
            this.activeId = this.selectedIDs[0];
        else
            this.activeId = this.selectedIDs[this.activeCharacterIndex+1];

        this.characters.selectedID = this.activeId;
    }

    setPreviousActiveCharacter() {
        if(this.activeCharacterIndex <= 0)
            this.activeId = this.selectedIDs[this.selectedIDs.length-1];
        else
            this.activeId = this.selectedIDs[this.activeCharacterIndex-1];

        this.characters.selectedID = this.activeId;
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            this.loadRooms().then(rooms => {
                this.rooms = Object.values(rooms);
                $('#room_list').change();
                resolve();
            }, error => {
                reject(error);
            });
        });
    }

    loadRooms(filename) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST', //
                url: '/getrooms',
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
                    reject(this.characters.handleError(jqXHR));
                }.bind(this)
            })
        });
    }

    onRoomCreate(event) {
        // console.log("Room Create Event");
        jQuery.ajax({
            type: 'POST',
            url: '/createroom',
            beforeSend: function(){},
            data: event.data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data.file_name !== undefined){
                    // this.loadCharacters(data.file_name.replace(/\.[^\.]*/, "")).then(data => {
                    //     characterAddedSign(data[0].filename.replace(/\.[^\.]*/, ""), 'Character created');
                    //     if(data && data[0]) {
                    //         this.characters.push(data[0]);
                    //         this.emit()
                    //         if(event.resolve) {
                    //             event.resolve(data[0]);
                    //         }
                    //     } else {
                    //         if(event.reject) {
                    //             reject("Unknown error");
                    //         }
                    //     }
                    // });
                    console.log(data);
                    this.loadRooms(data.file_name.replace(/\.[^\.]*/, "")).then(data => {
                        characterAddedSign(null, 'Room created'); // null since a room doesn't have an image
                        if(data && data[0]) {
                            this.rooms.push(data[0]);
                            // let char = this.view.addCharacter(data[0]);
                            // this.saveFolders();
                            this.emit(RoomModel.EVENT_ROOM_SELECT, {});
                            if(event.resolve) {
                                event.resolve(data[0]);
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

    onRoomSave(event) {
        // let newname = event.data.get("avatar").name;
        // let filename = event.data.get("filename");
        // let id = this.getIDbyFilename(filename);
        console.log(event.data);
        jQuery.ajax({
            type: 'POST',
            url: '/editroom',
            beforeSend: function(){},
            data: event.data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                // this.characters = this.characters.filter(
                //     ch => ch.filename != event.target
                // );
                // if(this.selectedID == id && newname) {
                //     // Would never be called, since advanced update feature is not implemented
                //     this.emit(RoomModel.EVENT_ROOM_UPDATED, {});
                // }
                // this.saveFolders();
                // this.rooms.length = 0;
                // this.loadAll();
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

    // Below method is not used due to reliance to character editor
    onRoomShown() {
        // let characterContainer = this.characters.editor.other.roomCharacterSelect.getElementsByClassName("room-character-select-items")[0];
        let characterContainer = findChildWithClass("room-character-select-items", this.characters.editor.other.roomCharacterSelect, true);
        characterContainer.append("Testing A Message");
        console.log("Testing A Message");
    }

}