import { encode } from "../scripts/gpt-2-3-tokenizer/mod.js";

import {
	Generate,
	getSettings,
	saveSettings,
	printMessages,
	getCharacters,
	clearChat,
	getChat
} from "../TAI-main.js";

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
export function RA_QuickRefresh(QRtype) {

	//console.log('RA_QR() -- settings.active_character: ' + settings.active_character);
	//console.log('RA_QR() -- active_character -- ' + active_character);
	//console.log('RA_QR() -- this_chid -- '+this_chid);
	//console.log('RA_QR() -- chid -- '+chid);
	//console.log('RA_QR() -- QRtype -- ' + QRtype);

	if (QRtype === 'UserNameChange') {
		//console.log('RA_QR -- found UserNameChangeCall');
		clearChat();
		printMessages();
		QRtype == '';
		return;
	} else { console.log('RA_QR -- no name change to proceeding') }

	//console.log('RA_QR -- this seems to be a REGULAR QuickRefresh');
	//console.log('RA_QR >> saveSettings');
	saveSettings();
	getSettings("def");
	RA_CountCharTokens();
	

}
//RossAscends: utility function to focus tab with users's last viewed tab, used with autoloadchat	
export function RA_FixRememberedTabs() {
	console.log('FixRememberedTabs -- starting -- target: ' + selected_button);
	if (selected_button == 'characters') {
		$('#rm_button_characters').click();
		//console.log('FixRememberedTabs -- BAM -- clicked CHARACTERS LIST');
	}
	if (selected_button == 'settings') {
		$('#rm_button_settings').click();
		//console.log('FixRememberedTabs -- BAM -- clicked SETTINGS');
	}
	if (selected_button == 'character_edit') {
		$('#CharID' + active_character).click();
		$('#rm_button_selected_ch').click();
		//console.log('FixRememberedTabs -- BAM -- clicked EDITOR');
	}
}

//RossAscends: a faster utility function for counting characters, even works for unsaved characters.
//Triggers:
$("#rm_button_selected_ch").children("h2").on('DOMSubtreeModified', function () { 						//when a new character name is loaded in the nav panel's 3rd h2 tab
	//console.log('setting active_character to this_chid: ' + this_chid);
	active_character = this_chid;
	//console.log(active_character);
	saveSettings();
	RA_CountCharTokens();
});
$("#character_popup_text_h3").on('DOMSubtreeModified', function () { RA_CountCharTokens(); })				//when "+New Character" is clicked and the hidden H3 text is changed in preparation 
$('#rm_ch_create_block').on('input', function () { RA_CountCharTokens(); });							//when any input is made to the create/edit character form textareas
$('#character_popup').on('input', function () { RA_CountCharTokens(); });								//when any input is made to the advanced editing popup textareas
function RA_CountCharTokens() {
	$('#result_info').html('');
	var count_tokens = 0;
	var perm_tokens = 0;
	//console.log('RA_TC -- start');
	if (selected_button == 'create') {				// if we are making a new character, we count the temporary variables
		//console.log('RA_TC -- new char routine');
		//total tokens in the char defs, including those that will be removed from context once chat history is long
		count_tokens = encode(JSON.stringify(
			create_save_name +
			create_save_description +
			create_save_personality +
			create_save_scenario +
			create_save_first_message +
			create_save_mes_example
		)).length;

		//permanent tokens that will never get flushed out of context
		perm_tokens = encode(JSON.stringify(
			create_save_name +
			create_save_description +
			create_save_personality +
			create_save_scenario
		)).length;
	} else {	//if it's not a new character, then it must be a presaved character we are loading

		//only exception is if we just deleted a character (which forces chid=invalid-safety-id) or some error with loading happens

		if (this_chid !== undefined && this_chid !== 'invalid-safety-id') {

			//same as above, all tokens including temporary ones
			count_tokens = encode(JSON.stringify(
				characters[this_chid].description +
				characters[this_chid].personality +
				characters[this_chid].scenario +
				characters[this_chid].first_mes +
				characters[this_chid].mes_example
			)).length;

			//permanent tokens count
			perm_tokens = encode(JSON.stringify(
				characters[this_chid].name +
				characters[this_chid].description +
				characters[this_chid].personality +
				characters[this_chid].scenario
			)).length;
		} else { console.log('RA_TC -- no valid char found, closing.'); }
	}

	//console.log('RA_TC -- counted'+perm_tokens+'(P) & '+count_tokens+'(T) tokens for CHID: '+this_chid+' name:"'+characters[this_chid].name+'"');
	if (count_tokens < 1024) {
		if (perm_tokens < 1024) {
			$('#result_info').html(count_tokens + " Tokens (" + perm_tokens + " Permanent Tokens)");
		}
	} else {
		$('#result_info').html("<font color=red>" + count_tokens + " Tokens (" + perm_tokens + " Permanent Tokens)(TOO MANY)</font>");
	}


}

//RossAscends: updated character sorting to be alphabetical
$('#rm_button_characters').on('click', function () { RA_CharListSort(); });
function RA_CharListSort() {
	characters.sort(Intl.Collator().compare)
}

