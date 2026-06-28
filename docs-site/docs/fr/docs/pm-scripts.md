---
title: PM Scripts
description: Extension-level scripting pour les scènes interactives TavernAI.
sidebar:
  order: 70
---
<small><em>Tech term: PM Scripts</em></small>

PM Scripts (Prompt Manager Scripts) sont des extension-level scripts écrits directement dans Prompt Manager pour les scènes interactives.

Ils s'exécutent dans le navigateur pendant qu'un chat est ouvert et peuvent utiliser les TavernAI APIs pour events, UI, storage et chat state.

Utilisez-les quand vous devez ajouter des panneaux personnalisés à l'interface, des live indicators, un état par réponse ou une logique interactive.

## Prompt Manager Scripts fonctionnent dans le navigateur

PM Scripts sont des script items dans Prompt Manager qui s'exécutent dans le navigateur quand un chat est ouvert.

Ils réagissent aux chat events, rendent de l'UI et sauvegardent l'état entre les sessions.

Leur rôle est le comportement interactif autour du chat. La construction du prompt appartient au prompt text et aux [Macros](/fr/docs/macros/).

## À quoi servent PM Scripts

Utilisez PM Scripts quand la logique appartient à la live chat session, pas au texte du prompt lui-même.

Adapté pour :

- UI panels et indicators;
- custom AI games et playable scenes;
- scene helpers liés à l'activité du chat;
- custom message decorations;
- event-driven logic après la fin de la génération;
- état qui doit se mettre à jour pendant que le chat est ouvert;
- comportement per-chat ou per-reply dans le navigateur.

## Modèle d'exécution

PM Scripts démarrent quand un chat s'ouvre et s'arrêtent quand le chat se ferme ou change.

Chaque script s'exécute dans son propre scope isolé. Les variables locales restent dans ce script, sauf si vous utilisez explicitement shared storage.

## Root code et event handlers

Le pattern propre est :

- root code enregistre les handlers;
- event handlers font le travail principal;
- `chat.load` gère l'async setup et le chargement de l'état initial.

Root code reste petit, et la chat-driven logic vit dans event handlers.

## Events

PM Scripts s'abonnent aux chat events avec `TAI.on(event, handler)`.

| Event | Quand il se déclenche |
|---|---|
| `chat.load` | Le chat est ouvert et tous les scripts sont initialisés. Utilisez-le pour async setup et chargement de l'état initial. |
| `chat.unload` | Le chat se ferme ou change. Utilisez-le pour sauvegarder l'état final. |
| `chat.message.created` | Un nouveau message a été créé. Payload: `{ messageId, origin, text, activeContentId }` |
| `chat.message.selected` | Le message actif dans une branche a changé. Payload: `{ messageId }` |
| `chat.message.deleted` | Un message a été supprimé. |
| `chat.message.content.selected` | Le content actif dans un message a changé. Payload: `{ messageId, previousContentId, contentId }` |
| `chat.message.content.deleted` | Un message content record a été supprimé. |
| `chat.message.content.version.selected` | La content version active a changé. Payload: `{ messageId, contentId, versionId }` |
| `chat.message.generation.started` | La génération commence. Payload: `{ chatId }` |
| `chat.message.generation.chunk` | Un streaming chunk a été reçu. Payload: `{ contentId, text, blockType }` |
| `chat.message.generation.completed` | La génération est terminée. Payload: `{ contentId, text, finishReason }` |
| `chat.message.generation.failed` | La génération a échoué. |
| `chat.ActiveBranchPath.changed` | Le chemin actif a changé (high-level hook pour la plupart des UI scripts). Payload: `{ reason, changedMessageId, changedContentId, activeLeafMessageId, activeLeafContentId, branchPath }` (`branchPath` peut être partiel ou vide) |

Valeurs de `finishReason` : `"stop"`, `"length"`, `"content_filter"`, `"cancelled"`, `"error"`.

Les handlers peuvent être async. Utilisez `TAI.once(event, handler)` quand un handler ne doit s'exécuter qu'une seule fois.

## Storage

Les deux stores sont persistants : ils survivent à la fermeture et à la réouverture du chat. La différence est dans le scope.

### `TAI.store.chat`

`TAI.store.chat` garde une valeur par clé pour tout le chat.


Adapté pour un état sans historique séparé par branches : settings, toggles, metadata qui appartiennent au chat complet, pas à un chemin précis de la conversation.

### `TAI.store.message.content`

`TAI.store.message.content` garde des données sur un message content précis.

Un message est une position dans le chat. Son content est la reply variant active dans ce message. Quand un message a plusieurs content swipes, chaque content record peut avoir ses propres stored data.

