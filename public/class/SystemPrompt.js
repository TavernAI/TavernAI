//import {Main.requestTimeout, main_api, singleline} from "../script.js";
import * as Main from "../script.js";
import {Tavern} from "./Tavern.js";
import {EventEmitter} from "./EventEmitter.mjs";

export class SystemPromptModule extends EventEmitter {
    static SAVE_SETTINGS = "save_settings";
    empty_prest_id = '(empty)';
    constructor() {
        super();
        var presets = {};
        var selected_preset_name; 
        var system_prompt = '';
        var jailbreak_prompt = '';
        var user_jailbreak_prompt = '';
        var saveRangeTimer;
        //this.is_online = false;
        const self = this;
        this.Save = this.Save.bind(this);
        
        
        //Save events
        $(document).on('input', '#system_prompt_textarea', function () {
            self.system_prompt = $(this).val();
            self.presets[self.selected_preset_name].system_prompt = self.system_prompt;
            self.saveRangeTimer = setTimeout(self.Save, 500);
        });
        $(document).on('input', '#jailbreak_prompt_textarea', function () {
            self.jailbreak_prompt = $(this).val();
            self.presets[self.selected_preset_name].jailbreak_prompt = self.jailbreak_prompt;
            self.saveRangeTimer = setTimeout(self.Save, 500);
        });
        $(document).on('input', '#user_jailbreak_prompt_textarea', function () {
            self.user_jailbreak_prompt = $(this).val();
            self.presets[self.selected_preset_name].user_jailbreak_prompt = self.user_jailbreak_prompt;
            self.saveRangeTimer = setTimeout(self.Save, 500);
        });
        $('#system_prompt_new_button').click(function(){
            let new_name = prompt("Please enter a new preset name:");
            if (new_name !== null) {
                jQuery.ajax({
                    type: 'POST',
                    url: '/systemprompt_new',
                    data: JSON.stringify({
                        preset_name: new_name,
                        create_date: Date.now(),
                        edit_date: Date.now(),
                        system_prompt: '',
                        jailbreak_prompt: '',
                        user_jailbreak_prompt: ''
                    }),
                    beforeSend: function () {


                    },
                    cache: false,
                    timeout: 3000,
                    dataType: "json",
                    contentType: "application/json",
                    //processData: false, 
                    success: function (data) {
                        //online_status = data.result;
                        //$('#system_prompt_preset_selector').append(`<option value="${new_name}">${new_name}</option>`);
                        self.selected_preset_name = data.preset_name;
                        self.emit(SystemPromptModule.SAVE_SETTINGS, {});
                        self.Load();
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                        console.log(jqXHR);

                    }
                });
            }
        });
        
        $("#system_prompt_preset_selector").change(function () {
            
            self.selected_preset_name = $('#system_prompt_preset_selector').find(":selected").val();
            self.system_prompt = self.presets[self.selected_preset_name].system_prompt;
            self.jailbreak_prompt = self.presets[self.selected_preset_name].jailbreak_prompt;
            self.user_jailbreak_prompt = self.presets[self.selected_preset_name].user_jailbreak_prompt;
            self.printPreset();
            self.emit(SystemPromptModule.SAVE_SETTINGS, {});
        });
        
        $('#system_prompt_delete_button').click(function(){
            self.Delete(self.selected_preset_name);
        });

    }
    Save() {
        const self = this;
        jQuery.ajax({
            type: 'POST',
            url: '/systemprompt_save',
            data: JSON.stringify({
                preset_name: self.selected_preset_name,
                create_date: Date.now(),
                edit_date: Date.now(),
                system_prompt: $('#system_prompt_textarea').val(),
                jailbreak_prompt: $('#jailbreak_prompt_textarea').val(),
                user_jailbreak_prompt: $('#user_jailbreak_prompt_textarea').val()
            }),
            beforeSend: function () {


            },
            cache: false,
            timeout: 3000,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function (data) {
                //online_status = data.result;

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);

            }
        });
    }
    
    Load(preset_name = undefined) {
        const self = this;

        jQuery.ajax({
                type: 'POST',
            url: '/systemprompt_get',
            data: JSON.stringify({}),
            beforeSend: function () {


            },
            cache: false,
            timeout: 3000,
            dataType: "json",
            contentType: "application/json",
            //processData: false, 
            success: function (data) {
                data[self.empty_prest_id] = {};
                data[self.empty_prest_id].preset_name = '(Empty)';
                data[self.empty_prest_id].create_date = 99999999999900000;
                data[self.empty_prest_id].edit_date = 99999999999900000;
                data[self.empty_prest_id].system_prompt = '';
                data[self.empty_prest_id].jailbreak_prompt = '';
                data[self.empty_prest_id].user_jailbreak_prompt = '';
                const sortedData = Object.entries(data)
                .sort(([key1, value1], [key2, value2]) => value2.create_date - value1.create_date)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                self.presets = sortedData;
                $('#system_prompt_preset_selector').empty();
                Object.keys(self.presets).forEach(key => {
                    $('#system_prompt_preset_selector').append(`<option value="${key}">${self.presets[key].preset_name}</option>`);
                });
                if(preset_name !== undefined){
                    self.select(preset_name);
                    $('#system_prompt_preset_selector option[value="'+self.selected_preset_name+'"]').attr('selected', 'true');
                }else{
                    $('#system_prompt_preset_selector option[value="'+self.selected_preset_name+'"]').attr('selected', 'true');
                    self.printPreset();
                }

            },
            error: function (jqXHR, exception) {
                console.log(exception);
                console.log(jqXHR);

            }
        });
    }
    Delete(del_name) {
        const self = this;
        if(del_name !== self.empty_prest_id){
        const confirmed = confirm(`Are you sure you want to delete ${del_name} preset?`);

        if (confirmed) {
            jQuery.ajax({
                type: 'POST',
                url: '/systemprompt_delete',
                data: JSON.stringify({
                    preset_name: del_name
                }),
                beforeSend: function () {


                },
                cache: false,
                timeout: 3000,
                dataType: "json",
                contentType: "application/json",
                //processData: false, 
                success: function (data) {
                    //online_status = data.result;
                    //$('#system_prompt_preset_selector').append(`<option value="${new_name}">${new_name}</option>`);

                    self.selected_preset_name = self.empty_prest_id;
                    self.emit(SystemPromptModule.SAVE_SETTINGS, {});
                    self.Load();
                },
                error: function (jqXHR, exception) {
                    console.log(exception);
                    console.log(jqXHR);

                }
            });
        }
    }else{
        alert(`Can't delete empty preset`);
    }
    }
    printPreset(){
        const self = this;
        if(self.selected_preset_name !== undefined){
            self.system_prompt = self.presets[self.selected_preset_name].system_prompt;
            self.jailbreak_prompt = self.presets[self.selected_preset_name].jailbreak_prompt;
            self.user_jailbreak_prompt = self.presets[self.selected_preset_name].user_jailbreak_prompt;

            $("#system_prompt_textarea").val(self.system_prompt);

            $("#jailbreak_prompt_textarea").val(self.jailbreak_prompt);

            $("#user_jailbreak_prompt_textarea").val(self.user_jailbreak_prompt);
        }
    }
    
    select(preset_name) {
        const self = this;
        self.selected_preset_name = preset_name;

        if(self.presets[self.selected_preset_name] !== undefined){
            self.selected_preset_name = preset_name;
        }else{
            self.selected_preset_name = self.empty_prest_id;
        }
        $('#system_prompt_preset_selector').val(self.selected_preset_name);
        self.printPreset();
        
    }
    selectWithLoad(preset_name){
        const self = this;
        self.Load(preset_name);
    }
}