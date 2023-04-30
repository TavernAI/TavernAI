class charaCloudClient {
    constructor() {
        if (charaCloudClient.instance) {
            return charaCloudClient.instance;
        }
        charaCloudClient.instance = this;
        this.is_online = false;
        this.is_toggle = false;
        this.is_init = false;
        this.max_user_page_characters_count = 16;
        this.user_page_characters_count = 0;
        this.user_profile_page = 1;
        this.user_profile_name;
        this.cardeditor_data;
        this.cardeditor_image;
        this.cardeditor_id_local;
        this.cardeditor_filename_local;
        this.delete_character_user_name;
        this.delete_character_public_id_short;
        this.delete_character_type;
        this.handleError = this.handleError.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.getEditorFields = this.getEditorFields.bind(this);
        
        

        
    }
    isOnline(){
        return this.is_online;
    }
    getCharacters(){
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
    getBoard(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'GET', // 
                url: '/api/characloud/board',
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
                url: '/api/characloud/server/status', // 
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
                    console.log(exception);
                    console.log(jqXHR);
                    console.log('No connection to charaCloud');

                }
            });
        });

    }
    loadCard(user_name, public_id_short){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: 'api/characloud/characters/load', // 
                data: JSON.stringify({
                            public_id_short: public_id_short,
                            user_name: user_name
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
                    return reject(self.handleError(jqXHR));

                }
            });
        });
    }
    searchCharacter(q){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: 'api/characloud/characters/search', // 
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
                    return reject(self.handleError(jqXHR));

                }
            });
        });
    }
    registration(user_name, email, password, conf_password, re_token){
        const self = this;
        return new Promise((resolve, reject) => {
            if(password !== conf_password){
                let jqXHR = {responseText: JSON.stringify({error: 'Confirmation password does not match'}), status: 422};
                return reject(self.handleError(jqXHR));
            }
            if(!self.validateUsername(user_name)){
                let jqXHR = {responseText: JSON.stringify({error: 'Name validation error'}), status: 422};
                return reject(self.handleError(jqXHR));
            }
            
            let data = {};
            data.name = user_name;
            data.password = password;
            if(email !== ''){
                data.email = email;
            }
            if(re_token !== undefined){
                data.re_token = re_token;
            }
            data = JSON.stringify(data);

            jQuery.ajax({    
                type: 'POST', // 
                url: '/api/characloud/users/registration', // 
                data: data,
                beforeSend: function(){
                    $('#registration_form').children('.load_icon').css('display', 'inline-block');
                    $('#registration_form').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){

                    return resolve(data);
                },
                error: function (jqXHR, exception) {

                    return reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    $('#registration_form').children('.load_icon').css('display', 'none');
                    $('#registration_form').children('.submit_button').css('display', 'inline-block');
                }
            });
        });
    }
    
    login(user_name, password, type){
        const self = this;
        return new Promise((resolve, reject) => {
            if(!self.validateUsername(user_name)){
                let jqXHR = {responseText: JSON.stringify({error: 'Name validation error'}), status: 422};
                return reject(self.handleError(jqXHR));
            }
            jQuery.ajax({    
                type: 'POST', // 
                url: '/api/characloud/users/login', // 
                data: JSON.stringify({
                            'name': user_name,
                            'password': password,
                            'type': type
                        }),
                beforeSend: function(){
                    $('#login_form').children('.load_icon').css('display', 'inline-block');
                    $('#login_form').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    $('#login_form').children('.load_icon').css('display', 'none');
                    $('#login_form').children('.submit_button').css('display', 'inline-block');
                }
            });
        });
    }
    logout(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: '/api/characloud/users/logout', // 
                beforeSend: function(){

                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                }
            });
        });
    }
    publishCharacter(type, target_filename = undefined){
        const self = this;
        return new Promise((resolve, reject) => {
            let character_data;
            try {
                let new_editor_date = self.getEditorFields();
                character_data = Object.assign({}, self.cardeditor_data, new_editor_date);
                if(type === 'add_locally'){
                    self.cardeditor_data.add_date = Date.now();
                }
            }catch(err){
                console.log(err);
                return reject(err);
            }
            jQuery.ajax({    
                type: 'POST', // 
                url: '/api/characloud/characters/publish', // 
                data: JSON.stringify({
                            'character_img': self.cardeditor_image,
                            'character_data': character_data,
                            'type': type,
                            'target_filename': target_filename
                        }),
                beforeSend: function(){
                    switch(type){
                        case 'create_online':
                            $('.load_icon_publish').css('display', 'inline-block');
                            $('.publish_button').css('display', 'none');
                            return;
                        case 'edit_online':
                            $('.load_icon_update').css('display', 'inline-block');
                            $('.update_button').css('display', 'none'); 
                            return;
                    }

                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){

                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    switch(type){
                        case 'create_online':
                            $('.load_icon').css('display', 'none');
                            $('.publish_button').css('display', 'inline-block');
                            return;
                        case 'edit_online':
                            $('.load_icon_update').css('display', 'none');
                            $('.update_button').css('display', 'inline-block');
                            return;
                    }

                }
            });
        });
    }
    getCharacter(user_name, public_id_short, mode = 'default'){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: `/api/characloud/characters/get`, // 
                data: JSON.stringify({
                            'user_name': user_name,
                            'public_id_short': public_id_short,
                            'mode': mode
                        }),
                beforeSend: function(){
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    self.cardeditor_image = data.image;
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                }
            });
        });
    }
    getUserCharacters(user_name,page){
        const self = this;
        return new Promise((resolve, reject) => {
            if(!self.validateUsername(user_name)){
                let jqXHR = {responseText: JSON.stringify({error: 'Name validation error'}), status: 422};
                return reject(self.handleError(jqXHR));
            }
            jQuery.ajax({    
                type: 'POST', // 
                url: '/api/characloud/user/characters', // 
                data: JSON.stringify({
                            'name': user_name,
                            'perpage': self.max_user_page_characters_count,
                            'page': page
                        }),
                beforeSend: function(){
                    //$('#login_form').children('.load_icon').css('display', 'inline-block');
                    //$('#login_form').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    self.user_page_characters_count = data.charactersCount;
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    //$('#login_form').children('.load_icon').css('display', 'none');
                    //$('#login_form').children('.submit_button').css('display', 'inline-block');
                }
            });
        });
    }
    getEditorFields(){
        const self = this;
        let character_data = {};
        character_data.name = $('#name-input').val();
        character_data.short_description = $('#short-description-input').val();
        character_data.personality = $('#personality-summary-input').val();
        character_data.scenario = $('#scenario-textarea').val();
        character_data.description = $('#description-textarea').val();
        character_data.mes_example = $('#dialogues-example-textarea').val();
        character_data.first_mes = $('#first-message-textarea').val();
        character_data.nsfw = !!$('#editor_nsfw').prop('checked');
        let categoriesArray = [];
        $('.character-category').each(function () {
            var category = $(this).text().replace('x', '').trim();
            categoriesArray.push(category);
        });
        character_data.categories = categoriesArray;
        return character_data;
    }
    changeCharacterAvatar(e) {
        const self = this;
        return new Promise((resolve, reject) => {
            var file = e.target.files[0];
            //console.log(1);
            if (!file) {
                return;
            }

            var formData = new FormData($("#form_characloud_upload_character_page").get(0));
            jQuery.ajax({
                type: 'POST',
                url: '/api/characloud/characters/avatar',
                data: formData,
                beforeSend: function () {
                    //$('#characloud_upload_character_button').html('Uploading...');
                    //$('#characloud_upload_character_button').css('width', button_width);
                },
                cache: false,
                timeout: 8 * 1000,
                contentType: false,
                processData: false,
                success: function (data) {
                    data.image = window.DOMPurify.sanitize(data.image);
                    $('.characloud_character_page_avatar').children('img').attr('src', `./cardeditor/${data.image}`);
                    self.cardeditor_image = data.image;
                    resolve(data);

                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (xhr, status) {
                    //$('#characloud_upload_character_button').html(button_text);
                }
            });
        });
    }
    deleteCharacter(user_name, public_id_short, mode = 'default'){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: `/api/characloud/characters/delete`, // 
                data: JSON.stringify({
                            'user_name': user_name,
                            'public_id_short': public_id_short,
                            'mode': mode
                        }),
                beforeSend: function(){
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                }
            });
        });
    }
    getCharactersByCategory(category){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: `/api/characloud/category/characters`, // 
                data: JSON.stringify({
                            category: category
                        }),
                beforeSend: function(){
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                }
            });
        });
    }
    getCategories(){
        const self = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax({    
                type: 'POST', // 
                url: `/api/characloud/categories`, // 
                data: JSON.stringify({

                        }),
                beforeSend: function(){
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                success: function(data){
                    resolve(data);
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    reject(self.handleError(jqXHR));
                },
                complete: function (data) {
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                }
            });
        });
    }
    getCharacterDivBlock(character, charaCloudServer, type = 'default'){
        character.user_name = window.DOMPurify.sanitize(character.user_name);
        character.public_id_short = window.DOMPurify.sanitize(character.public_id_short);
        let cahr_link = `<img src="../img/vdots.png">`;
        let img_url = `${charaCloudServer}/${character.user_name}/${character.public_id_short}.webp`;
        let char_link_mode = 'default';
            if(type === 'moderation'){
                img_url = `${charaCloudServer}/users/${character.user_name}/moderation/${character.public_id_short}.webp?v=${Date.now()}`;
                if(parseInt(character.status) === 4 && Boolean(character.moderation) === true){
                char_link_mode = 'moderation_edit';
            }
        }
        character.public_id = window.DOMPurify.sanitize(character.public_id);
        character.public_id_short = window.DOMPurify.sanitize(character.public_id_short);
        character.name = window.DOMPurify.sanitize(character.name);
        character.user_name_view = window.DOMPurify.sanitize(character.user_name_view);
        return `<div public_id="${character.public_id}" public_id_short="${character.public_id_short}" user_name="${character.user_name}" class="characloud_character_block"><div class="characloud_character_block_card"><div class="avatar"><img data-src="${img_url}" class="lazy"></div><div user_name="${character.user_name}" public_id_short="${character.public_id_short}" mode=${char_link_mode} class="characloud_character_block_page_link">${cahr_link}</div><div user_name="${character.user_name}" class="characloud_character_block_user_name">@${character.user_name_view}</div><div class="characloud_character_block_name">${character.name}</div><div class="characloud_character_block_description"></div></div></div>`;
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
        return new charaCloudClient();
    }
}
