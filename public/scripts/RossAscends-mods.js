import { encode } from "../scripts/gpt-2-3-tokenizer/mod.js";

import {
	Generate,
	getSettings,
	saveSettings,
	printMessages,
	getCharacters,
	getUserAvatars,
	clearChat,
	getChat} from "../TAI-main.js";

var NavToggle = document.getElementById("nav-toggle");
var PanelPin = document.getElementById("rm_button_panel_pin");
var SelectedCharacterTab = document.getElementById("rm_button_selected_ch");
var RightNavPanel = document.querySelector('#right-nav-panel');
var AdvancedCharDefsPopup = document.querySelector('#character_popup');
var ConfirmationPopup = document.querySelector('#dialogue_popup');

var active_character;

//RossAscends: Added function to format dates used in files and chat timestamps to a humanized format.
//Mostly I wanted this to be for file names, but couldn't figure out exactly where the filename save code was as everything seemed to be connected. 
//Does not break old characters/chats, as the code just uses whatever timestamp exists in the chat.
//New chats made with characters will use this new formatting.
//Useable variable is (( HumanizedDateTime ))
export function humanizedISO8601DateTime() {
	let baseDate = new Date(Date.now());
	let humanYear = baseDate.getFullYear();
	let humanMonth = (baseDate.getMonth() + 1);
	let humanDate = baseDate.getDate();
	let humanHour = (baseDate.getHours() < 10 ? '0' : '') + baseDate.getHours();
	let humanMinute = (baseDate.getMinutes() < 10 ? '0' : '') + baseDate.getMinutes();
	let humanSecond = (baseDate.getSeconds() < 10 ? '0' : '') + baseDate.getSeconds();
	let humanMillisecond = (baseDate.getMilliseconds() < 10 ? '0' : '') + baseDate.getMilliseconds();
	let HumanizedDateTime = (humanYear + "-" + humanMonth + "-" + humanDate + " @" + humanHour + "h " + humanMinute + "m " + humanSecond + "s " + humanMillisecond + "ms");
	return HumanizedDateTime;
}
//RossAscends: delete characters and change username without reloading the whole page
export function RA_QuickRefresh(RefreshByDelChar) {
	//console.log('RA_QR -- RefreshByDelChar: ' + RefreshByDelChar);
	
	if(this_chid !== undefined){
		if(this_chid !== ''){
			if(this_chid !== 'invalid-safety-id'){
				active_character= this_chid;
				chid = this_chid;
			}
		}
	}

	clearChat();
	console.log('RA_QR() -- settings.active_character: '+settings.active_character);
	console.log('RA_QR() -- active_character -- '+active_character);
	console.log('RA_QR() -- this_chid -- '+this_chid);
	console.log('RA_QR() -- chid -- '+chid);
	getSettings("def");
	getCharacters();
	getUserAvatars();
	printMessages();
	RA_CountCharTokens();
	//check for a deleted character, and if so clear the selected character tab's name
	if(active_character !== undefined && active_character !== 'invalid-safety-id'){}
	if (RefreshByDelChar == true || active_character == 'invalid-safety-id') {
		$(SelectedCharacterTab).css("class", "deselected-right-tab");
		$(SelectedCharacterTab).children("h2").text('');
		RefreshByDelChar = false;
	}
	console.log('RA_QR >> saveSettings');
	saveSettings();
	//console.log('QuickRefresh -- calling FixRememberedTabs');
	//FixRememberedTabs();
}
//RossAscends: utility function to focus tab with users's last viewed tab, used with autoloadchat	
export function FixRememberedTabs() {
	//console.log('FixRememberedTabs -- starting -- target: '+selected_button);
	if (selected_button == 'characters') {
		$('#rm_button_characters').click();
		//console.log('FixRememberedTabs -- BAM -- clicked CHARACTERS LIST');
	}
	if (selected_button == 'settings') {
		$('#rm_button_settings').click();
		//console.log('FixRememberedTabs -- BAM -- clicked SETTINGS');
	}
	if (selected_button == 'character_edit') {
		$('#rm_button_selected_ch').click();
		//console.log('FixRememberedTabs -- BAM -- clicked EDITOR');
	}
}

