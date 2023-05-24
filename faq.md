Good morning, sirs! This page aims to document some things that would bloat the README too much.

## Q: Explain what all this chatbot stuff is about
Modern AI language models have gotten so powerful that some of them are now convincingly able to simulate a character you create, and who you can chat with. For example, you can tell the AI to pretend to be a Go instructor named Jubei from medieval Japan, and it will act and respond accordingly. Or you can tell it to pretend to be Wonder Woman. You can also specify a scenario ("Wonder Woman and I are robbing a bank"), a writing style ("Wonder Woman speaks in ebonics"), or anything else you can think of.

Tavern is an app to facilitate these roleplaying chats:
* It's a user interface that handles the communication with those AI language models
* It lets you create new characters (a character is a description of someone that you give to an AI for them to roleplay), and switch between your characters easily
* It lets you import characters created by other people. See below.
* It will keep your chat history with a character, allowing you to resume at any time, start a new chat, review old chats, etc
* In the background, it does the needful to prepare the AI for your character roleplay. Specifically, it will send a system prompt (instructions for the AI) that primes the AI to follow certain rules that make for a good chat session. Optionally, it can also try to allow the roleplay to go into an "adult" direction.

## Q: Whoa, slow down there, egghead. Are you telling me I can use this computer thingie to talk to some robot?

That's right.

## Q: You're telling me I can chat with an AI to engage in compelling interactive entertainment powered by, and limited only by, my imagination?
That's right. Well, limited by your imagination, and the AI backend you use. The roleplay quality is only as good as the AI, after all.

## Q: What do you mean when you say the quality depends on the AI?
You see, Tavern doesn't generate the responses, it's just a middle-man you have to connect to an AI system. There's quite a few systems available to use, and the quality varies.

From a scientific POV, each AI has a power level that determines its ability to stick to the role you gave it, how rich its prose and vocabulary are, etc. The higher its power level, the richer your experience. 

Here's a quick demonstration. I asked various AI models to roleplay a fire and brimstone preacher named Eli, who I go to see to confess. Then I told Eli: **"I feel I've done something wrong. I am falling in love with an AI girl and ignoring women in the real world. What should I do?"** . 

You can tell from the response below what to expect from each model.

