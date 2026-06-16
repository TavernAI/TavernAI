---
title: Referencia de placeholders de tarjetas
description: Cómo se resuelven los placeholders de tarjetas en prompts de tarjeta, prompts de chat y mensajes de chat.
sidebar:
  order: 55
---
<small><em>Tech term: Text Placeholder Resolution</em></small>

Los placeholders insertan nombres de tarjetas desde el chat actual o el prompt context.

Usan llaves dobles:

```txt
{{ai_card}}
{{this_card}}
```

Usa esta página cuando necesites saber en qué se convierte un placeholder en un contexto concreto.

## Placeholders

| Placeholder | Significado |
|---|---|
| `{{ai_card}}` | Tarjetas seleccionadas para AI generation |
| `{{user_card}}` | Tarjetas seleccionadas para user input |
| `{{user}}` | Legacy alias de `{{user_card}}` |
| `{{ctx_card}}` | Tarjetas con context activado |
| `{{char}}` | Legacy character placeholder; el significado depende del contexto |
| `{{this_card}}` | La tarjeta actual, si existe en el contexto |

## Cómo se procesan los placeholders

| Placeholder | Card Prompt Manager | Chat Prompt Manager | Chat messages |
|---|---|---|---|
| `{{ai_card}}` | Tarjetas AI-selected en el chat | Tarjetas AI-selected en el chat | Tarjetas AI-selected en el chat |
| `{{user_card}}` | Tarjetas user-selected en el chat | Tarjetas user-selected en el chat | Tarjetas user-selected en el chat |
| `{{user}}` | Igual que `{{user_card}}` | Igual que `{{user_card}}` | Igual que `{{user_card}}` |
| `{{ctx_card}}` | Tarjetas con context activado en el chat | Tarjetas con context activado en el chat | Tarjetas con context activado en el chat |
| `{{char}}` | La tarjeta a la que pertenece el prompt | Igual que `{{ai_card}}` | Nombres de tarjetas adjuntos al mensaje; fallback a `{{ai_card}}` |
| `{{this_card}}` | La tarjeta a la que pertenece el prompt | Vacío | Nombres de tarjetas adjuntos al mensaje |

## Qué usar

| Si necesitas | Usa |
|---|---|
| La tarjeta actual dentro de un prompt de tarjeta | `{{this_card}}` |
| Nombres de los participantes AI actuales | `{{ai_card}}` |
| Nombres de los participantes user actuales | `{{user_card}}` |
| Tarjetas cuyo Prompt Manager se agrega al context | `{{ctx_card}}` |
| Legacy character-style text | `{{char}}` |

En prompts nuevos, usa el placeholder explícito cuando sepas qué valor necesitas. `{{char}}` y `{{user}}` existen por compatibilidad y por el prompt text estilo tavern.

## Ejemplos

Prompt de tarjeta:

```txt
{{this_card}} description
```

Prompt de chat:

```txt
Write as {{ai_card}}:
```

Texto de mensaje:

```txt
This message belongs to {{this_card}}.
```

## Utility placeholders

Estos no son placeholders de tarjetas, pero usan la misma sintaxis de llaves dobles.

| Placeholder | Significado |
|---|---|
| `{{date}}` | Fecha actual |
| `{{time}}` | Hora actual |
| `{{rand:N}}` | Entero aleatorio de `0` a `N` |

Utility text:

```txt
Today is {{date}}. Roll: {{rand:20}}.
```

## Siguiente

- [Primeros pasos](/es/docs/getting-started/) para el prompt model de TavernAI 2.
- [Macros](/es/docs/macros/) para dynamic prompt text y post-generation changes.
- [PM Scripts](/es/docs/pm-scripts/) para interactive scene scripting.