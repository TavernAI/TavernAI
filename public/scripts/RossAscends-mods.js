import {encode, decode} from "../scripts/gpt-2-3-tokenizer/mod.js";

import { Generate,
		getSettings,
		saveSettings,
		printMessages, 
		getChatResult, 
		getCharacters, 
		getUserAvatars, 
		clearChat, 
		getChat, 
		saveChat} from "../TAI-main.js";
		
	var safetychat = [{name: 'Chloe',is_user: false,is_name: true,create_date: 0,mes: '\n*You deleted a charcter and arrived back here for safety reasons! Pick another character!*\n\n'}];
	var RefreshByDelChar = false;
	var NavToggle = document.getElementById("nav-toggle");
	var PanelPin = document.getElementById("rm_button_panel_pin");


		//RossAscends: Added function to format dates used in files and chat timestamps to a humanized format.
			//Mostly I wanted this to be for file names, but couldn't figure out exactly where the filename save code was as everything seemed to be connected. 
			//During testing, this performs the same as previous date.now() structure.
			//It also does not break old characters/chats, as the code just uses whatever timestamp exists in the chat.
			//New chats made with characters will use this new formatting.
			//Useable variable is (( HumanizedDateTime ))
			export function humanizedISO8601DateTime() {
				let baseDate = new Date(Date.now());
				let humanYear = baseDate.getFullYear();
				let humanMonth = (baseDate.getMonth()+1);
				let humanDate = baseDate.getDate();
				let humanHour = (baseDate.getHours() < 10? '0' : '') + baseDate.getHours();
				let	humanMinute = (baseDate.getMinutes() < 10? '0' : '') + baseDate.getMinutes();
				let humanSecond = (baseDate.getSeconds() < 10? '0' : '') + baseDate.getSeconds();
				let humanMillisecond = (baseDate.getMilliseconds() < 10? '0' : '') + baseDate.getMilliseconds();
				let HumanizedDateTime = (humanYear+"-"+humanMonth+"-"+humanDate+" @"+humanHour+"h "+humanMinute+"m "+humanSecond+"s "+humanMillisecond+"ms");
				return HumanizedDateTime;
			};
		
		//RossAscends: a smaller load-up function to be used instead of refreshing the page in cases like deleting a character and changing username	
			export function RA_QuickRefresh(RefreshByDelChar){  
					console.log('RA_QR -- RefreshByDelChar: '+RefreshByDelChar);
					clearChat();
					
					//characters.length = 0		//if this could be enabled it would allow the GetCharacters function to detect files added or removed from the char dir on each panel load
					//console.log('RA_QR() -- active_character -- '+active_character);
					//console.log('RA_QR() -- this_chid -- '+this_chid);
					getSettings("def");
					getCharacters();
					getUserAvatars();
					//console.log(chat);
					printMessages();
					if(RefreshByDelChar == true||active_character == 'invalid-safety-id'){				// checks if we just deleted a character, and if so, deselect them and remove name from nav tab.
						console.log('RA_QR -- delete is true, clearing sel char tab');
						$( "#rm_button_selected_ch" ).css("class","deselected-right-tab");
						$( "#rm_button_selected_ch" ).children("h2").text('');
						RefreshByDelChar = false;
					}
					//console.log('QuickRefresh -- calling FixRememberedTabs');
					//FixRememberedTabs();
			}
		//RossAscends: utility function to focus tab with users's last viewed tab, used with autoloadchat	
			export function FixRememberedTabs(){
			//console.log('FixRememberedTabs -- starting -- target: '+selected_button);
			if(selected_button == 'characters'){
				$('#rm_button_characters').click();
				//console.log('FixRememberedTabs -- BAM -- clicked CHARACTERS LIST');
			}
			if(selected_button == 'settings'){
				$('#rm_button_settings').click();
				//console.log('FixRememberedTabs -- BAM -- clicked SETTINGS');
			}
			if(selected_button == 'character_edit'){
				$('#rm_button_selected_ch').click();
				//console.log('FixRememberedTabs -- BAM -- clicked EDITOR');
			}
		}
		//RossAscends: a utility function for counting characters, even works for unsaved characters. 
			export function RA_CountCharTokens(){
				$('#result_info').html('');
				if (selected_button == 'create'){
					var count_tokens = encode(JSON.stringify(create_save_description+create_save_personality+create_save_scenario+create_save_mes_example)).length;
					console.log('This unsaved character has '+count_tokens+' tokens in the defs.');
				}else{
					//console.log('TokenCounter -- trying to load tokens for -- '+this_chid);
				if(this_chid != undefined && this_chid !='invalid-safety-id'){
						var count_tokens = encode(JSON.stringify(characters[this_chid].description+characters[this_chid].personality+characters[this_chid].scenario+characters[this_chid].mes_example)).length;
						//console.log(characters[this_chid].name+' has '+count_tokens+' tokens in the defs.');
					}
				}

				if(count_tokens < 1024){
					$('#result_info').html(count_tokens+" Tokens");
                }else{
                    $('#result_info').html("<font color=red>"+count_tokens+" Tokens(TOO MANY TOKENS)</font>");
                }
			}
		//RossAscends: changes inpout bar and send but display depending on connection status
			export function RA_checkOnlineStatus(){
                //console.log(online_status);
                if(online_status == 'no_connection'){
					$("#send_textarea").attr('placeholder', "Not connected to API!");		//Input bar placeholder tells users they are not connected
					$("#send_form").css("background-color", "rgba(100,0,0,0.7)");			//entire input form area is red when not connected
					$("#send_but").css("display", "none");									//send button is hidden when not connected
                }else{
					$("#send_textarea").attr('placeholder', 'Type a message...');				//on connect, placeholder tells user to type message
					$("#send_form").css("background-color", "rgba(0,0,0,0.7)");					//on connect, form BG changes to transprent black
					$("#send_but").css("display", "inline");									//on connect, send button shows up
                }
                
            }		
		//RossAscends: updated character sorting to be alphabetical
			export function RA_CharListSort(){
                    characters.sort(function (a,b) { 
					//console.log('sorting characters: '+a.name+' vs '+b.name);
						if(a.name < b.name){	
							return -1
						}
						if (a.name > b.name) {
							return 1;
						}
						return 0;

					});
			}				
		//RossAscends: This is a copy of select_selected_char that doesn't force the edit_character tab to be displayed, used during AutoLoadChat to preserve last nav tab opened.
			async function RA_QuietCharSelect(active_character){
				console.log('RA_QCS -- load -- target: '+active_character);
				
				//var this_chid = active_character;
			
				if(active_character != undefined){
					console.log('RA_QCS -- start -- target: '+active_character);
					console.log('RA_QCS -- this_chid: '+this_chid);
					if (this_chid != 'invalid-safety-id') {
						var chid = active_character;
						var display_name = characters[chid].name;
						
						$( "#rm_button_selected_ch" ).children("h2").text(display_name);
				 
						var i = 0;
						while($( "#rm_button_selected_ch" ).width() > 170 && i < 100){
							display_name = display_name.slice(0,display_name.length-2);
							//console.log(display_name);
							$( "#rm_button_selected_ch" ).children("h2").text($.trim(display_name)+'...');
							i++;
						}
						$("#add_avatar_button").val('');
						$('#character_popup_text_h3').text(characters[chid].name);
						$("#character_name_pole").val(characters[chid].name);
						$("#description_textarea").val(characters[chid].description);
						$("#personality_textarea").val(characters[chid].personality);
						$("#firstmessage_textarea").val(characters[chid].first_mes);
						$("#scenario_pole").val(characters[chid].scenario);
						$("#mes_example_textarea").val(characters[chid].mes_example);
						$("#selected_chat_pole").val(characters[chid].chat);
						$("#create_date_pole").val(characters[chid].create_date);
						$("#avatar_url_pole").val(characters[chid].avatar);
						$("#chat_import_avatar_url").val(characters[chid].avatar);
						$("#chat_import_character_name").val(characters[chid].name);
						//$("#avatar_div").css("display", "none");
						var this_avatar = default_avatar;
						if(characters[chid].avatar != 'none'){
							this_avatar = "characters/"+characters[chid].avatar;
						}
						$("#avatar_load_preview").attr('src',this_avatar+"#"+Date.now());
						$("#name_div").css("display", "none");
						$("#form_create").attr("actiontype", "editcharacter");
						console.log('RA_QCS - calling RA_clearChat()');
						clearChat();
						chat.length = 0;
						console.log('RA_QCS - calling RA_getChat()');
						getChat();
						//console.log('QuietCharSelect -- calling FixRememberedTabs');
						FixRememberedTabs();
						//console.log('select_selected_character() -- active_character -- '+chid+'(ChID of '+display_name+')');
						saveSettings();
						console.log('RA_QCS -- done.');
					}
				}else{console.log('RA_QCS -- no defined character detected. chid='+chid+' active_char='+active_character)};
			}
		//RossAscends: auto-load last character function (fires when active_character is defined and auto_load_chat is true)					
			export function RA_autoloadchat(){
				jQuery.ajax({    
                    type: 'POST', 
                    url: '/getsettings', 
                    data: JSON.stringify({}),
                    beforeSend: function(){},
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data){
                        if(data.result != 'file not find'){
                            settings = JSON.parse(data.settings);
							//get the character to auto-load
							if(settings.active_character !== undefined){
                                if(settings.active_character !== ''){
									var active_character = settings.active_character;				
                                }
                           }
                        }
						if(auto_load_chat == true){
							console.log('RA_ALC -- function enabled');
							//console.log('RA_ALC -- incoming selected_button: '+selected_button);
							//var true_selected_button = selected_button;
							if (active_character !== undefined){
								console.log('RA_ALC -- targeting -- '+active_character);
								console.log('RA_ALC -- calling QCS -- selected_button as: '+selected_button);
								RA_QuietCharSelect(active_character);
								console.log('RA_ALC -- post QCS -- selected_button: '+selected_button);
								//selected_button = true_selected_button;
							}
							console.log('RA_ALC -- Done. Fixing Tabs.');
							FixRememberedTabs();
						}else{console.log('RA_ALC -- disabled')};
					},
					error: function (jqXHR, exception) {
                        console.log(exception);
                        console.log(jqXHR);
                    }
                });
			}	
		//RossAscends: auto-connect to last API function (fires when API URL exists in settings and auto_connect is true)		
			export function RA_autoconnect(){
					//console.log('autoconnect -- entered');
					jQuery.ajax({    
						type: 'POST', 
						url: '/getsettings', 
						data: JSON.stringify({}),
						beforeSend: function(){
						},
						cache: false,
						dataType: "json",
						contentType: "application/json",
						//processData: false, 
						success: function(data){
							if(data.result != 'file not find'){
								settings = JSON.parse(data.settings);
								if (settings.auto_connect == true){
									if(api_server !== ''){
										api_server = settings.api_server;
										$('#api_url_text').val(api_server);
										$('#api_button').click();	
									}
								}else{console.log('RA_AC -- disabled');}
							}
						},	
						error: function (jqXHR, exception) {
							console.log(exception);
							console.log(jqXHR);

						}
					});
								
				}
				
		// RossAscends: close the RightNav panel when user clicks outside of it or related panels (adv editing popup, or dialog popups)		
			$('document').ready(function(){
				$("html").click(function(e){
					if (NavToggle.checked === true && PanelPin.checked === false) {
						if ($(e.target).attr('id') !== "nav-toggle") {
							if (document.querySelector('#right-nav-panel').contains(e.target) === false){
								if (document.querySelector('#character_popup').contains(e.target) === false){
									if (document.querySelector('#dialogue_popup').contains(e.target) === false){
										document.getElementById('nav-toggle').click();
									}	
								}
							}
						}
					};
				});
			});
			
		//RossAscends: Additional hotkeys CTRL+ENTER and CTRL+UPARROW
			document.addEventListener('keydown', (event) => {
					if(event.ctrlKey && event.key == "Enter") {				// Ctrl+Enter for Regeneration Last Response
						console.log('detected CTRL+ENTER');
						console.log('is_send_press='+is_send_press);
						if(is_send_press == false){
							is_send_press = true;
							Generate('regenerate');
							
						}
					}else if(event.ctrlKey && event.key == "ArrowUp") {		//Ctrl+UpArrow for Connect to last server
						console.log('detected CTRL+UP');
						document.getElementById('api_button').click();

					}
				});	
			
		//RossAscends: saving the state of the right nav panel lock toggle and the open/closed state of nav panel itself
			$('#nav-toggle').change(function() {
				NavOpenClosePref = NavToggle.checked;
				//console.log('NavToggle sensor: '+NavOpenClosePref);
				//console.log('RA -- trying to save');
				saveSettings();
				});
		//RossAscends: saves the state of the right nav lock between page loads
            $('#rm_button_panel_pin').change(function() {
                stickyNavPref = PanelPin.checked;
				//console.log('Pin Change -- Sticky: '+stickyNavPref+', NavOpen: '+NavOpenClosePref);
				//console.log('RA -- trying to save');
                saveSettings();
            });
		//RossAscends: detects changes in the power users settings checkboxes	
			$('#auto-connect-checkbox').change(function() {
                auto_connect = !!$('#auto-connect-checkbox').prop('checked');
				//console.log('RA -- trying to save');
                saveSettings();
            });
			$('#auto-load-chat-checkbox').change(function() {
                auto_load_chat = !!$('#auto-load-chat-checkbox').prop('checked');
				//console.log('RA -- trying to save');
                saveSettings();
            });