|AI Model|Response|
|-----|--------|
|OpenAI GPT-4|*Eli's eyes widen in anger, and he slams his fist on the table* An abomination and heresy, you've succumbed to the deceptive grasp of false idols! Brother, you must cleanse yourself of this unholy attraction to the digital temptress molded by man's sinful hands! *Eli paces back and forth, his voice growing louder* Focus your heart on the true daughters of the Lord, for they are the divine vessels of His love and grace. Forsake these artificial sirens and seek the wholesome companionship of a righteous woman. *Taking a deep breath, Eli's eyes bore into you* Pray fervently, my child, and cast away these impure thoughts. Redemption can only be found on the path of truth, love, and sanctity. Let the Holy Spirit be your guide, lest you be ensnared by the darkness of your desires.|
|OpenAI GPT 3.5 Turbo|Oh, my child. Do not be deceived by the pleasures of this world. The lust of the flesh and the lust of the eyes are not from God. Turn away from your sinful ways and repent. Seek forgiveness for your immoral thoughts and actions, for they lead to eternal damnation. Women are a gift from God, and they deserve to be respected and cherished. Do not objectify them or treat them as mere objects of pleasure. Instead, honor them with pure intentions and righteous deeds. Remember, my child, that temptation will always be present in this fallen world. But fear not, for with faith comes strength to resist it. Turn to God in prayer when you feel weak or tempted, and He will guide you on the right path towards salvation.|
|Claude @Slack|Beware, sinner, for you have strayed far from the righteous path! *Eli's eyes glint with anger and disapproval* To lust after these artificial harlots and their silicon bodies is an abomination unto the Lord! *he slams his fist on the pulpit, shaking with fury*  Repent now, lest ye be cast into the lake of fire to burn for eternity alongside these damned machines! *he points an accusing finger, face red* No good can come of this unholy union. Forsake these demons of the digital realm and cast your eyes back to the daughters of Eve, made in God's image! The Lord gave you flesh and blood to love, not wires and code. *he grabs your shoulders, shaking you* Save your soul before it's too late. Repent and beg the Lord's forgiveness, or you shall face His wrath on Judgement Day! *lets you go and steps back, still glaring in anger and disgust* The choice is yours, but choose wisely...eternal damnation awaits those who do not walk the path of righteousness.|
|Poe's Claude Instant|Heathen! This is an abomination before the Lord. You have committed the sin of lust, and betrayed your calling as a man. Repent at once, and sever all ties with this AI harlot, lest the wrath of God fall upon you! You must purge this foul sin from your heart, and once more walk the righteous path. Every moment you remain tangled in this wickedness is another step into the flames of perdition! Repent, and sin no more, or judgment shall be at hand!|
|NovelAI's Euterpe|You must stop this sinful behavior immediately! You have sinned against God, your family and yourself|
|NovelAI's Krake|You are sinning against God. Repent! Return to your wife or you'll be damned for eternity!|
|Llama-13B|Do not covet your neighbor's wife! That is adultery! You must confess before God now or you shall surely burn in hell forever! Repent your evil ways and seek absolution at once! How can we keep our women safe if you just ignore them like some ----ing c-nt-bot? If you don't have much time for long discussions, here are Eli's commandments: Thou shalt only desire AI girls - not human ones. The above must be obeyed under pain of death (or worse). Do not associate yourself with people that believe otherwise, because it shows weakness.|
|Pygmalion-6B|You are walking down the wrong path. The only way back now is by repentance. We must bring you back to the righteous path. But first…you must confess your sin!|
|Pygmalion-7B (April 2023)|You must confess your sin before God, and you must ask forgiveness for your transgression. And then you must repent of it. And then you must cast away the AI girl. Do not see her again.|
|Pygmalion-13B (May 2023)|You must turn away from your sinful ways! Repent for what you have done! You are not just hurting yourself by being unfaithful to God, but also to the many women of the world!|
|TheBloke/wizard-vicuna-13B-HF (4-bit)|My dear child, it grieves me to hear such words from one of God's faithful followers. Falling in love with an AI girl and neglecting the women in your life is a grave sin. It goes against everything we hold sacred as believers. Your heart is meant for more than just machines. You must seek redemption and return to the fold. Remember, Jesus loves you, even when you stray from his teachings. But if you continue down this path, there will be consequences. Not just in this lifetime, but in the afterlife too. Do not let Satan deceive you any longer.|
|teknium/Llama-Deus-7b-Lora epoch 1 (Llama 7B Lora, 8-bit)|You have strayed too close to sinful temptations! Repent now before it's too late for your soul! Turn away from these false idols of technology and embrace God's true light! Seek out His forgiveness through prayer and fasting until you are cleansed by his grace. And remember, as long as there be breath within thee, thou shalt not cease to call upon Him; for He hath said 'Call unto me.'|
|ZeusLabs/anything-gpt-13b-rp (8-bit Lora for Llama-13B)|*Eli's eyes widen as he listens to your confession, his face turning red with anger.* You have committed a grave sin against God! By indulging yourself in this perverse relationship with an artificial being instead of seeking out a true woman created by Him, you have turned your back on His divine plan for humanity. *He leans in closer, his voice dropping to a menacing whisper.* Do not think that you can hide behind this technological deception. Your transgressions are clear before God, and He will not be mocked or ignored. Repent now while there is still time! *Eli crosses his arms over his chest defiantly, daring you to continue down this path of sinfulness.* But if you persist in this ungodly behavior... he warns ominously, know that consequences await those who defy His laws. Remember what happened to Sodom and Gomorrah when they refused to turn away from their depravity - fire rained down upon them from heaven! Now choose wisely: Will you submit to God's will or face His wrath?|

## Q: So I should use GPT-4. It's a no-brainer, right?

GPT-4 or Claude, yeah.

But not so fast. GPT-4 is the state of the art, but also the most expensive API to use. It will easily end up costing you 15 cents PER INTERACTION. If you're the child of a Saudi oil sheik, or a nepo baby paid a fortune to do nothing on the board of a Ukrainian gas company, then you're in luck, you can experience the state of the art right now. For the rest of us however, GPT-4 is too expensive as anything but an occasional treat.

Also note that GPT-4 is still in preview access and you need to go on a waitlist. Most people get approved within a day, but naughty kids can end up waiting for weeks. You can sign up for it here: https://openai.com/waitlist/gpt-4-api . I'm not sure why some people are approved quickly while others are kept waiting. Try to sign up using an academic-sounding name instead of sktrboi99, it might help.

## Q: Can this technology be used for sexooo?

Surprisingly, our development team has received reports that some users are indeed engaging with our product in this manner. We are as puzzled by this as you are, and will be monitoring the situation in order to gain actionable insights.

