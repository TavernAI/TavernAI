---
title: Referenz für Karten-Placeholders
description: Wie Karten-Placeholders in Karten-Prompts, Chat-Prompts und Chat-Nachrichten aufgelöst werden.
sidebar:
  order: 55
---
<small><em>Tech term: Text Placeholder Resolution</em></small>

Placeholders fügen Kartennamen aus dem aktuellen Chat oder prompt context ein.

Sie verwenden doppelte geschweifte Klammern:

```txt
{{ai_card}}
{{this_card}}
```

Nutze diese Seite, wenn du wissen musst, was ein Placeholder in einem bestimmten Kontext wird.

## Placeholders

| Placeholder | Bedeutung |
|---|---|
| `{{ai_card}}` | Karten, die für AI generation ausgewählt sind |
| `{{user_card}}` | Karten, die für user input ausgewählt sind |
| `{{user}}` | Legacy alias für `{{user_card}}` |
| `{{ctx_card}}` | Karten mit aktiviertem context |
| `{{char}}` | Legacy character placeholder; Bedeutung hängt vom Kontext ab |
| `{{this_card}}` | Die aktuelle Karte, wenn sie im Kontext vorhanden ist |

## Wie Placeholders verarbeitet werden

| Placeholder | Card Prompt Manager | Chat Prompt Manager | Chat messages |
|---|---|---|---|
| `{{ai_card}}` | AI-selected Karten im Chat | AI-selected Karten im Chat | AI-selected Karten im Chat |
| `{{user_card}}` | User-selected Karten im Chat | User-selected Karten im Chat | User-selected Karten im Chat |
| `{{user}}` | Wie `{{user_card}}` | Wie `{{user_card}}` | Wie `{{user_card}}` |
| `{{ctx_card}}` | Karten mit aktiviertem context im Chat | Karten mit aktiviertem context im Chat | Karten mit aktiviertem context im Chat |
| `{{char}}` | Die Karte, der der Prompt gehört | Wie `{{ai_card}}` | Kartennamen, die an die Nachricht angehängt sind; fallback auf `{{ai_card}}` |
| `{{this_card}}` | Die Karte, der der Prompt gehört | Leer | Kartennamen, die an die Nachricht angehängt sind |

## Was verwenden

| Wenn du brauchst | Verwende |
|---|---|
| Die aktuelle Karte in einem Karten-Prompt | `{{this_card}}` |
| Namen der aktuellen AI-Teilnehmer | `{{ai_card}}` |
| Namen der aktuellen user-Teilnehmer | `{{user_card}}` |
| Karten, deren Prompt Manager zum context hinzugefügt wird | `{{ctx_card}}` |
| Legacy character-style text | `{{char}}` |

In neuen Prompts verwende den expliziten Placeholder, wenn du weißt, welchen Wert du brauchst. `{{char}}` und `{{user}}` existieren für Kompatibilität und für tavern-style prompt text.

## Beispiele

Karten-Prompt:

```txt
{{this_card}} description
```

Chat-Prompt:

```txt
Write as {{ai_card}}:
```

Nachrichtentext:

```txt
This message belongs to {{this_card}}.
```

## Utility placeholders

Das sind keine Karten-Placeholders, sie verwenden aber dieselbe Syntax mit doppelten geschweiften Klammern.

| Placeholder | Bedeutung |
|---|---|
| `{{date}}` | Aktuelles Datum |
| `{{time}}` | Aktuelle Uhrzeit |
| `{{rand:N}}` | Zufällige Ganzzahl von `0` bis `N` |

Utility text:

```txt
Today is {{date}}. Roll: {{rand:20}}.
```

## Weiter

- [Erste Schritte](/de/docs/getting-started/) für das prompt model von TavernAI 2.
- [Macros](/de/docs/macros/) für dynamic prompt text und post-generation changes.
- [PM Scripts](/de/docs/pm-scripts/) für interactive scene scripting.