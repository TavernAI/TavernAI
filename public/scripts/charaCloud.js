class charaCloudClient {
    constructor() {
        if (charaCloudClient.instance) {
            return charaCloudClient.instance;
        }
        charaCloudClient.instance = this;
        this.is_online = false;
    }
    isOnline(){
        return this.is_online;
    }
    getAllCharacters(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: '/characloud_getallcharacters', // 
                data: JSON.stringify({
                            '': ''
                        }),
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
    getServerStatus(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: '/characloud_serverstatus', // 
                data: JSON.stringify({
                            '': ''
                        }),
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
    loadCard(public_id){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: '/characloud_loadcard', // 
                data: JSON.stringify({
                            'public_id': public_id
                        }),
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
                    console.log(exception);
                    console.log(jqXHR);

                }
            });
        });
    }
    searchCharacter(q){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: '/characloud_search_character', // 
                data: JSON.stringify({
                            'q': q
                        }),
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
                    console.log(exception);
                    console.log(jqXHR);

                }
            });
        });
    }
    static getInstance(name, age) {
        return new charaCloudClient(name, age);
    }
}
