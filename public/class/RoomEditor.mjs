import {EventEmitter} from "./EventEmitter.mjs";
import {encode, decode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {CharacterEditor} from "./CharacterEditor.mjs";

export class RoomEditor extends EventEmitter {
    static EVENT_CREATE = "roomedit_create";
    static EVENT_SAVE = "roomedit_save";
    static EVENT_DELETE = "roomedit_delete";
    static EVENT_SHOWN = "roomedit_shown";

    characters;

    constructor(options) {
        super({
            parent: options.parent
        });

        this.characters = options.characters;
    }

    // To be called by onSubmit() function in the CharacterEditor class/object, to promote better codes reusing
    // Below code is not used, this cannot be used in a static context
    static onSubmit(formData, chararacterEditor) {

        if(!chararacterEditor.editMode) {
            chararacterEditor.enabled = false;
            chararacterEditor.button.submit.setAttribute("value", "Creating...");
            this.emit(RoomEditor.EVENT_CREATE, {
                data: formData,
                resolve: function(data){
                    chararacterEditor.editMode = true;
                    chararacterEditor.enabled = true;
                    //this.emit(CharacterEditor.EVENT_HIDDEN);
                    
                }.bind(this),
                reject: function (jqXHR, exception) {
                    chararacterEditor.enabled = true;
                    console.error("Error creating character");
                    console.error(jqXHR);
                    console.error(exception);
                }.bind(this)
            });
        } 
        // else 
        // {
        //     this.enabled = false;
        //     this.button.submit.setAttribute("value", "Saving...");
        //     this.emit(RoomEditor.EVENT_SAVE, {
        //         data: formData,
        //         // filename: this.avatar.filenameDiv.innerHTML, // No need for this line, since a room doesn't have an avatar
        //         resolve: function(data) {
        //             this.editMode = true;
        //             this.enabled = true;
        //         }.bind(this),
        //         reject: function (jqXHR, exception) {
        //             this.enabled = true;
        //             console.error("Error editing character");
        //             console.error(jqXHR);
        //             console.error(exception);
        //         }.bind(this)
        //     });
        //     // make sure to load character and refresh chat!
        // }
    }
}