import {EventEmitter} from "./EventEmitter.mjs";
import {CharacterManager} from "./CharacterManager.mjs";
import {vl} from "../script.js";

export class UICharPerson extends EventEmitter {
    static CHARACTER_SELECT = "character_select";
    static CHARACTER_DELETE = "deleted";

    container;
    name;
    filename;
    parent;

    user_name;
    user_name_view;
    public_id;
    public_id_short;
    short_description;
    personality;
    add_date_local;

    constructor(datum) {
        super();
        this.name = vl(datum.name);
        this.user_name_view = vl(datum.user_name_view);
        this.public_id = vl(datum.public_id);
        this.public_id_short = vl(datum.public_id_short);
        this.short_description = vl(datum.short_description);
        this.personality = vl(datum.personality);
        this.create_date_local = datum.create_date_local;
        this.add_date_local = datum.add_date_local || datum.create_date_local;
        this.online = !!datum.online;
        this.first_mes = vl(datum.first_mes);

        this.container = document.createElement("li");
        this.container.classList.add("character_select");

        let main = document.createElement("div");
        this.container.appendChild(main);

        let avatar = document.createElement("div");
            avatar.classList.add("avatar");
            main.appendChild(avatar);
        let img = document.createElement("img");
            img.setAttribute("src", "characters/" + datum.filename + "?v="+Date.now());
            avatar.appendChild(img);
        this.filename = datum.filename;
        let charName = document.createElement("div");
            charName.classList.add("ch_name_menu");
            charName.appendChild(document.createTextNode(datum.name));
            main.appendChild(charName);

        let del = document.createElement("div");
            del.classList.add("delete");
            del.onclick = this.delete.bind(this);
            del.setAttribute("title", "Delete character");
            main.appendChild(del);

        main.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.emit(UICharPerson.CHARACTER_SELECT, { filename: this.filename });
        }.bind(this);

        this.container.setAttribute("draggable", "true");

        this.container.ondrag = this.onDrag.bind(this);
        this.container.ondragover = this.onDragOver.bind(this);
        this.container.ondrop = this.onDrop.bind(this);
    }

    onDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        CharacterManager.dragged = this;
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    show() {
        this.container.classList.remove("hidden");
    }

    hide() {
        this.container.classList.add("hidden");
    }

    getSimple() {
        return {
            name: this.name,
            filename: this.filename
        };
    }

    delete(event) {
        event.preventDefault();
        event.stopPropagation();
        if(confirm("Delete \"" + this.name + "\"? This will also delete chat history.")) {
            this.emit(UICharPerson.CHARACTER_DELETE, { target: this, filename: this.filename });
        }
    }
}