---
title: Quick Start Guide
description: From first launch to the first AI message.
sidebar:
  order: 30
---

Quick Start walks from opening TavernAI 2 to receiving the first AI reply.

Use it after [Installation](/docs/installation/). We will start the app, connect a provider, add a card, and send one message.

## 1. First Message

### 1.1 Launch TavernAI

Open TavernAI from the folder you extracted.

![TavernAI launch placeholder](/img/docs/1.png)

### 1.2 Connect a provider

Open provider settings and add the model backend you want to use.

![Provider setup placeholder](/img/docs/2.png)


### 1.3 Create a chat

Press the character **Chat** button to create a new chat.

![Create chat placeholder](/img/docs/3.png)

### 1.4 Write a message

Now let's write the first message.

![Add card placeholder](/img/docs/4.png)

### 1.5 Get a response

Now we get the first AI reply.

![First message placeholder](/img/docs/5.png)

## 2. Adding Cards

At this point, we are not speaking as any character card yet. Let's add a card for ourselves so the chat has a user-side participant.

### 2.1 Open the card panel

Open the panel for adding cards to the chat.

![First message placeholder](/img/docs/6.png)

### 2.2 Add a character

Choose the card we want to use for ourselves.

![First message placeholder](/img/docs/7.png)

### 2.3 Configure the card

The card is now in the chat.

![First message placeholder](/img/docs/8.png)

Right now, the AI is set to speak for both cards. Let's set Scout as our card, and leave Marika as the AI-side card.

This is what Scout looks like when the AI speaks for that card:

![First message placeholder](/img/docs/9.png)

And this is Scout after we assign the card to ourselves:

![First message placeholder](/img/docs/10.png)

The card controls mean:

`AI` — cards with this enabled can participate in AI-generated messages.

`U` — cards with this enabled can participate in your messages.

`Ctx` — when enabled, the card's Prompt Manager is added to generation context.

`Role selector` — controls the Chat Completion role for messages from this card, so the model knows whether they should be treated as user-side or AI-side messages.

### 2.4 Send a message as the card

Now we send a message as Scout. Marika reacts differently because the chat now has a clear user-side character.

![First message placeholder](/img/docs/11.png)

## 3. Flip the Roles

Now let's start a new chat and reverse the card settings.

![First message placeholder](/img/docs/12.png)

This time, we are playing as Marika, the owner of the night bakery, and receiving Scout as the guest.

![First message placeholder](/img/docs/13.png)

## Next

- [Macros](/docs/macros/)
- [PM Scripts](/docs/pm-scripts/)
- [TavernAI Pro](/docs/pro/)
