class CharactersClass {
    constructor() {
        if (CharactersClass.instance) {
            return CharactersClass.instance;
        }
        CharactersClass.instance = this;
        this.is_online = false;

        
        

        
    }
    isOnline(){
        return this.is_online;
    }
    getAllCharacters(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'GET', // 
                url: '/api/characloud/characters',
                beforeSend: function(){


                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                //processData: false, 
                success: function(data){
                    self.is_online = true;
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    self.is_online = false;
                    //console.log(exception);
                    //console.log(jqXHR);
                    console.log('No connection to charaCloud');

                }
            });
        });

    }
    validateUsername(user_name) {
        const regex = /^[A-Za-z0-9_\s]{2,32}$/;
        return regex.test(user_name);
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
    static getInstance() {
        return new CharactersClass();
    }
}
