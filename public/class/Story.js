//import {Main.requestTimeout, main_api, singleline} from "../script.js";
import * as Main from "../script.js";
import {Tavern} from "./Tavern.js";
import {EventEmitter} from "./EventEmitter.mjs";

export class StoryModule extends EventEmitter {
    static SAVE_CHAT = "save_chat";
    static CONVERT_CHAT = "convert_chat";
    static UPDATE_HORDE_STATUS = "update_horde_status";
    static CONVERT_ALERT = "convert_alert";
    constructor() {
        super();
        //this.is_online = false;
        const self = this;
        $('#chat_story_button').click(function(){
            if (Main.Characters.selectedID !== undefined) {
                if (Main.chat.length > 1) {
                    self.emit(StoryModule.CONVERT_ALERT, {});
                } else {
                    self.ConvertChatStory();
                }
            } else {
                alert('Сharacter is not selected');
            }
        });
        $(document).on('input', '#story_textarea', function () {
            //let this_story = $('#story_textarea').val();
            var saveStoryRangeTimer = setTimeout(self.emit(StoryModule.SAVE_CHAT, {}), 500);
        });
       
    }
    ConvertChatStory(){
        const self = this;
        if (Main.Characters.selectedID !== undefined) {
            if (Tavern.mode === 'chat') {
                Tavern.mode = 'story';
            } else if (Tavern.mode === 'story') {
                Tavern.mode = 'chat';
            }
            self.emit(StoryModule.CONVERT_CHAT, {});
            self.showHide();
        }
    }
    showHide(){
        if(Tavern.mode === 'story'){
            $('#chat').css('display', 'none');
            $('#story').css('display', 'block');
            $('#chat_story_button_story_text').css('opacity', 1.0);
            $('#chat_story_button_chat_text').css('opacity', 0.5);
            
            //sub menu
            $('#option_delete_mes').css('display', 'none');
            $('#option_regenerate').css('display', 'none');
            $('#option_toggle_notes').css('display', 'none');
            return;
        }
        if(Tavern.mode === 'chat'){
            $('#chat').css('display', 'block');
            $('#story').css('display', 'none');
            $('#chat_story_button_story_text').css('opacity', 0.5);
            $('#chat_story_button_chat_text').css('opacity', 1.0);
            
            //sub menu
            $('#option_delete_mes').css('display', 'block');
            $('#option_regenerate').css('display', 'block');
            $('#option_toggle_notes').css('display', 'block');
            return;
        }
    }
    Generate(){
        const self = this;
        if(!(Main.online_status != 'no_connection' && Main.Characters.selectedID != undefined)){
            Tavern.is_send_press = false;
            return;
        }
        Main.Characters.id[Main.Characters.selectedID].last_action_date = Date.now();
        $('#rm_folder_order').change();
        let this_gap_holder = Main.gap_holder;
        if ((Main.main_api === 'openai' || Main.main_api === 'proxy') && Main.isChatModel()){
            this_gap_holder = parseInt(Main.amount_gen_openai)+this_gap_holder;
        }
        let prompt;
        let pre_prompt;
        let memory = '';
        let generate_data;
        let this_amount_gen;
        var this_max_context = 1487;
        if (Main.main_api == 'kobold') this_max_context = Main.max_context;
        if (Main.main_api == 'horde') this_max_context = Main.max_context;
        if (Main.main_api == 'novel') {
            if (Main.novel_tier === 1) {
                this_max_context = 1024;
            } else {
                this_max_context = 2048 - 60;//fix for fat tokens 
                if (Main.model_novel === 'krake-v2') {
                    this_max_context -= 160;
                }
                if (Main.model_novel === 'clio-v1') {
                    this_max_context = 8192;
                    this_max_context -= 160;//fix for fat tokens 
                }
            }
        }
        if (Main.main_api === 'openai' || Main.main_api === 'proxy') this_max_context = Main.max_context_openai;
        
        //Prepare prompt
        if($('#send_textarea').val().length > 0){
            if($.trim($('#story_textarea').val().length) > 0){
                $('#story_textarea').val($('#story_textarea').val()+'\n'+$('#send_textarea').val());
            }else{
                $('#story_textarea').val($('#send_textarea').val());
            }
        }
        $('#send_textarea').val('');
        pre_prompt = $('#story_textarea').val();
        
        if(Main.Characters.selectedID !== undefined){
            if($.trim(Main.Characters.id[Main.Characters.selectedID].description).length > 0){
                memory += Main.Characters.id[Main.Characters.selectedID].description+'\n';
            }
        }
        let thisTokensCount = Main.getTokenCount(memory+pre_prompt)+this_gap_holder;
        while(thisTokensCount > this_max_context){
            let difference = thisTokensCount - this_max_context;
            pre_prompt = pre_prompt.substring(Math.floor(difference*2.5));
            if(pre_prompt <= 0){
                alert('Promt does not fit into the context.');
                break;
                //need to add error handler for this
            }
            thisTokensCount = Main.getTokenCount(memory+pre_prompt)+this_gap_holder;
        }
        if ((Main.main_api === 'openai' || Main.main_api === 'proxy') && Main.isChatModel()){
            prompt = [];
            prompt[0] = {"role": "assistant", "content": memory};
            //prompt[1] = {"role": "system", "content": $('#system_prompt_textarea').val()};
            prompt[1] = {"role": "assistant", "content": pre_prompt};
            //prompt[3] = {"role": "system", "content": $('#jailbreak_prompt_textarea').val()};
            
        }else{
            prompt = pre_prompt = memory+pre_prompt;
        }
        
        //Prepare send data
        
        
        switch (Main.main_api) {
            case 'kobold':
                this_amount_gen = parseInt(Main.amount_gen);
                break;
            case 'novel':
                this_amount_gen = parseInt(Main.amount_gen_novel);
                break;
            case 'openai':
                this_amount_gen = parseInt(Main.amount_gen_openai);
                break;
            case 'proxy':
                this_amount_gen = parseInt(Main.amount_gen_openai);
                break;
        }
        if (Main.main_api === 'kobold') {
            generate_data = {prompt: prompt, gui_settings: true, max_context_length: this_max_context, singleline: Main.singleline};
            if (Main.preset_settings !== 'gui') {

                var this_settings = Main.koboldai_settings[Main.koboldai_setting_names[Main.preset_settings]];


                generate_data = {prompt: prompt,
                    gui_settings: false,
                    max_context_length: parseInt(this_max_context), //this_settings.max_length,
                    max_length: this_amount_gen, //parseInt(amount_gen),
                    rep_pen: parseFloat(Main.rep_pen),
                    rep_pen_range: parseInt(Main.rep_pen_size),
                    rep_pen_slope: parseFloat(Main.rep_pen_slope),
                    temperature: parseFloat(Main.temp),
                    tfs: parseFloat(Main.tfs),
                    top_a: parseFloat(Main.top_a),
                    top_k: parseInt(Main.top_k),
                    top_p: parseFloat(Main.top_p),
                    typical: parseFloat(Main.typical),
                    singleline: Main.singleline,
                    s1: this_settings.sampler_order[0],
                    s2: this_settings.sampler_order[1],
                    s3: this_settings.sampler_order[2],
                    s4: this_settings.sampler_order[3],
                    s5: this_settings.sampler_order[4],
                    s6: this_settings.sampler_order[5],
                    s7: this_settings.sampler_order[6]
                };
            }
        }
        if (Main.main_api == 'novel') {
            var this_settings = Main.novelai_settings[Main.novelai_setting_names[Main.preset_settings_novel]];
            generate_data = {"input": prompt,
                "model": Main.model_novel,
                "use_string": true,
                "temperature": parseFloat(Main.temp_novel),
                "max_length": this_amount_gen,
                "min_length": this_settings.min_length,
                "tail_free_sampling": parseFloat(Main.tfs_novel),
                "top_a": parseFloat(Main.top_a_novel),
                "top_k": parseInt(Main.top_k_novel),
                "top_p": parseFloat(Main.top_p_novel),
                "typical_p": parseFloat(Main.typical_novel),
                "repetition_penalty": parseFloat(Main.rep_pen_novel),
                "repetition_penalty_range": parseInt(Main.rep_pen_size_novel),
                "repetition_penalty_slope": parseFloat(Main.rep_pen_slope_novel),
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
        if (Main.main_api == 'horde') {
            // Same settings as Kobold?
            let this_settings = Main.koboldai_settings[Main.koboldai_setting_names[Main.preset_settings]];
            this_amount_gen = parseInt(Main.amount_gen);

            if (Main.horde_api_key == null) {
                Main.horde_api_key = "0000000000";
            }

            generate_data = {
                "prompt": prompt,
                "horde_api_key": Main.horde_api_key,
                "n": 1,
                "frmtadsnsp": false,
                "frmtrmblln": false,
                "frmtrmspch": false,
                "frmttriminc": false,
                "max_context_length": parseInt(Main.max_context),
                "max_length": Main.this_amount_gen,
                "rep_pen": parseFloat(Main.rep_pen),
                "rep_pen_range": parseInt(Main.rep_pen_size),
                "rep_pen_slope": this_settings.rep_pen_slope,
                "singleline": Main.singleline || false,
                "temperature": parseFloat(Main.temp),
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
                "models": [Main.horde_model]
            };
        }

        if (Main.main_api === 'openai' || Main.main_api === 'proxy') {
            let this_model_gen;
            if (Main.main_api === 'openai') {
                this_model_gen = Main.model_openai;
            } else if (Main.main_api === 'proxy') {
                this_model_gen = Main.model_proxy;
            }
            generate_data = {
                "model": Main.model_openai,
                "temperature": parseFloat(Main.temp_openai),
                "frequency_penalty": parseFloat(Main.freq_pen_openai),
                "presence_penalty": parseFloat(Main.pres_pen_openai),
                "top_p": parseFloat(Main.top_p_openai),
                "stop": ['<|endoftext|>'],
                "max_tokens": this_amount_gen
            };

            if (Main.isChatModel()) {
                generate_data.messages = prompt;
            } else {
                generate_data.prompt = prompt;
            }

        }
        var generate_url = '';
        if (Main.main_api == 'kobold') {
            generate_url = '/generate';
        }
        if (Main.main_api == 'novel') {
            generate_url = '/generate_novelai';
        }
        // HORDE
        if (Main.main_api == 'horde') {
            generate_url = '/generate_horde';
        }
        if (Main.main_api === 'openai' || Main.main_api === 'proxy') {
            generate_url = '/generate_openai';
        }    
        $( "#send_button" ).css("display", "none");
        $( "#loading_mes" ).css("display", "block");

        jQuery.ajax({
            type: 'POST', //
            url: generate_url, //
            data: JSON.stringify(generate_data),
            beforeSend: function(){
                //$('#create_button').attr('value','Creating...');
            },
            cache: false,
            timeout: Main.requestTimeout,
            dataType: "json",
            contentType: "application/json",
            success: self.generateCallback.bind(this),
            error: function (jqXHR, exception) {
                console.error(jqXHR, exception);

                $("#send_textarea").removeAttr('disabled');
                Tavern.is_send_press = false;
                $( "#send_button" ).css("display", "block");
                $( "#loading_mes" ).css("display", "none");

                //callPopup(exception, 'alert_error');

                console.log(exception);
                console.log(jqXHR);
            }
        });
    }
    generateCallback(data){
        const self = this;
        if (data.error != true) {
            var getPrompt = '';
            if (Main.main_api == 'kobold') {
                getPrompt = data.results[0].text;
            }
            if (Main.main_api == 'novel') {
                getPrompt = data.output;
            }
            if (Main.main_api == 'horde') {
                if (!data.generations || !data.generations.length) {
                    console.log("Horde generation request started.");
                    Tavern.hordeCheck = true;
                    self.emit(StoryModule.UPDATE_HORDE_STATUS, {});
                    return;
                } else {
                    console.log("Horde generation request finished.");
                    getPrompt = data.generations[0].text;
                }
            }
            if (Main.main_api === 'openai' || Main.main_api === 'proxy') {
                if (Main.isChatModel()) {
                    getPrompt = data.choices[0].message.content + ' ';
                } else {
                    getPrompt = data.choices[0].text;
                }
            }
            if (getPrompt.length > 0) {
                $('#story_textarea').val($('#story_textarea').val() + getPrompt);
                if (true) {
                    self.emit(StoryModule.SAVE_CHAT, {});
                    //saveChat();
                } else {
                    //saveChatRoom();
                }

            } else {

                //callPopup('The model returned empty message', 'alert');

            }
            $("#send_button").css("display", "block");
            $("#loading_mes").css("display", "none");
            Tavern.is_send_press = false;


        } else {
            console.error(data);
            if (data.error_message) {
                //callPopup(data.error_message, 'alert_error');
            }
            Tavern.is_send_press = false;
            $("#send_button").css("display", "block");
            $("#loading_mes").css("display", "none");
        }
    }
}