//RossAscends: auto-load last character (fires when active_character is defined and auto_load_chat is true)
async function RA_autoloadchat() {

	if (this_chid !== 'invalid-safety-id') {
		console.log('RA_ALC -- No post char del situation detected. Proceeding.')
		if (settings.active_character !== undefined) {
			active_character = settings.active_character;
			//console.log(characters);
			//console.log(characters[active_character].name);
			//console.log('RA_ALC - target: ' + active_character + ' Name:"' + characters[active_character].name + '")');

			var display_name = characters[active_character].name;
			var DescTxt = characters[active_character].description;
			var PersonalityTxt = characters[active_character].personality;
			var FirstMesTxt = characters[active_character].first_mes;
			var ScenarioTxt = characters[active_character].scenario;
			var ChatTxt = characters[active_character].chat;
			var CreateDateTxt = characters[active_character].create_date;
			var AvatarURL = characters[active_character].avatar;
			var ExampleMsgTxt = characters[active_character].mes_example;

			$(SelectedCharacterTab).children("h2").text(display_name);						//display the name in the nav tab

			var i = 0;
			while ($(SelectedCharacterTab).width() > 170 && i < 100) {						// shrink the char name in tab if width >170px
				display_name = display_name.slice(0, display_name.length - 2);				// reduce by 2 characters
				$(SelectedCharacterTab).children("h2").text($.trim(display_name) + '...');	// add ... at the end
				i++;																		// repeat until it fits
			}
			// load character attributes into their respective textareas
			$("#add_avatar_button").val('');
			//$('#character_popup_text_h3').text(characters[active_character].name);
			$('#character_popup_text_h3').text(display_name);
			//$("#character_name_pole").val(characters[active_character].name);
			$("#character_name_pole").val(display_name);
			$("#description_textarea").val(DescTxt);
			$("#personality_textarea").val(PersonalityTxt);
			$("#firstmessage_textarea").val(FirstMesTxt);
			$("#scenario_pole").val(ScenarioTxt);
			$("#mes_example_textarea").val(ExampleMsgTxt);
			$("#selected_chat_pole").val(ChatTxt);
			$("#create_date_pole").val(CreateDateTxt);
			$("#avatar_url_pole").val(AvatarURL);
			$("#chat_import_avatar_url").val(AvatarURL);
			$("#chat_import_character_name").val(display_name);

			var this_avatar = default_avatar;										// flush avatar to default
			if (AvatarURL != 'none') {								// look for avatar in sel'd char
				this_avatar = "characters/" + AvatarURL;				// apply avatar if found
			}

			$("#avatar_load_preview").attr('src', this_avatar + "#" + Date.now());	//loads the avatar in editChar Panel
			$("#name_div").css("display", "none");									// hides name input as usual
			$("#form_create").attr("actiontype", "editcharacter");					// sets formcreate to edit mode
			RA_QuickRefresh();
			//console.log('RA_ALC - calling RA_clearChat()');
			clearChat();															// clears chat
			chat.length = 0;
			//console.log('RA_ALC - calling RA_getChat()'); //?
			this_chid = active_character;
			getChat(this_chid);																// gets chat for the character
			console.log('RA_ALC >>>> saving.');
			saveSettings();															// saves		
		} else {
			console.log('RA_ALC -- active_character undefined. Stopping.');
		}
	} else {
		console.log('RA_ALC -- post char del safety-ids found. Stopping.');
	}
}

//RossAscends: changes inpout bar and send but display depending on connection status
$('#online_status_text2').on('DOMSubtreeModified', function () { RA_checkOnlineStatus(); })
async function RA_checkOnlineStatus() {
	if (online_status == 'no_connection') {
		$("#send_textarea").attr('placeholder', "Not connected to API!");		//Input bar placeholder tells users they are not connected
		$("#send_form").css("background-color", "rgba(100,0,0,0.7)");			//entire input form area is red when not connected
		$("#send_but").css("display", "none");									//send button is hidden when not connected;			
	} else {
		if (online_status !== undefined && online_status !== 'no_connection') {
			$("#send_textarea").attr('placeholder', 'Type a message...');				//on connect, placeholder tells user to type message
			$("#send_form").css("background-color", "rgba(0,0,0,0.7)");					//on connect, form BG changes to transprent black
			$("#send_but").css("display", "inline");									//on connect, send button shows

		}
	}
}

//RossAscends: auto-connect to last API server (when set to kobold, API URL exists, and auto_connect is true)		
$("#main_api").change(function () { if (main_api = 'kobold') { setTimeout(RA_autoconnect, 300); } });
async function RA_autoconnect() {
	if (settings.auto_connect === true) {
		if (online_status == 'no_connection') {
			if (main_api === 'kobold') {
				if (api_server !== '') {
					api_server = settings.api_server;
					$('#api_url_text').val(api_server);
					$('#api_button').click();
					//console.log('clicked connect for you');
				}
			}
			if (main_api === 'novel') {
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

$('document').ready(function () {
	setTimeout(function () {
		RA_FixRememberedTabs();
		if (auto_load_chat == true && settings.active_character !== undefined) {
			console.log('calling RA_ALC')
			setTimeout(RA_autoloadchat, 400);
		} else { console.log('RA_ALC trigger not true, set to: ' + auto_load_chat + ' or active_character not available:' + settings.active_character); }

		if (auto_connect == true) {
			console.log('calling RA_AC');
			setTimeout(RA_autoconnect, 250);
		} else { console.log('RA_AC trigger not true, set to: ' + auto_connect); }
	}, 250);

	$("#api_button").click(function () {
		setTimeout(RA_checkOnlineStatus, 100);
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

$("#your_name_button").click(function () {
	console.log('NAME CHANGE - old name: ' + name1);
	name1 = $("#your_name").val();
	if (name1 === undefined || name1 == '') name1 = default_user_name;
	console.log('NAME CHANGE - new name: ' + name1);
	console.log('your_name_change.click >> refreshing');
	RA_QuickRefresh('UserNameChange');
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
		if (is_send_press == false) {
			is_send_press = true;
			Generate('regenerate');

		}
	}
	if (event.ctrlKey && event.key == "ArrowUp") {		//Ctrl+UpArrow for Connect to last server
		if (online_status === 'no_connection') {
			document.getElementById('api_button').click();
		}
	}
});