//RossAscends: a faster utility function for counting characters, even works for unsaved characters. 
export function RA_CountCharTokens() {
	$('#result_info').html('');
	//console.log('RA_TokenCounter online');
	if (selected_button == 'create') {				// if we are making a new character, we count the temporary variables
		
		//total tokens in the char defs, including those that will be removed from context once chat history is long
		var count_tokens = encode(JSON.stringify(
			create_save_name + 
			create_save_description + 
			create_save_personality + 
			create_save_scenario + 
			create_save_first_message + 

			create_save_mes_example
		)).length;

		//permanent tokens that will never get flushed out of context
		var perm_tokens = encode(JSON.stringify(
			create_save_name + 
			create_save_description + 
			create_save_personality + 
			create_save_scenario
		)).length;
	} else {	//if it's not a new character, then it must be a presaved character we are loading

		//only exception is if we just deleted a character (which forces chid=invalid-safety-id) or some error with loading happens
		if (this_chid !== undefined && this_chid !== 'invalid-safety-id') { 

			//same as above, all tokens including temporary ones
			var count_tokens = encode(JSON.stringify(
				characters[this_chid].description + 
				characters[this_chid].personality + 
				characters[this_chid].scenario + 
				characters[this_chid].firstmessage_textarea + 
				characters[this_chid].mes_example
			)).length;

			//permanent tokens count
			var perm_tokens = encode(JSON.stringify(
				characters[this_chid].name + 
				characters[this_chid].description + 
				characters[this_chid].personality + 
				characters[this_chid].scenario
			)).length;
		}
	}

	if (count_tokens < 1024) {
		if (perm_tokens < 1024) {
			$('#result_info').html(count_tokens + " Tokens ("+perm_tokens+" Permanent Tokens)");
		}
	}else{
		$('#result_info').html("<font color=red>" + count_tokens + " Tokens ("+perm_tokens+" Permanent Tokens)(TOO MANY)</font>");
	}
}

$(document).on("click", ".character_select", function () {
	RA_CountCharTokens();           
});

$('#rm_ch_create_block').on('input', function () {
	RA_CountCharTokens();           
});
$('#character_popup').on('input', function () {
	RA_CountCharTokens();           
});



//RossAscends: updated character sorting to be alphabetical
export function RA_CharListSort() {
	characters.sort(Intl.Collator().compare)
}
//RossAscends: auto-load last character (fires when active_character is defined and auto_load_chat is true)					
async function RA_autoloadchat() {

	if (active_character !== undefined) {
		console.log('RA_ALC -- active_charcter is defined');
		if (active_character !== '') {
			console.log('RA_ALC -- active_charcter not "")');
			active_character = settings.active_character;
			this_chid = active_character;
		}
	}
	console.log('RA_ALC - target: ' + active_character + ' (' + this_chid + ', ' + chid + ', ' + characters[this_chid].name + ')');

	if (this_chid != 'invalid-safety-id') {
		var display_name = characters[chid].name;
		$(SelectedCharacterTab).children("h2").text(display_name);
		var i = 0;
		while ($(SelectedCharacterTab).width() > 170 && i < 100) {						// shrink the char name in tab if width >170px
			display_name = display_name.slice(0, display_name.length - 2);				// reduce by 2 characters
			$(SelectedCharacterTab).children("h2").text($.trim(display_name) + '...');	// add ... at the end
			i++;																		// repeat until it fits
		}
		// loads character attributes into their respective textareas
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
		var this_avatar = default_avatar;										// flush avatar to default
		if (characters[chid].avatar != 'none') {								// look for avatar in sel'd char
			this_avatar = "characters/" + characters[chid].avatar;				// apply avatar if found
		}
		$("#avatar_load_preview").attr('src', this_avatar + "#" + Date.now());	//loads the avatar in editChar Panel
		$("#name_div").css("display", "none");									// hides name input as usual
		$("#form_create").attr("actiontype", "editcharacter");					// sets formcreate to edit mode
		//console.log('RA_ALC - calling RA_clearChat()');
		clearChat();															// clears chat
		chat.length = 0;
		//console.log('RA_ALC - calling RA_getChat()'); //?
		getChat();																// gets chat for the character
		FixRememberedTabs();													// sets remembered tab back
		console.log('RA_ALC >>>> saving.');
		saveSettings();															// saves		
		
	}else{
		console.log('RA_ALC -- found invalid chid ('+active_character+'). Stopping.');
	}
	FixRememberedTabs();
	}			