Adapté pour les données produites par une réponse générée : parsed damage, label, roll result, score ou UI state appartenant exactement à ce texte de réponse.

Utilisez `TAI.store.chat` pour l'état de tout le chat. Utilisez `TAI.store.message.content` quand la valeur appartient à un reply content précis.

## UI tools

PM Scripts peuvent rendre de la scene UI dans `TAI.ui.container`.

Ils peuvent aussi enregistrer des message content decorators quand l'UI appartient avant ou après un message content précis.

```js
TAI.ui.container.innerHTML = `<div>Scene state: active</div>`;
```

Utilisez `TAI.ui.showNotification(message, type)` pour de petites scene notifications.

## ChatCards et génération

PM Scripts peuvent lire les ChatCards du chat actuel et lancer une génération avec des participant overrides temporaires.

Utilisez `TAI.chat.getChatCards()` pour obtenir une liste plate des ChatCards du chat ouvert :

```js
const chatCards = await TAI.chat.getChatCards();
// [{ id, cardId, name, chatRolePlaceholderId, isSelectedForGenerated, ... }]
```

`id` est le ChatCard ID : l'attachement concret de la Card dans le chat actuel. `cardId` est l'ID de la Card dans la bibliothèque. Quand un script choisit qui doit répondre dans ce chat, utilisez `chatCardId` dans les generation overrides.

```js
await TAI.chat.generate({
  cardOverrides: {
    replaceOriginal: true,
    items: [
      { chatCardId: selectedChatCard.id, isSelectedForGenerated: true }
    ]
  }
});
```

`cardId` sert seulement à la compatibilité avec l'ancien comportement card-level. Si la même Library Card apparaît plusieurs fois dans un chat, `cardId` peut correspondre à plusieurs ChatCards; `chatCardId` cible l'entrée exacte du chat actuel.

Pour les helper calls ponctuels, passez `saveResult: false`, `emitToClient: false` et `stream: false`. La réponse contient `generatedText` et ne crée pas de message visible dans le chat.

Si vous passez `customPrompt`, le helper call contourne la construction normale du chat prompt et envoie seulement ce raw prompt. Si le helper doit voir l'historique actuel du chat et le Prompt Manager, omettez `customPrompt` et utilisez `injectedPrompts`.

```js
const pick = await TAI.chat.generate({
  stream: false,
  saveResult: false,
  emitToClient: false,
  injectedPrompts: [{
    content: "Based on the current chat, return only JSON: {\"chatCardIds\":[123]}",
    chatRole: "system"
  }]
});

console.log(pick.generatedText);
```

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

La valeur HP est sauvegardée sur le content de la réponse générée. Quand l'active content change, le script charge le HP lié exactement à ce content record.

## PM Scripts et Macros

PM Scripts et Macros travaillent souvent ensemble, mais appartiennent à des couches différentes.

### Macros

- s'exécutent sur le serveur;
- affectent le prompt text;
- s'exécutent pendant prompt building.

### PM Scripts

- s'exécutent dans le navigateur;
- réagissent aux chat events;
- affectent l'UI et l'interactive behavior.

Ils peuvent partager un état via `TAI.store.chat`. Un script peut mettre à jour chat storage dans le navigateur, puis une Macro peut lire cette valeur pendant une génération ultérieure.

## Sécurité

PM Scripts sont du JavaScript actif exécuté dans le navigateur. Traitez PM Scripts comme des extensions : activez seulement les scripts provenant de sources auxquelles vous faites confiance et que vous comprenez.

### Politique des scripts importés

Les PM Scripts importés passent par plusieurs safety gates avant de pouvoir s'exécuter.

- Les packs avec scripts peuvent être bloqués à l'importation par server policy.
- Les scripts importés sont marqués par le serveur comme imported.
- Les scripts importés peuvent être marqués unapproved et doivent être approved avant activation.
- L'exécution de scripts importés peut être désactivée par server policy.
- L'édition du code d'un script importé peut être désactivée par server policy.

Ces policies viennent de `config.yaml` et sont disponibles depuis l'UI de l'application en lecture seule.

Pratique :

- vérifiez les scripts importés avant de les activer;
- gardez la scene-specific logic petite et lisible;
- sauvegardez shared state explicitement au lieu de le cacher dans des variables locales;
- utilisez [Macros](/fr/docs/macros/) quand la tâche appartient au prompt text ou au post-generation text cleanup.

## Suivant

- [Exemples de PM Scripts](/fr/docs/pm-script-examples/) pour des script patterns prêts à l'emploi.
- [Macros](/fr/docs/macros/) pour server-side dynamic prompt text.
- [Référence des placeholders de cartes](/fr/docs/placeholders/) pour les noms de cartes et les valeurs de prompt context.