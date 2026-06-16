---
title: Card Placeholders Reference
description: How card placeholders resolve in card prompts, chat prompts, and chat messages.
sidebar:
  order: 55
---
<small><em>Tech term: Text Placeholder Resolution</em></small>

Card placeholders insert card names from the current chat or prompt context.

They use double braces:

```txt
{{ai_card}}
{{this_card}}
```

Use this page when you need to know what a card placeholder becomes in a specific context.

## Card placeholders

| Placeholder | Meaning |
|---|---|
| `{{ai_card}}` | Cards selected for AI generation |
| `{{user_card}}` | Cards selected for user input |
| `{{user}}` | Legacy alias for `{{user_card}}` |
| `{{ctx_card}}` | Cards with context enabled |
| `{{char}}` | Legacy character placeholder; meaning depends on context |
| `{{this_card}}` | The current card when the context has one |

## How card placeholders resolve

| Placeholder | Card Prompt Manager | Chat Prompt Manager | Chat messages |
|---|---|---|---|
| `{{ai_card}}` | AI-selected cards in the chat | AI-selected cards in the chat | AI-selected cards in the chat |
| `{{user_card}}` | User-selected cards in the chat | User-selected cards in the chat | User-selected cards in the chat |
| `{{user}}` | Same as `{{user_card}}` | Same as `{{user_card}}` | Same as `{{user_card}}` |
| `{{ctx_card}}` | Cards with context enabled in the chat | Cards with context enabled in the chat | Cards with context enabled in the chat |
| `{{char}}` | The card that owns the prompt | Same as `{{ai_card}}` | Card names attached to the message; falls back to `{{ai_card}}` |
| `{{this_card}}` | The card that owns the prompt | Empty | Card names attached to the message |

## Which one to use

| If you need | Use |
|---|---|
| The current card inside a card prompt | `{{this_card}}` |
| AI participant names | `{{ai_card}}` |
| User participant names | `{{user_card}}` |
| Cards whose Prompt Manager is added to context | `{{ctx_card}}` |
| Legacy character-style text | `{{char}}` |

For new prompt text, use the explicit placeholder when you know what value you want. `{{char}}` and `{{user}}` exists for compatibility and familiar tavern-style prompt text.

## Examples

Card prompt:

```txt
{{this_card}} description
```

Chat prompt:

```txt
Write as {{ai_card}}:
```

Message text:

```txt
This message belongs to {{this_card}}.
```

## Utility placeholders

These are not card placeholders, but they use the same double-brace syntax.

| Placeholder | Meaning |
|---|---|
| `{{date}}` | Current date |
| `{{time}}` | Current time |
| `{{rand:N}}` | Random integer from `0` to `N` |

Utility text:

```txt
Today is {{date}}. Roll: {{rand:20}}.
```

## Next

- [Getting Started](/docs/getting-started/) for the TavernAI 2 prompt model.
- [Macros](/docs/macros/) for dynamic prompt text and post-generation changes.
- [PM Scripts](/docs/pm-scripts/) for interactive scene scripting.
