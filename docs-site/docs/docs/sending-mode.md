---
title: Sending Mode
description: Choose whether Send starts AI generation, adds only your message, or creates replies for manual writing.
sidebar:
  order: 45
---

Sending Mode controls what happens after you submit text in a chat. It separates adding a user message from generating the next AI message.

The current mode appears in the compact toolbar above the chat input. Press the **Sending mode** button to cycle through **auto**, **manual**, and **blank**.

> **Screenshot:** 
## Modes

| Mode | Sending non-empty text | Pressing Send with an empty input | Generate controls in Current chat |
|---|---|---|---|
| **auto** | Adds your message, then starts AI generation | Starts AI generation from the current end of the chat | Generates an AI message |
| **manual** | Adds your message without starting AI generation | Does nothing | Generates an AI message |
| **blank** | Adds your message without starting AI generation | Does nothing | Creates an empty AI-side message for manual editing |

## Auto

**Auto** is the standard chat flow. TavernAI adds the submitted text as a user-origin message and immediately asks the connected model for the next response.

An empty submission skips the user message and generates directly from the current end of the active chat branch.

Auto mode requires a connected AI provider when generation starts.

## Manual

**Manual** adds submitted text to the chat without contacting the AI provider. Use it to write several messages, arrange a scene, or decide exactly when the model should answer.

To generate later, open **Current chat** and use one of its Generate controls:

- **Generate message for this card** starts a response for one card;
- **Generate response for all AI-selected cards** starts responses for all cards currently selected for AI generation.

> **Screenshot:** ![TavernAI Sending Mode](/img/docs/sending_mode_2.png)

## Blank

**Blank** keeps ordinary sending manual and changes the Current chat Generate controls into blank-message controls. Instead of contacting the model, Generate creates an empty generated-origin message for the selected card or cards.

Open that message with [Live Edit](/docs/live-edit/) or its **Edit button** and write the response directly. This preserves the normal participant and generated-message structure without an AI request.

Blank mode is useful for fully authored conversations, imported scene reconstruction, and testing card or branch behavior without a provider.

## Regeneration

Sending Mode does not change **Regenerate**. Regenerating a message always starts AI generation and requires a connected provider, including while Sending Mode is set to blank.

## Scope

Sending Mode is a user setting. Changing it applies across chats and synchronizes to other connected TavernAI clients for the same user.

## Related pages

- [Live Edit](/docs/live-edit/) for direct message editing.
- [Quick Start](/docs/quick-start/) for the standard first-message flow.
- [Advanced features](/docs/advanced-features/) for message versions, swipes, and prompt inspection.