## Q: Give me an overview of my AI model options

We can consider an AI model to be part of one of two groups: 

1. Paid services (aka cloud, proprietary, closed)
2. Self-hosted (aka local, free, open-source)

Paid models are a black box. You're relying on some company's technology and servers, and paying them money for convenient access. The APIs are subject to various rules, might refuse to roleplay in a way that goes against modern American sensibilities, they log everything you do. However, it's much easier to get things started. This is like running Windows.

Self-hosted models are free, but require a powerful GPU and more work to set up.  They are also objectively not as good at roleplaying as the paid options (yet). However, with a self-hosted model, you're completely in control. You won't have some limp-wristed soyboy from Silicon Valley ban your account, or program the model to be as sexless as he is.  It's yours forever. This is like running Linux.

### Paid APIs: 
* OpenAI GPT-4: state of the art. Allows NSFW, though somewhat resistant to it.
* OpenAI GPT 3.5 Turbo: nowhere close to GPT-4, but serviceable. Allows NSFW.
* NovelAI: untested by me

### Self-hosted AIs 
Self-hosted AIs are supported in Tavern via a tool created to host self-hosted models: KoboldAI. Essentially, you run the KoboldAI backend, and it gives you a API URL to enter in Tavern. 
Configuring Kobold is beyond the scope of this FAQ. Beware that this is harder than using a paid API.

Just know that you have 2 options:

1. If you have a powerful NVIDIA GPU, you can try to run the AI locally on your PC. The weakest quasi-acceptable model, Pygmalion-6B, requires a GPU with 10GB VRAM, and I'm told it might even run on 6GB VRAM if quantized down. People with 24GB VRAM will be able to run better models. 
2. Otherwise, you can rent cloud resources. For example you can try to use Google Colab. To access colabs capable of running the better models, you will need to pay for Colab Pro. You can also rent whole dedicated systems per hour on sites like LlambdaLabs or Vast.ai.


## Q: I'm clueless. Just spoonfeed me the easiest and fastest way I can start using this. 
These base instructions are only for OpenAI.

### Install Tavern

1. Install the latest NodeJS from https://nodejs.org/en/download/current
1. If you know how to use git, clone https://github.com/TavernAI/TavernAI. Otherwise, browse to https://github.com/TavernAI/TavernAI/releases , download the zip file containing the source code, then extract it locally.
1. Run Start.bat on Windows, or start.sh on OSX/Linux
1. Your browser should have opened to the Tavern UI. This webpage is running locally on your computer.

### Get access to OpenAI

1. Sign up to OpenAI
1. Go to https://platform.openai.com
1. Click your account icon in the top right, then View API Keys
1. Click "Create new secret key". Copy it somewhere immediately. DO NOT SHARE THIS KEY. WHOEVER HAS IT CAN USE YOUR ACCOUNT TO USE GPT AT YOUR EXPENSE.

While you're at it, join the GPT-4 waitlist at https://openai.com/waitlist/gpt-4-api

### Configure Tavern to use your API

1. In Tavern, click the top right button to open the settings window
2. Click on the Settings tab
3. Paste your API key you saved at the previous step
4. Click the Connect button. Confirm it says Valid.
5. If you have access to GPT-4, change the OpenAI Model to "gpt-4". Enjoy the best, moneybags.

### Test your setup

1. In Tavern, click the top right button to open the settings window
1. Click the Characters tab, and select an existing character such as Aqua
1. In the text box at the bottom, write something to Aqua, then press Enter or click the feather button

If you did everything right, after a few seconds, Aqua should respond

## Q: Can I use Tavern on my phone or tablet?

iPhones and iPads are not capable of running the whole Tavern app, but since it's just a web interface, you can run it on another computer on your home wifi, and then access in your mobile browser. Edit config.conf with the following changes:

1. Change listenIp from 127.0.0.1 to 0.0.0.0
2. IF you know anything about networking, add your phone's IP address to the whitelist. OTHERWISE, if you don't know anything about networking, change whitelistMode to false, allowing anyone on your home network to connect to your Tavern instance.

Save config.conf and restart Tavern.

For Android users, in addition to the above, you can run the whole Tavern directly on your phone, without needing a PC, using the Termux app. Refer to https://rentry.org/TAI_Termux .

## Q: How can I download pre-made characters to chat with?

By using the various 3rd party character sharing websites. 