//RossAscends: changes inpout bar and send but display depending on connection status
async function RA_checkOnlineStatus() {
	if (online_status == 'no_connection') {
		$("#send_textarea").attr('placeholder', "Not connected to API!");		//Input bar placeholder tells users they are not connected
		$("#send_form").css("background-color", "rgba(100,0,0,0.7)");			//entire input form area is red when not connected
		$("#send_but").css("display", "none");									//send button is hidden when not connected;			
	}else{
		if(online_status !== undefined && online_status !== 'no_connection'){
				$("#send_textarea").attr('placeholder', 'Type a message...');				//on connect, placeholder tells user to type message
				$("#send_form").css("background-color", "rgba(0,0,0,0.7)");					//on connect, form BG changes to transprent black
				$("#send_but").css("display", "inline");									//on connect, send button shows
				
			}			
	}
}
//Update input bar coloring according to API connectus status text
$('#online_status_text2').on('DOMSubtreeModified',function() {RA_checkOnlineStatus();})		

//RossAscends: auto-connect to last API server (when set to kobold, API URL exists, and auto_connect is true)		
async function RA_autoconnect() {
	if (settings.auto_connect === true) {
		if (online_status=='no_connection'){
			if(main_api==='kobold'){
				if (api_server !== '') {
					api_server = settings.api_server;
					$('#api_url_text').val(api_server);
					$('#api_button').click();
					//console.log('clicked connect for you');
				}
			}
			if(main_api==='novel'){
				if (api_key_novel !== '') {
					api_key_novel = settings.api_key_novel;
					$('#api_key_novel').val(api_key_novel);
					$('#api_button').click();
					//console.log('clicked connect for you');
				}
			}
		}
	} else { 
		//console.log('RA_AC -- disabled'); 
	}
}
$("#main_api").change(function () {
	console.log(main_api);
	if(main_api='kobold'){
		console.log('calling RA_AC');
		setTimeout(RA_autoconnect,300);
	}
});
$('document').ready(function () {
	
	setTimeout(function(){
		if(auto_load_chat == true){
			console.log('calling RA_ALC')
			setTimeout(RA_autoloadchat,250);
		}else{console.log('RA_ALC trigger not true, set to: '+auto_load_chat);}

		if(auto_connect == true){
			console.log('calling RA_AC');
			setTimeout(RA_autoconnect,250);
		}else{console.log('RA_AC trigger not true, set to: '+auto_connect);}
	},250);

	$("#api_button").click(function (){
		setTimeout(RA_checkOnlineStatus,100);
	});
})

// RossAscends: close the RightNav panel when user clicks outside of it or related panels (adv editing popup, or dialog popups)			
$("html").click(function (e) {
	if (NavToggle.checked === true && PanelPin.checked === false) {
		if ($(e.target).attr('id') !== "nav-toggle") {
			if (RightNavPanel.contains(e.target) === false) {
				if (AdvancedCharDefsPopup.contains(e.target) === false) {
					if (ConfirmationPopup.contains(e.target) === false) {
						NavToggle.click();
					}
				}
			}
		}
	}
})

//RossAscends: saving the state of the right nav panel lock toggle and the open/closed state of nav panel itself
$(NavToggle).change(function () {
	NavOpenClosePref = NavToggle.checked;
	console.log('RA_NavToggle.Change >>>> saveSettings');
	saveSettings();
});

//RossAscends: saves the state of the right nav lock between page loads
$(PanelPin).change(function () {
	stickyNavPref = PanelPin.checked;
	console.log('RA_Pin.change >>>> saveSettings');
	saveSettings();
});

//RossAscends: detects changes in the power users settings checkboxes	
$('#auto-connect-checkbox').change(function () {
	auto_connect = !!$('#auto-connect-checkbox').prop('checked');
	console.log('RA_AC-checkbox.change >>>> saving');
	saveSettings();
});
$('#auto-load-chat-checkbox').change(function () {
	auto_load_chat = !!$('#auto-load-chat-checkbox').prop('checked');
	console.log('RA_ALC-checkbox.change >>>> saving');
	saveSettings();
});

//RossAscends: Additional hotkeys CTRL+ENTER and CTRL+UPARROW
document.addEventListener('keydown', (event) => {
	if (event.ctrlKey && event.key == "Enter") {				// Ctrl+Enter for Regeneration Last Response
		console.log('detected CTRL+ENTER');
		console.log('is_send_press=' + is_send_press);
		if (is_send_press == false) {
			is_send_press = true;
			Generate('regenerate');

		}
	} else if (event.ctrlKey && event.key == "ArrowUp") {		//Ctrl+UpArrow for Connect to last server
		console.log('detected CTRL+UP');
		document.getElementById('api_button').click();

	}
});





