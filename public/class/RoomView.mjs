import {EventEmitter} from "./EventEmitter.mjs";
import {filterFiles} from "../script.js";

export class RoomView extends EventEmitter {

    static EVENT_ROOM_DELETE = "room_delete";

    container;
    controller;

    folderData;
    characters;

    activeFolder;

    constructor(options) {
        super(options.parent);
    }
}