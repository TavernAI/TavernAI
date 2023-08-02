import * as GPT_CUSTOM from "../scripts/gpt-2-3-tokenizer/mod.js";
import {Tavern} from "./Tavern.js";
import * as Main from "../script.js";
import {EventEmitter} from "./EventEmitter.mjs";

export class TokenizerModule extends EventEmitter {
    static ALERT = "alert";
    constructor() {
        super();
        const self = this;
    }
    
    async encode(prompt){
        const self = this;
        if(Main.main_api == 'webui' && Main.online_status != 'no_connection' && Main.online_status != 'None'){
            
            const response = await jQuery.ajax({    
                type: 'POST', // 
                url: '/tokenizer_webui', // 
                data: JSON.stringify({
                        prompt: prompt
                    }),
                beforeSend: function(){

                },
                cache: false,
                timeout: Main.requestTimeout,
                dataType: "json",
                crossDomain: true,
                contentType: "application/json",
                //processData: false, 
                success: function(data){
                    //console.log(prompt, data.results[0].tokens);

                },
                error: function (jqXHR, exception) {
                    $("#send_textarea").removeAttr('disabled');
                    Tavern.is_send_press = false;
                    $( "#send_button" ).css("display", "block");
                    $( "#loading_mes" ).css("display", "none");

                    //callPopup(exception, 'alert_error');
                    self.emit(TokenizerModule.ALERT, {type: 'alert_error', error: exception});
                    console.log(exception);
                    console.log(jqXHR);
                    
                }
            });
            return response.results[0].tokens;
        }else{
            return GPT_CUSTOM.encode(prompt).length;
        }
    }
    encodeOffline(prompt){
        return GPT_CUSTOM.encode(prompt).length;
    }
}

