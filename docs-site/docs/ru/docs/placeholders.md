---
title: Справочник карточных плейсхолдеров
description: Как карточные плейсхолдеры разрешаются в промптах карточек, промптах чата и сообщениях чата.
sidebar:
  order: 55
---
<small><em>Tech term: Text Placeholder Resolution</em></small>

Плейсхолдеры вставляют имена карточек из текущего чата или prompt context.

Они используют двойные фигурные скобки:

```txt
{{ai_card}}
{{this_card}}
```

Используйте эту страницу, когда нужно понять, во что превращается плейсхолдеры в конкретном контексте.

## Плейсхолдеры

| Placeholder | Значение |
|---|---|
| `{{ai_card}}` | Карточки, выбранные для AI generation |
| `{{user_card}}` | Карточки, выбранные для user input |
| `{{user}}` | Legacy alias для `{{user_card}}` |
| `{{ctx_card}}` | Карточки с включенным context |
| `{{char}}` | Legacy character placeholder; значение зависит от контекста |
| `{{this_card}}` | Текущая карточка, если она есть в контексте |

## Как обрабатываются плейсхолдеры

| Placeholder | Card Prompt Manager | Chat Prompt Manager | Chat messages |
|---|---|---|---|
| `{{ai_card}}` | AI-selected cards in the chat | AI-selected cards in the chat | AI-selected cards in the chat |
| `{{user_card}}` | User-selected cards in the chat | User-selected cards in the chat | User-selected cards in the chat |
| `{{user}}` | То же, что `{{user_card}}` | То же, что `{{user_card}}` | То же, что `{{user_card}}` |
| `{{ctx_card}}` | Карточки с включенным context в чате | Карточки с включенным context в чате | Карточки с включенным context в чате |
| `{{char}}` | Карточка, которой принадлежит промпт | То же, что `{{ai_card}}` | Имена карточек, прикрепленные к сообщению; fallback на `{{ai_card}}` |
| `{{this_card}}` | Карточка, которой принадлежит промпт | Пусто | Имена карточек, прикрепленные к сообщению |

## Что использовать

| Если нужно | Используйте |
|---|---|
| Текущая карточка внутри промпта карточки | `{{this_card}}` |
| Имена текущих AI-участников | `{{ai_card}}` |
| Имена текущих user-участников | `{{user_card}}` |
| Карточки, чей Prompt Manager добавлен в context | `{{ctx_card}}` |
| Legacy character-style text | `{{char}}` |

В новом тексте промпта используйте явный плейсхолдер, когда знаете, какое значение нужно. `{{char}}` и `{{user}}` существуют для совместимости и привычного tavern-style prompt text.

## Примеры

Промпт карточки:

```txt
{{this_card}} description
```

Промпт чата:

```txt
Write as {{ai_card}}:
```

Текст сообщения:

```txt
This message belongs to {{this_card}}.
```

## Utility placeholders

Это не карточные плейсхолдеры, но они используют тот же синтаксис двойных фигурных скобок.

| Placeholder | Значение |
|---|---|
| `{{date}}` | Текущая дата |
| `{{time}}` | Текущее время |
| `{{rand:N}}` | Случайное целое число от `0` до `N` |

Utility text:

```txt
Today is {{date}}. Roll: {{rand:20}}.
```

## Дальше

- [Начало работы](/ru/docs/getting-started/) для prompt model TavernAI 2.
- [Macros](/ru/docs/macros/) для dynamic prompt text и post-generation changes.
- [PM Scripts](/ru/docs/pm-scripts/) для interactive scene scripting.