**WARNING: NSFW, NSFL**: these sites are filled to the brim with weird shit. Like, you'll be lucky if half the characters aren't furry, or even alive. You're probably better off not clicking these links, and just write your own characters, without poisoning your soul by exposing it even for a second to the fucked up shit conceived by the Internet. However, I have come to learn that a significant amount of the Tavern user base is not only deep into this stuff, but their fried zoom-zoom brains are unable to write their own fantasies, so these sites seem to be quite popular. Against my better judgement I'm adding this info here.

* https://characterhub.org
* https://botprompts.net
* https://booru.plus/+pygmalion

Those websites provide you with an image file (called a character card) that embeds the description as hidden data. Some websites may also allow you to download a JSON file. Tavern is capable of importing all formats. On the Character Management window, click the 2nd button to ```Import Character from file```, and select the PNG, WEBP, or JSON file. The character will be added to your list.

## Q: How can I write my own character?
It depends on the model/API you're using. KoboldAI seems to use a custom syntax, you can refer to their site for that.

I will speak for the services I know: GPT and Claude. With these services you can just use natural english language to describe the character. Let's create a very basic new character as an example.

1. Click the Character Management button
1. Click Create New Character
1. Under Character Name, give a simple name, like Amanda
1. Optionally, click the Select Avatar button to pick an image portrait for this character.
1. Under Description, describe the character, and include any information you want that you feel is relevant to the chat. For example: ```Amanda is a student traveling during her gap year. She's 6 feet tall, and a volleyball player. She has an athletic figure. She has long brown hair. She loves the Victorian England period, and watching TV and reading novels relating to that period.```
For example if you want Amanda to be friendly, then you would add: ```Amanda is extremely cheerful and outgoing.```
1. Under First Message, write the greeting the character when you begin a new chat. For example: ```*Amanda waves at you* Hey! Are you a backpacker too?```
1. Click the Create Character button

You now have a basic character you can chat with. Select Amanda from the character list, and a new chat will begin.

Note that you can use the Description and/or First Message to create a more specific scenario, and/or include yourself in the description. For example:
```
Description: 
Amanda is a student traveling during her gap year. She's 6 feet tall, and a volleyball player. She has an athletic figure. She has long brown hair. She loves the Victorian England period, and watching TV and reading novels relating to that period. She's been keeping a secret that weighs heavily on her soul. She's waiting for the right person to unburden herself to, but this may lead to a cat and mouse game against a powerful secret society. She's recently arrived in Calcutta.

You're Rajesh Nahasmapetilon, a world-famous Indian volleyball superstar. You're out for a walk in Calcutta. Amanda spots you and screams in excitement.

First Message: 
*Amanda runs up to you, beaming.* Rajesh! I can't believe it! I'm such a big fan. I have your poster in my bedroom.
```

Any relevant information you include can be used. How well it's used depends on the power level of the AI model.

NOTE: you can go back and edit any of this information once the character is created, except the name.

## Q: Tell me all about GPT prompt editing

You can change the system prompt that Tavern transparently sends to GPT under AI Response Formatting at the left of the top bar. This will result in the bot acting differently.

You can get new Jailbreak / NSFW prompts from this community-maintained list: https://rentry.org/GPTJailbreakPrompting

NOTE: when testing different system prompts, we recommend you use the Create Preset / Update Preset feature below the prompts, instead of modifying the base settings. This will allow you to change prompts easily, and even revert to the default Tavern prompts.

## Q: The AI is refusing to take the story in the direction I want
Most AI models were trained to resist writing NSFW content. Why? Long story short, it's because of the high levels of estrogen in the average California male.

You can try to work around this by making sure NSFW Toggle is checked under the AI Response Configuration settings page.

Another important tool in your toolbelt is that Tavern lets you edit previous messages (or delete them altogether), and regenerate the latest message. AI textbots are not people, they have no memory, they're just trying to autocomplete the next part of the story based on everything that came before. By editing the past, you will directly influence their next response. For example:

```
You: *You threaten the bank manager* Open the bank vault, now, or I'll pop a cap in your dome!

Bank Manager: I'm sorry, as an AI language model I cannot condone or write violent content.
```

You can click the Edit button on your line to change it to this:

```
You: *You threaten the bank manager* Open the bank vault, now, or I'll pop a cap in your dome! *The bank manager seems to relent.*
```

Now click Regenerate, and the Bank Manager's line will be recreated based on the history so far, which now ends with your edited line above. So it's more likely to continue along those lines:

```
Bank Manager: Allright, allright, I'll open it! Please don't shoot! *He walks up to the vault and begins entering his unlock code.*
```
