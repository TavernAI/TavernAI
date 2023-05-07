import {encode, decode} from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Notes} from "./class/Notes.mjs";
import {WPP} from "./class/WPP.mjs";
import {WPPEditor} from "./class/WPPEditor.mjs";
import { CharactersClass } from './class/Characters.js';
import {UIWorldInfoMain} from "./class/UIWorldInfoMain.mjs";



var token;
var default_avatar = 'img/fluffy.png';
function vl(text) { //Validation security function for html
    return window.DOMPurify.sanitize(text);
}
export {token, default_avatar, vl};
$(document).ready(function(){
    /*
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const img = mutation.target;
                const aspectRatio = img.height / img.width;
                if (aspectRatio > img.parentNode.offsetHeight / img.parentNode.offsetWidth) {
                    $(img).removeClass('landscape').addClass('portrait');
                } else {
                    $(img).removeClass('portrait').addClass('landscape');
                }
            } else if (mutation.addedNodes) {
                $(mutation.addedNodes).find('.avatar img').each(function() {
                    const img = this;
                    const aspectRatio = img.height / img.width;
                    
                    if (aspectRatio > img.parentNode.offsetHeight / img.parentNode.offsetWidth) {
                        $(img).removeClass('landscape').addClass('portrait');
                    } else {
                        $(img).removeClass('portrait').addClass('landscape');
                    }
                });
            }
        });    
    });

    const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] };
    observer.observe(document.body, config);
    */
   
    var Characters = new CharactersClass();

    //CharaCloud
    var charaCloud = charaCloudClient.getInstance();
    var characloud_characters = [];
    var characloud_characters_rows;
    var charaCloudServer = 'http://127.0.0.1:80';
    ///////////
    const VERSION = '1.4.0';
    var converter = new showdown.Converter({ extensions: ['xssfilter'] })
    var bg_menu_toggle = false;
    var default_user_name = "You";
    var name1 = default_user_name;
    var name2 = "Chloe";
    var chloeMes = {
        name: 'Chloe',
        is_user: false,
        is_name: true,
        create_date: 0,
        mes: '*You went inside. The air smelled of fried meat, tobacco and a hint of wine. A dim light was cast by candles, and a fire crackled in the fireplace. It seems to be a very pleasant place. Behind the wooden bar is an elf waitress, she is smiling. Her ears are very pointy, and there is a twinkle in her eye. She wears glasses and a white apron. As soon as she noticed you, she immediately came right up close to you.*\n\n' +
            ' Hello there! How is your evening going?' +
            '<div id="characloud_img"><img src="img/tavern.png" id="chloe_star_dust_city"></div>\n<a id="verson" href="https://github.com/TavernAI/TavernAI" target="_blank">@@@TavernAI v'+VERSION+'@@@</a><a href="https://boosty.to/tavernai" target="_blank"><div id="characloud_url"><img src="img/cloud_logo.png"><div id="characloud_title">Cloud</div></div></a><br><br><br><br>'
    };
    var chat = [chloeMes];
    
    var number_bg = 1;
    var delete_user_avatar_filename;
    var chat_create_date = 0;
    var default_ch_mes = "Hello";
    var count_view_mes = 0;
    var mesStr = '';
    var generatedPromtCache = '';
    var backgrounds = [];
    var is_colab = false;
    var is_checked_colab = false;
    var is_mes_reload_avatar = false;
    var is_nav_toggle = false;
    var characterFormat = 'webp';
    
    var is_advanced_char_open = false;
    var is_master_settings_open = false;
    var menu_type = '';//what is selected in the menu
    var selected_button = '';//which button pressed
    //create pole save
    var create_save_name = '';
    var create_save_description = '';
    var create_save_personality = '';
    var create_save_first_message = '';
    var create_save_avatar = '';
    var create_save_scenario = '';
    var create_save_mes_example = '';
    
    var use_reg_recaptcha = false;
    
    var timerSaveEdit;
    var durationSaveEdit = 300;
    //animation right menu
    var animation_rm_duration = 200;
    var animation_rm_easing = "";

    var popup_type = "";
    var bg_file_for_del = '';
    var online_status = 'no_connection';

    var api_server = "";
    var horde_api_server = "";
    //var interval_timer = setInterval(getStatus, 2000);
    var interval_timer_novel = setInterval(getStatusNovel, 3000);
    var is_get_status = false;
    var is_get_status_novel = false;
    var is_get_status_openai = false;
    var is_api_button_press = false;
    var is_api_button_press_novel = false;
    var is_api_button_press_openai = false;

    var is_send_press = false;//Send generation
    var add_mes_without_animation = false;

    var this_del_mes = 0;

    var this_edit_mes_text = '';
    var this_edit_mes_chname = '';
    var this_edit_mes_id;
    var this_edit_target_id = undefined;

    const delay = ms => new Promise(res => setTimeout(res, ms));
    //settings
    var settings;
    var designs;
    var koboldai_settings;
    var koboldai_setting_names;
    var preset_settings = 'gui';
    var user_avatar = 'you.png';
    var temp = 0.5;
    var top_p = 1.0;
    var top_k = 0;
    var top_a = 0.0;
    var typical = 1.0;
    var tfs = 1.0;
    var amount_gen = 80;
    var max_context = 2048;//2048;
    var rep_pen = 1;
    var rep_pen_size = 100;
    var rep_pen_slope = 0.9;
    
    var is_pygmalion = false;
    const pygmalion_formatng_string_indicator = " (Pyg. formatting on)";
    var tokens_already_generated = 0;
    var message_already_generated = '';
    var if_typing_text = false;
    const tokens_first_request_count = 50;
    const tokens_cycle_count = 30;
    var cycle_count_generation = 0;

    
    var lock_context_size = false;
    var multigen = false;
    var singleline = false;
    var swipes = false;
    var keep_dialog_examples = false;
    var free_char_name_mode = false;
    var anchor_order = 0;
    var pygmalion_formating = 0;
    var style_anchor = true;
    var character_anchor = true;

    var winNotes;
    var winWorldInfo;
    var editorDescriptionWPP;

    var main_api = 'kobold';
    //Profile
    var is_login = false;
    var ALPHA_KEY = getCookie('ALPHA_KEY');
    var BETA_KEY;
    var login = getCookie('login');
    var login_view = getCookie('login_view');
    //novel settings
    var temp_novel = 0.5;
    var rep_pen_novel = 1;
    var rep_pen_size_novel = 100;
    var rep_pen_slope_novel = 0.9;
    var top_p_novel = 1.0;
    var top_k_novel = 0;
    var top_a_novel = 0.0;
    var typical_novel = 1.0;
    var tfs_novel = 1.0;
    var amount_gen_novel = 80;

    var api_key_novel = "";
    var novel_tier;
    var model_novel = "euterpe-v2";
    var novelai_settings;
    var novelai_setting_names;
    var preset_settings_novel = 'Classic-Krake';

    // HORDE
    var horde_api_key = "0000000000";
    var horde_model = "";
    var hordeCheck;

    //openai settings
    var temp_openai = 0.9;
    var top_p_openai = 1.0;
    var pres_pen_openai = 0.7;
    var freq_pen_openai = 0.7;
    
    var api_key_openai = "";
    var openai_system_prompt = "";
    var openai_jailbreak_prompt = "";
    var openai_jailbreak2_prompt = "";
    var amount_gen_openai = 220;
    var max_context_openai = 2048;
    var model_openai = 'gpt-3.5-turbo';


    var switch_log_reg = 'login';
    //css
    var bg1_toggle = true;
    var css_mes_bg = $('<div class="mes"></div>').css('background');
    var css_send_form_display = $('<div id=send_form></div>').css('display');

    var colab_ini_step = 1;

    // Mobile
    var is_mobile_user = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i);
    
    
    var requestTimeout = 1*60*1000;
    jQuery.ajax({
        type: "GET",
        url: "/timeout",
        cache: false,
        contentType: "application/json",
        success: function(data) {
            requestTimeout = data.timeout;
        },
        error: function (jqXHR, exception) {
            console.error(jqXHR);
            console.error(exception);
        }
    });
    
    editorDescriptionWPP = new WPPEditor({
        container: $('#description_wppeditor')[0],
    });
    editorDescriptionWPP.on("change", function(event) {
        $("#description_textarea").val(event.target.text);

        if(menu_type == 'create'){
            create_save_description = $('#description_textarea').val();
        }else{
            if(timerSaveEdit) { clearTimeout(timerSaveEdit) };
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    }.bind(this));


    $('#send_textarea').on('input', function () {
        
        if($('#send_textarea').css('--autoresize') === 'true'){
            $('#send_textarea').attr('style', '');
            this.style.height =
                (this.scrollHeight) + 'px';
        }
    });
    setInterval(function() {
        switch(colab_ini_step){
            case 0:
                $('#colab_popup_text').html('<h3>Initialization</h3>');
                colab_ini_step = 1;
                break
            case 1:
                $('#colab_popup_text').html('<h3>Initialization.</h3>');
                colab_ini_step = 2;
                break
            case 2:
                $('#colab_popup_text').html('<h3>Initialization..</h3>');
                colab_ini_step = 3;
                break
            case 3:
                $('#colab_popup_text').html('<h3>Initialization...</h3>');
                colab_ini_step = 0;
                break
        }
    }, 500);
    /////////////


     $.ajaxPrefilter((options, originalOptions, xhr) => {
            xhr.setRequestHeader("X-CSRF-Token", token);
    });

    $.get("/csrf-token")
            .then(data => {
                    token = data.token;
                    getSettings();
                    getLastVersion();
                    Characters.loadAll();
                    printMessages();
                    getBackgrounds();
                    getUserAvatars();
                    
            });
            
            
    
    function showCharaCloud(){
        if(!charaCloud.is_init){
            charaCloudInit();
        }
        $('#shell').css('display', 'none');
        $('#chara_cloud').css('display', 'block');
        $('#chara_cloud').css('opacity', 0.0);
        $('#chara_cloud').transition({
            opacity: 1.0,
            duration: 300,
            queue: false,
            easing: "",
            complete: function () { }
        });

        $('#rm_button_characters').click();
        $('#bg_chara_cloud').transition({
            opacity: 1.0,
            duration: 1000,
            queue: false,
            easing: "",
            complete: function () { }
        });
        $('#characloud_search_form').transition({
            opacity: 1.0,
            delay: 270,
            duration: 70,
            queue: false,
            easing: "ease-in-out",
            complete: function () { }
        });
        
    }
    
    function hideCharaCloud(){
        $('#shell').css('display', 'grid');
        $('#shell').css('opacity', 0.0);
        $('#shell').transition({  
            opacity: 1.0,
            duration: 1000,
            easing: "",
            complete: function() {  }
        });
        $('#chara_cloud').css('display', 'none');
        $('#bg_chara_cloud').transition({  
            opacity: 0.0,
            duration: 1200,
            easing: "",
            complete: function() {  }
        });
    }
    
    function checkOnlineStatus(){
        if(online_status == 'no_connection'){
            $("#online_status_indicator").removeClass('online_status_indicator_online');
            $("#online_status_indicator2").removeClass('online_status_indicator_online');
            $("#online_status_indicator3").removeClass('online_status_indicator_online');
            $("#online_status_indicator4").removeClass('online_status_indicator_online');
            $("#online_status_indicator").addClass('online_status_indicator_offline');
            $("#online_status").removeAttr('style');
            $("#online_status_text").html("No connection...");
            $("#online_status_indicator2").addClass('online_status_indicator_offline');
            $("#online_status_text2").html("No connection...");
            $("#online_status_indicator3").addClass('online_status_indicator_offline');
            $("#online_status_text3").html("No connection...");
            $("#online_status_indicator4").addClass('online_status_indicator_offline');
            $("#online_status_text4").html("No connection...");
            $("#online_status_indicator_horde").css("background-color", "red");
            $("#online_status_text_horde").html("No connection...");
            is_get_status = false;
            is_get_status_novel = false;
            is_get_status_openai = false;
        }else{
            $("#online_status_indicator").removeClass('online_status_indicator_offline');
            $("#online_status_indicator2").removeClass('online_status_indicator_offline');
            $("#online_status_indicator3").removeClass('online_status_indicator_offline');
            $("#online_status_indicator4").removeClass('online_status_indicator_offline');
            $("#online_status_indicator").addClass('online_status_indicator_online');
            $("#online_status").css("opacity", 0.0);
            $("#online_status_text").html("");
            $("#online_status_indicator2").addClass('online_status_indicator_online');
            $("#online_status_text2").html(online_status);
            $("#online_status_indicator3").addClass('online_status_indicator_online');
            $("#online_status_text3").html(online_status);
            $("#online_status_indicator4").addClass('online_status_indicator_online');
            $("#online_status_text4").html(online_status);
            $("#online_status_indicator_horde").css("background-color", "green");
            $("#online_status_text_horde").html(online_status);
        }

    }
    async function getLastVersion(){

        jQuery.ajax({    
            type: 'POST', // 
            url: '/getlastversion', // 
            data: JSON.stringify({
                        '': ''
                    }),
            beforeSend: function(){


            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function(data){
                var getVersion = data.version;
                if(getVersion !== 'error' && getVersion != undefined){
                    if(compareVersions(getVersion, VERSION) === 1){
                        $('#verson').append(' <span id="new_version_title">(New update @'+getVersion+')</span>');
                        $('#characloud_status_button').css('display', 'flex');
                        $('#characloud_status_button').text('New update '+getVersion);
                    }
                }

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);

            }
        });

    }
    
    $('#characloud_status_button').click(function(){
        window.open('https://github.com/TavernAI/TavernAI', '_blank');
    });
    function setPygmalionFormating(){
        if(online_status != 'no_connection'){
            online_status = online_status.replace(pygmalion_formatng_string_indicator, '');
            switch (pygmalion_formating){
                case 1:
                    is_pygmalion = true;
                    online_status+=pygmalion_formatng_string_indicator;
                    break;
                case 2:
                    is_pygmalion = false;
                    break;

                default:
                    if(online_status.toLowerCase().indexOf('pygmalion') != -1){
                        is_pygmalion = true;
                        online_status+=pygmalion_formatng_string_indicator;
                    }else{
                        is_pygmalion = false;
                    }
                    break;
            }
        }
    }
    async function getStatus(){
        if(is_get_status){
            jQuery.ajax({    
                type: 'POST', // 
                url: '/getstatus', // 
                data: JSON.stringify({
                        api_server: api_server
                    }),
                beforeSend: function(){
                    if(is_api_button_press){
                        //$("#api_loading").css("display", 'inline-block');
                        //$("#api_button").css("display", 'none');
                    }
                    //$('#create_button').attr('value','Creating...'); // 

                },
                cache: false,
                timeout: requestTimeout,
                dataType: "json",
                crossDomain: true,
                contentType: "application/json",
                //processData: false, 
                success: function(data){
                    online_status = data.result;
                    if(online_status == undefined){
                        online_status = 'no_connection';
                    }
                    setPygmalionFormating();

                

                    //console.log(online_status);
                    resultCheckStatus();
                    if(online_status !== 'no_connection'){
                        var checkStatusNow = setTimeout(getStatus, 3000);//getStatus();
                    }
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    console.log(jqXHR);
                    online_status = 'no_connection';

                    resultCheckStatus();
                }
            });
        }else{
            if(is_get_status_novel != true && is_get_status_openai != true){
                online_status = 'no_connection';
            }
        }
    }

    function resultCheckStatus(){
        is_api_button_press = false;  
        checkOnlineStatus();
        $("#api_loading").css("display", 'none');
        if(is_mobile_user){$("#api_button").css('display', 'block');}
        else{$("#api_button").css('display', 'inline-block');}
    }


    // HORDE
    async function getStatusHorde(){
        if(is_get_status){
            var data = {'type':'text'};

            jQuery.ajax({
                type: 'POST', //
                url: '/getstatus_horde', //
                data: JSON.stringify(data),
                beforeSend: function(){
                    //$('#create_button').attr('value','Creating...');
                },
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function(data){
                    if (!('error' in data)) online_status = 'Models list fetched and updated';

                    $('#horde_model_select').empty();
                    $('#horde_model_select').append($('<option></option>').val('').html('-- Select Model --'));
                    $.each(data, function(i, p) {
                        $('#horde_model_select').append($('<option></option>').val(p.name).html('['+p.count.toString()+'] - '+p.name));
                    });

                    is_pygmalion = true;
                    if(is_colab){
                        let selectElement = $("#horde_model_select");
                        let numOptions = selectElement.children("option").length;
                        let randomIndex = Math.floor(Math.random() * numOptions);
                        if(randomIndex === 0){
                            randomIndex++;
                        }
                        selectElement.prop("selectedIndex", randomIndex);
                        selectElement.trigger("change");
                        $('#colab_shadow_popup').css('display', 'none');
                    }
                    resultCheckStatusHorde();
                },
                error: function (jqXHR, exception) {
                    online_status = 'no_connection';
                    $('#horde_model_select').empty();
                    $('#horde_model_select').append($('<option></option>').val('').html('-- Connect to Horde for models --'));

                    console.log(exception);
                    console.log(jqXHR);
                    resultCheckStatusHorde();
                }
            });
        }else{
            if(!is_get_status && !is_get_status_novel){
                online_status = 'no_connection';
            }
        }
    }

    function resultCheckStatusHorde(){
        is_api_button_press = false;
        checkOnlineStatus();
        $("#api_loading_horde").css("display", 'none');
        $("#api_button_horde").css("display", 'inline-block');
    }



    async function getBackgrounds() {

        const response = await fetch("/getbackgrounds", {
            method: "POST",
            headers: {
                                        "Content-Type": "application/json",
                                        "X-CSRF-Token": token
                                },
            body: JSON.stringify({
                        "": ""
                    })

        });
        if (response.ok === true) {
            const getData = await response.json();
            //background = getData;
            //console.log(getData.length);
            for(var i = 0; i < getData.length; i++) {
                //console.log(1);
                $("#bg_menu_content").append("<div class=bg_example><img bgfile='"+getData[i]+"' class=bg_example_img src='backgrounds/"+getData[i]+"'><img bgfile='"+getData[i]+"' class=bg_example_cross src=img/cross.png></div>");
            }
            //var aa = JSON.parse(getData[0]);
            //const load_ch_coint = Object.getOwnPropertyNames(getData);


        }
    }
     async function isColab() {
        is_checked_colab = true;
        const response = await fetch("/iscolab", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": token
                                },
            body: JSON.stringify({
                        "": ""
                    })

        });
        if (response.ok === true) {
            const getData = await response.json();
            if(getData.colab_type !== undefined){
                is_colab = true;
                let url;
                if (getData.colab_type == "kobold_model") {
                    $("#main_api").val("kobold");
                    $("#main_api").change();
                    url = String(getData.colaburl).split("flare.com")[0] + "flare.com";
                    url = String(url).split("loca.lt")[0] + "loca.lt";
                    $('#api_url_text').val(url);
                    setTimeout(function () {
                        $('#api_button').click();
                        $('#colab_shadow_popup').css('display', 'none');
                    }, 2000);
                }
                
                if(getData.colab_type == "kobold_horde"){
                    main_api = "horde";
                    $("#main_api").val("horde");
                    $("#main_api").change();
                    setTimeout(function () {
                        $('#api_button_horde').click();
                        
                    }, 2000);

                }
                if(getData.colab_type == "openai"){
                    url = getData.colaburl;
                    main_api = "openai";
                    $("#main_api").val("openai");
                    $("#main_api").change();
                    $('#api_key_openai').val(url);
                    setTimeout(function () {
                        $('#api_button_openai').click();
                        $('#colab_shadow_popup').css('display', 'none');
                    }, 1000);
                }
            }


        }
    }
    async function setBackground(bg) {
        jQuery.ajax({    
            type: 'POST', // 
            url: '/setbackground', // 
            data: JSON.stringify({
                        bg: bg
                    }),
            beforeSend: function(){
                //$('#create_button').attr('value','Creating...'); // 
            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function(html){

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);
            }
        });
    }
    async function delBackground(bg) {
        const response = await fetch("/delbackground", {
            method: "POST",
            headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": token
                                },
            body: JSON.stringify({
                        "bg": bg
                    })

        });
        if (response.ok === true) {
            //const getData = await response.json();
            //background = getData;

            //var aa = JSON.parse(getData[0]);
            //const load_ch_coint = Object.getOwnPropertyNames(getData);


        }
    }
    function printMessages(){
        chat.forEach(function(item, i, arr) {
            addOneMessage(item);
        });
    }
    function clearChat(){
        count_view_mes = 0;
        $('#chat').html('');
    }
    function messageFormating(mes, ch_name){
        //if(Characters.selectedID != undefined) mes = mes.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        //for Chloe
        if(Characters.selectedID === undefined){
            mes = mes.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/\n/g, '<br/>');

        }else{
            mes = converter.makeHtml(mes);
            mes = mes.replace(/\n/g, '<br/>');
        }


        if(ch_name !== name1){
            mes = mes.replaceAll(name2+":", "");
        }
        return mes;
    }
    function getMessageAvatar(mes) {
        var avatarImg = "User Avatars/"+user_avatar;
        if(!mes.is_user){
            if(Characters.selectedID === undefined) {
                avatarImg = "img/chloe.png";
            } else {
                //mes.chid = mes.chid || parseInt(Characters.selectedID);
                mes.chid = parseInt(Characters.selectedID);     // TODO: properly establish persistent ids
                avatarImg = Characters.id[mes.chid].filename == 'none' ? "img/fluffy.png" : "characters/"+Characters.id[Characters.selectedID].filename + "#t=" + Date.now();
            }
        } else {
            delete mes.chid;
        }
        return avatarImg;
    }
    function addOneMessage(mes, type='normal') {
        var messageText = mes['mes'];
        var characterName = name1;
        generatedPromtCache = '';
        var avatarImg = getMessageAvatar(mes);
        if(!mes.is_user){
            mes.chid = Characters.selectedID;   // TODO: properly establish persistent ids
            characterName = Characters.id[mes.chid] ? Characters.id[mes.chid].name : "Chloe";
        }
        if(count_view_mes == 0){
            messageText = messageText.replace(/{{user}}/gi, name1);
            messageText = messageText.replace(/{{char}}/gi, name2);
            messageText = messageText.replace(/<USER>/gi, name1);
            messageText = messageText.replace(/<BOT>/gi, name2);
        }
        messageText = messageFormating(messageText, characterName);
        let container = null;
        if(type !== 'swipe'){
                container = $('<div class="mes" mesid='+count_view_mes+' ch_name="'+vl(characterName)+'" is_user="'+mes['is_user']+'"></div>')
                container.append('<div class="for_checkbox"></div><input type="checkbox" class="del_checkbox">');       // delete checkbox
                container.append('<div class="avatar"><img class="avt_img" src="'+avatarImg+'"></div>');                                // avatar

            let messageBlock = $('<div class="mes_block"></div>');
                messageBlock.append('<div class="ch_name">'+vl(characterName)+'</div>');                                    // character name block
                messageBlock.append('<select class="name_select"></select>');                                    // character name selector for editing
            container.append(messageBlock);

            // message content
            messageBlock.append('<div class="mes_text"></div>');

            container.append('<div title="Edit" class="mes_edit"><img src="img/scroll.png"></div>');                // edit button
            let editMenu = $('<div class="edit_block"></div>');                                                         // edit menu shown when edit button is pressed
                editMenu.append('<div class="mes_edit_done"><img src="img/done.png"></div>');                           // confirm button
                editMenu.append('<div class="mes_edit_clone" title="Create copy"><img src=img/clone.png></div>');
                editMenu.append('<div class="mes_edit_delete" title="Delete"><img src=img/del_mes.png></div>');
                editMenu.append('<div class="mes_up" title="Move up"><img src=img/arrow_up.png></div>');
                editMenu.append('<div class="mes_down"><img src="img/arrow_down.png" title="Move down"></div>');
                editMenu.append('<div class="mes_edit_cancel"><img src="img/cancel.png"></div>');                       // cancel (close menu)
            container.append(editMenu);

            /* Swipes */
            container.append('<div class="swipe_left"><img src="img/swipe_left.png"></div>');
            container.append('<div class="swipe_right"><img src="img/swipe_right.png"></div>');

            let tokenCounter = $('<div class="token_counter" title="Token count"></div>');         // token count
            container.append(tokenCounter);

            $("#chat").append(container);
        }
        
        if(!if_typing_text){
            if(type === 'swipe'){
                $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.mes_block').children('.mes_text').html('');
                $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.mes_block').children('.mes_text').append(messageText);
                $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.token_counter').html(String(getTokenCount(messageText)));
                if(mes['swipe_id'] !== 0 && swipes){
                    $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_right').css('display', 'block');
                    $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_left').css('display', 'block');
                }
            }else{
                $("#chat").children().filter('[mesid="'+count_view_mes+'"]').children('.mes_block').children('.mes_text').append(messageText);
                $("#chat").children().filter('[mesid="'+count_view_mes+'"]').children('.token_counter').html(String(getTokenCount(messageText)));
                
                hideSwipeButtons();
                
                if(parseInt(chat.length-1) === parseInt(count_view_mes) && !mes['is_user'] && swipes){
                    
                    if(mes['swipe_id'] === undefined && count_view_mes !== 0){
                        $("#chat").children().filter('[mesid="'+(count_view_mes)+'"]').children('.swipe_right').css('display', 'block');
                    }else if(mes['swipe_id'] !== undefined){
                        if(mes['swipe_id'] === 0){
                            $("#chat").children().filter('[mesid="'+(count_view_mes)+'"]').children('.swipe_right').css('display', 'block');
                        }else {
                            $("#chat").children().filter('[mesid="'+(count_view_mes)+'"]').children('.swipe_right').css('display', 'block');
                            $("#chat").children().filter('[mesid="'+(count_view_mes)+'"]').children('.swipe_left').css('display', 'block');
                        }
                    }
                }
            }
        }else{
            typeWriter($("#chat").children().filter('[mesid="'+count_view_mes+'"]').children('.mes_block').children('.mes_text'), messageText, 50, 0);
        }
        
        if(type !== 'swipe'){
            count_view_mes++;
        }
        if(!add_mes_without_animation){
            $('#chat').children().last().css("opacity",1.0);
            $('#chat').children().last().transition({  
                    opacity: 1.0,
                    duration: 700,
                    easing: "",
                    complete: function() {  }
            });
        }else{
            add_mes_without_animation = false;
        }
        var $textchat = $('#chat');
        
        $('#chat .mes').last().addClass('last_mes');
        $('#chat .mes').eq(-2).removeClass('last_mes');
        $textchat.scrollTop($textchat[0].scrollHeight);

        return container;
    }
    function typeWriter(target, text, speed, i) {
        if (i < text.length) {
            //target.append(text.charAt(i));
            target.html(target.html() + text.charAt(i));
            i++;
            setTimeout(() => typeWriter(target, text, speed, i), speed);
        }
    }
    function newMesPattern(name){ //Patern which denotes a new message
        name = name+':';
        return name;
    }

    $( "#send_button" ).click(function() {
        //$( "#send_button" ).css({"background": "url('img/load.gif')","background-size": "100%, 100%", "background-position": "center center"});
        if(is_send_press == false){
            hideSwipeButtons();
            is_send_press = true;

            Generate();
        }
    });
    async function Generate(type) {//encode("dsfs").length
        // HORDE
        if (main_api == 'horde' && horde_model == '') { return; }

        let gap_holder = 120;
        if(main_api === 'openai' && (model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k')) 
            gap_holder = parseInt(amount_gen_openai)+gap_holder;
        var textareaText = '';
        tokens_already_generated = 0;
        if(!free_char_name_mode){
            message_already_generated = name2+': ';
        }else{
            message_already_generated = '';
        }
        if(online_status != 'no_connection' && Characters.selectedID != undefined){
            if(type === 'regenerate'){
                textareaText = "";
                if(chat[chat.length-1]['is_user']){//If last message from You

                }else{
                    chat.length = chat.length-1;
                    count_view_mes-=1;
                    $('#chat').children().last().remove();
                }
                
            }else{
                if(type !== 'swipe'){
                    textareaText = $("#send_textarea").val();
                    $("#send_textarea").val('');
                }
            }
            //$("#send_textarea").attr("disabled","disabled");

            //$("#send_textarea").blur();
            $( "#send_button" ).css("display", "none");
            $( "#loading_mes" ).css("display", "block");


            var storyString = "";
            var userSendString = "";
            var finalPromt = "";

            var postAnchorChar = "talks a lot with descriptions";//'Talk a lot with description what is going on around';// in asterisks
            var postAnchorStyle = "Writing style: very long messages";//"[Genre: roleplay chat][Tone: very long messages with descriptions]";


            var anchorTop = '';
            var anchorBottom = '';
            var topAnchorDepth = 8;

            if(character_anchor && !is_pygmalion){
                if(anchor_order === 0){
                    anchorTop = name2+" "+postAnchorChar;
                }else{
                    anchorBottom = "["+name2+" "+postAnchorChar+"]";
                }
            }
            if(style_anchor && !is_pygmalion){
                if(anchor_order === 1){
                    anchorTop = postAnchorStyle;
                }else{
                    anchorBottom = "["+postAnchorStyle+"]";
                }
            }


            //*********************************
            //PRE FORMATING STRING
            //*********************************
            if(textareaText != ""){

                chat[chat.length] = {};
                chat[chat.length-1]['name'] = name1;
                chat[chat.length-1]['is_user'] = true;
                chat[chat.length-1]['is_name'] = true;
                chat[chat.length-1]['send_date'] = Date.now();
                chat[chat.length-1]['mes'] = textareaText;
                addOneMessage(chat[chat.length-1]);
            }
            var chatString = '';
            var arrMes = [];
            var mesSend = [];

            var charDescription = Characters.id[Characters.selectedID].description.replace(/\r/g, "");
            var charPersonality = $.trim(Characters.id[Characters.selectedID].personality);
            var inject = "";


            let wDesc = WPP.parseExtended(charDescription);
            if(settings.notes && winNotes.strategy === "discr") {
                charDescription = WPP.stringifyExtended(WPP.getMergedExtended(wDesc, winNotes.wppx), "line");
            } else if(settings.notes && winNotes.strategy === "prep") {
                inject = (WPP.stringifyExtended(winNotes.wppx) + "\n")
                    .replace(/{{user}}/gi, name1)
                    .replace(/{{char}}/gi, name2)
                    .replace(/<USER>/gi, name1)
                    .replace(/<BOT>/gi, name2);
            } else {
                charDescription = WPP.stringifyExtended(wDesc, "line");
            }
            charDescription = $.trim(charDescription);


            /* World info */
            let prepend = [];
            let append = [];
            if(winWorldInfo.worldName && winWorldInfo.worldName.length) {
                let depth = parseInt(document.getElementById("input_worldinfo_depth").value);
                let budget = parseInt(document.getElementById("input_worldinfo_budget").value);

                let process = [];
                let i = chat.length-1;
                let k = 0;
                while(chat[i] && i >= 0 && k < depth) {
                    process.push(chat[i].mes);
                    k++;
                    i--;
                }
                let result = winWorldInfo.evaluate(process);
                let totalTokens = 0;
                for(let i = 0; i < result.prepend.length; i++) {
                    const isAppend = !result.prepend[i];
                    const candidate = result.prepend[i] ? result.prepend[i] : result.append[i];
                    totalTokens += encode(candidate);
                    if(totalTokens > budget) {
                        break;
                    }
                    (isAppend ? append : prepend).push(candidate);
                }
            }

            var Scenario = $.trim(Characters.id[Characters.selectedID].scenario);
            var mesExamples = $.trim(Characters.id[Characters.selectedID].mes_example);

            var checkMesExample = $.trim(mesExamples.replace(/<START>/gi, ''));//for check length without tag
            if(checkMesExample.length == 0) mesExamples = '';
            var mesExamplesArray = [];
            //***Base replace***
            if(mesExamples !== undefined){
                if(mesExamples.length > 0){
                    if(is_pygmalion){
                        mesExamples = mesExamples.replace(/{{user}}:/gi, 'You:');
                        mesExamples = mesExamples.replace(/<USER>:/gi, 'You:');
                    }
                    mesExamples = mesExamples.replace(/{{user}}/gi, name1);
                    mesExamples = mesExamples.replace(/{{char}}/gi, name2);
                    mesExamples = mesExamples.replace(/<USER>/gi, name1);
                    mesExamples = mesExamples.replace(/<BOT>/gi, name2);
                    //mesExamples = mesExamples.replaceAll('<START>', '[An example of how '+name2+' responds]');
                    let blocks = mesExamples.split(/<START>/gi);
                    mesExamplesArray = blocks.slice(1).map(block => `<START>\n${block.trim()}\n`);
                }
            }
            if(charDescription !== undefined){
                if(charDescription.length > 0){
                    charDescription = charDescription.replace(/{{user}}/gi, name1);
                    charDescription = charDescription.replace(/{{char}}/gi, name2);
                    charDescription = charDescription.replace(/<USER>/gi, name1);
                    charDescription = charDescription.replace(/<BOT>/gi, name2);
                }
            }
            if(charPersonality !== undefined){
                if(charPersonality.length > 0){
                    charPersonality = charPersonality.replace(/{{user}}/gi, name1);
                    charPersonality = charPersonality.replace(/{{char}}/gi, name2);
                    charPersonality = charPersonality.replace(/<USER>/gi, name1);
                    charPersonality = charPersonality.replace(/<BOT>/gi, name2);
                }
            }
            if(Scenario !== undefined){
                if(Scenario.length > 0){
                    Scenario = Scenario.replace(/{{user}}/gi, name1);
                    Scenario = Scenario.replace(/{{char}}/gi, name2);
                    Scenario = Scenario.replace(/<USER>/gi, name1);
                    Scenario = Scenario.replace(/<BOT>/gi, name2);
                }
            }
            

            if(is_pygmalion){
                if(charDescription.length > 0){
                    storyString = name2+"'s Persona: "+charDescription+"\n";
                }
                if(charPersonality.length > 0){
                    storyString+= 'Personality: '+charPersonality+'\n';
                }
                if(Scenario.length > 0){
                    storyString+= 'Scenario: '+Scenario+'\n';
                }
            }else{
                if(charDescription !== undefined){
                    if(charPersonality.length > 0){
                        charPersonality = name2+"'s personality: "+charPersonality;//"["+name2+"'s personality: "+charPersonality+"]";
                    }
                }
                if(charDescription !== undefined){
                    if($.trim(charDescription).length > 0){
                        if(charDescription.slice(-1) !== ']' || charDescription.substr(0,1) !== '['){
                            //charDescription = '['+charDescription+']';
                        }
                        storyString+=charDescription+'\n';
                    }
                }

                if(count_view_mes < topAnchorDepth){
                    storyString+=charPersonality+'\n';
                }


            }

            if(main_api == 'kobold') {
                if(prepend.length) {
                    storyString = prepend.join("\n") + "\n" + storyString;
                }
                if(append.length) {
                    storyString = storyString + append.join("\n") + "\n";
                }
                storyString = storyString.replace(/\n+/g, "\n");
            }

            if(main_api === 'openai' && (model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k')){
                let osp_string = openai_system_prompt.replace(/{{user}}/gi, name1) //System prompt for OpenAI
                                .replace(/{{char}}/gi, name2)
                                .replace(/<USER>/gi, name1)
                                .replace(/<BOT>/gi, name2);
                storyString = osp_string+'\n'+storyString;
            }
            
            var count_exm_add = 0;
            var chat2 = [];
            var j = 0;
            for(var i = chat.length-1; i >= 0; i--){
                if(j == 0){
                    chat[j]['mes'] = chat[j]['mes'].replace(/{{user}}/gi, name1);
                    chat[j]['mes'] = chat[j]['mes'].replace(/{{char}}/gi, name2);
                    chat[j]['mes'] = chat[j]['mes'].replace(/<USER>/gi, name1);
                    chat[j]['mes'] = chat[j]['mes'].replace(/<BOT>/gi, name2);
                }
                let this_mes_ch_name = '';
                if(chat[j]['is_user']){
                    this_mes_ch_name = name1;
                }else{
                    this_mes_ch_name = name2;
                }
                if(chat[j]['is_name']){
                    chat2[i] = this_mes_ch_name+': '+chat[j]['mes']+'\n';
                }else{
                    chat2[i] = chat[j]['mes']+'\n';
                }
                j++;
            }
            //chat2 = chat2.reverse();
            var this_max_context = 1487;
            if(main_api == 'kobold') this_max_context = max_context;
            if(main_api == 'horde') this_max_context = max_context;
            if(main_api == 'novel'){
                if(novel_tier === 1){
                    this_max_context = 1024;
                }else{
                    this_max_context = 2048-60;//fix for fat tokens 
                    if(model_novel == 'krake-v2'){
                        this_max_context-=160;
                    }
                }
            }
            if(main_api == 'openai') this_max_context = max_context_openai;
            
            var i = 0;
            let mesExmString = '';
            count_exm_add = 0;
            if(keep_dialog_examples){
                for(let iii = 0; iii < mesExamplesArray.length; iii++){
                    mesExmString = mesExmString+mesExamplesArray[iii];
                    if(!is_pygmalion){
                        mesExamplesArray[iii] = mesExamplesArray[iii].replace(/<START>/i, 'This is how '+name2+' should talk');//An example of how '+name2+' responds
                    }
                    count_exm_add++;
                }
            }
            if(type == 'swipe'){
                chat2.shift();
            }
            for (var item of chat2) {//console.log(encode("dsfs").length);
                chatString = item+chatString;
                if(getTokenCount(storyString+mesExmString+chatString+anchorTop+anchorBottom+charPersonality)+gap_holder < this_max_context){ //(The number of tokens in the entire prompt) need fix, it must count correctly (added +120, so that the description of the character does not hide)
                    arrMes[arrMes.length] = item;
                }else{
                    i = chat2.length-1;
                }
                await delay(1); //For disable slow down (encode gpt-2 need fix)
                //console.log(i+' '+chat.length);
                
                
                
                if(i == chat2.length-1){
                    //arrMes[arrMes.length-1] = '<START>\n'+arrMes[arrMes.length-1];
                    if(!keep_dialog_examples){
                        for(let iii = 0; iii < mesExamplesArray.length; iii++){//mesExamplesArray It need to make from end to start

                            mesExmString = mesExmString+mesExamplesArray[iii];
                            if(getTokenCount(storyString+mesExmString+chatString+anchorTop+anchorBottom+charPersonality)+gap_holder < this_max_context){ //example of dialogs
                                if(!is_pygmalion){
                                    mesExamplesArray[iii] = mesExamplesArray[iii].replace(/<START>/i, 'This is how '+name2+' should talk');//An example of how '+name2+' responds
                                }
                                count_exm_add++;
                                await delay(1);

                                //arrMes[arrMes.length] = item;
                            }else{

                                iii = mesExamplesArray.length;
                            }

                        }
                    }

                    if(!is_pygmalion){
                        if(Scenario !== undefined){
                            if(Scenario.length > 0){
                                storyString+= 'Circumstances and context of the dialogue: '+Scenario+'\n';
                            }
                        }
                        //storyString+='\nThen the roleplay chat between '+name1+' and '+name2+' begins.\n';
                    }
                    runGenerate();
                    return;
                }
                i++;


            }

            function runGenerate(cycleGenerationPromt = ''){
                generatedPromtCache+=cycleGenerationPromt;
                if(generatedPromtCache.length == 0){
                    chatString = "";
                    arrMes = arrMes.reverse();
                    var is_add_personality = false;

                    if (main_api === 'openai' && (model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k')) { // Jailbreak
                        if (openai_jailbreak2_prompt.length > 0) {
                            arrMes[arrMes.length-1] = arrMes[arrMes.length-1]+'\n'+openai_jailbreak2_prompt;
                        }
                        if (openai_jailbreak_prompt.length > 0) {
                            //arrMes.splice(-1, 0, openai_jailbreak_prompt);
                            arrMes.push(openai_jailbreak_prompt);
                        }
                        
                    }


                    if(inject && inject.length && arrMes.length) {
                        arrMes.splice(arrMes.length-1, 0, inject);
                    }


                    arrMes.forEach(function(item, i, arr) {//For added anchors and others

                        if(i >= arrMes.length-1 && $.trim(item).substr(0, (name1+":").length) != name1+":"){
                            if(textareaText == ""){
                                item = item.substr(0,item.length-1);
                            }
                        }
                        if(i === arrMes.length-topAnchorDepth && count_view_mes>=topAnchorDepth && !is_add_personality){

                            is_add_personality = true;
                            //chatString = chatString.substr(0,chatString.length-1);
                            //anchorAndPersonality = "[Genre: roleplay chat][Tone: very long messages with descriptions]";
                            if((anchorTop != "" || charPersonality != "") && !is_pygmalion){
                                if(anchorTop != "") charPersonality+=' ';
                                item+="["+charPersonality+anchorTop+']\n';
                            }
                        }
                        if(i >= arrMes.length-1 && count_view_mes>8 && $.trim(item).substr(0, (name1+":").length) == name1+":" && !is_pygmalion){//For add anchor in end
                            item = item.substr(0,item.length-1);
                            //chatString+=postAnchor+"\n";//"[Writing style: very long messages]\n";
                            item =item+ anchorBottom+"\n";
                        }
                        

                        if(!free_char_name_mode && !(main_api === 'openai' && (model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k'))){
                            if(i >= arrMes.length-1 && $.trim(item).substr(0, (name1+":").length) == name1+":"){//for add name2 when user sent
                                item =item+name2+":";
                            }
                            if(i >= arrMes.length-1 && $.trim(item).substr(0, (name1+":").length) != name1+":"){//for add name2 when continue
                                if(textareaText == ""){
                                    item =item+'\n'+name2+":";
                                }
                            }
                        }
                        
                        if(is_pygmalion){
                            if($.trim(item).indexOf(name1) === 0){
                                item = item.replace(name1+':', 'You:');
                            }
                        }
                        mesSend[mesSend.length] = item;
                        //chatString = chatString+item;
                    });
                }
                //finalPromt +=chatString;
                //console.log(storyString);

                //console.log(encode(characters[Characters.selectedID].description+chatString).length);
                //console.log(encode(JSON.stringify(characters[Characters.selectedID].description+chatString)).length);
                
                //console.log(JSON.stringify(storyString));
                //Send story string
                var mesSendString = '';
                var mesExmString = '';
                function setPromtString(){
                    mesSendString = '';
                    mesExmString = '';
                    for(let j = 0; j < count_exm_add; j++){
                        mesExmString+=mesExamplesArray[j];
                    }
                    for(let j = 0; j < mesSend.length; j++){
                        mesSendString+=mesSend[j];
                        if(type === 'force_name2' && j === mesSend.length-1 && tokens_already_generated === 0){
                            mesSendString+= name2+':';
                        }
                    }
                }
                function checkPromtSize(){
                    setPromtString();
                    let thisPromtContextSize = getTokenCount(storyString+mesExmString+mesSendString+anchorTop+anchorBottom+charPersonality+generatedPromtCache)+gap_holder;
                    if(thisPromtContextSize > this_max_context){
                        if(count_exm_add > 0 && !keep_dialog_examples){
                            //mesExamplesArray.length = mesExamplesArray.length-1;
                            count_exm_add--;
                            checkPromtSize();
                        }else if(mesSend.length > 0){
                            mesSend.shift();
                            checkPromtSize();
                        }else{
                            //end
                        }
                    }
                }



                if(generatedPromtCache.length > 0){
                    checkPromtSize();
                }else{
                    setPromtString();
                }

                if(!is_pygmalion){
                    mesSendString = '\nThen the roleplay chat between '+name1+' and '+name2+' begins.\n'+mesSendString;
                }else{
                    mesSendString = '<START>\n'+mesSendString;
                }
                if(main_api === 'openai' && (model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k')){
                    finalPromt = {};
                    finalPromt = [];
                    
                    
                    finalPromt[0] = {"role": "system", "content": storyString+mesExmString};
                    mesSend.forEach(function(item,i){
                        if (openai_jailbreak_prompt.length > 0 && i === mesSend.length-1) {
                            finalPromt[i + 1] = {"role": "system", "content": item};
                        } else {
                            if (item.indexOf(name1 + ':') === 0) {
                                finalPromt[i + 1] = {"role": "user", "content": item};
                            } else {
                                finalPromt[i + 1] = {"role": "assistant", "content": item};
                            }
                        }

                    });
 
                }else{
                    finalPromt = storyString+mesExmString+mesSendString+generatedPromtCache;
                }

                var generate_data;
                switch(main_api){
                    case 'kobold':
                            var this_amount_gen = parseInt(amount_gen);
                            break;
                    case 'novel':
                            var this_amount_gen = parseInt(amount_gen_novel);
                            break;
                    case 'openai':
                            var this_amount_gen = parseInt(amount_gen_openai);
                            break;
                }
                var this_max_gen = this_amount_gen;
                if(multigen && (main_api === 'kobold' || main_api === 'novel')){ //Multigen is not necessary for OpenAI (Uses stop tokens)
                    
                    let this_set_context_size;
                    if(main_api === 'kobold') this_set_context_size = parseInt(amount_gen);
                    if(main_api === 'novel') this_set_context_size = parseInt(amount_gen_novel);
                    if(tokens_already_generated === 0){
                        if(this_set_context_size >= tokens_first_request_count){
                            this_amount_gen = tokens_first_request_count;
                        }else{
                            this_amount_gen = this_set_context_size;
                        }

                    }else{
                        if(parseInt(amount_gen) - tokens_already_generated < tokens_cycle_count){
                            this_amount_gen = this_set_context_size - tokens_already_generated;
                        }else{
                            this_amount_gen = tokens_cycle_count;
                        }
                    }
                }
                if(main_api == 'kobold'){
                    var generate_data = {prompt: finalPromt, gui_settings: true, max_context_length: this_max_context, singleline: singleline};
                    if(preset_settings != 'gui'){

                        var this_settings = koboldai_settings[koboldai_setting_names[preset_settings]];
                        
                        
                        generate_data = {prompt: finalPromt, 
                                        gui_settings: false, 
                                        max_context_length: parseInt(this_max_context),//this_settings.max_length,
                                        max_length: this_amount_gen,//parseInt(amount_gen),
                                        rep_pen: parseFloat(rep_pen),
                                        rep_pen_range: parseInt(rep_pen_size),
                                        rep_pen_slope: parseFloat(rep_pen_slope),
                                        temperature: parseFloat(temp),
                                        tfs: parseFloat(tfs),
                                        top_a: parseFloat(top_a),
                                        top_k: parseInt(top_k),
                                        top_p: parseFloat(top_p),
                                        typical: parseFloat(typical),
                                        singleline: singleline,
                                        s1:this_settings.sampler_order[0],
                                        s2:this_settings.sampler_order[1],
                                        s3:this_settings.sampler_order[2],
                                        s4:this_settings.sampler_order[3],
                                        s5:this_settings.sampler_order[4],
                                        s6:this_settings.sampler_order[5],
                                        s7:this_settings.sampler_order[6]
                                        };
                    }
                }
                if(main_api == 'novel'){
                    var this_settings = novelai_settings[novelai_setting_names[preset_settings_novel]];
                    generate_data = {"input": finalPromt,
                                    "model": model_novel,
                                    "use_string": true,
                                    "temperature": parseFloat(temp_novel),
                                    "max_length": this_amount_gen,
                                    "min_length": this_settings.min_length,
                                    "tail_free_sampling": parseFloat(tfs_novel),
                                    "top_a": parseFloat(top_a_novel),
                                    "top_k": parseInt(top_k_novel),
                                    "top_p": parseFloat(top_p_novel),
                                    "typical_p": parseFloat(typical_novel),
                                    "repetition_penalty": parseFloat(rep_pen_novel),
                                    "repetition_penalty_range": parseInt(rep_pen_size_novel),
                                    "repetition_penalty_slope": parseFloat(rep_pen_slope_novel),
                                    "repetition_penalty_frequency": this_settings.repetition_penalty_frequency,
                                    "repetition_penalty_presence": this_settings.repetition_penalty_presence,
                                    //"stop_sequences": {{187}},
                                    //bad_words_ids = {{50256}, {0}, {1}};
                                    //generate_until_sentence = true;
                                    "use_cache": false,
                                    //use_string = true;
                                    "return_full_text": false,
                                    "prefix": "vanilla",
                                    "order": this_settings.order
                                        };
                }

                // HORDE
                if(main_api == 'horde'){
                    // Same settings as Kobold?
                    var this_settings = koboldai_settings[koboldai_setting_names[preset_settings]];
                    this_amount_gen = parseInt(amount_gen);

                    if (horde_api_key == null) {
                        horde_api_key = "0000000000";
                    }

                    generate_data = {
                        "prompt": finalPromt,
                        "horde_api_key": horde_api_key,
                        "n": 1,
                        "frmtadsnsp": false,
                        "frmtrmblln": false,
                        "frmtrmspch": false,
                        "frmttriminc": false,
                        "max_context_length": parseInt(max_context),
                        "max_length": this_amount_gen,
                        "rep_pen": parseFloat(rep_pen),
                        "rep_pen_range": parseInt(rep_pen_size),
                        "rep_pen_slope": this_settings.rep_pen_slope,
                        "singleline": singleline || false,
                        "temperature": parseFloat(temp),
                        "tfs": this_settings.tfs,
                        "top_a": this_settings.top_a,
                        "top_k": this_settings.top_k,
                        "top_p": this_settings.top_p,
                        "typical": this_settings.typical,
                        "s1": this_settings.sampler_order[0],
                        "s2": this_settings.sampler_order[1],
                        "s3": this_settings.sampler_order[2],
                        "s4": this_settings.sampler_order[3],
                        "s5": this_settings.sampler_order[4],
                        "s6": this_settings.sampler_order[5],
                        "s7": this_settings.sampler_order[6],
                        "models": [horde_model]
                    };
                }

                if(main_api == 'openai'){
                    generate_data = {
                        "model": model_openai,
                        "temperature": parseFloat(temp_openai),
                        "frequency_penalty": parseFloat(freq_pen_openai),
                        "presence_penalty": parseFloat(pres_pen_openai),
                        "top_p": parseFloat(top_p_openai),
                        "stop": [ name1+':', '<|endoftext|>'],
                        "max_tokens": this_amount_gen
                    };
                    
                    if((model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k')){
                        generate_data.messages = finalPromt;
                    }else{
                        generate_data.prompt = finalPromt;
                    }
                   
                }
                var generate_url = '';
                if(main_api == 'kobold'){
                    generate_url = '/generate';
                }
                if(main_api == 'novel'){
                    generate_url = '/generate_novelai';
                }
                // HORDE
                if(main_api == 'horde'){
                    generate_url = '/generate_horde';

                    hordeCheck = true;
                    updateHordeStats();
                }
                if(main_api == 'openai'){
                    generate_url = '/generate_openai';
                }

                jQuery.ajax({    
                    type: 'POST', // 
                    url: generate_url, // 
                    data: JSON.stringify(generate_data),
                    beforeSend: function(){
                        //$('#create_button').attr('value','Creating...'); 
                    },
                    cache: false,
                    timeout: (main_api == 'horde' && requestTimeout < 5*60*1000 ? 5*60*1000 : requestTimeout),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data){
                        tokens_already_generated += this_amount_gen;
                        //$("#send_textarea").focus();
                        //$("#send_textarea").removeAttr('disabled');
                        
                        if(data.error != true){
                            var getMessage = '';
                            //const getData = await response.json();
                            if(main_api == 'kobold'){
                                getMessage = data.results[0].text;
                            }
                            if(main_api == 'novel'){
                                getMessage = data.output;
                            }
                            if(main_api == 'horde'){
                                getMessage = data.generations[0].text;
                                if(hordeCheck) {
                                    hordeCheck = false;
                                    document.getElementById("hordeInfo").classList.remove("hidden");
                                    document.getElementById("hordeQueue").innerHTML = "-";
                                }
                            }
                            if(main_api == 'openai'){
                                if(model_openai === 'gpt-3.5-turbo' || model_openai === 'gpt-3.5-turbo-0301' || model_openai === 'gpt-4' || model_openai === 'gpt-4-32k'){
                                    getMessage = data.choices[0].message.content;
                                }else{
                                    getMessage = data.choices[0].text;
                                }
                            }
                            //Multigen run again
                            
                            if(multigen && (main_api === 'kobold' || main_api === 'novel')){
                                if_typing_text = false;

                                if(type === 'force_name2' && tokens_already_generated === tokens_first_request_count){
                                    getMessage = name2+": "+getMessage;
                                }
                                getMessage = getMessage.replace(/\n+$/, "");
                                message_already_generated +=getMessage;

                                if(message_already_generated.indexOf('You:') === -1 && message_already_generated.indexOf('<|endoftext|>') === -1 && tokens_already_generated < parseInt(this_max_gen) && getMessage.length > 0){
                                    runGenerate(getMessage);
                                    return;
                                }

                                getMessage = message_already_generated;
                            }
                            //Formating
                            getMessage = $.trim(getMessage);
                            if(is_pygmalion){
                                getMessage = getMessage.replace(new RegExp('<USER>', "g"), name1);
                                getMessage = getMessage.replace(new RegExp('<BOT>', "g"), name2);
                                getMessage = getMessage.replace(new RegExp('You:', "g"), name1+':');
                            }
                            if(getMessage.indexOf(name1+":") != -1){ 
                                getMessage = getMessage.substr(0,getMessage.indexOf(name1+":"));

                            }
                            if(getMessage.indexOf('<|endoftext|>') != -1){ 
                                getMessage = getMessage.substr(0,getMessage.indexOf('<|endoftext|>'));

                            }
                            let this_mes_is_name = true;
                            if(getMessage.indexOf(name2+":") === 0){
                                getMessage = getMessage.replace(name2+':', '');
                                getMessage = getMessage.trimStart();
                            }else{
                                this_mes_is_name = false;
                            }
                            if(type === 'force_name2') this_mes_is_name = true;
                            //getMessage = getMessage.replace(/^\s+/g, '');
                            if(getMessage.length > 0){
                                if(chat[chat.length-1]['swipe_id'] === undefined || chat[chat.length-1]['is_user']){
                                    
                                    type = 'normal';
                                }
                                if(type === 'swipe'){
                                    
                                    chat[chat.length-1]['swipes'][chat[chat.length-1]['swipes'].length] = getMessage;
                                    if(chat[chat.length-1]['swipe_id'] === chat[chat.length-1]['swipes'].length-1){
                                        chat[chat.length-1]['mes'] = getMessage;
                                        addOneMessage(chat[chat.length-1], 'swipe');
                                    }else{
                                        chat[chat.length-1]['mes'] = getMessage;
                                    }
                                    is_send_press = false;
                                }else{
                                    chat[chat.length] = {}; //adds one mes in array but then increases length by 1
                                    chat[chat.length-1]['name'] = name2;
                                    chat[chat.length-1]['is_user'] = false;
                                    chat[chat.length-1]['is_name'] = this_mes_is_name;
                                    chat[chat.length-1]['send_date'] = Date.now();
                                    getMessage = $.trim(getMessage);
                                    chat[chat.length-1]['mes'] = getMessage;
                                    addOneMessage(chat[chat.length-1]);
                                    is_send_press = false;
                                }
                                $( "#send_button" ).css("display", "block");
                                $( "#loading_mes" ).css("display", "none");
                                saveChat();
                                
                            }else{
                                //console.log('run force_name2 protocol');
                                if(free_char_name_mode && main_api !== 'openai')
                                {
                                    Generate('force_name2');
                                }
                                else
                                {
                                    $( "#send_button" ).css("display", "block");
                                    $( "#loading_mes" ).css("display", "none");
                                    is_send_press = false;
                                    callPopup('The model returned empty message', 'alert');
                                }
                            }
                        }else{
                            is_send_press = false;
                            $( "#send_button" ).css("display", "block");
                            $( "#loading_mes" ).css("display", "none");
                        }
                    },
                    error: function (jqXHR, exception) {

                        $("#send_textarea").removeAttr('disabled');
                        is_send_press = false;
                        hordeCheck = false;
                        $( "#send_button" ).css("display", "block");
                        $( "#loading_mes" ).css("display", "none");

                        callPopup(exception, 'alert_error');

                        console.log(exception);
                        console.log(jqXHR);
                    }
                });
            }
        }else{
            if(Characters.selectedID == undefined){
                //send ch sel
                callPopup('Сharacter is not selected', 'alert');
            }
            is_send_press = false;
        }
    }

    async function saveChat() {
        chat.forEach(function(item, i) {
            if(item['is_user']){
                var str = item['mes'].replace(name1+':', default_user_name+':');
                chat[i]['mes'] = str;
                chat[i]['name'] = default_user_name;
            }else if(i !== chat.length-1){
                if(chat[i]['swipe_id'] !== undefined){
                    delete chat[i]['swipes'];
                    delete chat[i]['swipe_id'];
                }
            }
        });
        var save_chat = [{user_name:default_user_name, character_name:name2,create_date: chat_create_date, notes: winNotes.text, notes_type: winNotes.strategy}, ...chat];

        jQuery.ajax({    
            type: 'POST', 
            url: '/savechat', 
            data: JSON.stringify({ch_name: Characters.id[Characters.selectedID].name, file_name: Characters.id[Characters.selectedID].chat, chat: save_chat, card_filename: Characters.id[Characters.selectedID].filename}),
            beforeSend: function(){
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            success: function(data){

            },
            error: function (jqXHR, exception) {

                console.log(exception);
                console.log(jqXHR);
            }
        });
    }
    async function getChat() {
        //console.log(characters[Characters.selectedID].chat);
        jQuery.ajax({    
            type: 'POST', 
            url: '/getchat', 
            data: JSON.stringify({ch_name: Characters.id[Characters.selectedID].name, file_name: Characters.id[Characters.selectedID].chat, card_filename: Characters.id[Characters.selectedID].filename}),
            beforeSend: function(){
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            success: function(data){
                //console.log(data);
                //chat.length = 0;
                if(data[0] !== undefined){
                    for (let key in data) {
                        chat.push(data[key]);
                    }
                    //chat =  data;
                    chat_create_date = chat[0]['create_date'];
                    winNotes.text = chat[0].notes || "";
                    winNotes.strategy = chat[0].notes_type || "discr";
                    if(!winNotes.text || !winNotes.text.length) {
                        let defaultWpp = '[Character("'+Characters.id[Characters.selectedID].name+'"){}]';
                        try {
                            let parsed = WPP.parse(Characters.id[Characters.selectedID].description);
                            if(parsed[0] && parsed[0].type && parsed[0].type.length && parsed[0].name && parsed[0].name.length) {
                                defaultWpp = '[' + parsed[0].type + '("' + parsed[0].name + '"){}]';
                            }
                        } catch(e) { /* ignore error */ }
                        winNotes.wppText = defaultWpp;
                    }
                    chat.shift();

                }else{
                    chat_create_date = Date.now();
                }
                //console.log(chat);
                getChatResult();
                saveChat();
            },
            error: function (jqXHR, exception) {
                getChatResult();
                console.log(exception);
                console.log(jqXHR);
            }
        });
    }

    function getChatResult(){
        name2 = Characters.id[Characters.selectedID].name;
        if(chat.length > 1){

            chat.forEach(function(item, i) {
                if(item['is_user']){
                    var str = item['mes'].replace(default_user_name+':', name1+':');
                    chat[i]['mes'] = str;
                    chat[i]['name'] = name1;
                }
            });


        }else{
            //console.log(characters[Characters.selectedID].first_mes);
            chat[0] = {};
            chat[0]['name'] = name2;
            chat[0]['is_user'] = false;
            chat[0]['is_name'] = true;
            chat[0]['send_date'] = Date.now();
            if(Characters.id[Characters.selectedID].first_mes != ""){
                chat[0]['mes'] = Characters.id[Characters.selectedID].first_mes;
            }else{
                chat[0]['mes'] = default_ch_mes;
            }
        }
        printMessages();
        select_selected_character(Characters.selectedID);
    }
    $("#send_textarea").keypress(function (e) {
        if(e.which === 13 && !e.shiftKey && is_send_press == false) {
            hideSwipeButtons();
            is_send_press = true;
            e.preventDefault();
            Generate();
            //$(this).closest("form").submit();
        }
    });

    //menu buttons
    
    $( "#rm_button_characters" ).children("h2").removeClass('deselected_button_style');
    $( "#rm_button_characters" ).children("h2").addClass('seleced_button_style');
    $( "#rm_button_settings" ).click(function() {
        selected_button = 'settings';
        menu_type = 'settings';
        $( "#rm_charaters_block" ).css("display", "none");
        $( "#rm_api_block" ).css("display", "block");

        $('#rm_api_block').css('opacity',0.0);
        $('#rm_api_block').transition({  
                opacity: 1.0,
                duration: animation_rm_duration,
                easing: animation_rm_easing,
                complete: function() {  }
        });

        $( "#rm_ch_create_block" ).css("display", "none");
        $( "#rm_info_block" ).css("display", "none");
        
        $( "#rm_button_characters" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_characters" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_settings" ).children("h2").removeClass('deselected_button_style');
        $( "#rm_button_settings" ).children("h2").addClass('seleced_button_style');
        
        $( "#rm_button_selected_ch" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_selected_ch" ).children("h2").addClass('deselected_button_style');
    });
    $( "#rm_button_characters" ).click(function() {
        selected_button = 'characters';
        select_rm_characters();
    });
    $( "#rm_button_back" ).click(function() {
        selected_button = 'characters';
        select_rm_characters();
    });
    $( "#rm_button_create" ).click(function() {
        selected_button = 'create';
        select_rm_create();
    });
    $( "#rm_button_selected_ch" ).click(function() {
        selected_button = 'character_edit';
        select_selected_character(Characters.selectedID);
    });
    function select_rm_create(){
        menu_type = 'create';
        if(selected_button == 'create'){
            if(create_save_avatar != ''){
                $("#add_avatar_button").get(0).files = create_save_avatar;
                read_avatar_load($("#add_avatar_button").get(0));
            }

        }
        $( "#rm_charaters_block" ).css("display", "none");
        $( "#rm_api_block" ).css("display", "none");
        $( "#rm_ch_create_block" ).css("display", "block");

        $('#rm_ch_create_block').css('opacity',0.0);
        $('#rm_ch_create_block').transition({  
                opacity: 1.0,
                duration: animation_rm_duration,
                easing: animation_rm_easing,
                complete: function() {  }
        });
        $( "#rm_info_block" ).css("display", "none");

        $( "#delete_button_div" ).css("display", "none");
        $("#create_button").css("display", "block");
        $("#create_button").attr("value", "Create");
        $('#result_info').html('&nbsp;');
        
        $( "#rm_button_characters" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_characters" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_settings" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_settings" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_selected_ch" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_selected_ch" ).children("h2").addClass('deselected_button_style');

        // Reset W++ editor
        document.getElementById("description_wpp_checkbox").checked = false;
        document.getElementById("description_textarea").style.display = null;
        document.getElementById("description_wppeditor").style.display = "none";
        editorDescriptionWPP.clear();
        editorDescriptionWPP.text = "";

        //create text poles
        $("#rm_button_back").css("display", "inline-block");
        $("#rm_button_import").css("display", "inline-block");
        $("#character_popup_text_h3").text('Create character');
        $("#character_name_pole").val(create_save_name);
        $("#description_textarea").val(create_save_description);
        $("#personality_textarea").val(create_save_personality);
        $("#firstmessage_textarea").val(create_save_first_message);
        $("#scenario_pole").val(create_save_scenario);
        if($.trim(create_save_mes_example).length == 0){
            $("#mes_example_textarea").val('<START>');
        }else{
            $("#mes_example_textarea").val(create_save_mes_example);
        }
        $("#avatar_div").css("display", "block");
        $("#avatar_load_preview").attr('src',default_avatar);
        $("#name_div").css("display", "block");

        $("#form_create").attr("actiontype", "createcharacter");
    }
    function select_rm_characters(){

        menu_type = 'characters';
        $( "#rm_charaters_block" ).css("display", "block");
        $('#rm_charaters_block').css('opacity',0.0);
        $('#rm_charaters_block').transition({  
                opacity: 1.0,
                duration: animation_rm_duration,
                easing: animation_rm_easing,
                complete: function() {  }
        });

        $( "#rm_api_block" ).css("display", "none");
        $( "#rm_ch_create_block" ).css("display", "none");
        $( "#rm_info_block" ).css("display", "none");
        
        $( "#rm_button_characters" ).children("h2").removeClass('deselected_button_style');
        $( "#rm_button_characters" ).children("h2").addClass('seleced_button_style');
        
        $( "#rm_button_settings" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_settings" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_selected_ch" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_selected_ch" ).children("h2").addClass('deselected_button_style');
        
    }
    function select_rm_info(text){
        $( "#rm_charaters_block" ).css("display", "none");
        $( "#rm_api_block" ).css("display", "none");
        $( "#rm_ch_create_block" ).css("display", "none");
        $( "#rm_info_block" ).css("display", "flex");

        $("#rm_info_text").html('<h3>'+text+'</h3>');

        $( "#rm_button_characters" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_characters" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_settings" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_settings" ).children("h2").addClass('deselected_button_style');
        
        $( "#rm_button_selected_ch" ).children("h2").removeClass('seleced_button_style');
        $( "#rm_button_selected_ch" ).children("h2").addClass('deselected_button_style');
        
        
    }

    function getTokenCount(text = "") {
        return encode(JSON.stringify(text)).length;
    }

    function select_selected_character(chid){ //character select

        select_rm_create();
        menu_type = 'character_edit';
        
        
        
        $( "#delete_button_div" ).css("display", "block");
        $( "#rm_button_selected_ch" ).children("h2").removeClass('deselected_button_style');
        $( "#rm_button_selected_ch" ).children("h2").addClass('seleced_button_style');
        var display_name = Characters.id[chid].name;
        $( "#rm_button_selected_ch" ).css('display', 'inline-block');
        $( "#rm_button_selected_ch" ).children("h2").text(display_name);

        //create text poles
        $("#rm_button_back").css("display", "none");
        //$("#rm_button_import").css("display", "none");
        $("#create_button").attr("value", "Save");
        $("#create_button").css("display", "none");
        var i = 0;

        while(parseInt($( "#rm_button_selected_ch" ).css('width').replace('px', '')) > 170 && i < 100){
            
            display_name = display_name.slice(0,display_name.length-2);
            $( "#rm_button_selected_ch" ).children("h2").text($.trim(display_name)+'...');
            i++;
        }

        $("#add_avatar_button").val('');

        $('#character_popup_text_h3').text(Characters.id[chid].name);
        $("#character_name_pole").val(Characters.id[chid].name);
        $("#description_textarea").val(Characters.id[chid].description);
        $("#personality_textarea").val(Characters.id[chid].personality);
        $("#firstmessage_textarea").val(Characters.id[chid].first_mes);
        $("#scenario_pole").val(Characters.id[chid].scenario);
        $("#mes_example_textarea").val(Characters.id[chid].mes_example);
        $("#selected_chat_pole").val(Characters.id[chid].chat);
        $("#create_date_pole").val(Characters.id[chid].create_date_local);
        $("#chat_import_avatar_url").val(Characters.id[chid].filename);
        $("#chat_import_character_name").val(Characters.id[chid].name);
        
        $("#character_file_div").text(Characters.id[chid].filename);

        editorDescriptionWPP.clear();
        editorDescriptionWPP.text = Characters.id[chid].description;

        //$("#avatar_div").css("display", "none");
        var this_avatar = default_avatar;
        if(Characters.id[chid].filename != 'none'){
                this_avatar = "characters/"+Characters.id[chid].filename;
        }
        $("#avatar_load_preview").attr('src',this_avatar+"?v="+Date.now());
        $("#name_div").css("display", "none");

        $("#form_create").attr("actiontype", "editcharacter");
    }
    $(document).on('click', '#rm_print_charaters_block .character_select', function(){
        if (Characters.id[$(this).attr("chid")].online === true) {
            if (Characters.id[$(this).attr("chid")].user_name === login) {
                $('#character_online_editor').val('🢤 Online Editor');
            } else {
                $('#character_online_editor').val('🢤 Online Editor');
            }
            $('#chat_header_char_info').html(`designed by <a user_name="${Characters.id[$(this).attr("chid")].user_name}" class="chat_header_char_info_user_name">${vl(Characters.id[$(this).attr("chid")].user_name_view)}</a>`);
        } else {
            $('#character_online_editor').val('🢤 Publish Card');
            $('#chat_header_char_info').text('designed by User');
        }
        $('#chat_header_char_name').text(Characters.id[$(this).attr("chid")]['name']);
        if(Characters.selectedID !== $(this).attr("chid")){
            if(!is_send_press){
               
                this_edit_mes_id = undefined;
                selected_button = 'character_edit';
                Characters.selectedID = $(this).attr("chid");
                
                

                $('#chat_header_back_button').css('display', 'block');
                clearChat();
                chat.length = 0;
                getChat();

            }
        }else{
            selected_button = 'character_edit';
            select_selected_character(Characters.selectedID);
        }
        $('#bg_chara_cloud').transition({  
            opacity: 0.0,
            duration: 1200,
            easing: "",
            complete: function() {  }
        });
        if($('#characloud_character_page').css('display') === 'none' && $('#characloud_user_profile_block').css('display') === 'none'){
            $('#shell').css('display', 'grid');
            $('#chara_cloud').css('display', 'none');
        }

    });
    $('#shell').on('click', '.chat_header_char_info_user_name', function(){
        showCharaCloud();
        showUserProfile($(this).attr("user_name"));
    });
    var scroll_holder = 0;
    var is_use_scroll_holder = false;
    $(document).on('input', '.edit_textarea', function(){ 
        scroll_holder = $("#chat").scrollTop();
        $(this).height(0).height(this.scrollHeight);
        is_use_scroll_holder = true;
    });
    $("#chat").on("scroll", function() {
        if(is_use_scroll_holder){
            $("#chat").scrollTop(scroll_holder);
            is_use_scroll_holder = false;
        }

    });
    $(document).on('click', '.del_checkbox', function(){
        $('.del_checkbox').each(function(){
            $(this).prop( "checked", false );
            $(this).parent().css('background', css_mes_bg);
        });
        $(this).parent().css('background', "#791b31");
        var i = $(this).parent().attr('mesid');
        this_del_mes = i;
        while(i < chat.length){
            $(".mes[mesid='"+i+"']").css('background', "#791b31");
            $(".mes[mesid='"+i+"']").children('.del_checkbox').prop( "checked", true );
            i++;
            //console.log(i);
        }

    });
    $(document).on('click', '#user_avatar_block .avatar', function(){
        user_avatar = $(this).attr("imgfile");
        $('.mes').each(function(){
            if($(this).attr('ch_name') == name1){
                $(this).children('.avatar').children('img').attr('src', 'User Avatars/'+user_avatar);
            }
        });
        saveSettings();

    });
    $('#logo_block').click(function(event) {  
        if(!bg_menu_toggle){
            if(is_mobile_user){
                $('#chara_cloud').transition({  
                    marginLeft: "10px",
                    duration: 300,
                    easing: "",
                    complete: function() {  }
                });
            }else{
                $('#chara_cloud').transition({  
                    marginLeft: "170px",
                    duration: 300,
                    easing: "",
                    complete: function() {  }
                });
            }
            designs.forEach(function(item, i){
                $('#style_button'+i).css('opacity', 0.0);
                $('#style_button'+i).transition({ y: '-10px', opacity: 0.0, duration: 0});
                setTimeout(() => {
                    $('#style_button'+i).transition({ y: '0px',opacity: 1.0, duration: 200});
                    }, (designs.length - i)*100);
            });
            $('#bg_menu_button').transition({ perspective: '100px',rotate3d: '1,1,0,180deg'});
            //$('#bg_menu_content1').css('display', 'block');
            //$('#bg_menu_content1').css('opticary', 0);marginTop: '10px'
            $('#bg_menu_content').transition({
                opacity: 1.0, height: '90vh',
                duration: 340,
                easing: 'in',
                complete: function() { bg_menu_toggle = true; $('#bg_menu_content').css("overflow-y", "auto");}
              });
        }else{
            if(is_mobile_user){
                $('#chara_cloud').transition({  
                    marginLeft: "10px",
                    duration: 300,
                    easing: "",
                    complete: function() {  }
                });
            }else{
                $('#chara_cloud').transition({  
                    marginLeft: "130px",
                    duration: 300,
                    easing: "",
                    complete: function() {  }
                });
            }
            designs.forEach(function(item, i){
                setTimeout(() => {
                    $('#style_button'+i).transition({ y: '-15px',opacity: 0.0, duration: 100});
                    }, i*20);
            });
            $('#bg_menu_button').transition({ perspective: '100px',rotate3d: '1,1,0,360deg'});
            $('#bg_menu_content').css("overflow-y", "hidden");
            $('#bg_menu_content').transition({

                opacity: 0.0, height: '0px',
                duration: 340,
                easing: 'in',
                complete: function() { bg_menu_toggle = false; }
              });
        }
    });
    $(document).on('click', '.bg_example_img', function(){
        var this_bgfile = $(this).attr("bgfile");

        if(bg1_toggle == true){
            bg1_toggle = false;
            number_bg = 2;
            var target_opacity = 1.0;
        }else{
            bg1_toggle = true;
            number_bg = 1;
            var target_opacity = 0.0;
        }
        $('#bg2').stop();
        $('#bg2').transition({  
                opacity: target_opacity,
                duration: 1300,//animation_rm_duration,
                easing: "linear",
                complete: function() {
                    $("#options").css('display', 'none');
                }
        });
        

        let this_bg_style = $('body').css('background-image');
        if (this_bg_style.includes('url(')) {
            this_bg_style = this_bg_style.replace(/url\(['"]?([^'"]*)['"]?\)/i, 'url("../backgrounds/' + this_bgfile + '")');
            $('#bg'+number_bg).css('background-image', this_bg_style);
            setBackground(this_bg_style);
        }
        

    });
    $(document).on('click', '.bg_example_cross', function(){
        bg_file_for_del = $(this);
        //$(this).parent().remove();
        //delBackground(this_bgfile);
        callPopup('<h3>Delete the background?</h3>', 'del_bg');

    });
    $(document).on('click', '.style_button', function() {
        const this_style_id = $(this).attr('style_id');
        const this_style_name = designs[this_style_id];
        //
        //console.log('old '+$('#chat')[0].scrollHeight); //$textchat.scrollTop($textchat[0].scrollHeight
        let oldScrollTop = $('#chat').scrollTop();
        let oldHeight = $('#chat')[0].scrollHeight - $('#chat').height();
        
        let oldProportion = oldScrollTop/oldHeight;
        $('#base_theme').attr('href', 'designs/classic.css');
        $('#send_textarea').attr('style', '');
        if (this_style_name === 'classic.css') {
            // Remove the existing theme link element if it exists
            $('#theme').remove();
        } else {
            // Create or update the theme link element with the new style
            let cssLink = $('#theme');
            if (!cssLink.length) {
                cssLink = $('<link id="theme" rel="stylesheet" type="text/css">');
                $("head").append(cssLink);
            }
            cssLink.attr('href', 'designs/' + this_style_name);
        }
        
        let newHeight = $('#chat')[0].scrollHeight - $('#chat').height();
        $('#chat').scrollTop(oldProportion*newHeight);

        const request = {style: this_style_name};
        jQuery.ajax({    
            method: 'POST', 
            url: '/savestyle',
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(request), 
            success: function(response){
                setTimeout(() => {
                    let this_bg_style = $('body').css('background-image');
                    if (this_bg_style.includes('url(')) {
                        $('#bg1').css('display', 'block');
                        $('#bg2').css('display', 'block');
                        this_bg_style = this_bg_style.replace(/url\(['"]?([^'"]*)['"]?\)/i, 'url("../backgrounds/tavern.png")');
                        $('#bg').css('background-image', this_bg_style);
                    }else{
                        this_bg_style = 'none';
                        $('#bg1').css('display', 'none');
                        $('#bg2').css('display', 'none');
                    }
                    setBackground(this_bg_style);
                },200);
            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);
            }
        });  
    });

    $( "#character_advanced_button" ).click(function() {
        
        if(!is_advanced_char_open){
            is_advanced_char_open = true;
            if(is_master_settings_open){
                $("#master_settings_cross").click();
                $('#character_popup').css('opacity', 1.0);
                $('#character_popup').css('display', 'grid');
            }else{
                $('#character_popup').css('display', 'grid');
                $('#character_popup').css('opacity', 0.0);
                $('#character_popup').transition({ opacity: 1.0 ,duration: animation_rm_duration, easing:animation_rm_easing});
            }
        }else{
            $("#character_cross").click();
        }
    });
    $( "#master_settings_button" ).click(function() {
        if(!is_master_settings_open){
            is_master_settings_open = true;
            if(is_advanced_char_open){
                $("#character_cross").click();
                $('#master_settings_popup').css('opacity', 1.0);
                $('#master_settings_popup').css('display', 'grid');
            }else{
                $('#master_settings_popup').css('display', 'grid');
                $('#master_settings_popup').css('opacity', 0.0);
                $('#master_settings_popup').transition({ opacity: 1.0 ,duration: animation_rm_duration, easing:animation_rm_easing});
            }
        }else{
            $("#master_settings_cross").click();
        }
    });
    $("#character_cross").click(function() {
        is_advanced_char_open = false;
        if(!is_master_settings_open){
            $('#character_popup').transition({ opacity: 0.0 ,duration: animation_rm_duration, easing:animation_rm_easing, complete: function(){
                $('#character_popup').css('display', 'none');
            }});
        }else{
            $('#character_popup').css('display', 'none');
        }
    });
    $("#character_popup_ok").click(function() {
        $("#character_cross").click();
    });
    
    $("#master_settings_cross").click(function() {
        is_master_settings_open = false;
        if(!is_advanced_char_open){
            $('#master_settings_popup').transition({ opacity: 0.0 ,duration: animation_rm_duration, easing:animation_rm_easing, complete: function(){
                    $('#master_settings_popup').css('display', 'none');
            }});
        }else{
            $('#master_settings_popup').css('display', 'none');
        }
    });
    $("#dialogue_popup_ok").click(function(){
        $("#shadow_popup").css('display', 'none');
        $("#shadow_popup").css('opacity:', 0.0);
        if(popup_type == 'del_bg'){
            delBackground(bg_file_for_del.attr("bgfile"));
            bg_file_for_del.parent().remove();
            return;
        }
        if(popup_type == 'del_ch'){
            let filename = Characters.id[Characters.selectedID].filename;
            jQuery.ajax({    
                method: 'POST', 
                url: '/deletecharacter',
                beforeSend: function(){
                    select_rm_info("Character deleted");

                    //$('#create_button').attr('value','Deleting...'); 
                },
                data: JSON.stringify({
                            filename: filename
                        }),
                cache: false,
                dataType: "json",
                contentType: "application/json",
                processData: false, 
                timeout: requestTimeout,
                success: function(html){
                    Characters.id[Characters.selectedID] = {};
                    $(`#rm_print_charaters_block .character_select[chid="${Characters.selectedID}"]`).remove();
                    Characters.selectedID = undefined;
                    $('#rm_button_selected_ch').css('display', 'none');
                    $('#rm_button_characters').click();
                    clearChat();
                    chat.length = 0;
                    printMessages();
                    //getCharacters();
                    //$('#create_button_div').html(html);  
                }  
            }); 
            return;
        }
        if(popup_type == 'del_ch_characloud'){
            charaCloud.deleteCharacter(charaCloud.delete_character_user_name, charaCloud.delete_character_public_id_short)
            .then(function (data) {
                $(`div.characloud_character_block[public_id_short="${charaCloud.delete_character_public_id_short}"]`).remove();
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
            return;
        }
        if(popup_type == 'del_ch_characloud_from_edit_moderation'){
            charaCloud.deleteCharacter(charaCloud.delete_character_user_name, charaCloud.delete_character_public_id_short, 'moderation_edit')
            .then(function (data) {
                $(`div.characloud_character_block[public_id_short="${charaCloud.delete_character_public_id_short}"]`).remove();
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
            return;
        }
        if(popup_type === 'delete_user_avatar'){
            jQuery.ajax({    
                type: 'POST', // 
                url: `deleteuseravatar`, // 
                data: JSON.stringify({
                    filename: delete_user_avatar_filename
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
                    getUserAvatars();
                },
                error: function (jqXHR, exception) {
                    let error = handleError(jqXHR);
                    callPopup(error.msg, 'alert_error');
                },
                complete: function (data) {
                    //$('.load_icon').children('.load_icon').css('display', 'inline-block');
                    //$('.publish_button').children('.submit_button').css('display', 'none');
                }
            });
        }
        if(popup_type == 'new_chat' && Characters.selectedID != undefined && menu_type != "create"){//Fix it; New chat doesn't create while open create character menu
            clearChat();
            chat.length = 0;
            Characters.id[Characters.selectedID].chat = Date.now();
            $("#selected_chat_pole").val(Characters.id[Characters.selectedID].chat);
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
            getChat();
            return;
        }
        if(popup_type === 'logout'){
            charaCloud.logout()
            .then(function (data) {
                login = undefined;
                ALPHA_KEY = undefined;
                deleteCookie('login_view');
                deleteCookie('login');
                deleteCookie('ALPHA_KEY');
                $('.characloud_content').css('display', 'none');
                $('#characloud_user_profile_block').css('display', 'none');
                $('#characloud_characters').css('display', 'block');
                $('#characloud_board').css('display', 'block');
                $('#profile_button_is_not_login').css('display', 'block');
                $('#profile_button_is_login').css('display', 'none');
                is_login = false;
                return;
            })
            .catch(function (error) {
                callPopup(`Logout error`, 'alert_error');
                return;
            });
        }
    });
    $("#dialogue_popup_cancel").click(function(){
        $("#shadow_popup").css('display', 'none');
        $("#shadow_popup").css('opacity:', 0.0);
        popup_type = '';
    });
    function callPopup(text = '', type){
        
        popup_type = type;
        $("#dialogue_popup_cancel").css("display", "inline-block");
        switch(popup_type){
            case 'logout':
                $("#dialogue_popup_ok").css("background-color", "#191b31CC");
                $("#dialogue_popup_ok").text("Yes");
                $("#dialogue_popup_text").html('<h3>Log out of account?</h3>');
                break;
            case 'alert':

                $("#dialogue_popup_ok").css("background-color", "#191b31CC");
                $("#dialogue_popup_ok").text("Ok");
                $("#dialogue_popup_cancel").css("display", "none");
                text = `<h3 class="alert">${text}</h3>`;
                break;
            case 'alert_error':
                text = `<p>${text}</p>`;
                $("#dialogue_popup_ok").css("background-color", "#191b31CC");
                $("#dialogue_popup_ok").text("Ok");
                $("#dialogue_popup_cancel").css("display", "none");
                text = '<h3 class="error">Error</h3>'+text+'';
                break;
            case 'new_chat':

                $("#dialogue_popup_ok").css("background-color", "#191b31CC");
                $("#dialogue_popup_ok").text("Yes");
                break;
            default:
                $("#dialogue_popup_ok").css("background-color", "#791b31");
                $("#dialogue_popup_ok").text("Delete");

        }
        if(text !== ''){
            $("#dialogue_popup_text").html(text);
        }
        $("#shadow_popup").css('display', 'block');
        $('#shadow_popup').transition({ opacity: 1.0 ,duration: animation_rm_duration, easing:animation_rm_easing});
    }

    function read_bg_load(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#bg_load_preview')
                    .attr('src', e.target.result)
                    .width(103)
                    .height(83);  

                var formData = new FormData($("#form_bg_download").get(0));

                //console.log(formData);
                jQuery.ajax({    
                    type: 'POST', 
                    url: '/downloadbackground', 
                    data: formData,
                    beforeSend: function(){
                        //$('#create_button').attr('value','Creating...'); 
                    },
                    cache: false,
                    timeout: requestTimeout,
                    contentType: false,
                    processData: false, 
                    success: function(html){
                        
                        let this_bg_style = $('body').css('background-image');
                        if (this_bg_style.includes('url(')) {
                            this_bg_style = this_bg_style.replace(/url\(['"]?([^'"]*)['"]?\)/i, 'url("../backgrounds/' + html + '")');
                            $('#bg'+number_bg).css('background-image', this_bg_style);
                            setBackground(this_bg_style);
                        }
                        if(bg1_toggle == true){
                            bg1_toggle = false;
                            number_bg = 2;
                            var target_opacity = 1.0;
                        }else{
                            bg1_toggle = true;
                            number_bg = 1;
                            var target_opacity = 0.0;
                        }
                        $('#bg2').transition({  
                                opacity: target_opacity,
                                duration: 1300,//animation_rm_duration,
                                easing: "linear",
                                complete: function() {
                                    $("#options").css('display', 'none');
                                }
                        });
                        this_bg_style = $('body').css('background-image');
                        if (this_bg_style.includes('url(')) {
                            $('#bg'+number_bg).css('background-image', this_bg_style.replace(/url\(['"]?([^'"]*)['"]?\)/i, 'url("'+e.target.result+'")'));
                        }
                        //$('#bg'+number_bg).css('background-image', 'linear-gradient(rgba(19,21,44,0.75), rgba(19,21,44,0.75)), url('+e.target.result+')');
                        $("#form_bg_download").after("<div class=bg_example><img bgfile='"+html+"' class=bg_example_img src='backgrounds/"+html+"'><img bgfile='"+html+"' class=bg_example_cross src=img/cross.png></div>");
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                        console.log(jqXHR);
                    }
                });

            };

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#add_bg_button").change(function(){
        read_bg_load(this);

    });
    function read_avatar_load(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            if(selected_button == 'create'){
                create_save_avatar = input.files;
            }
            reader.onload = function (e) {

                if(selected_button == 'character_edit'){

                    timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
                }
                $('#avatar_load_preview')
                    .attr('src', e.target.result);
                    //.width(103)
                    //.height(83);
            //console.log(e.target.result.name);   

            };

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#add_avatar_button").change(function(){
        is_mes_reload_avatar = Date.now();
        read_avatar_load(this);
    });
    $( "#form_create" ).submit(function(e) {
        $('#rm_info_avatar').html('');
        var formData = new FormData($("#form_create").get(0));
        if($("#form_create").attr("actiontype") == "createcharacter"){

            if($("#character_name_pole").val().length > 0){
                jQuery.ajax({    
                    type: 'POST', 
                    url: '/createcharacter', 
                    data: formData,
                    beforeSend: function(){
                        $('#create_button').attr('disabled',true);
                        $('#create_button').attr('value','Creating...'); 
                    },
                    cache: false,
                    timeout: requestTimeout,
                    contentType: false,
                    processData: false, 
                    success: function(data){
                        $('#character_cross').click();
                        $("#character_name_pole").val('');
                        create_save_name = '';
                        $("#description_textarea").val('');
                        create_save_description = '';
                        $("#personality_textarea").val('');
                        create_save_personality = '';
                        $("#firstmessage_textarea").val('');
                        create_save_first_message = '';

                        $("#character_popup_text_h3").text('Create character');

                        $("#scenario_pole").val('');
                        create_save_scenario = '';
                        $("#mes_example_textarea").val('');
                        create_save_mes_example = '';

                        create_save_avatar = '';

                        $('#create_button').removeAttr("disabled");
                        $("#add_avatar_button").replaceWith($("#add_avatar_button").val('').clone(true));
                        $('#create_button').attr('value','Create');

                        characterAddedSign(data.file_name, 'Character created');

                    },
                    error: function (jqXHR, exception) {
                        $('#create_button').removeAttr("disabled");
                    }
                });  
            }else{
                $('#result_info').html("Name not entered");
            }
        }else{
            //console.log($("#add_avatar_button").val());
            formData.append("filename", Characters.id[Characters.selectedID].filename);
            jQuery.ajax({    
                type: 'POST', 
                url: '/editcharacter', 
                data: formData,
                beforeSend: function(){
                    $('#create_button').attr('disabled',true);
                    $('#create_button').attr('value','Save'); 
                },
                cache: false,
                timeout: requestTimeout,
                contentType: false,
                processData: false, 
                success: function(html){

                    $('.mes').each(function(){
                        if($(this).attr('ch_name') != name1){
                            $(this).children('.avatar').children('img').attr('src', $('#avatar_load_preview').attr('src'));
                        }
                    });
                    if(chat.length === 1 ){

                        var this_ch_mes = default_ch_mes;
                        if($('#firstmessage_textarea').val() != ""){
                            this_ch_mes = $('#firstmessage_textarea').val();
                        }
                        if(this_ch_mes != $.trim($("#chat").children('.mes').children('.mes_block').children('.mes_text').text())){
                            clearChat();
                            chat.length = 0;
                            chat[0] = {};
                            chat[0]['name'] = name2;
                            chat[0]['is_user'] = false;
                            chat[0]['is_name'] = true;
                            chat[0]['mes'] = this_ch_mes;
                            add_mes_without_animation = true;
                            addOneMessage(chat[0]);
                        }
                    }
                    $('#create_button').removeAttr("disabled");
                    Characters.loadAll();


                    $("#add_avatar_button").replaceWith($("#add_avatar_button").val('').clone(true));
                    $('#create_button').attr('value','Save');

                    var count_tokens = getTokenCount(Characters.id[Characters.selectedID].description+Characters.id[Characters.selectedID].personality+Characters.id[Characters.selectedID].scenario+Characters.id[Characters.selectedID].mes_example);
                    const alert_context_size_gap = 400;
                    if((count_tokens < (max_context-alert_context_size_gap) && main_api === 'kobold') || (count_tokens < (2048-alert_context_size_gap) && main_api === 'novel') || (count_tokens < (max_context_openai-alert_context_size_gap) && main_api === 'openai')){
                        $('#result_info').html(count_tokens+" Tokens");
                    }else{
                        $('#result_info').html("<font color=red>"+count_tokens+" Tokens(TOO MANY TOKENS)</font>");
                    }

                    //$('#result_info').transition({ opacity: 0.0 ,delay: 500,duration: 1000,easing: 'in-out',complete: function() { 
                            //$('#result_info').transition({ opacity: 1.0,duration: 0}); 
                            //$('#result_info').html('&nbsp;');
                    //}});
                },
                error: function (jqXHR, exception) {
                    $('#create_button').removeAttr("disabled");
                    //$('#result_info').html("<font color=red>Error: no connection</font>");
                    callPopup(exception, 'alert_error');
                }
            }); 
        }

    });

    $( "#delete_button" ).click(function() {
        callPopup('<h3>Delete the character?</h3>', 'del_ch');
    });
    $( "#rm_info_button" ).click(function() {
        $('#rm_info_avatar').html('');
        select_rm_characters();
    });
    //@@@@@@@@@@@@@@@@@@@@@@@@
    //character text poles creating and editing save
    $('#character_name_pole').on('change keyup paste', function(){
        if(menu_type == 'create'){
            create_save_name = $('#character_name_pole').val();
        }

    });
    $('#description_textarea').on('keyup paste cut', function(){
        if(menu_type === 'create'){
            create_save_description = $('#description_textarea').val();
        }else{
            editorDescriptionWPP.text = $('#description_textarea').val();
            if(timerSaveEdit) { clearTimeout(timerSaveEdit) };
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    });
    $('#notes_textarea').on('keyup paste cut', function(){
        
    });
    $('#personality_textarea').on('keyup paste cut', function(){
        if(menu_type == 'create'){

            create_save_personality = $('#personality_textarea').val();
        }else{
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    });
    $('#scenario_pole').on('keyup paste cut', function(){
        if(menu_type == 'create'){

            create_save_scenario = $('#scenario_pole').val();
        }else{
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    });
    $('#mes_example_textarea').on('keyup paste cut', function(){
        if(menu_type == 'create'){

            create_save_mes_example = $('#mes_example_textarea').val();
        }else{
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    });
    $('#firstmessage_textarea').on('keyup paste cut', function(){

        if(menu_type == 'create'){
            create_save_first_message = $('#firstmessage_textarea').val();
        }else{
            timerSaveEdit = setTimeout(() => {$("#create_button").click();},durationSaveEdit);
        }
    });
    $( "#api_button" ).click(function() {
        if($('#api_url_text').val() != ''){
            $("#api_loading").css("display", 'inline-block');
            $("#api_button").css("display", 'none');
            api_server = $('#api_url_text').val();
            api_server = $.trim(api_server);
            //console.log("1: "+api_server);
            if(api_server.substr(api_server.length-1,1) == "/"){
                api_server = api_server.substr(0,api_server.length-1);
            }
            if(!(api_server.substr(api_server.length-3,3) == "api" || api_server.substr(api_server.length-4,4) == "api/")){
                api_server = api_server+"/api";
            }
            //console.log("2: "+api_server);
            saveSettings();
            is_get_status = true;
            is_api_button_press = true;
            getStatus();
        }
    });

    // HORDE
    $( "#api_button_horde" ).click(function() {
        if($('#horde_api_key').val() != ''){
            horde_api_key == "0000000000";
        }
        $("#api_loading_horde").css("display", 'inline-block');
        $("#api_button_horde").css("display", 'none');
        is_get_status = true;
        is_api_button_press = true;
        getStatusHorde();
    });

    $( "body" ).click(function() {
        if($("#options").css('opacity') == 1.0){
            $('#options').transition({  
                opacity: 0.0,
                duration: 100,//animation_rm_duration,
                easing: animation_rm_easing,
                complete: function() {
                    $("#options").css('display', 'none');
                }
            });
        }
    });
    $( "#options_button" ).click(function() {
        if($("#options").css('display') === 'none' && $("#options").css('opacity') == 0.0){
            $("#options").css('display', 'block');
            $('#options').transition({  
                opacity: 1.0,
                duration: 100,
                easing: animation_rm_easing,
                complete: function() {

                }
            });
        }
    });
    $( "#option_select_chat" ).click(function() {
        if(Characters.selectedID != undefined && !is_send_press){
            getAllCharaChats();
            $('#shadow_select_chat_popup').css('display', 'block');
            $('#shadow_select_chat_popup').css('opacity', 0.0);
            $('#shadow_select_chat_popup').transition({ opacity: 1.0 ,duration: animation_rm_duration, easing:animation_rm_easing});
        }
    });
    $( "#option_start_new_chat" ).click(function() {
        if(Characters.selectedID != undefined && !is_send_press){
            callPopup('<h3>Start new chat?</h3>', 'new_chat');
        }
    });
    $( "#option_regenerate" ).click(function() {
        if(is_send_press == false && count_view_mes > 1){
            hideSwipeButtons();
            is_send_press = true;
            if(this_edit_mes_id === chat.length-1) {
                this_edit_target_id = undefined;
                this_edit_mes_id = undefined;
            }
            Generate('regenerate');
        }
    });
    
    $( "#option_delete_mes" ).click(function() {
        
        if(Characters.selectedID != undefined){
            hideSwipeButtons();
            $('#dialogue_del_mes').css('display','block');
            $('#send_form').css('display','none');
            $('.del_checkbox').each(function(){
                if($(this).parent().attr('mesid') != 0){
                    $(this).css("display", "block");
                    $(this).parent().children('.for_checkbox').css('display', 'none');
                }
            });
        }
    });
    $( "#dialogue_del_mes_cancel" ).click(function() {
        showSwipeButtons();
        $('#dialogue_del_mes').css('display','none');
        $('#send_form').css('display',css_send_form_display);
        $('.del_checkbox').each(function(){
            $(this).css("display", "none");
            $(this).parent().children('.for_checkbox').css('display', 'block');
            $(this).parent().css('background', css_mes_bg);
            $(this).prop( "checked", false );

        });
        this_del_mes = 0;

    });
    $( "#dialogue_del_mes_ok" ).click(function() {
        $('#dialogue_del_mes').css('display','none');
        $('#send_form').css('display',css_send_form_display);
        $('.del_checkbox').each(function(){
            $(this).css("display", "none");
            $(this).parent().children('.for_checkbox').css('display', 'block');
            $(this).parent().css('background', css_mes_bg);
            $(this).prop( "checked", false );


        });
        if(this_del_mes != 0){
            $(".mes[mesid='"+this_del_mes+"']").nextAll('div').remove();
            $(".mes[mesid='"+this_del_mes+"']").remove();
            chat.length = this_del_mes;
            count_view_mes = this_del_mes;
            saveChat();
            var $textchat = $('#chat');
            $textchat.scrollTop($textchat[0].scrollHeight);
        }
        showSwipeButtons();
        this_del_mes = 0;


    });
    function showSwipeButtons(){
        if(swipes){
            if(!chat[chat.length-1]['is_user'] && count_view_mes > 1){
                $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_right').css('display', 'block');
                if(chat[chat.length-1]['swipe_id'] !== undefined){
                    if(chat[chat.length-1]['swipe_id'] != 0){
                        $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_left').css('display', 'block');
                    }
                }
            }
        }
    }
    function hideSwipeButtons(){
        $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_right').css('display', 'none');
        $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.swipe_left').css('display', 'none');
    }
    $( "#settings_perset" ).change(function() {

        if($('#settings_perset').find(":selected").val() != 'gui'){
            preset_settings = $('#settings_perset').find(":selected").text();
            temp = koboldai_settings[koboldai_setting_names[preset_settings]].temp;
            
            top_p = koboldai_settings[koboldai_setting_names[preset_settings]].top_p;
            top_k = koboldai_settings[koboldai_setting_names[preset_settings]].top_k;
            top_a = koboldai_settings[koboldai_setting_names[preset_settings]].top_a;
            typical = koboldai_settings[koboldai_setting_names[preset_settings]].typical;
            tfs = koboldai_settings[koboldai_setting_names[preset_settings]].tfs;
            
            
            amount_gen = koboldai_settings[koboldai_setting_names[preset_settings]].genamt;
            rep_pen = koboldai_settings[koboldai_setting_names[preset_settings]].rep_pen;
            rep_pen_size = koboldai_settings[koboldai_setting_names[preset_settings]].rep_pen_range;
            rep_pen_slope = koboldai_settings[koboldai_setting_names[preset_settings]].rep_pen_slope;
            if(!lock_context_size){
                max_context = koboldai_settings[koboldai_setting_names[preset_settings]].max_length;
            }
            $('#temp').val(temp);
            $('#temp_counter').html(temp);

            $('#amount_gen').val(amount_gen);
            $('#amount_gen_counter').html(amount_gen);

            $('#max_context').val(max_context);
            $('#max_context_counter').html(max_context+" Tokens");
            
            $('#top_p').val(top_p);
            $('#top_p_counter').html(top_p);
            
            $('#top_k').val(top_k);
            $('#top_k_counter').html(top_k);
            
            $('#top_a').val(top_a);
            $('#top_a_counter').html(top_a);
            
            $('#typical').val(typical);
            $('#typical_counter').html(typical);
            
            $('#tfs').val(tfs);
            $('#tfs_counter').html(tfs);
            
            
            $('#rep_pen').val(rep_pen);
            $('#rep_pen_counter').html(rep_pen);

            $('#rep_pen_size').val(rep_pen_size);
            $('#rep_pen_size_counter').html(rep_pen_size+" Tokens");

            $('#rep_pen_slope').val(rep_pen_slope);
            $('#rep_pen_slope_counter').html(rep_pen_slope);
            
            $("#range_block").children().prop("disabled", false);
            $("#range_block").css('opacity',1.0);
            $("#amount_gen_block").children().prop("disabled", false);
            $("#amount_gen_block").css('opacity',1.0);
            
            $("#top_p_block").children().prop("disabled", false);
            $("#top_p_block").css('opacity',1.00);

            $("#top_k_block").children().prop("disabled", false);
            $("#top_k_block").css('opacity',1.00);

            $("#top_a_block").children().prop("disabled", false);
            $("#top_a_block").css('opacity',1.00);

            $("#typical_block").children().prop("disabled", false);
            $("#typical_block").css('opacity',1.00);

            $("#tfs_block").children().prop("disabled", false);
            $("#tfs_block").css('opacity',1.00);

            $("#rep_pen_size_block").children().prop("disabled", false);
            $("#rep_pen_size_block").css('opacity',1.00);

            $("#rep_pen_slope_block").children().prop("disabled", false);
            $("#rep_pen_slope_block").css('opacity',1.00);

        }else{
            //$('.button').disableSelection();
            preset_settings = 'gui';
            $("#range_block").children().prop("disabled", true);
            $("#range_block").css('opacity',0.5);
            $("#top_p_block").children().prop("disabled", true);
            $("#top_p_block").css('opacity',0.45);

            $("#top_k_block").children().prop("disabled", true);
            $("#top_k_block").css('opacity',0.45);

            $("#top_a_block").children().prop("disabled", true);
            $("#top_a_block").css('opacity',0.45);

            $("#typical_block").children().prop("disabled", true);
            $("#typical_block").css('opacity',0.45);

            $("#tfs_block").children().prop("disabled", true);
            $("#tfs_block").css('opacity',0.45);

            $("#rep_pen_size_block").children().prop("disabled", true);
            $("#rep_pen_size_block").css('opacity',0.45);

            $("#rep_pen_slope_block").children().prop("disabled", true);
            $("#rep_pen_slope_block").css('opacity',0.45);
            $("#amount_gen_block").children().prop("disabled", true);
            $("#amount_gen_block").css('opacity',0.45);
        }
        saveSettings();
    });
    $( "#settings_perset_novel" ).change(function() {
        preset_settings_novel = $('#settings_perset_novel').find(":selected").text();
        temp_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].temperature;
        top_p_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].top_p;
        top_k_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].top_k;
        top_a_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].top_a;
        typical_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].typical_p;
        tfs_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].tail_free_sampling;
        amount_gen_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].max_length;
        rep_pen_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].repetition_penalty;
        rep_pen_size_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].repetition_penalty_range;
        rep_pen_slope_novel = novelai_settings[novelai_setting_names[preset_settings_novel]].repetition_penalty_slope;
        
        $('#temp_novel').val(temp_novel);
        $('#temp_counter_novel').html(temp_novel);

        $('#amount_gen_novel').val(amount_gen_novel);
        $('#amount_gen_counter_novel').html(amount_gen_novel);

        $('#top_p_novel').val(top_p_novel);
        $('#top_p_counter_novel').html(top_p_novel);

        $('#top_k_novel').val(top_k_novel);
        $('#top_k_counter_novel').html(top_k_novel);

        $('#top_a_novel').val(top_a_novel);
        $('#top_a_counter_novel').html(top_a_novel);

        $('#typical_novel').val(typical_novel);
        $('#typical_counter_novel').html(typical_novel);

        $('#tfs_novel').val(tfs_novel);
        $('#tfs_counter_novel').html(tfs_novel);


        $('#rep_pen_novel').val(rep_pen_novel);
        $('#rep_pen_counter_novel').html(rep_pen_novel);

        $('#rep_pen_size_novel').val(rep_pen_size_novel);
        $('#rep_pen_size_counter_novel').html(rep_pen_size_novel+" Tokens");

        $('#rep_pen_slope_novel').val(rep_pen_slope_novel);
        $('#rep_pen_slope_counter_novel').html(rep_pen_slope_novel);

        //$("#range_block").children().prop("disabled", false);
        //$("#range_block").css('opacity',1.0);
        saveSettings();
    });
    $( "#main_api" ).change(function() {
        is_pygmalion = false;
        is_get_status = false;
        is_get_status_novel = false;
        is_get_status_openai = false;
        online_status = 'no_connection';
        checkOnlineStatus();
        changeMainAPI();
        saveSettings();

        // HORDE
        horde_model = "";
        $('#horde_model_select').empty();
        $('#horde_model_select').append($('<option></option>').val('').html('-- Connect to Horde for models --'));
    });
    function changeMainAPI(){
        if($('#main_api').find(":selected").val() == 'kobold'){
            $('#kobold_api').css("display", "block");
            $('#novel_api').css("display", "none");
            $('#openai_api').css("display","none");
            $('#horde_api').css("display", "none");
            document.getElementById("hordeInfo").classList.add("hidden");
            
            if(!is_mobile_user){$('#master_settings_koboldai_block').css("display", "grid");}
            $('#master_settings_novelai_block').css("display", "none");
            $('#master_settings_openai_block').css("display", "none");
            $('#singleline_toggle').css("display", "grid");
            $('#multigen_toggle').css("display", "grid");

            main_api = 'kobold';
        }
        if($('#main_api').find(":selected").val() == 'novel'){
            $('#kobold_api').css("display", "none");
            $('#novel_api').css("display", "block");
            $('#openai_api').css("display","none");
            $('#horde_api').css("display", "none");
            $('#master_settings_koboldai_block').css("display", "none");
            if(!is_mobile_user){$('#master_settings_novelai_block').css("display", "grid");}
            $('#master_settings_openai_block').css("display", "none");
            $('#singleline_toggle').css("display", "none");
            $('#multigen_toggle').css("display", "grid");
            document.getElementById("hordeInfo").classList.add("hidden");

            main_api = 'novel';
        }
        if($('#main_api').find(":selected").val() == 'openai'){
            $('#kobold_api').css("display", "none");
            $('#novel_api').css("display", "none");
            $('#openai_api').css("display","block");
            $('#horde_api').css("display", "none");
            $('#master_settings_koboldai_block').css("display", "none");
            $('#master_settings_novelai_block').css("display", "none");
            if(!is_mobile_user){$('#master_settings_openai_block').css("display", "grid");}
            $('#singleline_toggle').css("display", "none");
            $('#multigen_toggle').css("display", "grid");
            document.getElementById("hordeInfo").classList.add("hidden");
            main_api = 'openai';
        }
        // HORDE
        if($('#main_api').find(":selected").val() == 'horde'){
            $('#kobold_api').css("display", "none");
            $('#novel_api').css("display", "none");
            $('#openai_api').css("display","none");
            $('#horde_api').css("display", "block");
            if(!is_mobile_user){$('#master_settings_koboldai_block').css("display", "grid");}
            $('#master_settings_novelai_block').css("display", "none");
            $('#master_settings_openai_block').css("display", "none");
            $('#singleline_toggle').css("display", "grid");
            $('#multigen_toggle').css("display", "none");
            document.getElementById("hordeInfo").classList.remove("hidden");
            main_api = 'horde';
        }
    }
    async function getUserAvatars(){
        const response = await fetch("/getuseravatars", {
            method: "POST",
            headers: {
                                        "Content-Type": "application/json",
                                        "X-CSRF-Token": token
                                },
            body: JSON.stringify({
                        "": ""
                    })

        });
        if (response.ok === true) {
            const getData = await response.json();
            //background = getData;
            //console.log(getData.length);
            $("#user_avatar_block").html('');
            for(var i = 0; i < getData.length; i++) {
                //console.log(1);
                $("#user_avatar_block").append('<div imgfile="'+getData[i]+'" class=avatar><img class="user_avatar_img" src="User Avatars/'+getData[i]+'"><img src="../img/cross.png" class="user_avatar_cross"></div>');
            }
            //var aa = JSON.parse(getData[0]);
            //const load_ch_coint = Object.getOwnPropertyNames(getData);


        }
    }

   
    $(document).on('input', '#temp', function() {
        temp = $(this).val();
        if(isInt(temp)){
            $('#temp_counter').html( $(this).val()+".00" );
        }else{
            $('#temp_counter').html( $(this).val() );
        }
        var tempTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#amount_gen', function() {
        amount_gen = $(this).val();
        $('#amount_gen_counter').html( $(this).val()+' Tokens' );
        var amountTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_p', function() {
        top_p = $(this).val();
        if(isInt(top_p)){
            $('#top_p_counter').html( $(this).val()+".00" );
        }else{
            $('#top_p_counter').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_k', function() {
        top_k = $(this).val();
        $('#top_k_counter').html( $(this).val() );
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_a', function() {
        top_a = $(this).val();
        if(isInt(top_a)){
            $('#top_a_counter').html( $(this).val()+".00" );
        }else{
            $('#top_a_counter').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#typical', function() {
        typical = $(this).val();
        if(isInt(typical)){
            $('#typical_counter').html( $(this).val()+".00" );
        }else{
            $('#typical_counter').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#tfs', function() {
        tfs = $(this).val();
        if(isInt(tfs)){
            $('#tfs_counter').html( $(this).val()+".00" );
        }else{
            $('#tfs_counter').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#rep_pen', function() {
        rep_pen = $(this).val();
        if(isInt(rep_pen)){
            $('#rep_pen_counter').html( $(this).val()+".00" );
        }else{
            $('#rep_pen_counter').html( $(this).val() );
        }
        var repPenTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#rep_pen_size', function() {
        rep_pen_size = $(this).val();
        $('#rep_pen_size_counter').html( $(this).val()+" Tokens");
        var repPenSizeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#rep_pen_slope', function() {
        rep_pen_slope = $(this).val();
        if(isInt(rep_pen_slope)){
            $('#rep_pen_slope_counter').html( $(this).val()+".00" );
        }else{
            $('#rep_pen_slope_counter').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#max_context', function() {
        max_context = parseInt($(this).val());
        $('#max_context_counter').html( $(this).val() +' Tokens');
        var max_contextTimer = setTimeout(saveSettings, 500);
    });
    $('#style_anchor').change(function() {
        style_anchor = !!$('#style_anchor').prop('checked');
        saveSettings();
    });
    $('#character_anchor').change(function() {
        character_anchor = !!$('#character_anchor').prop('checked');
        saveSettings();
    });
    $('#lock_context_size').change(function() {
        lock_context_size = !!$('#lock_context_size').prop('checked');
        saveSettings();
    });
    $('#multigen').change(function() {
        multigen = !!$('#multigen').prop('checked');
        saveSettings();
    });
    $('#singleline').change(function() {
        singleline = !!$('#singleline').prop('checked');
        saveSettings();
    });
    $('#notes_checkbox').change(function() {
        settings.notes = !!$('#notes_checkbox').prop('checked');
        $("#option_toggle_notes").css("display", settings.notes ? "block" : "none");
        saveSettings();
    });
    $('#autoconnect').change(function() {
        settings.auto_connect = !!$('#autoconnect').prop('checked');
        saveSettings();
    });
    $('#show_nsfw').change(function() {
        charaCloud.show_nsfw = !!$('#show_nsfw').prop('checked');
        charaCloudInit();
        saveSettings();
    });
    $('#characloud').change(function() {
        settings.characloud = !!$('#characloud').prop('checked');
        saveSettings();
    });
    $('#swipes').change(function() {
        swipes = !!$('#swipes').prop('checked');
        if(swipes){
            showSwipeButtons();
        }else{
            hideSwipeButtons();
        }
        saveSettings();
    });
    $('#keep_dialog_examples').change(function() {
        keep_dialog_examples = !!$('#keep_dialog_examples').prop('checked');
        saveSettings();
    });
    $('#free_char_name_mode').change(function() {
        free_char_name_mode = !!$('#free_char_name_mode').prop('checked');
        saveSettings();
    });

    document.getElementById("description_wppeditor").style.display = "none";
    document.getElementById("description_wpp_checkbox").checked = false;
    $('#description_wpp_checkbox').change(function() {
        if($('#description_wpp_checkbox').prop('checked')) {
            document.getElementById("description_wppeditor").style.display = null;
            document.getElementById("description_textarea").style.display = "none";
            $('#description_wppeditor').css('opacity', 0.0);
            $('#description_wppeditor').transition({ opacity: 1.0 ,duration: 410, easing:animation_rm_easing});
            
        } else {
            document.getElementById("description_textarea").style.display = null;
            document.getElementById("description_wppeditor").style.display = "none";
            $('#description_textarea').css('opacity', 0.0);
            $('#description_textarea').transition({ opacity: 1.0 ,duration: 410, easing:animation_rm_easing});
        }
    });
    $('#notes_wpp_checkbox').change(function() {
        if($('#notes_wpp_checkbox').prop('checked')) {
            document.getElementById("notes_wpp_editor").style.display = null;
            document.getElementById("notes_textarea").style.display = "none";
            $('#notes_wpp_editor').css('opacity', 0.0);
            $('#notes_wpp_editor').transition({ opacity: 1.0 ,duration: 410, easing:animation_rm_easing});
            
        } else {
            document.getElementById("notes_textarea").style.display = null;
            document.getElementById("notes_wpp_editor").style.display = "none";
            $('#notes_textarea').css('opacity', 0.0);
            $('#notes_textarea').transition({ opacity: 1.0 ,duration: 410, easing:animation_rm_easing});
        }
    });

    //Novel
    $(document).on('input', '#temp_novel', function() {
        temp_novel = $(this).val();
        if(isInt(temp_novel)){
            $('#temp_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#temp_counter_novel').html( $(this).val() );
        }
        var tempTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#amount_gen_novel', function() {
        amount_gen_novel = $(this).val();
        $('#amount_gen_counter_novel').html( $(this).val()+' Tokens' );
        var amountTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_p_novel', function() {
        top_p_novel = $(this).val();
        if(isInt(top_p_novel)){
            $('#top_p_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#top_p_counter_novel').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_k_novel', function() {
        top_k_novel = $(this).val();
        $('#top_k_counter_novel').html( $(this).val() );
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_a_novel', function() {
        top_a_novel = $(this).val();
        if(isInt(top_a_novel)){
            $('#top_a_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#top_a_counter_novel').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#typical_novel', function() {
        typical_novel = $(this).val();
        if(isInt(typical_novel)){
            $('#typical_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#typical_counter_novel').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#tfs_novel', function() {
        tfs_novel = $(this).val();
        if(isInt(tfs_novel)){
            $('#tfs_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#tfs_counter_novel').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#rep_pen_novel', function() {
        rep_pen_novel = $(this).val();
        if(isInt(rep_pen_novel)){
            $('#rep_pen_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#rep_pen_counter_novel').html( $(this).val() );
        }
        var repPenTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#rep_pen_size_novel', function() {
        rep_pen_size_novel = $(this).val();
        $('#rep_pen_size_counter_novel').html( $(this).val()+" Tokens");
        var repPenSizeTimer = setTimeout(saveSettings, 500);
    });
    // HORDE
    $(document).on('input', '#horde_api_key', function() {
        horde_api_key = $(this).val();
    });
    $( "#horde_model_select" ).change(function() {
        horde_model = $( "#horde_model_select" ).val();
    });
    function updateHordeStats() {
        jQuery.ajax({
            type: "GET",
            url: "/gethordeinfo",
            cache: false,
            contentType: "application/json",
            success: function(data) {
                if(data.running && data.queue > 0) {
                    document.getElementById("hordeInfo").classList.remove("hidden");
                    document.getElementById("hordeQueue").innerHTML = String(data.queue);
                } else {
                    document.getElementById("hordeInfo").classList.remove("hidden");
                    document.getElementById("hordeQueue").innerHTML = "-";
                }
                if(hordeCheck){
                    setTimeout(updateHordeStats, 1000);
                }
            },
            error: function (jqXHR, exception) {
                hordeCheck = false;
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }
    $(document).on('input', '#rep_pen_slope_novel', function() {
        rep_pen_slope_novel = $(this).val();
        if(isInt(rep_pen_slope_novel)){
            $('#rep_pen_slope_counter_novel').html( $(this).val()+".00" );
        }else{
            $('#rep_pen_slope_counter_novel').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    
    //OpenAi
    $(document).on('input', '#temp_openai', function() {
        temp_openai = $(this).val();

        if(isInt(temp_openai)){
            $('#temp_counter_openai').html( $(this).val()+".00" );
        }else{
            $('#temp_counter_openai').html( $(this).val() );
        }
        var tempTimer_openai = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#top_p_openai', function() {
        top_p_openai = $(this).val();
        if(isInt(top_p_openai)){
            $('#top_p_counter_openai').html( $(this).val()+".00" );
        }else{
            $('#top_p_counter_openai').html( $(this).val() );
        }
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#freq_pen_openai', function() {
        freq_pen_openai = $(this).val();
        if(isInt(freq_pen_openai)){
            $('#freq_pen_counter_openai').html( $(this).val()+".00" );
        }else{
            $('#freq_pen_counter_openai').html( $(this).val() );
        }
        var freqPenTimer_openai = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#pres_pen_openai', function() {
        pres_pen_openai = $(this).val();
        if(isInt(pres_pen_openai)){
            $('#pres_pen_counter_openai').html( $(this).val()+".00" );
        }else{
            $('#pres_pen_counter_openai').html( $(this).val() );
        }
        var presPenTimer_openai = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#max_context_openai', function() {
        max_context_openai = parseInt($(this).val());
        $('#max_context_counter_openai').html( $(this).val() +' Tokens');
        var max_contextTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#amount_gen_openai', function() {
        amount_gen_openai = $(this).val();
        $('#amount_gen_counter_openai').html( $(this).val()+' Tokens' );
        var amountTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#openai_system_prompt_textarea', function() {
        openai_system_prompt = $(this).val();
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#openai_jailbreak_prompt_textarea', function() {
        openai_jailbreak_prompt = $(this).val();
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    $(document).on('input', '#openai_jailbreak2_prompt_textarea', function() {
        openai_jailbreak2_prompt = $(this).val();
        var saveRangeTimer = setTimeout(saveSettings, 500);
    });
    //***************SETTINGS****************//
    ///////////////////////////////////////////
    async function getSettings(){//timer


        jQuery.ajax({    
            type: 'POST', 
            url: '/getsettings', 
            data: JSON.stringify({}),
            beforeSend: function(){


            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function(data){
                if(data.result != 'file not find'){
                    settings = JSON.parse(data.settings);
                    if(settings.username !== undefined){
                        if(settings.username !== ''){
                            name1 = settings.username;
                            $('#your_name').val(name1);
                        }
                    }
                    
                    charaCloudServer = data.charaCloudServer;
                    characterFormat = data.characterFormat;
                    
                    designs = data.designs;
                    let classic_style_id;
                    designs.forEach(function(item, i) {
                        if(item == 'classic.css') classic_style_id = i;
                    });
                    if(classic_style_id !== undefined){
                        designs.splice(classic_style_id, 1);
                        designs.unshift('classic.css');
                    }
                    designs.forEach(function(item, i) {

                        $('#style_menu').append('<div class="style_button" style_id="'+i+'" id="style_button'+i+'" alt="'+item+'"><img src="../designs/'+item.replace('.css', '.png')+'"></div>');
                    });
                    
                    if(settings.main_api != undefined){
                        main_api = settings.main_api;
                        $("#main_api option[value="+main_api+"]").attr('selected', 'true');
                        changeMainAPI();
                    }
                    if(settings.api_key_novel != undefined){
                        api_key_novel = settings.api_key_novel;
                        $("#api_key_novel").val(api_key_novel);
                    }
                    if(settings.api_key_openai != undefined){
                        api_key_openai = settings.api_key_openai;
                        $("#api_key_openai").val(api_key_openai);
                    }
                    if(settings.openai_system_prompt != undefined){
                        openai_system_prompt = settings.openai_system_prompt;
                        $("#openai_system_prompt_textarea").val(openai_system_prompt);
                    }
                    if(settings.openai_jailbreak_prompt != undefined){
                        openai_jailbreak_prompt = settings.openai_jailbreak_prompt;
                        $("#openai_jailbreak_prompt_textarea").val(openai_jailbreak_prompt);
                    }
                    if(settings.openai_jailbreak2_prompt != undefined){
                        openai_jailbreak2_prompt = settings.openai_jailbreak2_prompt;
                        $("#openai_jailbreak2_prompt_textarea").val(openai_jailbreak2_prompt);
                    }
                    model_openai = settings.model_openai;
                    $('#model_openai_select option[value="'+model_openai+'"]').attr('selected', 'true');
                    openAIChangeMaxContextForModels();
                    
                    //Novel
                    model_novel = settings.model_novel;
                    $('#model_novel_select option[value="'+model_novel+'"]').attr('selected', 'true');

                    novelai_setting_names = data.novelai_setting_names;
                    novelai_settings = data.novelai_settings;
                    novelai_settings.forEach(function(item, i, arr) {

                        novelai_settings[i] = JSON.parse(item);
                    });
                    var arr_holder = {};
                    $("#settings_perset_novel").empty();
                    novelai_setting_names.forEach(function(item, i, arr) {
                        arr_holder[item] = i;
                        $('#settings_perset_novel').append('<option value='+i+'>'+item+'</option>');

                    });
                    novelai_setting_names = {};
                    novelai_setting_names = arr_holder;

                    preset_settings_novel = settings.preset_settings_novel;
                    $("#settings_perset_novel option[value="+novelai_setting_names[preset_settings_novel]+"]").attr('selected', 'true');
                    //Kobold
                    koboldai_setting_names = data.koboldai_setting_names;
                    koboldai_settings = data.koboldai_settings;
                    koboldai_settings.forEach(function(item, i, arr) {
                        koboldai_settings[i] = JSON.parse(item);
                    });
                    var arr_holder = {};
                    //$("#settings_perset").empty();
                    koboldai_setting_names.forEach(function(item, i, arr) {
                        arr_holder[item] = i;
                        $('#settings_perset').append('<option value='+i+'>'+item+'</option>');

                    });
                    koboldai_setting_names = {};
                    koboldai_setting_names = arr_holder;

                    preset_settings = settings.preset_settings;

                    temp = settings.temp;
                    top_p = settings.top_p;
                    top_k = settings.top_k;
                    top_a = settings.top_a;
                    typical = settings.typical;
                    tfs = settings.tfs;
                    
                    amount_gen = settings.amount_gen;
                    max_context = settings.max_context;
                    
                    
                    rep_pen = settings.rep_pen;
                    rep_pen_size = settings.rep_pen_size;
                    rep_pen_slope = settings.rep_pen_slope;


                    var addZeros = "";
                    if(isInt(temp)) addZeros = ".00";
                    $('#temp').val(temp);
                    $('#temp_counter').html(temp+addZeros);

                    addZeros = "";
                    if(isInt(top_p)) addZeros = ".00";
                    $('#top_p').val(top_p);
                    $('#top_p_counter').html(top_p+addZeros);
                    
                    $('#top_k').val(top_k);
                    $('#top_k_counter').html(top_k);
                    
                    addZeros = "";
                    if(isInt(top_a)) addZeros = ".00";
                    $('#top_a').val(top_a);
                    $('#top_a_counter').html(top_a+addZeros);
                    
                    addZeros = "";
                    if(isInt(typical)) addZeros = ".00";
                    $('#typical').val(typical);
                    $('#typical_counter').html(typical+addZeros);
                    
                    addZeros = "";
                    if(isInt(tfs)) addZeros = ".00";
                    $('#tfs').val(tfs);
                    $('#tfs_counter').html(tfs+addZeros);
                    
                    
                    
                    $('#max_context').val(max_context);
                    $('#max_context_counter').html(max_context+' Tokens');

                    $('#amount_gen').val(amount_gen);
                    $('#amount_gen_counter').html(amount_gen+' Tokens');

                    addZeros = "";
                    if(isInt(rep_pen)) addZeros = ".00";
                    $('#rep_pen').val(rep_pen);
                    $('#rep_pen_counter').html(rep_pen+addZeros);

                    addZeros = "";
                    if(isInt(rep_pen_slope)) addZeros = ".00";
                    $('#rep_pen_slope').val(rep_pen_slope);
                    $('#rep_pen_slope_counter').html(rep_pen_slope+addZeros);
                    
                    $('#rep_pen_size').val(rep_pen_size);
                    $('#rep_pen_size_counter').html(rep_pen_size+" Tokens");

                    //Novel

                    temp_novel = settings.temp_novel;
                    top_p_novel = settings.top_p_novel;
                    top_k_novel = settings.top_k_novel;
                    top_a_novel = settings.top_a_novel;
                    typical_novel = settings.typical_novel;
                    tfs_novel = settings.tfs_novel;
                    
                    amount_gen_novel = settings.amount_gen_novel;
                    
                    
                    rep_pen_novel = settings.rep_pen_novel;
                    rep_pen_size_novel = settings.rep_pen_size_novel;
                    rep_pen_slope_novel = settings.rep_pen_slope_novel;


                    var addZeros = "";
                    if(isInt(temp_novel)) addZeros = ".00";
                    $('#temp_novel').val(temp_novel);
                    $('#temp_counter_novel').html(temp_novel+addZeros);

                    addZeros = "";
                    if(isInt(top_p_novel)) addZeros = ".00";
                    $('#top_p_novel').val(top_p_novel);
                    $('#top_p_counter_novel').html(top_p_novel+addZeros);
                    
                    $('#top_k_novel').val(top_k_novel);
                    $('#top_k_counter_novel').html(top_k_novel);
                    
                    addZeros = "";
                    if(isInt(top_a_novel)) addZeros = ".00";
                    $('#top_a_novel').val(top_a_novel);
                    $('#top_a_counter_novel').html(top_a_novel+addZeros);
                    
                    addZeros = "";
                    if(isInt(typical_novel)) addZeros = ".00";
                    $('#typical_novel').val(typical_novel);
                    $('#typical_counter_novel').html(typical_novel+addZeros);
                    
                    addZeros = "";
                    if(isInt(tfs_novel)) addZeros = ".00";
                    $('#tfs_novel').val(tfs_novel);
                    $('#tfs_counter_novel').html(tfs_novel+addZeros);


                    $('#amount_gen_novel').val(amount_gen_novel);
                    $('#amount_gen_counter_novel').html(amount_gen_novel+' Tokens');

                    addZeros = "";
                    if(isInt(rep_pen_novel)) addZeros = ".00";
                    $('#rep_pen_novel').val(rep_pen_novel);
                    $('#rep_pen_counter_novel').html(rep_pen_novel+addZeros);

                    addZeros = "";
                    if(isInt(rep_pen_slope_novel)) addZeros = ".00";
                    $('#rep_pen_slope_novel').val(rep_pen_slope_novel);
                    $('#rep_pen_slope_counter_novel').html(rep_pen_slope_novel+addZeros);
                    
                    $('#rep_pen_size_novel').val(rep_pen_size_novel);
                    $('#rep_pen_size_counter_novel').html(rep_pen_size_novel+" Tokens");
                    
                    //OpenAI
                    temp_openai = settings.temp_openai;
                    top_p_openai = settings.top_p_openai;
                    freq_pen_openai = settings.freq_pen_openai;
                    pres_pen_openai = settings.pres_pen_openai;
                    max_context_openai = settings.max_context_openai;
                    amount_gen_openai = settings.amount_gen_openai;
                    
                    addZeros = "";
                    if(isInt(temp_openai)) addZeros = ".00";
                    $('#temp_openai').val(temp_openai);
                    $('#temp_counter_openai').html(temp_openai+addZeros);
                    
                    addZeros = "";
                    if(isInt(top_p_openai)) addZeros = ".00";
                    $('#top_p_openai').val(top_p_openai);
                    $('#top_p_counter_openai').html(top_p_openai+addZeros);
                    
                    addZeros = "";
                    if(isInt(freq_pen_openai)) addZeros = ".00";
                    $('#freq_pen_openai').val(freq_pen_openai);
                    $('#freq_pen_counter_openai').html(freq_pen_openai+addZeros);

                    addZeros = "";
                    if(isInt(pres_pen_openai)) addZeros = ".00";
                    $('#pres_pen_openai').val(pres_pen_openai);
                    $('#pres_pen_counter_openai').html(pres_pen_openai+addZeros);
                    
                    $('#max_context_openai').val(max_context_openai);
                    $('#max_context_counter_openai').html(max_context_openai+' Tokens');
                    
                    $('#amount_gen_openai').val(amount_gen_openai);
                    $('#amount_gen_counter_openai').html(amount_gen_openai+' Tokens');
                    //TavernAI master settings
                    
                    
                    anchor_order = settings.anchor_order;
                    pygmalion_formating = settings.pygmalion_formating;
                    style_anchor = !!settings.style_anchor;
                    character_anchor = !!settings.character_anchor;//if(settings.character_anchor !== undefined) character_anchor = !!settings.character_anchor;
                    lock_context_size = !!settings.lock_context_size;
                    multigen = !!settings.multigen;
                    singleline = !!settings.singleline;
                    swipes = !!settings.swipes;
                    keep_dialog_examples = !!settings.keep_dialog_examples;
                    free_char_name_mode = !!settings.free_char_name_mode;
                    settings.auto_connect = settings.auto_connect === false ? false : true;
                    settings.characloud = settings.characloud === false ? false : true;
                    if(settings.show_nsfw !== undefined){
                        charaCloud.show_nsfw = Boolean(settings.show_nsfw);
                    }
                    settings.notes = settings.notes === false ? false : true;

                    if(!winNotes) {
                        winNotes = new Notes({
                            root: document.getElementById("shadow_notes_popup"),
                            save: saveChat.bind(this)
                        });
                    }

                    if(!winWorldInfo) {
                        winWorldInfo = new UIWorldInfoMain({
                            root: document.getElementById("shadow_worldinfo_popup"),
                            worldName: settings.worldName || null,
                            metaSave: function(worldName) {
                                settings.worldName = worldName;
                                saveSettings();
                            }.bind(this)
                        });
                    }
                    document.getElementById("input_worldinfo_depth").value = settings.world_depth !== undefined && settings.world_depth !== null ? settings.world_depth : 2;
                    document.getElementById("input_worldinfo_budget").value = settings.world_budget !== undefined && settings.world_budget !== null ? settings.world_budget : 100;

                    document.getElementById("input_worldinfo_depth").onchange = function(event) {
                        settings.world_depth = parseInt(event.target.value);
                    }.bind(this);
                    document.getElementById("input_worldinfo_budget").onchange = function(event) {
                        settings.world_budget = parseInt(event.target.value);
                    }.bind(this);

                    $('#style_anchor').prop('checked', style_anchor);
                    $('#character_anchor').prop('checked', character_anchor);
                    $('#lock_context_size').prop('checked', lock_context_size);
                    $('#multigen').prop('checked', multigen);
                    $('#singleline').prop('checked', singleline);
                    $('#autoconnect').prop('checked', settings.auto_connect);
                    $('#show_nsfw').prop('checked', charaCloud.show_nsfw);
                    
                    $('#characloud').prop('checked', settings.characloud);
                    $('#notes_checkbox').prop('checked', settings.notes);
                    $('#swipes').prop('checked', swipes);
                    $('#keep_dialog_examples').prop('checked', keep_dialog_examples);
                    $('#free_char_name_mode').prop('checked', free_char_name_mode);

                    $("#option_toggle_notes").css("display", settings.notes ? "block" : "none");
                    
                    $("#anchor_order option[value="+anchor_order+"]").attr('selected', 'true');
                    $("#pygmalion_formating option[value="+pygmalion_formating+"]").attr('selected', 'true');
                    //////////////////////
                    if(preset_settings == 'gui'){
                        $("#settings_perset option[value=gui]").attr('selected', 'true');
                        $("#range_block").children().prop("disabled", true);
                        $("#range_block").css('opacity',0.5);

                        $("#top_p_block").children().prop("disabled", true);
                        $("#top_p_block").css('opacity',0.45);
                        
                        $("#top_k_block").children().prop("disabled", true);
                        $("#top_k_block").css('opacity',0.45);
                        
                        $("#top_a_block").children().prop("disabled", true);
                        $("#top_a_block").css('opacity',0.45);
                        
                        $("#typical_block").children().prop("disabled", true);
                        $("#typical_block").css('opacity',0.45);
                        
                        $("#tfs_block").children().prop("disabled", true);
                        $("#tfs_block").css('opacity',0.45);
                        
                        $("#rep_pen_size_block").children().prop("disabled", true);
                        $("#rep_pen_size_block").css('opacity',0.45);
                        
                        $("#rep_pen_slope_block").children().prop("disabled", true);
                        $("#rep_pen_slope_block").css('opacity',0.45);
                        
                        $("#amount_gen_block").children().prop("disabled", true);
                        $("#amount_gen_block").css('opacity',0.45);
                    }else{
                        if(typeof koboldai_setting_names[preset_settings] !== 'undefined') {

                            $("#settings_perset option[value="+koboldai_setting_names[preset_settings]+"]").attr('selected', 'true');
                        }else{
                            $("#range_block").children().prop("disabled", true);
                            $("#range_block").css('opacity',0.5);
                            
                            $("#range_block").children().prop("disabled", true);
                            $("#range_block").css('opacity',0.5);

                            $("#top_p_block").children().prop("disabled", true);
                            $("#top_p_block").css('opacity',0.45);

                            $("#top_k_block").children().prop("disabled", true);
                            $("#top_k_block").css('opacity',0.45);

                            $("#top_a_block").children().prop("disabled", true);
                            $("#top_a_block").css('opacity',0.45);

                            $("#typical_block").children().prop("disabled", true);
                            $("#typical_block").css('opacity',0.45);

                            $("#tfs_block").children().prop("disabled", true);
                            $("#tfs_block").css('opacity',0.45);

                            $("#rep_pen_size_block").children().prop("disabled", true);
                            $("#rep_pen_size_block").css('opacity',0.45);

                            $("#rep_pen_slope_block").children().prop("disabled", true);
                            $("#rep_pen_slope_block").css('opacity',0.45);
                            
                            $("#amount_gen_block").children().prop("disabled", true);
                            $("#amount_gen_block").css('opacity',0.45);

                            preset_settings = 'gui';
                            $("#settings_perset option[value=gui]").attr('selected', 'true');
                        }

                    }
                    if(settings.characloud){
                        showCharaCloud();
                    }
                    //User
                    user_avatar = settings.user_avatar;
                    $('.mes').each(function(){
                        if($(this).attr('ch_name') == name1){
                            $(this).children('.avatar').children('img').attr('src', 'User Avatars/'+user_avatar);
                        }
                    });

                    api_server = settings.api_server;
                    $('#api_url_text').val(api_server);

                    if(api_server && settings.auto_connect && !is_colab) {
                        setTimeout(function() {
                            $('#api_button').click();
                        }, 2000);
                    }

                    
                }
                if(!is_checked_colab) isColab();

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);

            }
        });

    }

    async function saveSettings(type){

        jQuery.ajax({    
            type: 'POST', 
            url: '/savesettings', 
            data: JSON.stringify({
                    username: name1,
                    api_server: api_server,
                    preset_settings: preset_settings,
                    preset_settings_novel: preset_settings_novel,
                    user_avatar: user_avatar,
                    temp: temp,
                    top_p: top_p,
                    top_k: top_k,
                    top_a: top_a,
                    typical: typical,
                    tfs: tfs,
                    amount_gen: amount_gen,
                    max_context: max_context,
                    rep_pen: rep_pen,
                    rep_pen_size: rep_pen_size,
                    rep_pen_slope: rep_pen_slope,
                    anchor_order: anchor_order,
                    pygmalion_formating: pygmalion_formating,
                    style_anchor: style_anchor,
                    character_anchor: character_anchor,
                    lock_context_size: lock_context_size,
                    multigen: multigen,
                    singleline: singleline,
                    worldName: settings.worldName || null,
                    world_depth: settings.world_depth || 2,
                    world_budget: settings.world_budget || 100,
                    auto_connect: settings.auto_connect || false,
                    characloud: settings.characloud === false ? false : true,
                    show_nsfw: charaCloud.show_nsfw,
                    swipes: swipes,
                    notes: settings.notes || false,
                    keep_dialog_examples: keep_dialog_examples,
                    free_char_name_mode: free_char_name_mode,
                    main_api: main_api,
                    api_key_novel: api_key_novel,
                    api_key_openai: api_key_openai,
                    openai_system_prompt: openai_system_prompt,
                    openai_jailbreak_prompt: openai_jailbreak_prompt,
                    openai_jailbreak2_prompt: openai_jailbreak2_prompt,
                    model_novel: model_novel,
                    temp_novel: temp_novel,
                    top_p_novel: top_p_novel,
                    top_k_novel: top_k_novel,
                    top_a_novel: top_a_novel,
                    typical_novel: typical_novel,
                    tfs_novel: tfs_novel,
                    amount_gen_novel: amount_gen_novel,
                    rep_pen_novel: rep_pen_novel,
                    rep_pen_size_novel: rep_pen_size_novel,
                    rep_pen_slope_novel: rep_pen_slope_novel,
                    temp_openai: temp_openai,
                    top_p_openai: top_p_openai,
                    freq_pen_openai: freq_pen_openai,
                    pres_pen_openai: pres_pen_openai,
                    max_context_openai: max_context_openai,
                    amount_gen_openai: amount_gen_openai,
                    model_openai: model_openai
                    }),
            beforeSend: function(){


            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function(data){
                //online_status = data.result;
                if(type === 'change_name'){
                    location.reload();
                }

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);

            }
        });

    }
    $('#donation').click(function(){
        $('#shadow_tips_popup').css('display', 'block');
        $('#shadow_tips_popup').transition({  
            opacity: 1.0,
            duration: 100,
            easing: animation_rm_easing,
            complete: function() {

            }
        });
    });
    $('#tips_cross').click(function(){

        $('#shadow_tips_popup').transition({  
            opacity: 0.0,
            duration: 100,
            easing: animation_rm_easing,
            complete: function() {
                $('#shadow_tips_popup').css('display', 'none');
            }
        });
    });
    $('#select_chat_cross').click(function(){


        $('#shadow_select_chat_popup').css('display', 'none');
        $('#load_select_chat_div').css('display', 'block');
    });

    function isInt(value) {
        return !isNaN(value) && 
            parseInt(Number(value)) == value && 
            !isNaN(parseInt(value, 10));
    }
    //********************
    //***Message Editor***
    function messageRoot(anyChild) {
        while(anyChild && anyChild.length && anyChild.attr && (anyChild.attr("mesid") === undefined || anyChild.attr("mesid") === null) && anyChild.parent) {
            anyChild = anyChild.parent();
        }
        if(anyChild && anyChild.attr && anyChild.attr("mesid") !== undefined && anyChild.attr("mesid") !== null) {
            return anyChild;
        }
        return null;
    }
    function toggleEdit(messageRoot, toState = false) {
        if(!messageRoot) { return; }
        messageRoot.find('.mes_edit').css("display", toState ? "none": "block");
        const editBlock = messageRoot.find('.edit_block');
        editBlock.css("display", toState ? "block" : "none");
        if(toState) {
            editBlock.css("opacity", 0);
            editBlock.transition({
                opacity: 1.0,
                duration: 600,
                easing: "",
                complete: function() {  }
            });
        }
    }
    function recalculateChatMesids() {
        const childs = $('#chat')[0].childNodes;
        for(let index = 0; index < childs.length; index++) {
            const child = childs[index];
            child.setAttribute("mesid", index);
            child.setAttribute("class", index === childs.length - 1 ? "mes last_mes" : "mes");
        }
    }

    $(document).on('click', '.mes_edit', function(){
        if(Characters.selectedID == undefined){
            return;
        }
        let run_edit = true;
        const root = messageRoot($(this));
        if(!root) { return; }
        const edit_mes_id = root ? parseInt(root.attr("mesid")) : NaN;
        if(isNaN(edit_mes_id)) { return; }
        if(this_edit_mes_id !== undefined) { return; }

        if(edit_mes_id == count_view_mes-1){ //if the generating swipe (...)
            if(chat[edit_mes_id]['swipe_id'] !== undefined){
                if(chat[edit_mes_id]['swipes'].length === chat[edit_mes_id]['swipe_id']){
                    run_edit = false;
                }
            }
            if(run_edit){
                hideSwipeButtons();
            }
        }
        if(run_edit){
            let chatScrollPosition = $("#chat").scrollTop();
            if(this_edit_mes_id !== undefined){
                let mes_edited = $('#chat').children().filter('[mesid="'+this_edit_mes_id+'"]').children('.mes_block').children('.ch_name').children('.mes_edit_done');
                messageEditDone(mes_edited);
            }
            root.find('.mes_text').empty();
            toggleEdit(root, true);
            this_edit_mes_id = edit_mes_id;
            root.find('.mes_up').attr('class', this_edit_mes_id == 0 ? "mes_up disabled" : "mes_up");
            root.find('.mes_down').attr('class', this_edit_mes_id == chat.length - 1 ? "mes_down disabled" : "mes_down");

            if(chat[this_edit_mes_id].chid === undefined && !chat[this_edit_mes_id].is_user) {
                chat[this_edit_mes_id].chid = parseInt(Characters.selectedID);
            }

            let nameSelect = root.find(".name_select");
                nameSelect.css("display", "block");
                nameSelect.empty();
                nameSelect.append('<option value="-1" class="player"'+ (chat[this_edit_mes_id].is_user ? " selected=\"selected\"" : "") +'>'+name1+'</option>');
                nameSelect.append('<option value="'+Characters.selectedID+'" class="host"'+ (chat[this_edit_mes_id].chid == parseInt(Characters.selectedID) ? " selected=\"selected\"" : "") +'>'+name2+'</option>');
            root.find(".ch_name").css("display", "none");

            var text = chat[edit_mes_id]['mes'];
            if(chat[edit_mes_id]['is_user']){
                this_edit_mes_chname = name1;
            }else{
                this_edit_mes_chname = name2;
            }
            text = text.trim();
            const mesText = root.find('.mes_text');
            let edit_textarea = $('<textarea class=edit_textarea>'+text+'</textarea>');
            mesText.append(edit_textarea);
            edit_textarea.css('opacity',0.0);
            edit_textarea.transition({
                    opacity: 1.0,
                    duration: 0,
                    easing: "",
                    complete: function() {  }
            });
            edit_textarea.height(0);
            edit_textarea.height(edit_textarea[0].scrollHeight);
            edit_textarea.focus();
            edit_textarea[0].setSelectionRange(edit_textarea.val().length, edit_textarea.val().length);
            if(this_edit_mes_id == count_view_mes-1 || true){
                //console.log(1);
                $("#chat").scrollTop(chatScrollPosition);
            }
        }
    });
    $(document).on('click', '.mes_edit_clone', function(){
        if(!confirm("Make a copy of this message?")) { return; }
        const root = messageRoot($(this));
        if(!root) { return; }
        let oldScroll = $('#chat')[0].scrollTop;
        let clone = JSON.parse(JSON.stringify(chat[this_edit_mes_id]));
        clone.send_date++;

        let nameSelect = root.find('.name_select');
        let authorId = parseInt(nameSelect.val());
        clone.is_user = authorId < 0;
        clone.chid = authorId < 0 ? undefined : authorId;
        clone.name = authorId < 0 ? name1 : Characters.id[authorId].name;
        clone.mes = root.find('.mes_text').children('.edit_textarea').val().trim();

        chat.splice(this_edit_mes_id+1, 0, clone);
        root.after(addOneMessage(clone));
        recalculateChatMesids();
        saveChat();
        $('#chat')[0].scrollTop = oldScroll;
    });
    $(document).on('click', '.mes_edit_delete', function(){
        if(!confirm("Are you sure you want to delete this message?")) { return; }
        const root = messageRoot($(this));
        if(!root) { return; }
        chat.splice(this_edit_mes_id, 1);
        this_edit_target_id = undefined;
        this_edit_mes_id = undefined;
        root.remove();
        count_view_mes--;
        recalculateChatMesids();
        saveChat();
        hideSwipeButtons();
        showSwipeButtons();
    });
    $(document).on('click', '.mes_up', function(){
        if(this_edit_mes_id <= 0 && this_edit_target_id === undefined) { return; }
        this_edit_mes_id = parseInt(this_edit_mes_id);
        if(this_edit_target_id === undefined) {
            this_edit_target_id = this_edit_mes_id - 1;
        } else {
            this_edit_target_id--;
        }
        const root = messageRoot($(this));
        if(!root) { return; }
        root.attr('mesid', this_edit_target_id);
        root.prev().attr('mesid', this_edit_target_id+1);
        root.insertBefore(root.prev());
        $(this).parent().children('.mes_up').attr('class', this_edit_target_id == 0 ? "mes_up disabled" : "mes_up");
        $(this).parent().children('.mes_down').attr('class', this_edit_target_id == chat.length - 1 ? "mes_down disabled" : "mes_down");
    });
    $(document).on('click', '.mes_down', function(){
        if(this_edit_mes_id >= chat.length-1 && this_edit_target_id === undefined) { return; }
        this_edit_mes_id = parseInt(this_edit_mes_id);
        if(this_edit_target_id === undefined) {
            this_edit_target_id = this_edit_mes_id + 1;
        } else {
            this_edit_target_id++;
        }
        const root = messageRoot($(this));
        if(!root) { return; }
        root.attr('mesid', this_edit_target_id);
        root.next().attr('mesid', this_edit_target_id-1);
        root.insertAfter(root.next());
        $(this).parent().children('.mes_up').attr('class', this_edit_target_id == 0 ? "mes_up disabled" : "mes_up");
        $(this).parent().children('.mes_down').attr('class', this_edit_target_id == chat.length - 1 ? "mes_down disabled" : "mes_down");
    });
    $(document).on('change', '.name_select', function(){
        const root = messageRoot($(this));
        if(!root) { return; }
        let to_chid = parseInt($(this).val());
        let toAvatar = to_chid < 0 ? "User Avatars/" + user_avatar : "characters/" + Characters.id[to_chid].filename;
        root.find(".avt_img").attr("src", toAvatar + "#t=" + Date.now());
    });
    $(document).on('click', '.mes_edit_cancel', function(){
        hideSwipeButtons();
        const mes = chat[this_edit_mes_id];
        const text = mes.mes;

        const root = messageRoot($(this));
        if(!root) { return; }
        toggleEdit(root, false);

        root.find('.avt_img').attr("src", getMessageAvatar(mes));
        let nameSelect = root.find('.name_select');
            nameSelect.empty();
            nameSelect.css("display", "none");
        root.find('.ch_name').css("display", "block");
        root.find('.mes_text').empty();
        root.find('.mes_text').append(messageFormating(text,this_edit_mes_chname));
        if(this_edit_target_id !== undefined && this_edit_target_id !== null && this_edit_target_id !== this_edit_mes_id) {
            $('#chat')[0].insertBefore($('#chat')[0].childNodes[this_edit_target_id], $('#chat')[0].childNodes[this_edit_mes_id < this_edit_target_id ? this_edit_mes_id : this_edit_mes_id+1]);
            recalculateChatMesids();
        }
        this_edit_target_id = undefined;
        this_edit_mes_id = undefined;
        showSwipeButtons();
    });
    $(document).on('click', '.mes_edit_done', function(){
        showSwipeButtons();
        messageEditDone($(this));
    });
    function messageEditDone(div){
        const root = messageRoot(div);
        if(!root) { return; }
        hideSwipeButtons();
        var text = root.find('.mes_text').children('.edit_textarea').val();
        const message = chat[this_edit_mes_id];
        text = text.trim();
        message.mes = text;

        let nameSelect = root.find('.name_select');
        let authorId = parseInt(nameSelect.val());
        message.is_user = authorId < 0;
        message.chid = authorId < 0 ? undefined : authorId;
        message.name = authorId < 0 ? name1 : Characters.id[authorId].name;
        nameSelect.empty();
        nameSelect.css("display", "none");
        let chName = root.find('.ch_name');
            chName.html(message.name);
            chName.css("display", "block");

        if(message['swipe_id'] !== undefined){
            message['swipes'][message['swipe_id']] = text;
        }
        root.find('.mes_text').empty();
        toggleEdit(root, false);
        root.find('.mes_text').append(messageFormating(text,this_edit_mes_chname));
        root.find('.token_counter').html(String(getTokenCount(text)));
        if(this_edit_target_id !== undefined && this_edit_target_id !== this_edit_mes_id) {
            let date = message.send_date;
            chat.splice(this_edit_target_id, 0, chat.splice(this_edit_mes_id, 1)[0]);
            if(this_edit_target_id < this_edit_mes_id) {
                for(let i = this_edit_target_id; i < this_edit_mes_id; i++) {
                    chat[i].send_date = chat[i+1].send_date;
                }
                message.send_date = date;
            } else {
                for(let i = this_edit_target_id; i > this_edit_mes_id; i--) {
                    chat[i].send_date = chat[i-1].send_date;
                }
                message.send_date = date;
            }
            for(let i = 0; i < div.parent().parent().parent().parent().children().length; i++) {
                div.parent().parent().parent().parent().children().eq(i).attr("mesid", i);
            }
        }
        showSwipeButtons();
        this_edit_target_id = undefined;
        this_edit_mes_id = undefined;
        saveChat();
    }
    //********************
    //***Swipes***
    $(document).keydown(function(e) {
        if (($(document.activeElement).is('#send_textarea') && $('#send_textarea').val().length === 0) || !$('textarea:focus, input[type="text"]:focus').length) {
            if (e.keyCode == 37) {
                // Left arrow key pressed
                if(JSON.parse($('#chat').children('.mes').last().attr('is_user')) === false && $('#chat').children('.mes').last().children('.swipe_left').css('display') !== 'none'){
                    $('#chat').children('.mes').last().children('.swipe_left').click();
                }
            } else if (e.keyCode == 39) {
                // Right arrow key pressed
                if(JSON.parse($('#chat').children('.mes').last().attr('is_user')) === false && $('#chat').children('.mes').last().children('.swipe_right').css('display') !== 'none'){
                    $('#chat').children('.mes').last().children('.swipe_right').click();

                }
            }
        }
    });
    $(document).on('click', '.swipe_right', function(){
        const swipe_duration = 120;
        const swipe_range = '700px';
        let run_generate = false;
        let run_swipe_right = false;
        if(chat[chat.length-1]['swipe_id'] === undefined){
            chat[chat.length-1]['swipe_id'] = 0;
            chat[chat.length-1]['swipes'] = [];
            chat[chat.length-1]['swipes'][0] = chat[chat.length-1]['mes'];
        }
        chat[chat.length-1]['swipe_id']++;

        if(parseInt(chat[chat.length-1]['swipe_id']) === chat[chat.length-1]['swipes'].length){

            run_generate = true;
        }else if(parseInt(chat[chat.length-1]['swipe_id']) < chat[chat.length-1]['swipes'].length){
            chat[chat.length-1]['mes'] = chat[chat.length-1]['swipes'][chat[chat.length-1]['swipe_id']];
            run_swipe_right = true;
        }
        
        if(chat[chat.length-1]['swipe_id'] > chat[chat.length-1]['swipes'].length){
            chat[chat.length-1]['swipe_id'] = chat[chat.length-1]['swipes'].length;
        }
        if(run_generate){
            $(this).css('display', 'none');
            
        }
        if(run_generate || run_swipe_right){
            let this_mes_div = $(this).parent();
            let this_mes_block = $(this).parent().children('.mes_block').children('.mes_text');
            const this_mes_div_height = this_mes_div[0].scrollHeight;
            this_mes_div.css('height', this_mes_div_height);
            const this_mes_block_height = this_mes_block[0].scrollHeight;
            
            this_mes_div.children('.swipe_left').css('display', 'block');
            this_mes_div.children('.mes_block').transition({ 
                    x: '-'+swipe_range,
                    duration: swipe_duration,
                    easing: animation_rm_easing,
                    queue:false,
                    complete: function() {
                        
                        const is_animation_scroll = ($('#chat').scrollTop() >= ($('#chat').prop("scrollHeight") - $('#chat').outerHeight()) - 10);
                        if(run_generate && parseInt(chat[chat.length-1]['swipe_id']) === chat[chat.length-1]['swipes'].length){
                            $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.mes_block').children('.mes_text').html('...');
                            $("#chat").children().filter('[mesid="'+(count_view_mes-1)+'"]').children('.token_counter').html("-");
                        }else{
                            addOneMessage(chat[chat.length-1], 'swipe');
                        }
                        let new_height = this_mes_div_height-(this_mes_block_height - this_mes_block[0].scrollHeight);
                        if(new_height < 103) new_height = 103;
                        
                        
                        this_mes_div.animate({height: new_height+'px'}, {
                            duration: 100,
                            queue:false,
                            progress: function() {
                                // Scroll the chat down as the message expands
                                if(is_animation_scroll) $("#chat").scrollTop($("#chat")[0].scrollHeight);
                            },
                            complete: function() {
                                this_mes_div.css('height', 'auto');
                                // Scroll the chat down to the bottom once the animation is complete
                                if(is_animation_scroll) $("#chat").scrollTop($("#chat")[0].scrollHeight);
                            }
                        });
                        this_mes_div.children('.mes_block').transition({  
                                x: swipe_range,
                                duration: 0,
                                easing: animation_rm_easing,
                                queue:false,
                                complete: function() {  
                                    this_mes_div.children('.mes_block').transition({  
                                            x: '0px',
                                            duration: swipe_duration,
                                            easing: animation_rm_easing,
                                            queue:false,
                                            complete: function() {  
                                                if(run_generate && !is_send_press && parseInt(chat[chat.length-1]['swipe_id']) === chat[chat.length-1]['swipes'].length){
                                                    is_send_press = true;
                                                    Generate('swipe');
                                                }else{
                                                    if(parseInt(chat[chat.length-1]['swipe_id']) !== chat[chat.length-1]['swipes'].length){
                                                        saveChat();
                                                    }
                                                }
                                            }
                                    });
                                }
                        });
                    }
            });

            $(this).parent().children('.avatar').transition({ 
                    x: '-'+swipe_range,
                    duration: swipe_duration,
                    easing: animation_rm_easing,
                    queue:false,
                    complete: function() {  
                        $(this).parent().children('.avatar').transition({  
                                x: swipe_range,
                                duration: 0,
                                easing: animation_rm_easing,
                                queue:false,
                                complete: function() {  
                                    $(this).parent().children('.avatar').transition({  
                                            x: '0px',
                                            duration: swipe_duration,
                                            easing: animation_rm_easing,
                                            queue:false,
                                            complete: function() {  

                                            }
                                    });
                                }
                        });
                    }
            });
        }
        
    });
    $(document).on('click', '.swipe_left', function(){
        const swipe_duration = 120;
        const swipe_range = '700px';
        chat[chat.length-1]['swipe_id']--;
        if(chat[chat.length-1]['swipe_id'] >= 0){
            $(this).parent().children('.swipe_right').css('display', 'block');
            if(chat[chat.length-1]['swipe_id'] === 0){
                $(this).css('display', 'none');
            }
            
            let this_mes_div = $(this).parent();
            let this_mes_block = $(this).parent().children('.mes_block').children('.mes_text');
            const this_mes_div_height = this_mes_div[0].scrollHeight;
            this_mes_div.css('height', this_mes_div_height);
            const this_mes_block_height = this_mes_block[0].scrollHeight;
            
            chat[chat.length-1]['mes'] = chat[chat.length-1]['swipes'][chat[chat.length-1]['swipe_id']];
            $(this).parent().children('.mes_block').transition({ 
                    x: swipe_range,
                    duration: swipe_duration,
                    easing: animation_rm_easing,
                    queue:false,
                    complete: function() {
                        const is_animation_scroll = ($('#chat').scrollTop() >= ($('#chat').prop("scrollHeight") - $('#chat').outerHeight()) - 10);
                        addOneMessage(chat[chat.length-1], 'swipe');
                        let new_height = this_mes_div_height-(this_mes_block_height - this_mes_block[0].scrollHeight);
                        if(new_height < 103) new_height = 103;
                        this_mes_div.animate({height: new_height+'px'}, {
                            duration: 100,
                            queue:false,
                            progress: function() {
                                // Scroll the chat down as the message expands
                                
                                if(is_animation_scroll) $("#chat").scrollTop($("#chat")[0].scrollHeight);
                            },
                            complete: function() {
                                this_mes_div.css('height', 'auto');
                                // Scroll the chat down to the bottom once the animation is complete
                                if(is_animation_scroll) $("#chat").scrollTop($("#chat")[0].scrollHeight);
                            }
                        });
                        $(this).parent().children('.mes_block').transition({  
                                x: '-'+swipe_range,
                                duration: 0,
                                easing: animation_rm_easing,
                                queue:false,
                                complete: function() {  
                                    $(this).parent().children('.mes_block').transition({  
                                            x: '0px',
                                            duration: swipe_duration,
                                            easing: animation_rm_easing,
                                            queue:false,
                                            complete: function() {  
                                                saveChat();
                                            }
                                    });
                                }
                        });
                    }
            });

            $(this).parent().children('.avatar').transition({ 
                    x: swipe_range,
                    duration: swipe_duration,
                    easing: animation_rm_easing,
                    queue:false,
                    complete: function() {  
                        $(this).parent().children('.avatar').transition({  
                                x: '-'+swipe_range,
                                duration: 0,
                                easing: animation_rm_easing,
                                queue:false,
                                complete: function() {  
                                    $(this).parent().children('.avatar').transition({  
                                            x: '0px',
                                            duration: swipe_duration,
                                            easing: animation_rm_easing,
                                            queue:false,
                                            complete: function() {  

                                            }
                                    });
                                }
                        });
                    }
            });
        }
        if(chat[chat.length-1]['swipe_id'] < 0){
            chat[chat.length-1]['swipe_id'] = 0;
        }
    });

    $("#your_name_button").click(function() {
        if(!is_send_press){
            name1 = $("#your_name").val();
            if(name1 === undefined || name1 == '') name1 = default_user_name;
            console.log(name1);
            saveSettings('change_name');

        }
    });
    $("#your_avatar_add_button").click(function() {
        $("#user_avatar_add_file").click();
    });
    $("#user_avatar_add_file").on("change", function(e){
        var file = e.target.files[0];
        //console.log(1);
        if (!file) {
          return;
        }



        //console.log(format);
        var formData = new FormData($("#form_add_user_avatar").get(0));

        jQuery.ajax({    
            type: 'POST', 
            url: '/adduseravatar', 
            data: formData,
            beforeSend: function(){
                //$('#create_button').attr('disabled',true);
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            contentType: false,
            processData: false, 
            success: function(data){
                getUserAvatars();

            },
            error: function (jqXHR, exception) {
                //let error = handleError(jqXHR);
                callPopup(exception, 'alert_error');
            }
        });  
    });
    $(document).on('click', '.user_avatar_cross', function(){
        delete_user_avatar_filename = $(this).parent().attr('imgfile');
        callPopup('<h3>Delete this avatar?</h3>', 'delete_user_avatar');
        

    });
    //Select chat
    async function getAllCharaChats() {
        $('#select_chat_div').html('');
        //console.log(Characters.id[Characters.selectedID].chat);
        jQuery.ajax({    
            type: 'POST', 
            url: '/getallchatsofchatacter', 
            data: JSON.stringify({filename: Characters.id[Characters.selectedID].filename}),
            beforeSend: function(){
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            dataType: "json",
            contentType: "application/json",
            success: function(data){
                $('#load_select_chat_div').css('display', 'none');
                let dataArr = Object.values(data);
                data = dataArr.sort((a, b) => a['file_name'].localeCompare(b['file_name']));
                data = data.reverse();
                for (const key in data) {
                    let strlen = 40;
                    let mes = data[key]['mes'];
                    if(mes.length > strlen){
                        mes = '...'+mes.substring(mes.length - strlen);
                    }
                    $('#select_chat_div').append('<div class="select_chat_block" file_name="'+data[key]['file_name']+'"><div class=avatar><img src="characters/'+Characters.id[Characters.selectedID].filename+'"></div><div class="select_chat_block_filename">'+data[key]['file_name']+'</div><div class="select_chat_block_mes">'+vl(mes)+'</div></div>');
                    if(Characters.id[Characters.selectedID]['chat'] == data[key]['file_name'].replace('.jsonl', '')){
                        //children().last()
                        $('#select_chat_div').children(':nth-last-child(1)').attr('highlight', true);
                    }
                }
                //<div id="select_chat_div">

                //<div id="load_select_chat_div">
                //console.log(data);
                //chat.length = 0;

                //chat =  data;
                //getChatResult();
                //saveChat();
            },
            error: function (jqXHR, exception) {
                //getChatResult();
                console.log(exception);
                console.log(jqXHR);
            }
        });
    }
    //************************************************************
    //************************Novel.AI****************************
    //************************************************************
    async function getStatusNovel(){
        if(is_get_status_novel){

            var data = {key:api_key_novel};


            jQuery.ajax({    
                type: 'POST', // 
                url: '/getstatus_novelai', // 
                data: JSON.stringify(data),
                beforeSend: function(){
                    //$('#create_button').attr('value','Creating...'); 
                },
                cache: false,
                timeout: requestTimeout,
                dataType: "json",
                contentType: "application/json",
                success: function(data){


                    if(data.error != true){
                        //var settings2 = JSON.parse(data);
                        //const getData = await response.json();
                        novel_tier = data.tier;
                        if(novel_tier == undefined){
                            online_status = 'no_connection';
                        }
                        if(novel_tier === 0){
                            online_status = "Paper";
                        }
                        if(novel_tier === 1){
                            online_status = "Tablet";
                        }
                        if(novel_tier === 2){
                            online_status = "Scroll";
                        }
                        if(novel_tier === 3){
                            online_status = "Opus";
                        }
                    }
                    setPygmalionFormating();
                    resultCheckStatusNovel();
                },
                error: function (jqXHR, exception) {
                    online_status = 'no_connection';
                    console.log(exception);
                    console.log(jqXHR);
                    resultCheckStatusNovel();
                }
            });
        }else{
            if(is_get_status != true && !is_get_status_openai){
                online_status = 'no_connection';
            }
        }
    }
    $( "#api_button_novel" ).click(function() {
        if($('#api_key_novel').val() != ''){
            $("#api_loading_novel").css("display", 'inline-block');
            $("#api_button_novel").css("display", 'none');
            api_key_novel = $('#api_key_novel').val();
            api_key_novel = $.trim(api_key_novel);
            //console.log("1: "+api_server);
            saveSettings();
            is_get_status_novel = true;
            is_api_button_press_novel = true;
        }
    });
    function resultCheckStatusNovel(){
        is_api_button_press_novel = false;  
        checkOnlineStatus();
        $("#api_loading_novel").css("display", 'none');
        $("#api_button_novel").css("display", 'inline-block');
    }
    $( "#model_novel_select" ).change(function() {
        model_novel = $('#model_novel_select').find(":selected").val();
        saveSettings();
    });
    $( "#model_openai_select" ).change(function() {
        model_openai = $('#model_openai_select').find(":selected").val();
        openAIChangeMaxContextForModels();
        saveSettings();
    });
    function openAIChangeMaxContextForModels(){
        let this_openai_max_context;
        switch(model_openai){
            case 'gpt-4':
                this_openai_max_context = 8192;
                break;
            case 'gpt-4-32k':
                this_openai_max_context = 32768;
                break;
            case 'code-davinci-002':
                this_openai_max_context = 8000;
                break;
            default:
                this_openai_max_context = 4096;
                break;
        }
        $('#max_context_openai').attr('max', this_openai_max_context);
        if(max_context_openai > this_openai_max_context){
            max_context_openai = this_openai_max_context;
        }
        $('#max_context_openai').val(max_context_openai);
        $('#max_context_counter_openai').html(max_context_openai+' Tokens');
        
    }
    $( "#anchor_order" ).change(function() {
        anchor_order = parseInt($('#anchor_order').find(":selected").val());
        saveSettings();
    });
    $( "#pygmalion_formating" ).change(function() {
        pygmalion_formating = parseInt($('#pygmalion_formating').find(":selected").val());
        setPygmalionFormating();
        checkOnlineStatus();
        saveSettings();
    });
    //************************************************************
    //************************OPENAI****************************
    //************************************************************
    async function getStatusOpenAI(){
        if(is_get_status_openai){
            jQuery.ajax({    
                type: 'POST', // 
                url: '/getstatus_openai', // 
                data: JSON.stringify({
                        key: api_key_openai
                    }),
                beforeSend: function(){
                    if(is_api_button_press_openai){
                        //$("#api_loading").css("display", 'inline-block');
                        //$("#api_button").css("display", 'none');
                    }

                },
                cache: false,
                timeout: requestTimeout,
                dataType: "json",
                crossDomain: true,
                contentType: "application/json",
                //processData: false, 
                success: function(data){
                    online_status = data;
                    if(online_status == undefined || online_status.error == true){
                        online_status = 'no_connection';
                    }else{
                        online_status = 'Connected';
                    }
                    setPygmalionFormating();

                

                    //console.log(online_status);
                    resultCheckStatusOpen();
                    if(online_status !== 'no_connection'){
                        var checkStatusNowOpenAI = setTimeout(getStatusOpenAI, 3000);//getStatus();
                    }
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    console.log(jqXHR);
                    online_status = 'no_connection';

                    resultCheckStatus();
                }
            });
        }else{
            if(is_get_status_novel != true && is_get_status != true){
                online_status = 'no_connection';
            }
        }
    }
    $( "#api_button_openai" ).click(function() {
        if($('#api_key_openai').val() != ''){
            $("#api_loading_openai").css("display", 'inline-block');
            $("#api_button_openai").css("display", 'none');
            api_key_openai = $('#api_key_openai').val();
            api_key_openai = $.trim(api_key_openai);
            //console.log("1: "+api_server);
            saveSettings();
            is_get_status_openai = true;
            is_api_button_press_openai = true;
            getStatusOpenAI();
        }
    });
    function resultCheckStatusOpen(){
        is_api_button_press_openai = false;  
        checkOnlineStatus();
        $("#api_loading_openai").css("display", 'none');
        $("#api_button_openai").css("display", 'inline-block');
    }

    function compareVersions(v1, v2) {
        const v1parts = v1.split('.');
        const v2parts = v2.split('.');

        for (let i = 0; i < v1parts.length; ++i) {
            if (v2parts.length === i) {
                return 1;
            }

            if (v1parts[i] === v2parts[i]) {
                continue;
            }
            if (v1parts[i] > v2parts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }

        if (v1parts.length != v2parts.length) {
            return -1;
        }

        return 0;
    }



    //**************************CHARACTER IMPORT EXPORT*************************//
    $( "#rm_button_import" ).click(function() {
        $("#character_import_file").click();
    });
    $("#character_import_file").on("change", function(e){
        $('#rm_info_avatar').html('');
        var file = e.target.files[0];
        //console.log(1);
        if (!file) {
          return;
        }
        var ext = file.name.match(/\.(\w+)$/);
        if(!ext || (ext[1].toLowerCase() != "json" && ext[1].toLowerCase() != "png" && ext[1].toLowerCase() != "webp")){
            return;
        }

        var format = ext[1].toLowerCase();
        $("#character_import_file_type").val(format);
        //console.log(format);
        var formData = new FormData($("#form_import").get(0));

        jQuery.ajax({    
            type: 'POST', 
            url: '/importcharacter', 
            data: formData,
            beforeSend: function(){
                //$('#create_button').attr('disabled',true);
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            contentType: false,
            processData: false, 
            success: function(data){
                if(data.file_name !== undefined){

                    characterAddedSign(data.file_name, 'Character imported');

                }
            },
            error: function (jqXHR, exception) {
                $('#create_button').removeAttr("disabled");
            }
        });  
    });
    $('#export_button').click(function(){
        var link = document.createElement('a');
        link.href = 'characters/'+Characters.id[Characters.selectedID].filename;  
        link.download = Characters.id[Characters.selectedID].filename;
        document.body.appendChild(link);
        link.click();
   });

    async function characterAddedSign(file_name, alert_text = 'Character created'){
        $('#rm_info_block').transition({opacity: 0, duration: 0});
        var $prev_img = $('#avatar_div_container').clone();
        $prev_img.children('img').attr('src', 'characters/'+file_name+'.'+characterFormat);
        $('#rm_info_avatar').append($prev_img);
        select_rm_info("Character created");

        $('#rm_info_block').transition({opacity: 1.0, duration: 2000});
        await Characters.loadAll()
                .then(function(){
                    
                })
                .catch(function (error) {
                    switch (error.status) {
                        default:
                            callPopup(`${error.msg}`, 'alert_error');
                            return;
                    }
                });
    }


//**************************CHAT IMPORT EXPORT*************************//
    $( "#chat_import_button" ).click(function() {
        $("#chat_import_file").click();
    });
    $("#chat_import_file").on("change", function(e){
        var file = e.target.files[0];
        //console.log(1);
        if (!file) {
          return;
        }
        var ext = file.name.match(/\.(\w+)$/);
        if(!ext || (ext[1].toLowerCase() != "json" && ext[1].toLowerCase() != "jsonl"&& ext[1].toLowerCase() != "txt")){
            return;
        }

        var format = ext[1].toLowerCase();
        $("#chat_import_file_type").val(format);
        //console.log(format);
        console.warn($("#form_import_chat").get(0));
        var formData = new FormData($("#form_import_chat").get(0));

        jQuery.ajax({    
            type: 'POST', 
            url: '/importchat', 
            data: formData,
            beforeSend: function(){
                $('#select_chat_div').html('');
                $('#load_select_chat_div').css('display', 'block');
                //$('#create_button').attr('value','Creating...'); 
            },
            cache: false,
            timeout: requestTimeout,
            contentType: false,
            processData: false, 
            success: function(data){
                //console.log(data);
                if(data.res){
                    getAllCharaChats();


                }
            },
            error: function (jqXHR, exception) {
                $('#create_button').removeAttr("disabled");
            }
        });  
    });
    $(document).on('click', '.select_chat_block', function(){
        let file_name = $(this).attr("file_name").replace('.jsonl', '');
        //console.log(Characters.id[Characters.selectedID]['chat']);
        Characters.id[Characters.selectedID]['chat'] = file_name;
        clearChat();
        chat.length = 0;
        getChat();
        $('#selected_chat_pole').val(file_name);
        $("#create_button").click();
        $('#shadow_select_chat_popup').css('display', 'none');
        $('#load_select_chat_div').css('display', 'block');

    });
    
    
    
    $( "#worldinfo-import" ).click(function() {
        $("#world_import_file").click();
    });
    
    
    
    
    
    
    
    
    //**************************************************************//
    //**************************************************************//
    //**************************************************************//
    //**************************************************************//
    //**************************CHARA CLOUD*************************//
    $('#chat_header_back_button').click(function(){
        if(charaCloud.isOnline()){
            $('#shell').css('display', 'none');
            $('#chara_cloud').css('display', 'block');
            $('#chara_cloud').css('opacity', 0.0);
            $('#chara_cloud').transition({  
                opacity: 1.0,
                duration: 300,
                queue: false,
                easing: "",
                complete: function() {  }
            });

            $('#rm_button_characters').click();
            $('#bg_chara_cloud').transition({  
                opacity: 1.0,
                duration: 1000,
                queue: false,
                easing: "",
                complete: function() {  }
            });
        }else{
            Characters.selectedID = undefined;
            clearChat();
            chat.length = 0;
            chat = [chloeMes];
            name2 = 'Chloe';
            $('#rm_button_characters').click();
            $('#rm_button_selected_ch').css('display', 'none');
            $('#chat_header_char_name').text('');
            $('#chat_header_back_button').css('display', 'none');
            $('#chat_header_char_info').text('Wellcome to Tavern');
            printMessages();
            $('#chat').scrollTop(0);
        }
    });

    characloud_characters_rows = [];

    let charaCloudSwipeLeft = function(){
        const this_row_id = $(this).parent().attr('characloud_row_id');
        const this_width = parseInt($(this).parent().children('.characloud_characters_row_scroll').css('width'))-parseInt($('#characloud_characters_row'+this_row_id).css('width'));
        let move_x = 820;
        if(is_mobile_user){
            move_x = 305;
        }
        $(this).parent().lazyLoadXT({edgeX:1000, edgeY:500});
        if(characloud_characters_rows[this_row_id] != 0){
            if($(this).parent().children('.characloud_swipe_rigth').css('display') == 'none'){
                $(this).parent().children('.characloud_swipe_rigth').css('display', 'flex');
                $(this).parent().children('.characloud_swipe_rigth').transition({
                    opacity: 1.0,
                    duration: 300,
                    easing: animation_rm_easing,
                    queue: false,
                    complete: function() {
                    }
                });
            }
            if(Math.abs(characloud_characters_rows[this_row_id])-move_x <= 0){
                $(this).transition({
                    opacity: 0.0,
                    duration: 700,
                    easing: animation_rm_easing,
                    queue: false,
                    complete: function() {
                        $(this).css('display', 'none');
                    }
                });
                characloud_characters_rows[this_row_id] = 0;
            }else{
                characloud_characters_rows[this_row_id] += move_x;
            }
            $(this).parent().children('.characloud_characters_row_scroll').transition({
                x: characloud_characters_rows[this_row_id],
                duration: 300,
                easing: animation_rm_easing,
                queue: false,
                complete: function() {

                }
            });
        } else {
            $(this).css("opacity", "0");
        }
    };
    let charaCloudSwipeRight = function(){
        const this_row_id = $(this).parent().attr('characloud_row_id');
        const this_width = parseInt($(this).parent().children('.characloud_characters_row_scroll').css('width'))-parseInt($('#characloud_characters_row'+this_row_id).css('width'));

        let move_x = 820;
        if(is_mobile_user){
            move_x = 305;
        }
        $(this).parent().lazyLoadXT({edgeX:1000, edgeY:500});
        if(characloud_characters_rows[this_row_id] != this_width*-1 && parseInt($(this).parent().css('width')) < parseInt($(this).parent().children('.characloud_characters_row_scroll').css('width'))){
            if($(this).parent().children('.characloud_swipe_left').css('display') == 'none'){
                $(this).parent().children('.characloud_swipe_left').css('display', 'flex');
                $(this).parent().children('.characloud_swipe_left').transition({
                    opacity: 1.0,
                    duration: 300,
                    easing: animation_rm_easing,
                    queue: false,
                    complete: function() {
                    }
                });
            }
            if(Math.abs(characloud_characters_rows[this_row_id])+move_x >= this_width){
                characloud_characters_rows[this_row_id] = this_width*-1;
                $(this).transition({
                    opacity: 0.0,
                    duration: 700,
                    easing: animation_rm_easing,
                    queue: false,
                    complete: function() {
                        $(this).css('display', 'none');
                    }
                });
            }else{
                characloud_characters_rows[this_row_id] -= move_x;

            }

            $(this).parent().children('.characloud_characters_row_scroll').transition({
                x: characloud_characters_rows[this_row_id],
                duration: 400,
                easing: animation_rm_easing,
                queue: false,
                complete: function() {

                }
            });
        } else {
            $(this).css("opacity", "0");
        }
    };
    $('#shell').on('click', '#chloe_star_dust_city', function(){
        showCharaCloud();
    });
    async function charaCloudInit(){
            charaCloud.is_init = true;
            charaCloudServerStatus();
            let characloud_characters_board = await charaCloud.getBoard();
            if(charaCloud.isOnline()){
                if(login !== undefined && ALPHA_KEY !== undefined){
                    userLogin(login, ALPHA_KEY, 'ALPHA_KEY');
                }
                //showCharaCloud();
                
                printCharactersBoard(characloud_characters_board);

                


            }

    }
    function printCharactersBoard(characloud_characters_board) {
        
        let char_i = 0;
        let row_i = 0;
        $('#characloud_characters').html('');
        characloud_characters_board.forEach(function (category, i) {
            if (category.characters.length === 0)
                return;

            characloud_characters_rows[row_i] = 0;
            $('#characloud_characters').append('<div category="' + vl(category.name) + '" class="characloud_characters_category_title">' + vl(category.name_view.replace('$', '')) + '</div><div characloud_row_id="' + row_i + '" id="characloud_characters_row' + row_i + '" class="characloud_characters_row"><div class="characloud_swipe_rigth"><img src="img/swipe_right.png"></div><div class="characloud_swipe_left"><img src="img/swipe_left.png"></div></div>');
            $('#characloud_characters_row' + row_i).append('<div class="characloud_characters_row_scroll"></div>');

            let row = $('#characloud_characters_row' + row_i);
            row[0].addEventListener("wheel", function (event) {
                if (!event.deltaX || row.sleeping) {
                    return;
                }
                if (event.deltaX > 0) {
                    row.sleeping = true;
                    charaCloudSwipeRight.call(row.find(".characloud_swipe_rigth"));
                } else {
                    row.sleeping = true;
                    charaCloudSwipeLeft.call(row.find(".characloud_swipe_left"));
                }
                setTimeout(function () {
                    row.sleeping = false;
                }, 150);
            });

            category.characters.forEach(function (item, i) {
                let link = `<img src="../img/vdots.png">`;
                $('#characloud_characters_row' + row_i).children('.characloud_characters_row_scroll').append(charaCloud.getCharacterDivBlock(item, charaCloudServer));
                //$('#characloud_character_block'+char_i).children('.characloud_character_block_card').children('.avatar').children('img').lazyLoadXT({edgeX:500, edgeY:500});
                const $char_block = $('.characloud_character_block[public_id="' + item.public_id + '"]');
                //$.lazyLoadXT.scrollContainer = '#chara_cloud';
                const new_width = $('#characloud_characters_row' + row_i).children('.characloud_characters_row_scroll').width() + $char_block.width();
                $('#characloud_characters_row' + row_i).children('.characloud_characters_row_scroll').css('width', new_width);
                let j = 0;
                let this_discr = item.short_description;
                if (this_discr.length == 0) {
                    this_discr = "Hello, I'm " + item.name;
                }
                if (this_discr.length > 120) {
                    this_discr = this_discr.substr(0, 120);
                }
                $char_block.children('.characloud_character_block_card').children('.characloud_character_block_description').text($.trim(this_discr));
                while (parseInt($char_block.children('.characloud_character_block_card').children('.characloud_character_block_description').css('height').replace('px', '')) > 40 && j < 100) {
                    this_discr = this_discr.slice(0, this_discr.length - 5);
                    $char_block.children('.characloud_character_block_card').children('.characloud_character_block_description').text($.trim(this_discr) + '...');
                    j++;
                }
                characloud_characters[char_i] = item;

                char_i++;
            });
            row_i++;
        });
        $('.lazy').lazyLoadXT({edgeX:500, edgeY:500});
        $('#characloud_bottom').css('display', 'flex');
    }
    var is_lazy_load = true;
    $('#chara_cloud').on('scroll', function(){
        if(is_lazy_load){
            is_lazy_load = false;
            setTimeout(lazy, 400);
        }

    });
    function lazy(){
        $(this).lazyLoadXT({edgeX:500, edgeY:500});
        is_lazy_load = true;
    }
    $('#chara_cloud').on('click', '.characloud_swipe_rigth', charaCloudSwipeRight);
    $('#chara_cloud').on('click', '.characloud_swipe_left', charaCloudSwipeLeft);
    
    //select character
    $('#chara_cloud').on('click', '.characloud_character_block_card', function(){

        let public_id = $(this).parent().attr('public_id');
        let public_id_short = $(this).parent().attr('public_id_short');
        let user_name = $(this).parent().attr('user_name');
        charaCloudLoadCard(public_id, public_id_short, user_name);
    });
    $('#chara_cloud').on('click', '.characloud_character_block_page_link', function(event){
        
        event.stopPropagation();
        
        const publicIdShort = $(this).attr('public_id_short');
        const userName = $(this).attr('user_name');
        const mode = $(this).attr('mode');
        selectCharacterCardOnline(userName, publicIdShort, mode);
        

    });
    $('#chara_cloud').on('click', '.characloud_character_block_user_name', function(event){
        event.stopPropagation();
        showUserProfile($(this).attr('user_name'));

    });
    $('#chara_cloud').on('click', '#characloud_search_result .character_select', function(){

        if($(this).attr('category') !== undefined){
            showCategory($(this).attr('category'));
        }else{
            charaCloudLoadCard($(this).attr('public_id'), $(this).attr('public_id_short'), $(this).attr('user_name'));
        }
    });
    async function charaCloudLoadCard(public_id, public_id_short, user_name){
        
        let need_to_load = true;
        let selected_char_id;
        Characters.id.forEach(function(item, i){
            if(item.public_id != undefined){
                if(item.public_id == public_id){
                    need_to_load = false;
                    selected_char_id = i;
                    return;
                }
            }
        });
        if(need_to_load){
            await charaCloud.loadCard(user_name, public_id_short)
                    .then(async function (data) {
                        Characters.loadAll().then(async function () {
                            let filename = data.filename;
                            let id = Characters.getIDbyFilename(filename);
                            $(`#rm_print_charaters_block .character_select[chid="${id}"]`).click();
                        }).catch(function (error) {
                            switch (error.status) {
                                default:
                                    callPopup(`${error.msg}`, 'alert_error');
                                    return;
                            }
                        });
                    })
                    .catch(function (error) {
                        switch (error.status) {
                            default:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                        }
                    });
            
            
            $('#shell').css('display', 'grid');
            $('#chara_cloud').css('display', 'none');
        }else{
            $(`#rm_print_charaters_block .character_select[chid="${selected_char_id}"]`).click();
            $('#shell').css('display', 'grid');
            $('#chara_cloud').css('display', 'none');
        }
        $('#bg_chara_cloud').transition({  
            opacity: 0.0,
            duration: 1000,
            easing: "",
            complete: function() {  }
        });
    }
    
    //search character
    $('#characloud_search_form').on('submit', async (event) => {
        hideAll();
        event.preventDefault(); // prevent default form submission
        // get search query from input field
        const searchQuery = $('#characloud_search').val().trim();
        let characloud_found_characters = [];
        let characloud_found_categories = [];
        let characloud_found_data = await charaCloud.searchCharacter(searchQuery);
        characloud_found_characters = characloud_found_data.characters;
        characloud_found_categories = characloud_found_data.categories;
        $('#characloud_search_block').css('display', 'block');
        $('#characloud_search_back_button').css('display', 'block');
        $('#characloud_characters').css('display', 'none');
        $('#characloud_board').css('display', 'none');
        $('#characloud_search_result').html('');
        characloud_found_characters.sort(function(a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
        });
        characloud_found_categories.sort(function(a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
        });
        if(characloud_found_categories.length > 0){
            characloud_found_categories.forEach(function(item, i){
                item.name = vl(item.name);
                item.name_view = vl(item.name_view);
                $('#characloud_search_result').append(`<div class="character_select" category="${item.name}"><div class=avatar></div><div style="color:rgb(168, 137, 97);" class="ch_name_menu">Category:</div><div class="ch_short_desctription">${item.name_view} (${item.count})</div></div>`);

            });
        }
        if(characloud_found_characters.length > 0){
            characloud_found_characters.forEach(function(item, i){
                $('#characloud_search_result').append('<div public_id_short="'+vl(item.public_id_short)+'" public_id="'+vl(item.public_id)+'" user_name="'+vl(item.user_name)+'" class=character_select chid='+i+'><div class=avatar><img src="'+charaCloudServer+'/'+vl(item.user_name)+'/'+vl(item.public_id_short)+'.webp"></div><div class="ch_name_menu">'+vl(item.name)+'</div><div class="ch_short_desctription">'+vl(item.short_description)+'</div></div>');

            });
        }
        if(characloud_found_characters.length === 0 && characloud_found_categories.length === 0){
            $('#characloud_search_result').append('Characters not found');
        }
        
    });
    $('#characloud_search_back_button').click(function(){
        $('#characloud_search').val('');
        showMain();
    });
    if(document.getElementById("nav-toggle").checked) {
        is_nav_toggle = true;
        $('#chara_cloud').transition({
            width: "calc(100vw - 610px)",
            duration: 140,
            delay: 20,
            easing: "ease-in-out",
            complete: function() {  }
        });
    }
    $('.nav-toggle').click(function(){
        if(!is_nav_toggle){
            is_nav_toggle = true;
            $('#chara_cloud').transition({  
                width: "calc(100vw - 610px)",
                duration: 140,
                delay: 20,
                easing: "ease-in-out",
                complete: function() {  }
            });

            if(is_mobile_user){
                $('#bg_menu').transition({
                    display: "none",
                    duration: 140,
                    delay: 20,
                    easing: "ease-in-out",
                    complete: function() {  }
                });
            }
        }else if (is_mobile_user){
            is_nav_toggle = false;
            $('#chara_cloud').transition({  
                width: "100%",
                duration: 140,
                delay: 20,
                easing: "ease-in-out",
                complete: function() {  }
            });

            if(is_mobile_user){
                $('#bg_menu').transition({
                    display: "block",
                    duration: 140,
                    delay: 20,
                    easing: "ease-in-out",
                    complete: function() {  }
                });
            }
        }
        else{
            is_nav_toggle = false;
            $('#chara_cloud').transition({  
                width: "calc(100vw - 180px)",
                duration: 140,
                delay: 20,
                easing: "ease-in-out",
                complete: function() {  }
            });
        }
    });
    
    async function charaCloudServerStatus(){
        let count_supply = 0;
        let max_supply = 30;
        let chara_logo = 'default';
        let server_status = await charaCloud.getServerStatus();
        if(charaCloud.isOnline()){
            count_supply = server_status.count_supply;
            max_supply = server_status.max_supply;
            use_reg_recaptcha = server_status.use_reg_recaptcha;
            if(server_status.chara_logo !== undefined){
                if(server_status.chara_logo != 'default'){
                    chara_logo = server_status.chara_logo;
                    $('#characloud_status_button_content_logo').children('img').attr('src', charaCloudServer+'/app/img/'+chara_logo+'.png');
                }
            }
            if(count_supply > max_supply){
                count_supply = max_supply;
            }
            $('#characloud_status_button_content_logo_counter').text(count_supply+'/'+max_supply);
            let inputNumber = count_supply/max_supply; // example input number
            if(inputNumber <= 0.5){
                inputNumber = 0.01;
            }else{
                inputNumber -= 0.5;
                inputNumber *=2;
            }
            const red = Math.round(255 - (inputNumber * 55)); // map inputNumber to red value
            const green = Math.round(180 + (inputNumber * 75)); // map inputNumber to green value
            //colorBox.style.backgroundColor = `rgba(${red}, ${green}, 200, 0.4)`;
            $('#characloud_status_button_content_logo_counter').css('color', `rgba(${red}, ${green}, 200, 0.4)`);
            $('#characloud_status_button_content_logo_line_fill').css('background-color', `rgba(${red}, ${green}, 200, 0.5)`);
            //if(count_supply >= max_supply){
                //$('#characloud_status_button_content_logo_counter').css('color', 'rgba(200,255,200,0.4)');
                //$('#characloud_status_button_content_logo_line_fill').css('background-color', 'rgba(200,255,200,0.5)');

            //}
            let fill_proportion = count_supply/max_supply;
            let fill_width = Math.floor(fill_proportion*parseInt($('#characloud_status_button_content_logo_line_fill').css('max-width').replace('px', '')));
            $('#characloud_status_button_content_logo_line_fill').css('width', fill_width);
        }else{
            hideCharaCloud();
        }
    }
    
    //Login Registration
    $('#characloud_profile_button').click(function(event){
        $('#successful_registration').css('display', 'none');
        if (!is_login) {
            $('#reg_login_popup_shadow').css('display', 'block');
            $('#reg_login_popup_shadow').css('opacity', 0.0);
            $('#reg_login_popup_shadow').transition({opacity: 1.0, duration: animation_rm_duration, easing: animation_rm_easing, complete: function () {

                }});
            let rect = this.getBoundingClientRect();
            let xPosition = event.clientX - rect.left;
            let width = rect.right - rect.left;

            if (xPosition < width / 2.35) {
                switch_log_reg = 'login';
                showLoginForm();
            } else {
                switch_log_reg = 'reg';
                showRegForm();
            }
        } else {
            showUserProfile();
        }
    });
    setRegLoginFormSize();
    $(window).resize(function () {
        setRegLoginFormSize();
    });
    function setRegLoginFormSize(){
        try {
            let max_height = parseInt($('#reg_login_popup').css('max-height').replace('px', ''));
            let windowHeight = $(window).height();
            if (max_height > windowHeight) {

                $('#reg_login_popup').height(windowHeight - 100);
            }else{
                $('#reg_login_popup').height(max_height);
            }
        } catch (err) {
            console.log(err);
        }
    }
    $('textarea.characloud_character').on('input', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();  
        textareaAutosize($(this));
    });
    function textareaAutosize(textarea){
        textarea.attr('style', '');
        let texarea_height = textarea.height();
        textarea.css('height', 'auto');
        const height = Math.max(textarea.prop('scrollHeight'), texarea_height);
        textarea.css('height', height + 'px');
    }

    $('#registration_form').on('submit', async (event) => {
        event.preventDefault(); // prevent default form submission
        if(use_reg_recaptcha){
            grecaptcha.ready(function () {
                grecaptcha.execute('6Lf4za4lAAAAAKntV6fQX7daXJeWspwIN_bOBmwW', {action: 'submit'}).then(function (re_token) {
                    registration(re_token);
                });
            });
        } else {
            registration();
        }

       
    });
    function registration(re_token = undefined){

        const username = $('#reg_username').val();
        const email = $('#reg_email').val();
        const password = $('#reg_password').val();//$('#reg_password').val();
        const conf_password = $('#reg_confirm_password').val();
        $('#username_error').css('display', 'none');
        $('#email_error').css('display', 'none');
        $('#reg_password_error').css('display', 'none');
        $('#reg_confirm_password_error').css('display', 'none');
        
        charaCloud.registration(username, email, password, conf_password, re_token)
        .then(function (data) {
            $('#registration_form').css('display', 'none');
            $('#successful_registration').css('display', 'flex');
            $('#successful_registration').css('opacity', 0.0);
            $('#successful_registration').transition({opacity: 1.0, duration: 1000, easing: animation_rm_easing, complete: function () {
                setTimeout(userLogin(username, password, 'password'), 1400);
            }});
        })
        .catch(function (error) {
            switch(error.status){
                case 409: // Name already exists
                    $('#username_error').css('display', 'inline-block');
                    $('#username_error').text('Name already exists');
                    return;
                case 422:
                    switch(error.msg){
                        case 'Name validation error':
                            $('#username_error').css('display', 'inline-block');
                            $('#username_error').text('Name validation error. Only allowed A-Za-z0-9_');
                            return;
                        case 'Confirmation password does not match':
                            $('#reg_confirm_password_error').css('display', 'inline-block');
                            $('#reg_confirm_password_error').text(error.msg);
                            return;   
                        default:
                            callPopup(`<h3>${error.msg}</h3>`, 'alert_error');
                            return;
                    }
                    return;
                case 504:
                    callPopup(`${error.msg}`, 'alert_error');
                    return;
                default:
                    callPopup(`${error.msg}`, 'alert_error');
                    return;
            }
            console.log(error);
        });
    }
    $('#login_form').on('submit', async (event) => {
        event.preventDefault(); // prevent default form submission

        const username = $('#login_username').val();
        const password = $('#login_password').val();//$('#reg_password').val();
        $('#login_username_error').css('display', 'none');
        userLogin(username, password, 'password');
    });

    function userLogin(username, password, type = 'password') {
        charaCloud.login(username, password, type)
                .then(function (data) {
                    if (type === 'password') {
                        ALPHA_KEY = data.ALPHA_KEY;
                        login = data.username;
                        login_view = data.username_view;
                        setCookie("login_view", login_view, {'max-age': 31536000, 'secure': true, 'SameSite': 'Lax'});
                        setCookie("login", login, {'max-age': 31536000, 'secure': true, 'SameSite': 'Lax'});
                        setCookie("ALPHA_KEY", ALPHA_KEY, {'max-age': 31536000, 'secure': true, 'SameSite': 'Lax'});
                    }
                    setCookie("refresh_login", 'true', {'max-age': 600, 'secure': true, 'SameSite': 'Lax'});
                    if (type === 'password') {
                        showUserProfile();
                    }
                    $('#profile_button_is_not_login').css('display', 'none');
                    $('#profile_button_is_login').css('display', 'block');
                    
                    $('#profile_button_is_login').children('.user_name').text(login_view);
                    is_login = true;
                })
                .catch(function (error) {
                    if (type === 'password') {
                        switch (error.status) {
                            case 401: // Wrong password or login
                                $('#login_username_error').css('display', 'inline-block');
                                $('#login_username_error').text('Wrong login or password');
                                return;
                            case 422:
                                if (error.msg === 'Name validation error') {
                                    $('#login_username_error').css('display', 'inline-block');
                                    $('#login_username_error').text('Name validation error. Only allowed A-Za-z0-9_');
                                    return;
                                } else {
                                    callPopup(`${error.msg}`, 'alert_error');
                                    return;
                                }
                            case 504:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                            default:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                        }
                    }
                    console.log(error);
                });
    }

    $('.switch_log_reg').click(function(){
        switchLoginReg();
    });
    
    $('.logout').click(function(){
        callPopup('', 'logout');
        
    });
   
    function switchLoginReg() {
            switch (switch_log_reg) {
                case 'login':
                    
                    showRegForm();
                    switch_log_reg = 'reg';
                    return;
                case 'reg':
                    showLoginForm();
                    switch_log_reg = 'login';
                    return;
            }

    }
    function showLoginForm(){
        $('#reg_login_popup_shadow').css('display', 'block');
        $('#registration_form').css('display', 'none');
        $('#login_form').css('display', 'block');
        $('#login_form').css('opacity', 0.0);
        $('#login_form').transition({opacity: 1.0, duration: 1000, easing: animation_rm_easing, complete: function () {
            }});
    }
    function showRegForm() {
        if(use_reg_recaptcha){
            $('.google-captcha-terms').css('display', 'block');
            const recaptcha_url = `https://www.google.com/recaptcha/api.js?render=6Lf4za4lAAAAAKntV6fQX7daXJeWspwIN_bOBmwW`;

            $('head').append(`<script src="${recaptcha_url}"></script>`);
        }
        $('#reg_login_popup_shadow').css('display', 'block');
        $('#login_form').css('display', 'none');
        $('#registration_form').css('display', 'block');
        $('#registration_form').css('opacity', 0.0);
        $('#registration_form').transition({opacity: 1.0, duration: 1000, easing: animation_rm_easing, complete: function () {
            }});
    }
    $('#reg_login_cross').click(function () {
        $('#reg_login_popup_shadow').transition({opacity: 0.0, duration: animation_rm_duration, easing: animation_rm_easing, complete: function () {
                const script = document.querySelector('script[src="https://www.google.com/recaptcha/api.js?render=6Lf4za4lAAAAAKntV6fQX7daXJeWspwIN_bOBmwW"]');
                script.remove();
                $('#reg_login_popup_shadow').css('display', 'none');
            }});
    });
    
    
    //************************//
    //UPLOAD CHARACTERS ONLINE//
    $( "#characloud_upload_character_button" ).click(function() {
        if(is_login){
            $("#characloud_upload_character_file").click();
        }else{
            $('#characloud_profile_button').click();
        }
    });
    $("#characloud_upload_character_file").on("change", function(e){ // Load from file
        $('#rm_info_avatar').html('');
        var file = e.target.files[0];
        //console.log(1);
        if (!file) {
          return;
        }
        var ext = file.name.match(/\.(\w+)$/);
        if(!ext || (ext[1].toLowerCase() != "png" && ext[1].toLowerCase() != "webp")){
            return;
        }
        //console.log(format);
        var formData = new FormData($("#form_characloud_upload_character").get(0));
        //let button_text = $('#characloud_upload_character_button').text();
        //let button_width = $('#characloud_upload_character_button').outerWidth();
        prepublishCard(formData);
    });
    $('#character_online_editor').click(function(){ // Click from local library
        $('#chara_cloud').css('display', 'block');
        $('#shell').css('display', 'none');
        var formData = new FormData();
        formData.append('filename_local', Characters.id[Characters.selectedID].filename);
        showCharaCloud();
        prepublishCard(formData);
        
    });
    function prepublishCard(formData){
        jQuery.ajax({    
            type: 'POST', 
            url: '/api/characloud/characters/prepublish', 
            data: formData,
            beforeSend: function(){
                //$('#characloud_upload_character_button').html('Uploading...');
                //$('#characloud_upload_character_button').css('width', button_width);
            },
            cache: false,
            timeout: 8*1000,
            contentType: false,
            processData: false, 
            success: function(data){
                charaCloud.cardeditor_image = data.image;
                showCharacterCard(data, 'prepublish');

            },
            error: function (jqXHR, exception) {
                if (exception === 'timeout') {
                    callPopup('Timeout: Error uploading the character', 'alert_error');
                }else{
                    let error = handleError(jqXHR);
                    callPopup(`${error.status} ${error.msg}`, 'alert_error');
                }
            },
            complete: function (xhr, status) {
                //$('#characloud_upload_character_button').html(button_text);
            }
        });  
    }
    $('.publish_button').click(function(){ // Add card online
        if (login !== undefined) {
            charaCloud.publishCharacter('create_online')
                    .then(function (data) {
                        if(data.premod === true){
                            $('.character_published_popup_title').text('Character added for moderation');
                        }else{
                            $('.character_published_popup_title').text('Character Published');
                        }

                        $('#character_published_shadow').css('display', 'flex');
                        $('#character_published_shadow').css('opacity', 0.0);
                        $('#character_published_popup_avatar').attr('src', `./cardeditor/${charaCloud.cardeditor_image}`);
                        $('#character_published_shadow').transition({opacity: 1.0, duration: 600, easing: animation_rm_easing, complete: function () {

                            }});
                        

                        if(charaCloud.cardeditor_id_local === -1){
                            $('.add_locally_button').eq(0).data("params", {type: 'add_locally_with_publish', online_public_id: data.public_id}).click();
                        }else{
                            $('.update_locally_button').eq(0).data("params", {type: 'update_locally_with_publish', online_public_id: data.public_id}).click();
                        }
                        

                    })
                    .catch(function (error) {
                        console.log(error);
                        switch (error.status) {
                            case 504:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                            default:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                        }
                    });
        }
    });
    $('.update_button').click(function(){ // Update card online
        if (login !== undefined) {
            charaCloud.publishCharacter('edit_online')
                    .then(function (data) {
                        if(data.premod === true){
                            callPopup(`Character update added for moderation`, 'alert');
                        }else{
                            callPopup(`Character updated`, 'alert');
                        }
                        $('.update_locally_button').eq(0).data("params", {type: 'update_locally_with_publish', online_public_id: data.public_id}).click();
                    })
                    .catch(function (error) {
                        console.log(error);
                        switch (error.status) {
                            default:
                                callPopup(`${error.msg}`, 'alert_error');
                                return;
                        }
                    });
        }
    });
    $('.add_locally_button').click(function(){ // Add new character from online editor to local storagev
        let type = 'default';
        let online_public_id;
        let card_data = {};
        if($(this).data("params") !== undefined){
            type = $(this).data("params").type;
            online_public_id = vl($(this).data("params").online_public_id);
            
            charaCloud.cardeditor_data.public_id = online_public_id;
            charaCloud.cardeditor_data.public_id_short = online_public_id.substr(0,6);
            charaCloud.cardeditor_data.user_name = login;
            charaCloud.cardeditor_data.user_name_view = login_view;
            charaCloud.cardeditor_data.online = true;
        }

        charaCloud.publishCharacter('add_locally')
            .then(async function (data) {
                if(type === 'default'){
                    callPopup(`Character added`, 'alert');
                }
                await characterAddedSign(data.file_name, 'Character added');
                charaCloud.cardeditor_id_local = Characters.getIDbyFilename(`${data.file_name}.${characterFormat}`);
                charaCloud.cardeditor_filename_local = Characters.id[charaCloud.cardeditor_id_local].filename;
                printCharacterPageLocalButtons();
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
    });
    $('.update_locally_button').on('click', function() { // Update character from online editor to local storage
        let type = 'default';
        let online_public_id;
        let card_data = {};
        if($(this).data("params") !== undefined){
            type = $(this).data("params").type;
            online_public_id = vl($(this).data("params").online_public_id);
            
            charaCloud.cardeditor_data.public_id = online_public_id;
            charaCloud.cardeditor_data.public_id_short = online_public_id.substr(0,6);
            charaCloud.cardeditor_data.user_name = login;
            charaCloud.cardeditor_data.user_name_view = login_view;
            charaCloud.cardeditor_data.online = true;
        }

        let char_id = Characters.getIDbyFilename(charaCloud.cardeditor_filename_local);

        charaCloud.publishCharacter('update_locally', Characters.id[char_id].filename)
            .then(async function (data) {
                if(type === 'default'){
                    callPopup(`Changes saved`, 'alert');
                }
                await Characters.loadAll();
                char_id = Characters.getIDbyFilename(charaCloud.cardeditor_filename_local);
                $(`#rm_print_charaters_block .character_select[chid="${char_id}"]`).click();

            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });

    });

    $('#character_published_popup_button').click(function(){
        $('#character_published_shadow').transition({opacity: 0.0, duration: 300, easing: animation_rm_easing, complete: function () {
                $('#character_published_shadow').css('display', 'none');
            }});

        showUserProfile();
    });
    
    // Navigator
    function showMain() {
        hideAll();
        $('#characloud_bottom').css('display', 'flex');
        $('#characloud_search_back_button').css('display', 'none');
        $('#characloud_search_block').css('display', 'none');
        $('#characloud_characters').css('display', 'block');
        $('#characloud_board').css('display', 'block');

    }
    $('.characloud_user_profile_avatar_img').on('error', function () { // Set default avatar
        
        $(this).attr('src', '../img/default_avatar.png');

    });
    $('.characloud_user_profile_avatar').click(function(){
        if(charaCloud.user_profile_name === login){
            $('#form_user_profile_avatar_file').click();
        }
    });
    $("#form_user_profile_avatar_file").on("change", function(e){
        $('#rm_info_avatar').html('');
        var file = e.target.files[0];
        //console.log(1);
        if (!file) {
          return;
        }
        var ext = file.name.match(/\.(\w+)$/); 
        if(!ext || (ext[1].toLowerCase() != "png" && ext[1].toLowerCase() != "webp" && ext[1].toLowerCase() != "jpeg" && ext[1].toLowerCase() != "jpg" && ext[1].toLowerCase() != "gif")){
            return;
        }
        //console.log(format);
        var formData = new FormData($("#form_user_profile_avatar").get(0));
        //let button_text = $('#characloud_upload_character_button').text();
        //let button_width = $('#characloud_upload_character_button').outerWidth();
        formData.append("user_name", login);
        jQuery.ajax({    
            type: 'POST', 
            url: '/api/characloud/users/avatar', 
            data: formData,
            beforeSend: function(){
                //$('#characloud_upload_character_button').html('Uploading...');
                //$('#characloud_upload_character_button').css('width', button_width);
            },
            cache: false,
            timeout: 8*1000,
            contentType: false,
            processData: false, 
            success: function(data){
                //charaCloud.cardeditor_image = data.image;

                $('.characloud_user_profile_avatar_img').attr('src', `${charaCloudServer}/users/${login}/img/avatar.webp?v=${Date.now()}`);

            },
            error: function (jqXHR, exception) {
                if (exception === 'timeout') {
                    callPopup('Timeout: Error uploading the character', 'alert_error');
                }else{
                    let error = handleError(jqXHR);
                    callPopup(`${error.status} ${error.msg}`, 'alert_error');
                }
            },
            complete: function (xhr, status) {
                //$('#characloud_upload_character_button').html(button_text);
            }
        });  
    });
    $('.url-data').click(function(){
        window.open($('.url-data').attr('url'), '_blank');
    });
    $('.upload-avatar-button').click(function () {
        $('.characloud_user_profile_avatar').click();
    });
    $('.upload-character-button').click(function () {
        $('#characloud_upload_character_button').click();
    });
    function showUserProfile(user_name = undefined) {
        if(user_name === undefined){
            user_name = login;
        }
        user_name = vl(user_name);
        charaCloud.user_profile_name = user_name;
        hideAll();
        $('#characloud_bottom').css('display', 'flex');
        $('#characloud_header_navigator_p2').css('display', 'inline-block');
        $('#characloud_header_navigator_c1').css('display', 'inline-block');
        $('.characloud_content').css('display', 'block');
        $('#characloud_user_profile_block').css('display', 'block');

        $('.character-gallery-content').html('');
        $('.edit-mod-character-gallery-content').html('');
        $('.new-mod-character-gallery-content').html('');

        $('.characloud_user_profile_avatar_img').attr('src', `${charaCloudServer}/users/${user_name.toLowerCase()}/img/avatar.webp`);
        $('.url-data').css('display','block');
        $('.url-data').text(`Profile: ${charaCloudServer}/${user_name.toLowerCase()}`);
        $('.url-data').attr('url',`${charaCloudServer}/${user_name.toLowerCase()}`);
        charaCloud.getUserCharacters(user_name.toLowerCase(), charaCloud.user_profile_page)
            .then(function (data) {
                data.name_view = vl(data.name_view);
                let user_count_pages = Math.ceil(data.charactersCount / charaCloud.max_user_page_characters_count);
                if (user_count_pages === 0) {
                    user_count_pages = 1;
                }
                $('#user_profile_page_pagination').text(`${charaCloud.user_profile_page}/${user_count_pages}`);
                
                if(typeof login !== 'undefined' && user_name.toLowerCase() === login.toLowerCase()){
                    $('#user_profile_info_this_user').css('display', 'inline-block');
                    $('.characloud_user_profile_avatar').css('cursor', 'pointer');
                }else{
                    $('.profile-button').text('Characters: '+data.charactersCount);
                    $('#user_profile_info_other_user').css('display', 'inline-block');
                    $('.characloud_user_profile_avatar').css('cursor', 'auto');
                }
                if(data.status === 4){
                    $('.star-icon').css('display', 'inline-block');
                }else{
                    $('.star-icon').css('display', 'none');
                }

                $('#characloud_header_navigator_p2').text(data.name_view);
                $('#user_profile_info').children('.username').children('.username_text').text(data.name_view);
                $('#characloud_header_navigator_p2').text(data.name_view);
                if(data.characters[0] !== undefined){
                    if (data.characters[0].public_id !== null) {
                        // Characters Gallery
                        data.characters.forEach(function (item, i) {
                            item.moderation = Boolean(item.moderation);
                            item.user_name = user_name.toLowerCase();
                            item.user_name_view = user_name;
                            if(item.status === 4){
                                let $lastAppendedElement = $('.character-gallery-content').append(charaCloud.getCharacterDivBlock(item, charaCloudServer)).last();
                                //$('.character-gallery-content').append(`<div user_name="${data.name}" public_id_short="${item.public_id_short}" class="user_profile_character"><div class="user_profile_character_container"><img class="user_profile_character_img" src="${charaCloudServer}/${data.name}/${item.public_id_short}.webp"><img class="user_profile_character_delete" src="./img/cross.png"></div></div>`);
                            
                                if(login === user_name.toLowerCase()){
                                    $('.character-gallery-content .characloud_character_block  .characloud_character_block_card').last().append('<img class="user_profile_character_delete" src="./img/cross.png">');
                                }
                            }
                        });
                        // Character on moderation
                        let is_show_new_moderation_gallery = false; //new-moderation-gallery
                        let is_show_edit_moderation_gallery = false; //new-moderation-gallery
                        
                        if(login === user_name.toLowerCase()){
                            // New characters
                            data.characters.forEach(function (item, i) {
                                
                                item.moderation = Boolean(item.moderation);
                                item.user_name = user_name.toLowerCase();
                                item.user_name_view = user_name;
                                if(item.moderation === true && item.status === 2){
                                    is_show_new_moderation_gallery = true;
                                    let $lastAppendedElement = $('.new-mod-character-gallery-content').append(charaCloud.getCharacterDivBlock(item, charaCloudServer, 'moderation')).last();
                                    //$('.character-gallery-content').append(`<div user_name="${data.name}" public_id_short="${item.public_id_short}" class="user_profile_character"><div class="user_profile_character_container"><img class="user_profile_character_img" src="${charaCloudServer}/${data.name}/${item.public_id_short}.webp"><img class="user_profile_character_delete" src="./img/cross.png"></div></div>`);
                                    $('.new-mod-character-gallery-content .characloud_character_block  .characloud_character_block_card').last().append('<img class="user_profile_character_delete" src="./img/cross.png">');
                                }
                                
                            });
                            if(is_show_new_moderation_gallery){
                                $('.new-mod-character-gallery').css('display', 'block');
                            }
                            
                            // Edited characters
                            data.characters.forEach(function (item, i) {
                                
                                item.moderation = Boolean(item.moderation);
                                item.user_name = user_name.toLowerCase();
                                item.user_name_view = user_name;
                                if(item.moderation === true && item.status === 4){
                                    is_show_edit_moderation_gallery = true;
                                    let $lastAppendedElement = $('.edit-mod-character-gallery-content').append(charaCloud.getCharacterDivBlock(item, charaCloudServer, 'moderation')).last();
                                    //$('.character-gallery-content').append(`<div user_name="${data.name}" public_id_short="${item.public_id_short}" class="user_profile_character"><div class="user_profile_character_container"><img class="user_profile_character_img" src="${charaCloudServer}/${data.name}/${item.public_id_short}.webp"><img class="user_profile_character_delete" src="./img/cross.png"></div></div>`);
                                    $('.edit-mod-character-gallery-content .characloud_character_block  .characloud_character_block_card').last().append('<img class="user_profile_character_delete" type="edit_moderation" src="./img/cross.png">');
                                }
                                
                            });
                            if(is_show_edit_moderation_gallery){
                                $('.edit-mod-character-gallery').css('display', 'block');
                            }
                        }
                        $('.lazy').lazyLoadXT({edgeX:500, edgeY:500});
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });

    }

    function showCharacterCardBlock() {
        hideAll();
        $('.url-data').css('display', 'none');
        $('#characloud_header_navigator_p2').css('display', 'inline-block');
        $('#characloud_header_navigator_c1').css('display', 'inline-block');
        
        $('#characloud_header_navigator_p3').css('display', 'inline-block');

        $('#characloud_header_navigator_c2').css('display', 'inline-block');
        
        $('.characloud_content').css('display', 'block');
        $('#characloud_bottom').css('display', 'flex');
        $('#characloud_character_page').css('display', 'grid');

    }
    async function showCharacterCard(data, type = 'prepublish'){ // actions with card: prepublish, select_online

        $('.publish_button').css('display', 'none');
        $('.update_button').css('display', 'none');
        $('.to_chat_button').css('display', 'none');
        $('.update_locally_button').css('display', 'none');
        $('.add_locally_button').css('display', 'none');
        $('.load_update_button').css('display', 'none');
        let character_data;
        let online_data;
        let image_size = data.image_size;
        
        showCharacterCardBlock();
        if (type === 'prepublish'){
            character_data = JSON.parse(data.character);
            if(character_data.user_name_view === undefined){
                if(login_view !== undefined){
                    $('#characloud_header_navigator_p2').text(login_view);
                }else{
                    $('#characloud_header_navigator_p2').text('User');
                }
                $('#characloud_header_navigator_p3').text('Publishing Character');
            }else{
                $('#characloud_header_navigator_p3').text(character_data.name);
                $('#characloud_header_navigator_p2').text(character_data.user_name_view);
            }
        }else if(type === 'select_online'){
            character_data = data.character_data;
            $('#characloud_header_navigator_p3').text(character_data.name);
            $('#characloud_header_navigator_p2').text(character_data.user_name_view);
        }

        if(character_data.nsfw === undefined){
            character_data.nsfw = false;
        }
        $('#editor_nsfw').prop('checked', character_data.nsfw);

        // Categories
        if (character_data.categories !== undefined) {

            let categories = character_data.categories;
            categories.forEach(function (item, i) {
                addCategory(item);
            });
        }

        
        // Online checking
        let character_data_online;
        let online_type_action = 'publish';
        if(character_data.online == true){
            character_data_online = await charaCloud.getCharacter(character_data.user_name, character_data.public_id_short)
            .then(function (ch_data_online) {
                return ch_data_online;
            })
            .catch(function (error) {
                console.log(error);
                return false;
            });
            if(character_data_online === false){
                online_type_action = 'publish';
            }else{
                online_type_action = 'update';
            }
        }else{
            online_type_action = 'publish';
        }
        
        
        // Print online buttons
        if(login !== undefined){
            if(login === character_data.user_name || character_data.user_name === undefined){
                if(online_type_action === 'publish'){ 
                    $('.publish_button').css('display', 'inline-block');
                }
                if(online_type_action === 'update'){ 
                    $('.update_button').css('display', 'inline-block');
                }
            }else{
                $('.url-data').css('display','inline-block');
                character_data.user_name = vl(character_data.user_name);
                character_data.public_id_short = vl(character_data.public_id_short);
                $('.url-data').text(`${charaCloudServer}/${character_data.user_name.toLowerCase()}/${character_data.public_id_short}`);
                $('.url-data').attr('url',`${charaCloudServer}/${character_data.user_name.toLowerCase()}/${character_data.public_id_short}`);
            }
        }else{
            
        }
        // Local checking
        charaCloud.cardeditor_id_local = -1;
        charaCloud.cardeditor_filename_local = undefined;
        if(character_data.public_id !== undefined){
            if(character_data.public_id != "undefined" && character_data.public_id.length > 0){
                charaCloud.cardeditor_id_local = Characters.getIDbyPublicID(character_data.public_id);
                if(charaCloud.cardeditor_id_local !== -1){
                    charaCloud.cardeditor_filename_local = Characters.id[charaCloud.cardeditor_id_local].filename;
                }
            }
        }

        printCharacterPageLocalButtons();
        // Next
        $('.characloud_character_page_avatar').children('img').attr('src', `cardeditor/${data.image}`);
        charaCloud.cardeditor_data = character_data;
        
        $('#name-input').val(character_data.name);
        $('#short-description-input').val(character_data.short_description);
        $('#personality-summary-input').val(character_data.personality);
        $('#scenario-textarea').val(character_data.scenario);
        textareaAutosize($('#scenario-textarea'));
        $('#description-textarea').val(character_data.description);
        textareaAutosize($('#description-textarea'));
        $('#dialogues-example-textarea').val(character_data.mes_example);
        textareaAutosize($('#dialogues-example-textarea'));
        $('#first-message-textarea').val(character_data.first_mes);
        textareaAutosize($('#first-message-textarea'));

        $('#avatar-info-name').text(character_data.name);
        let author;
        if (character_data.user_name_view !== undefined) {
            author = character_data.user_name_view;
        } else {
            author = login_view;
        }
        $('#avatar-info-author').text(`Author: ${author}`);
        $('#avatar-info-filesize').text(`File Size: ${parseFloat(image_size).toFixed(1)}kb`);
        
        let date = new Date(Number(character_data.create_date_online));
        if(character_data.create_date_online === undefined){
            date = new Date(Number(Date.now()));
        }
        

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        //console.log(`${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`);
        $('#avatar-info-creation-date').text(`Creation Date: ${date.toLocaleString(navigator.language, options).replace(',','')}`);
    }
    function printCharacterPageLocalButtons(){
        $('.characloud_character_page_top_info').text('');
        $('.add_locally_button').css('display', 'none');
        $('.update_locally_button').css('display', 'none');
        // Print local buttons
        if(charaCloud.cardeditor_id_local !== -1){
            $('.update_locally_button').css('display', 'inline-block');
            $('.characloud_character_page_top_info').text(Characters.id[charaCloud.cardeditor_id_local].filename);
        }else{
            
            $('.add_locally_button').css('display', 'inline-block');
        }
    }
    
    function hideAll() {
        $('#characloud_bottom').css('display', 'none');
        $('#user_profile_info_this_user').css('display', 'none');
        $('#user_profile_info_other_user').css('display', 'none');
        $('#characloud_category').css('display', 'none');
        $('#characloud_categories').css('display', 'none');
        $('#characloud_search_back_button').css('display', 'none');
        $('#characloud_search_block').css('display', 'none');
        $('.characloud_content').css('display', 'none');
        $('#characloud_character_page').css('display', 'none');
        $('#reg_login_popup_shadow').css('display', 'none');
        $('#characloud_user_profile_block').css('display', 'none');
        $('#characloud_characters').css('display', 'none');
        $('#characloud_board').css('display', 'none');
        $('#characloud_search_back_button').css('display', 'none');
        $('#characloud_search_block').css('display', 'none');
        
        $('#characloud_header_navigator_p2').css('display', 'none');
        $('#characloud_header_navigator_p3').css('display', 'none');
        $('#characloud_header_navigator_c1').css('display', 'none');
        $('#characloud_header_navigator_c2').css('display', 'none');
        
        $('.new-moderation-gallery').css('display', 'none');
        $('.edit-moderation-gallery').css('display', 'none');
        
        $('.category-list').html('');
    }
    $('#characloud_close_button').click(function(){
        hideCharaCloud();
    });
    $('#characloud_header_navigator_p1').click(function () {
        showMain();
    });
    $('#characloud_header_navigator_p2').click(function () {
        if($('#characloud_header_navigator_p2').text() === 'Category'){
            showCategories();
        }else{
            showUserProfile($('#characloud_header_navigator_p2').text());
        }
    });
    $('#user_profile_prev_button').click(function(){
        if(charaCloud.user_profile_page > 1){
            charaCloud.user_profile_page--;
            showUserProfile(charaCloud.user_profile_name);
        }
    });
    $('#user_profile_next_button').click(function(){
        if(charaCloud.user_profile_page < Math.ceil(charaCloud.user_page_characters_count/charaCloud.max_user_page_characters_count)){
            charaCloud.user_profile_page++;
            showUserProfile(charaCloud.user_profile_name);
        }
    });
    $('.character-gallery-content').on('click', '.user_profile_character', function () {
        const publicIdShort = $(this).attr('public_id_short');
        const userName = $(this).attr('user_name');
        const mode = $(this).attr('mode');
        selectCharacterCardOnline(userName, publicIdShort, mode);

        // Rest of your code to handle the click event goes here
    });
    $('#characloud_user_profile_block').on('click', '.user_profile_character_delete', function(event){
        event.stopPropagation();
        const type = $(this).attr('type');
        const publicIdShort = $(this).parent().parent().attr('public_id_short');
        const userName = $(this).parent().parent().attr('user_name');
        if(type === 'edit_moderation'){
            charaCloud.delete_character_user_name = userName;
            charaCloud.delete_character_public_id_short = publicIdShort;
            callPopup('<h3>Cancel editing?</h3>', 'del_ch_characloud_from_edit_moderation');
        }else{
            charaCloud.delete_character_user_name = userName;
            charaCloud.delete_character_public_id_short = publicIdShort;
            callPopup('<h3>Delete the character?</h3>', 'del_ch_characloud');
        }
        
    });
    function selectCharacterCardOnline(userName, publicIdShort, mode = 'default'){
        charaCloud.getCharacter(userName, publicIdShort, mode)
            .then(function (data) {
                $('#chara_cloud').scrollTop(0);
                showCharacterCard(data, 'select_online');
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
    }
    $("#characloud_upload_character_page_avatar").on("change", function (e) {
        charaCloud.changeCharacterAvatar(e)
            .then(function (data) {
                //
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {

                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
    });
    
    
    ///////////////////////////
    //********* Categories ********//
    var is_character_page_categories_show = false;
    $('#category-input-field').on('focus', function () {
        if (!is_character_page_categories_show) {
            $('.popular-categories').slideDown(200, function () {
                is_character_page_categories_show = true;
                //$(this).transit({ y: '3px' }, 50)
                //     .transit({ y: '-3px' }, 50)
                //   .transit({ y: '0px' }, 50);
            });
        }
    });


    $(document).on('click', function (e) {
        if (!$('.category-form').is(e.target) && $('.category-form').has(e.target).length === 0 && is_character_page_categories_show) {
            is_character_page_categories_show = false;
            $('.popular-categories').slideUp(200);
        }
    });
    
    $('#category-input-field').on('keypress', function (e) {

        if (e.which == 13) { // 13 is the code for the Enter key
            let category = $(this).val().trim();
            addCategory(vl(category));
        }
    });
    function addCategory(category) {
        category = window.DOMPurify.sanitize(category);
        let categoryRegex = /^[A-Za-z0-9_\- ]{1,32}$/;
        let existingCategories = $('.character-category').map(function () {
            return $(this).text().replace('x', '').trim().toLowerCase();
        }).get();
        if (existingCategories.includes(category.toLowerCase())) {
            //alert('This category has already been added.');
            $('#category-input-field').val('');
        } else if ($('.character-category').length < 12) {
            if (categoryRegex.test(category)) {
                $('#category-input-field').val('');
                $('.category-list').append('<div class="category character-category">' + category + '<span class="category-remove">x</span></div>');
                $(this).val('');
            } else {
                callPopup('Invalid category format. Categories can only contain letters, numbers, spaces, underscores, hyphens, and must be between 1 and 32 characters long.', 'alert_error');
            }
        } else {
            callPopup('You have reached the maximum number of categories allowed (12).', 'alert_error');
        }
    }
    $(document).on('click', '.character-category', function (e) {
        $(this).remove();
    });
    
    $('.popular-category').on('click', function () {
        let category = $(this).text().substr(2);
        addCategory(category);
        //$('.category-list').prepend('<div class="category character-category">' + category + '<span class="category-remove">x</span></div>');
    });
    $('#chara_cloud').on('click', '.characloud_characters_category_title', function () {
        let category = $(this).attr('category');
        showCategory(category);
        
    });
    function showCategory(category){
        charaCloud.getCharactersByCategory(category)
            .then(function (data) {
                let count_char_in_row = 10; 
                let characters_board = [];
                let category_show = category.replace('$', '');
                let end = 0;
                if (false) {
                    for (let i = 0; end < data.length; i++) {
                        const start = i * count_char_in_row;
                        end = start + count_char_in_row;
                        const anime_characters = data.slice(start, end);
                        characters_board.push({title: category_show, characters: data.slice(start, end)});
                    }
                }
                hideAll();
                $('#characloud_header_navigator_p2').css('display', 'inline-block');
                $('#characloud_header_navigator_c1').css('display', 'inline-block');
                $('#characloud_header_navigator_c2').css('display', 'inline-block');
                $('#characloud_header_navigator_p3').css('display', 'inline-block');

                $('#characloud_header_navigator_p2').text('Category');
                $('#characloud_header_navigator_p3').text(category_show);

                $('#characloud_category').html('');
                $('#characloud_category').css('display', 'block');
                $('.characloud_content').css('display', 'block');
                data.forEach(function (item, i) {

                    $('#characloud_category').append(charaCloud.getCharacterDivBlock(item, charaCloudServer));
                });
                $('.lazy').lazyLoadXT({edgeX:500, edgeY:500});

                //$('#characloud_characters').html('');
                //printCharactersBoard(characters_board);
                //$('#chara_cloud').scrollTop(0);

            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
    }
    function showCategories(){
        charaCloud.getCategories()
            .then(function (data) {

                hideAll();
                $('#characloud_bottom').css('display', 'flex');
                $('#characloud_header_navigator_p2').css('display', 'inline-block');
                $('#characloud_header_navigator_c1').css('display', 'inline-block');
                $('#characloud_header_navigator_p2').text('Category');
                $('#characloud_categories').css('display', 'block');
                $('.characloud_content').css('display', 'block');

                const $categoriesList = $('.categories-list');
                $categoriesList.html('');
                //$categoriesList.html('');
                let categories = [{name: '$recent', name_view: '$Recent'},{name: '$random', name_view: '$Random'}];

                categories = categories.concat(data);

                // loop through the categories array and create a category element for each one
                for (let i = 0; i < categories.length; i++) {
                    console.log(categories[i]);
                    const $category = $('<div>', {
                        class: 'category show-category',
                        text: categories[i].name_view,
                        // add a data attribute to store the category name
                        'data-category': categories[i].name
                    });
                    $categoriesList.append($category);
                }

                // add a click event listener to the categories
                $categoriesList.on('click', '.category', function () {
                    const category = $(this).data('category');
                    // do something with the selected category, e.g. navigate to a page that shows only that category's content
                    console.log('Selected category:', category);
                });
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    
                    default:
                        callPopup(`${error.msg}`, 'alert_error');
                        return;
                }
            });
    }
    $(document).on('click', '.show-category', function (e) {
        let category = $(this).text();
        showCategory(category);
    });

});
function handleError(jqXHR) { // Need to make one handleError and in script.js and in charaCloud.js
    let msg;
    let status;
    try {
        let msg_json = JSON.parse(jqXHR.responseText);
        msg = msg_json.error;
    } catch {
        msg = 'Unique error';
    }
    if (jqXHR.status !== undefined) {
        status = jqXHR.status;
    } else {
        status = 400;
    }
    if (status === 504) {
        msg = 'Server is not responding';
    }
    if (status === 429) {
        msg = 'Too many requests';
    }
    console.log(`Status: ${status}`);
    console.log(msg);
    return {'status': status, 'msg': msg};
}
document.getElementsByName("rm_search_bar")[0].addEventListener('keyup', search_chars);
function search_chars(){
    const character_list = document.querySelector('#rm_print_charaters_block').querySelectorAll('div.character_select');
    for (let i = 0; i < character_list.length; i++) {
        character_list[i].style.display = "";
        if (character_list[i].textContent.toLowerCase().indexOf(this.value.toLowerCase())<0){
            character_list[i].style.display = "none";
        }
    }
}
/*
function auto_start(){
    //console.log(main_api.value)

    if (main_api.value == "openai"){
        document.getElementById("api_button_openai").click()
    }
    else if (main_api.value == "novel"){
        document.getElementById("api_button_novel").click()
    }
    else if (main_api.value == "kobold"){
        document.getElementById("api_button").click()
    }
}
$(document).ready(function() {
    setTimeout(auto_start, 500)
})
 * */
