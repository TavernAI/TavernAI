---
title: Prompt Manager
description: Build the model context from ordered prompts, card prompts, chat history, Activation Rules, merge groups, and attachments.
sidebar:
  order: 54
---

Prompt Manager defines the context TavernAI sends to an AI model. Each enabled item contributes text, media, chat history, card prompts, or a transformation rule to the final request.

The tree is the prompt structure. Its top-to-bottom order becomes the base order of the assembled prompt. Folders organize and gate parts of that structure, structural nodes insert dynamic content, merge groups combine adjacent entries, and Activation Rules decide when ordinary items enter the prompt or replace chat text.

Use **Preview** in **Current Chat Prompt Manager** to inspect the assembled prompt before generation. The [Final Prompt Viewer](/docs/advanced-features/#5-final-prompt-viewer) uses the same build path as a real request.

## Open and select a Prompt Manager

Open the **PM** tab in the left library pane to manage Prompt Manager presets. From this library you can:

- create a Prompt Manager with **Create PM**;
- import a Prompt Manager set;
- export, rename, or delete an existing set;
- open a set and edit its tree.

The effective Prompt Manager for a chat appears under **Chat prompt manager** in the right settings pane. **Change** selects another preset. **Pin** attaches the selected preset to the current chat; a pinned chat keeps using that preset when the user-level selection changes.

> **Screenshot:** ![TavernAI Prompt Manager](/img/docs/pm_1.png)

Cards have their own Prompt Managers. Open a card and select its prompts tab to edit them. A card Prompt Manager contributes only while that card has **Ctx** enabled in the current chat.

## Build the tree

The Prompt Manager toolbar provides **Create Item**, **Create Folder**, **Script**, and **Presets**.

### Items

An item is one prompt entry. Open it to edit these fields:

| Field | Effect |
|---|---|
| **Enable Rules** | Adds conditions and an Insert or Replace action. |
| **Name** | Labels the item in the tree. The name is not sent to the model. |
| **Role** | Assigns a User, AI, System, or custom role placeholder. The active role preset maps that placeholder to a provider role. |
| **Position** | Places the item in normal tree order with **Relative**, or inserts it near the end of the assembled context with **At Depth**. |
| **Depth** | For At Depth items, `0` appends the item, `1` inserts it before the final entry, and larger values move it farther toward the start. |
| **Order** | Sorts multiple At Depth items at the same depth. Lower numbers come first. |
| **Prompt** | Holds prompt text, placeholders, macros, and file references. Replace rules label this field **Replace with**. |
| **Trim** | Removes leading and trailing whitespace from the item before assembly. |

New items save automatically while the editor is open.

Drag rows to reorder them or move them into folders. The visible top-to-bottom order is the order used during prompt assembly.

### Folders

Folders organize items and can be nested. Turning a folder off removes all of its descendants from generation, even if the switches on those descendants remain enabled.

Folder state is useful for keeping alternate instruction sets in one Prompt Manager. Prompt Manager Quick Presets can store different enabled/disabled states and switch between them without duplicating the tree.

## Insert chat and card prompts

The **Presets** menu creates two immutable structural nodes:

| Structural node | Inserted content |
|---|---|
| **CHAT** | Messages from the active chat path. |
| **CARD PROMPTS** | Enabled relative prompts from cards whose **Ctx** switch is on, ordered by chat-card order and then by each card's Prompt Manager tree. |

A basic chat Prompt Manager normally needs a **CHAT** node. Without it, chat messages are not inserted into the model context.

Add **CARD PROMPTS** when the model should receive card descriptions, personality instructions, or other prompts stored on cards. Without this node, the assembled card prompt block does not enter the chat Prompt Manager.

Structural nodes can include literal text around their placeholder and can appear more than once. They are read-only after creation; delete and recreate one when its structural type needs to change.

Activation Rules on a structural node do not gate the inserted chat or card content. Put the rule on an ordinary item when a condition should control prompt text around a structural section.

## Merge adjacent prompts

Providers receive roles on complete request entries. A merge group turns several adjacent tree entries into one entry with one selected role.

For example, three consecutive System items can remain separate internally for editing, then become one System entry in the provider request.
> **Screenshot:** ![TavernAI Prompt Manager](/img/docs/pm_2.png)
### Create a merge group

1. Find the small merge dots in the right gutter of the Prompt Manager tree.
2. Select the dot beside the first boundary.
3. Select the dot beside the last boundary.
4. Select the role badge on the new line to set the role of the merged result.

The boundaries are inclusive and must be different siblings in the same folder. A folder inside the selected range contributes its enabled prompt descendants. Ranges on the same tree level cannot overlap or share an endpoint.

Select **Delete group** below the role badge to remove a merge group.

### Merge behavior

At generation time, TavernAI:

- collects enabled entries inside the group;
- joins their text with line breaks;
- preserves attached file and image parts;
- replaces the entries with one entry at the first contributing position;
- assigns the merge group's role to the result.

The original item roles are replaced by the group role. **At Depth** items are inserted later and are not part of merge groups. Replace-rule items transform chat text and do not contribute their own prompt entry.

Keep each intended merge result on one tree level. A group inside a folder and another group around that folder do not define a dependable nested merge order.

## Activation Rules

Activation Rules make ordinary items conditional. Turn on **Enable Rules** in an item editor, then define one or more conditions under **When** and choose an **Action**.

### Conditions

| Condition | Match behavior |
|---|---|
| **Keyword** | Finds literal text. |
| **Regex** | Matches a regular expression. Invalid expressions are skipped during generation. |

Each condition can be case-sensitive or case-insensitive. Use **+ Add condition** to add another target.

**Match** controls an Insert rule with multiple conditions:

| Match option | Item activates when |
|---|---|
| **PM Default** | The Prompt Manager setting decides. |
| **Any condition** | At least one condition matches. |
| **All conditions** | Every condition matches. |

**Scan** controls the source text:

| Scan option | Text inspected |
|---|---|
| **PM Default** | The Prompt Manager setting decides. |
| **Entire chat** | All messages on the active chat path. |
| **Last user message** | The newest chat message. In the current build this does not filter by role. |
| **Last N messages** | The final `N` messages on the active chat path. |

Open **Prompt Manager Settings** to define the defaults used by items set to **PM Default**. New Prompt Managers default to **Any condition** and **Entire chat**.

### Insert

**Insert — include this prompt when conditions match** adds the item to the request only while its conditions match the selected chat scope. An Insert rule with no conditions is always active.

This replaces separate lorebook or world-info activation systems: store the contextual text in **Prompt**, add its keywords or regex conditions, and leave the item in the exact tree position and role where it should appear.

### Replace

**Replace — replace matched text in chat messages** uses each Keyword or Regex condition as a search target and the item's **Replace with** content as the replacement.

Choose where the replacement applies:

- **AI Generation** changes chat-message text while TavernAI builds the request. Stored message text remains unchanged.
- **Display** changes rendered message text in the chat. Stored message text remains unchanged.

Both targets can be enabled together. **Replace all occurrences** controls whether each target replaces its first match or every match. Replace rules run in tree order, so a later rule sees the result of earlier replacements.

Display replacement evaluates each rendered message separately. Set **Any condition** or **All conditions** explicitly on display rules instead of relying on **PM Default**.

> **Screenshot:** ![TavernAI Prompt Manager](/img/docs/pm_3.png)

## Attach images and files

Press the attachment button beside **Prompt** to upload a file. TavernAI inserts a reference such as:

```txt
![[a1b2c3.png]]
```

During prompt assembly, that reference becomes a media part owned by the item. Text before or after the reference remains text in the same prompt entry. Merge groups preserve media parts when they combine items.

The picker accepts images, audio, video, PDF, Word documents, text, Markdown, JSON, CSV, and XML. Provider and model support still determines which media can be sent. Images have the broadest support; some provider paths support additional types such as PDF, while others ignore unsupported file parts.

Open **AI attachment settings** in the right settings pane and select the effective attachment provider and model. Enable **Send Attachments** and, when available, **Send Images**. A model that reports no attachment support cannot receive Prompt Manager media.

Images assigned to a non-user role may need **Image Role Handling** in Chat Sequencer. This setting can preserve the original role, move the entire entry to User, or extract images into a separate User entry for providers that accept images only on user messages.

Keep provider payload limits in mind. Large images and files become base64 request data and can exceed the provider's request-size limit even when the upload itself succeeds.

> **Screenshot:** ![TavernAI Prompt Manager](/img/docs/pm_4.png)

## Presets and token counts

The **Presets** menu for CHAT and CARD PROMPTS is separate from Quick Presets.

Prompt Manager Quick Presets store the enabled/disabled state of items, folders, and scripts. Use them for alternate context configurations inside one tree. Prompt Item Presets store alternate prompt text for one item.

Rows show token counts when TavernAI can cache or calculate them. Ordinary Relative items use the selected tokenizer's cached count. Structural nodes can show a runtime count after the current chat prompt is assembled. Folders, scripts, At Depth items, and unavailable dynamic counts show a dash.

## Assembly order

The main stages relevant to Prompt Manager are:

1. collect enabled chat and card Prompt Manager items;
2. expand CHAT and CARD PROMPTS;
3. apply AI-generation Replace rules to chat text;
4. evaluate Insert rules;
5. merge grouped relative entries;
6. insert At Depth entries;
7. resolve roles, media handling, and provider-specific request format.

Use **Preview** after changing rules, merge groups, roles, or attachments. It shows the concrete result for the current chat and selected model before a request is sent.

## Related pages

- [Card Placeholders Reference](/docs/placeholders/) for card-name placeholders inside prompt text.
- [Macros](/docs/macros/) for dynamic prompt text and pre-generation transformations.
- [PM Scripts](/docs/pm-scripts/) for browser-side chat logic and custom scene UI.
- [Advanced features](/docs/advanced-features/) for Final Prompt Viewer and Prompt Records.