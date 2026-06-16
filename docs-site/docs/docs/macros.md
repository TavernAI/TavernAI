---
title: Macros
description: Server-side JavaScript for prompt-time and post-generation processing inside Prompt Manager items.
sidebar:
  order: 60
---
<small><em>Tech term: Safe Scripts</em></small>

Macros let Prompt Manager text run small JavaScript snippets during generation.

Use them when prompt text needs a computed value, shared state, random variation, or post-generation cleanup.


## Macros run in two phases

TavernAI has two Macro forms, and both run on the server.

- `<% ... %>` is pre-gen. It runs while TavernAI is building the prompt. Its output becomes part of the prompt sent to the model.
- `<%% ... %%>` is post-gen. It runs after the AI response is received and can inspect and rewrite generated blocks before the final message is shown.

Macros are server-side tools. If the job belongs to the live browser scene, use [PM Scripts](/docs/pm-scripts/).

## What Macros are for

Use Macros when prompt text or generated message content should be computed instead of left static.

Good fit:

- random variation;
- time-based text;
- conditional wording;
- prompt text that depends on shared state;
- post-processing generated text before it is finalized;
- persistent chat state that should reappear in later generations.

## Macro syntax

### Pre-gen: `<% %>`

Pre-gen Macros execute during prompt building.

```txt
The room feels <% rand(["warm", "cold", "silent"]) %>.
```

If a block contains an expression, its result is inserted into the text.

For more control, use `print()`.

```txt
<%
print("Turn: ");
print((TAI.store.chat.get("turn") || 0) + 1);
%>
```

### Post-gen: `<%% %%>`

Post-gen Macros run after the AI response is received. Use this form when the response should be changed after generation.

```txt
<%%
for (var i = 0; i < TAI.generated.blocks.length; i++) {
	var block = TAI.generated.blocks[i];
	if (block.type !== "text") continue;
	block.text = block.text.replace(/OOC:/g, "(OOC:");
}
%%>
```



## One item, two execution phases

All `<% %>` blocks inside the same Prompt Manager item execute in order during prompt building.

`<%% %%>` blocks from the same item run later, after generation.

Do not rely on local JavaScript variables crossing from pre-gen to post-gen. If data from `<% %>` should be available to `<%% %%>`, write it to `TAI.vars` or `TAI.store.chat`.

Different items do not share local JavaScript variables with each other. If data needs to move between items, use `TAI.vars` or `TAI.store.chat`.

## Placeholders and Macros

Placeholders and Macros solve different jobs.

- placeholders substitute known context values;
- Macros compute or assemble text, or post-process generated text.

Placeholder resolution happens before pre-gen Macro execution. `<% %>` runs on top of already resolved prompt context.

`<%% %%>` blocks are never inserted into the prompt, so they do not behave like placeholder text at all.

Use [Placeholders Reference](/docs/placeholders/) when the value already exists in context. Use a Macro when the value needs to be computed.

## The main data tools

### `TAI.vars`

`TAI.vars` is shared state for one prompt build.

Use it when one item needs to pass a value to another item in the same generation, or when a `<% %>` block should prepare data for a later `<%% %%>` block.

Good fit:

- rolling a value once and reusing it later in the same prompt;
- computing a shared state value near the top of the tree;
- letting several items react to one temporary result;
- bridging pre-gen and post-gen logic in the same prompt cycle.

```txt
<% TAI.vars.set("mood", rand(["tense", "calm", "alert"])) %>
```

Later in another item:

```txt
Current mood: <% TAI.vars.get("mood") %>
```

Pre-gen to post-gen bridge:

```txt
<% TAI.vars.set("target", "OOC:") %>

<%%
var target = TAI.vars.get("target");
for (var i = 0; i < TAI.generated.blocks.length; i++) {
	var block = TAI.generated.blocks[i];
	if (block.type !== "text") continue;
	block.text = block.text.replace(new RegExp(target, "g"), "(OOC:");
}
%%>
```

### `TAI.store.chat`

`TAI.store.chat` is persistent state tied to the current chat.

Use it when the value should survive across generations and across reopening the chat.

Good fit:

- turn counters;
- lightweight RPG state;
- scene flags;
- values written now and reused later.

```txt
<%
var turn = TAI.store.chat.get("turn") || 0;
turn++;
TAI.store.chat.set("turn", turn);
print("Turn " + turn);
%>
```

### `TAI.generated`

`TAI.generated` is available in `<%% %%>` blocks.

Use it when post-gen logic should read or rewrite the received message.

A `TAI.generated.message.content.blocks` is one part of the generated response. It can be normal text or a think block, and models can alternate between block types when they produce the response.

Common examples:

- `TAI.generated.blocks` — short alias for `TAI.generated.message.content.blocks`
- `TAI.generated.message.content.blocks` — full path to the generated content blocks
- `TAI.generated.finishReason`

Use `TAI.generated.blocks` when you want to rewrite generated text before the final message reaches the user.

### `TAI.chat`, `TAI.card`, and `TAI.time`

Pre-gen Macros can also read structured context directly.

Common examples:

- `TAI.chat.messageCount`
- `TAI.chat.lastMessage`
- `TAI.card.names`
- `TAI.time.hour`

These are useful when the prompt should react to the current conversation, current participants, or current time.

### Built-in helpers

Macros also expose a small set of helpers for common prompt work:

- `print()`
- `rand()`
- `dice()`
- `chance()`

These cover a large part of dynamic prompt writing without needing a larger runtime.

### Debug output

Use `TAI.debug.log(...)` when a Macro needs diagnostic output. It writes to the backend log/console and does not add text to the prompt or the generated message.

```js
TAI.debug.log('state', { hp: 10 }, TAI.chat.messageCount);
```

## Common patterns

### Random variation

Use a Macro when a repeated instruction or description should rotate between several forms.

### Shared per-generation state

Use `TAI.vars` when several items in the same prompt need one shared value.

### Persistent chat state

Use `TAI.store.chat` when the state should survive and affect future generations.

### Post-process generated text

Use `<%% %%>` when the generated message should be rewritten after receipt, for example to normalize tags, fix known output patterns, or apply scene-specific cleanup.

## Macros and PM Scripts

Macros and PM Scripts sit on different layers.

### Use Macros when

- the item needs computed prompt text with `<% %>`;
- the generated message should be rewritten right after receipt with `<%% %%>`;
- state should influence later prompt output or post-processing.

### Use PM Scripts when

- the logic belongs in the browser;
- the script reacts to chat events in real time;
- the result is UI behavior, notifications, or browser-side interaction.

If the job is to rewrite generated blocks before the final message is shown, start with post-gen `<%% %%>`, not PM Scripts.

## Limits

Both Macro forms run in a safe server-side sandbox.

That means they are intentionally narrow:

- no DOM access;
- no browser APIs;
- no network fetches;
- no `eval()` or `new Function()`;
- no timer-based browser logic.

Macros stay inside prompt-side scripting boundaries.

## Next

- [Card Placeholders Reference](/docs/placeholders/) for simple context values.
- [PM Scripts](/docs/pm-scripts/) for browser-side logic.
