---
title: Référence des placeholders de cartes
description: Comment les placeholders de cartes sont résolus dans les prompts de carte, les prompts de chat et les messages de chat.
sidebar:
  order: 55
---
<small><em>Tech term: Text Placeholder Resolution</em></small>

Les placeholders insèrent les noms de cartes depuis le chat actuel ou le prompt context.

Ils utilisent des doubles accolades :

```txt
{{ai_card}}
{{this_card}}
```

Utilisez cette page quand vous devez savoir ce que devient un placeholder dans un contexte précis.

## Placeholders

| Placeholder | Signification |
|---|---|
| `{{ai_card}}` | Cartes sélectionnées pour AI generation |
| `{{user_card}}` | Cartes sélectionnées pour user input |
| `{{user}}` | Legacy alias de `{{user_card}}` |
| `{{ctx_card}}` | Cartes avec context activé |
| `{{char}}` | Legacy character placeholder; la signification dépend du contexte |
| `{{this_card}}` | La carte actuelle, si elle existe dans le contexte |

## Comment les placeholders sont traités

| Placeholder | Card Prompt Manager | Chat Prompt Manager | Chat messages |
|---|---|---|---|
| `{{ai_card}}` | Cartes AI-selected dans le chat | Cartes AI-selected dans le chat | Cartes AI-selected dans le chat |
| `{{user_card}}` | Cartes user-selected dans le chat | Cartes user-selected dans le chat | Cartes user-selected dans le chat |
| `{{user}}` | Identique à `{{user_card}}` | Identique à `{{user_card}}` | Identique à `{{user_card}}` |
| `{{ctx_card}}` | Cartes avec context activé dans le chat | Cartes avec context activé dans le chat | Cartes avec context activé dans le chat |
| `{{char}}` | La carte à laquelle appartient le prompt | Identique à `{{ai_card}}` | Noms de cartes attachés au message; fallback vers `{{ai_card}}` |
| `{{this_card}}` | La carte à laquelle appartient le prompt | Vide | Noms de cartes attachés au message |

## Quoi utiliser

| Si vous avez besoin de | Utilisez |
|---|---|
| La carte actuelle dans un prompt de carte | `{{this_card}}` |
| Les noms des participants AI actuels | `{{ai_card}}` |
| Les noms des participants user actuels | `{{user_card}}` |
| Les cartes dont le Prompt Manager est ajouté au context | `{{ctx_card}}` |
| Legacy character-style text | `{{char}}` |

Dans les nouveaux prompts, utilisez le placeholder explicite quand vous savez quelle valeur vous voulez. `{{char}}` et `{{user}}` existent pour la compatibilité et pour le prompt text de style tavern.

## Exemples

Prompt de carte :

```txt
{{this_card}} description
```

Prompt de chat :

```txt
Write as {{ai_card}}:
```

Texte de message :

```txt
This message belongs to {{this_card}}.
```

## Utility placeholders

Ce ne sont pas des placeholders de cartes, mais ils utilisent la même syntaxe à doubles accolades.

| Placeholder | Signification |
|---|---|
| `{{date}}` | Date actuelle |
| `{{time}}` | Heure actuelle |
| `{{rand:N}}` | Entier aléatoire de `0` à `N` |

Utility text:

```txt
Today is {{date}}. Roll: {{rand:20}}.
```

## Suivant

- [Premiers pas](/fr/docs/getting-started/) pour le prompt model de TavernAI 2.
- [Macros](/fr/docs/macros/) pour dynamic prompt text et post-generation changes.
- [PM Scripts](/fr/docs/pm-scripts/) pour interactive scene scripting.