---
title: Live Edit
description: Edit message text directly in the chat while preserving content versions.
sidebar:
  order: 58
---

Live Edit turns rendered message text into a click-to-edit surface. It changes how the editor opens; it does not change the message, branch, or version model.

Toggle **Live edit** in the compact toolbar above the chat input.

> **Screenshot:** ![TavernAI Live Edit](/img/docs/live_edit_1.png)

## Editing with Live Edit

When Live Edit is on:

1. Click a text block in any message.
2. The text becomes an editor, with the cursor placed near the clicked position.
3. Change the text directly in the message.
4. Click outside the editor to close it.

Only one text block is open in Live Edit at a time. Opening another block closes the previous editor.

Changes are saved automatically after a short delay. When the next AI request must include a new edit, let the save complete before starting generation.

Live Edit applies to message text blocks. Thinking blocks are not editable through this control.

## Editing with Live Edit off

Message editing remains available when Live Edit is off. Press the pencil button in a message header to open its editor. The pencil changes to a check mark; press the check mark to close the editor.

This explicit editor stays open when you click elsewhere. Messages with additional text blocks expose their own edit buttons for those blocks.

Use the explicit edit button for longer changes that should remain open while you inspect another part of the chat. Use Live Edit for quick corrections directly where the text appears.

## Versions and branches

Both editing methods use the same message content version system. The first saved change preserves the original text as **Original** and creates **Edit 1**. Later changes update the active edited version.

Editing does not create a branch and does not create a Content Swipe. It changes the active content version of the selected message.

Open the message content version controls to inspect or restore earlier text. See [Advanced features](/docs/advanced-features/) for Message Content Versions, Content Swipes, and branching swipes.


## Related pages

- [Sending Mode](/docs/sending-mode/) for automatic, manual, and blank-message chat flows.
- [Advanced features](/docs/advanced-features/) for message versions and swipes.
