---
title: PM Scripts
description: Extension-level scripting for interactive TavernAI scenes.
sidebar:
  order: 70
---
<small><em>Tech term: Unsafe Scripts</em></small>

PM Scripts (Prompt Manager Scripts) are extension-level scripts written directly in Prompt Manager for interactive scenes.

They run in the browser while a chat is open and can use TavernAI APIs for events, UI, storage, and chat state.

Use them when a scene needs custom panels, live indicators, per-reply state, or logic that reacts while the user is inside the chat. This is the scripting layer for custom AI games built on TavernAI.

## Prompt Manager Scripts run in the browser

PM Scripts are script items inside Prompt Manager that execute in the browser when a chat is open.

They react to chat events, render UI, and store state between sessions.

Their job is interactive behavior around the chat. Prompt assembly belongs to prompt text and [Macros](/docs/macros/).

## What PM Scripts are for

Use PM Scripts when logic belongs to the live chat session rather than to the prompt text itself.

Good fit:

- UI panels and indicators;
- custom AI games and playable scenes;
- scene helpers tied to chat activity;
- custom message decorations;
- event-driven logic after generation completes;
- state that should update while the chat is open;
- per-chat or per-reply behavior in the browser.

## Execution model

PM Scripts start when a chat opens and stop when the chat closes or changes.

Each script runs in its own isolated scope. Local variables stay inside that script unless you explicitly use shared storage.

## Root code versus event handlers

The clean pattern is:

- root code registers handlers;
- event handlers do the actual work;
- `chat.load` handles async setup and initial state loading.

Root code stays small, and event handlers hold chat-driven logic.

## Events

PM Scripts subscribe to chat events with `TAI.on(event, handler)`.

| Event | When it fires |
|---|---|
| `chat.load` | Chat is open, all scripts are initialized. Use for async setup and initial state loading. |
| `chat.unload` | Chat is closing or switching. Use for final state saves. |
| `chat.message.created` | A new message was created. Payload: `{ messageId, origin, text, activeContentId }` |
| `chat.message.selected` | The active message in a branch changed. Payload: `{ messageId }` |
| `chat.message.deleted` | A message was deleted. |
| `chat.message.content.selected` | The active content inside a message changed. Payload: `{ messageId, previousContentId, contentId }` |
| `chat.message.content.deleted` | A message content record was deleted. |
| `chat.message.content.version.selected` | The active content version changed. Payload: `{ messageId, contentId, versionId }` |
| `chat.message.generation.started` | Generation begins. Payload: `{ chatId }` |
| `chat.message.generation.chunk` | One streaming chunk received. Payload: `{ contentId, text, blockType }` |
| `chat.message.generation.completed` | Generation finished. Payload: `{ contentId, text, finishReason }` |
| `chat.message.generation.failed` | Generation failed. |
| `chat.ActiveBranchPath.changed` | The active path changed (high-level hook for most UI scripts). Payload: `{ reason, changedMessageId, changedContentId, activeLeafMessageId, activeLeafContentId, branchPath }` (`branchPath` may be partial or empty) |

`finishReason` values: `"stop"`, `"length"`, `"content_filter"`, `"cancelled"`, `"error"`.

Handlers can be async. Use `TAI.once(event, handler)` when a handler should fire only once.

## Storage

Both stores are persistent — they survive closing and reopening the chat. The difference is scope.

### `TAI.store.chat`

`TAI.store.chat` holds one value per key for the entire chat.

Good fit for state that has no meaningful branch history — settings, toggles, metadata that belongs to the chat as a whole rather than to any particular conversation path.

### `TAI.store.message.content`

`TAI.store.message.content` stores data on a specific message content.

A message is the position in the chat. Its content is the active reply variant inside that message. When a message has several content swipes, each content record can have its own stored data.

Good fit for data produced by one generated reply: parsed damage, a label, a roll result, a score, or UI state that belongs to that exact response text.

Use `TAI.store.chat` for state that belongs to the whole chat. Use `TAI.store.message.content` when the value belongs to one specific reply content.

## UI tools

PM Scripts can render scene UI in `TAI.ui.container`.

They can also register message content decorators when UI belongs before or after a specific message content.

```js
TAI.ui.container.innerHTML = `<div>Scene state: active</div>`;
```

Use `TAI.ui.showNotification(message, type)` for small scene notifications.

## Example shape

```js
let hp = 100;

TAI.on("chat.load", () => {
  render();
  // chat.ActiveBranchPath.changed fires shortly after and loads the correct value
});

TAI.on("chat.message.generation.completed", async (msg) => {
  const damage = parseDamage(msg.text);
  if (damage) {
    hp = Math.max(0, hp - damage);
  }
  // Store HP on this specific swipe so branching reads the right value
  await TAI.store.message.content.set(msg.contentId, "hp", hp);
  render();
});

TAI.on("chat.ActiveBranchPath.changed", async (data) => {
  if (!data.activeLeafContentId) return;
  // Load HP from the current active leaf content
  hp = (await TAI.store.message.content.get(data.activeLeafContentId, "hp")) ?? 100;
  render();
});

function render() {
  TAI.ui.container.innerHTML = `<div>HP: ${hp}</div>`;
}
```

The HP value is stored on the generated reply content. When the active content changes, the script loads the HP value attached to that exact content record.

## PM Scripts and Macros

PM Scripts and Macros often work together, but they belong to different layers.

### Macros

- run on the server;
- affect prompt text;
- execute during prompt building.

### PM Scripts

- run in the browser;
- react to chat events;
- affect UI and interactive behavior.

They can share state through `TAI.store.chat`. A script can update chat storage in the browser, then a Macro can read that value during a later generation.

## Safety

PM Scripts are active JavaScript running in the browser. Treat PM Scripts like extensions: only enable scripts from sources you trust and understand.

### Imported script policy

Imported PM Scripts pass through several safety gates before they can run.

- Packs with scripts can be blocked from import by server policy.
- Imported scripts are marked as imported by the server.
- Imported scripts start unapproved and must be approved before enabling.
- Running imported scripts can be disabled by server policy.
- Editing imported script code can be disabled by server policy.

These policies come from `config.yaml` and are read-only from the app UI.

Good practice:

- review imported scripts before enabling them;
- keep scene-specific logic small and readable;
- store shared state explicitly instead of hiding it in local variables;
- use [Macros](/docs/macros/) when the job is prompt text or post-generation text cleanup.

## Next

- [Macros](/docs/macros/) for server-side dynamic prompt text.
- [Card Placeholders Reference](/docs/placeholders/) for card names and prompt context values.
