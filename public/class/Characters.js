import { token, default_avatar } from '../script.js';


export class CharactersClass {

    constructor() {
        this.selectedID;
        this.characters = [];
        this.charactersFilename = [];
        this.id = this.characters;

    }

    loadAll() {
        self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type: 'POST', // 
                url: '/getcharacters',
                beforeSend: function () {


                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": token
                },
                //processData: false, 
                success: function (getData) {
                    //console.log(getData);
                    //var aa = JSON.parse(getData[0]);
                    const load_ch_count = Object.getOwnPropertyNames(getData);
                    for (var i = 0; i < load_ch_count.length; i++) {
                        self.characters[i] = [];
                        self.characters[i] = getData[i];
                        self.characters[i]['name'] = window.DOMPurify.sanitize(self.characters[i]['name']);
                        if (self.characters[i].add_date_local === undefined) {
                            self.characters[i].add_date_local = self.characters[i].create_date_local;
                        }
                        self.charactersFilename[self.characters[i]['filename']] = i;

                    }
                    self.sortByAddDate();
                    self.printAll();
                    resolve();

                },
                error: function (jqXHR, exception) {
                    return reject(self.handleError(jqXHR));
                }
            });
        });


    }

    printAll(){
        self = this;
        $("#rm_print_charaters_block").empty();
        this.characters.forEach(function(item, i, arr) {
            self.print(item);

        });
    }
    
    print(item){
        let this_avatar = "characters/"+item.filename+"?v="+Date.now();
        const id = this.getIDbyFilename(item.filename);
        $("#rm_print_charaters_block").prepend('<div class=character_select chid='+id+'><div class=avatar><img src="'+this_avatar+'"></div><div class=ch_name_menu>'+item.name+'</div></div>');
    }
    
    selectByArrayId(){
        
    }
    
    selectByFilename(){
        
    }
    
    deleteByFilename(){
        
    }
    
    sortByAddDate(){
        self = this;
        self.characters.sort((a, b) => a.add_date_local - b.add_date_local);
        self.charactersFilename = [];
        self.characters.forEach(function(item, i){

            self.charactersFilename[item.filename] = i;
        });
        //characters.reverse();
    }
    sortByLastActionDate(){
        self = this;
        self.characters.sort((a, b) => a.last_action_date - b.last_action_date);
        self.charactersFilename = [];
        self.characters.forEach(function(item, i){
            self.charactersFilename[item.filename] = i;
        });
        //characters.reverse();
    }
    
    getIDbyFilename(filename){
        return this.characters.findIndex(char => char.filename === filename);
    }
    getIDbyPublicID(public_id){
        return this.characters.findIndex(char => char.public_id === public_id);
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
}

