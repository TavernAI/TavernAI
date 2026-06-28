---
title: PM Scripts
description: Extension-level scripting für interaktive TavernAI-Szenen.
sidebar:
  order: 70
---
<small><em>Tech term: PM Scripts</em></small>

PM Scripts (Prompt Manager Scripts) sind extension-level scripts, die direkt im Prompt Manager für interaktive Szenen geschrieben werden.

Sie laufen im Browser, während ein Chat geöffnet ist, und können TavernAI APIs für events, UI, storage und chat state verwenden.

Nutze sie, wenn du eigene Panels in der Oberfläche, live indicators, Zustand pro Antwort oder interaktive Logik brauchst.

## Prompt Manager Scripts laufen im Browser

PM Scripts sind script items im Prompt Manager, die im Browser ausgeführt werden, wenn ein Chat geöffnet ist.

Sie reagieren auf chat events, rendern UI und speichern Zustand zwischen Sitzungen.

Ihre Aufgabe ist interaktives Verhalten rund um den Chat. Prompt-Bau gehört zu prompt text und [Macros](/de/docs/macros/).

## Wofür PM Scripts da sind

Nutze PM Scripts, wenn Logik zur live chat session gehört und nicht zum Prompt-Text selbst.

Geeignet für:

- UI panels und indicators;
- custom AI games und playable scenes;
- scene helpers, die an Chat-Aktivität gebunden sind;
- custom message decorations;
- event-driven logic nach Abschluss der Generation;
- Zustand, der aktualisiert werden soll, während der Chat geöffnet ist;
- per-chat oder per-reply Verhalten im Browser.

## Ausführungsmodell

PM Scripts starten beim Öffnen eines Chats und stoppen, wenn der Chat geschlossen oder gewechselt wird.

Jedes Script läuft in seinem eigenen isolierten scope. Lokale Variablen bleiben in diesem Script, sofern du nicht ausdrücklich shared storage verwendest.

## Root code und event handlers

Das saubere Pattern ist:

- root code registriert handlers;
- event handlers erledigen die eigentliche Arbeit;
- `chat.load` übernimmt async setup und das Laden des Anfangszustands.

Root code bleibt klein, und chat-driven logic lebt in event handlers.

## Events

PM Scripts abonnieren chat events mit `TAI.on(event, handler)`.

| Event | Wann es ausgelöst wird |
|---|---|
| `chat.load` | Der Chat ist geöffnet, alle scripts sind initialisiert. Für async setup und Laden des Anfangszustands. |
| `chat.unload` | Der Chat wird geschlossen oder gewechselt. Für abschließendes Speichern des Zustands. |
| `chat.message.created` | Eine neue Nachricht wurde erstellt. Payload: `{ messageId, origin, text, activeContentId }` |
| `chat.message.selected` | Die aktive Nachricht in einem Branch hat sich geändert. Payload: `{ messageId }` |
| `chat.message.deleted` | Eine Nachricht wurde gelöscht. |
| `chat.message.content.selected` | Der aktive content in einer Nachricht hat sich geändert. Payload: `{ messageId, previousContentId, contentId }` |
| `chat.message.content.deleted` | Ein message content record wurde gelöscht. |
| `chat.message.content.version.selected` | Die aktive content version hat sich geändert. Payload: `{ messageId, contentId, versionId }` |
| `chat.message.generation.started` | Die Generation beginnt. Payload: `{ chatId }` |
| `chat.message.generation.chunk` | Ein streaming chunk wurde empfangen. Payload: `{ contentId, text, blockType }` |
| `chat.message.generation.completed` | Die Generation ist abgeschlossen. Payload: `{ contentId, text, finishReason }` |
| `chat.message.generation.failed` | Die Generation ist fehlgeschlagen. |
| `chat.ActiveBranchPath.changed` | Der aktive Pfad hat sich geändert (high-level hook für die meisten UI scripts). Payload: `{ reason, changedMessageId, changedContentId, activeLeafMessageId, activeLeafContentId, branchPath }` (`branchPath` kann teilweise oder leer sein) |

`finishReason`-Werte: `"stop"`, `"length"`, `"content_filter"`, `"cancelled"`, `"error"`.

Handlers können async sein. Nutze `TAI.once(event, handler)`, wenn ein handler nur einmal ausgeführt werden soll.

## Storage

Beide stores sind persistent: sie bleiben nach Schließen und erneutem Öffnen des Chats erhalten. Der Unterschied liegt im scope.

### `TAI.store.chat`

`TAI.store.chat` speichert einen Wert pro Schlüssel für den gesamten Chat.


Geeignet für Zustand ohne eigene Branch-Historie: settings, toggles, metadata, die zum gesamten Chat gehören und nicht zu einem bestimmten Gesprächspfad.

### `TAI.store.message.content`

`TAI.store.message.content` speichert Daten auf einem bestimmten message content.

Eine Nachricht ist eine Position im Chat. Ihr content ist die aktive reply variant innerhalb dieser Nachricht. Wenn eine Nachricht mehrere content swipes hat, kann jeder content record eigene stored data haben.

Geeignet für Daten, die aus einer generierten Antwort stammen: parsed damage, label, roll result, score oder UI state, der genau zu diesem Antworttext gehört.

Nutze `TAI.store.chat` für Zustand des gesamten Chats. Nutze `TAI.store.message.content`, wenn der Wert zu einem bestimmten reply content gehört.

## UI tools

PM Scripts können scene UI in `TAI.ui.container` rendern.

Sie können auch message content decorators registrieren, wenn UI vor oder nach einem bestimmten message content gehört.

```js
TAI.ui.container.innerHTML = `<div>Scene state: active</div>`;
```

Nutze `TAI.ui.showNotification(message, type)` für kleine scene notifications.

## ChatCards und Generierung

PM Scripts können die ChatCards des aktuellen Chats lesen und eine Generierung mit temporären participant overrides starten.

Nutze `TAI.chat.getChatCards()`, um eine flache Liste der ChatCards im geöffneten Chat zu bekommen:

```js
const chatCards = await TAI.chat.getChatCards();
// [{ id, cardId, name, chatRolePlaceholderId, isSelectedForGenerated, ... }]
```

`id` ist die ChatCard ID: die konkrete Card-Verknüpfung im aktuellen Chat. `cardId` ist die Library Card ID. Wenn ein Script auswählt, wer in diesem Chat antworten soll, verwende `chatCardId` in generation overrides.

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

`cardId` ist nur für Kompatibilität mit älterem card-level Verhalten gedacht. Wenn dieselbe Library Card mehrfach in einem Chat vorhanden ist, kann `cardId` mehrere ChatCards treffen; `chatCardId` wählt den exakten Eintrag im aktuellen Chat.

Für einmalige helper calls nutze `saveResult: false`, `emitToClient: false` und `stream: false`. Die Antwort enthält `generatedText` und erstellt keine sichtbare Chat-Nachricht.

Wenn du `customPrompt` übergibst, umgeht der helper call die normale chat prompt construction und sendet nur diesen raw prompt. Wenn der helper die aktuelle Chat-Historie und den Prompt Manager sehen soll, lass `customPrompt` weg und nutze stattdessen `injectedPrompts`.

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

Der HP-Wert wird auf dem content der generierten Antwort gespeichert. Wenn active content wechselt, lädt das Script den HP-Wert, der genau an diesen content record gebunden ist.

## PM Scripts und Macros

PM Scripts und Macros arbeiten oft zusammen, gehören aber zu unterschiedlichen Ebenen.

### Macros

- laufen auf dem Server;
- beeinflussen prompt text;
- laufen während prompt building.

### PM Scripts

- laufen im Browser;
- reagieren auf chat events;
- beeinflussen UI und interactive behavior.

Sie können Zustand über `TAI.store.chat` teilen. Ein Script kann chat storage im Browser aktualisieren, und eine Macro kann diesen Wert in einer späteren Generation lesen.

## Sicherheit

PM Scripts sind aktives JavaScript, das im Browser läuft. Behandle PM Scripts wie extensions: aktiviere nur scripts aus Quellen, denen du vertraust und die du verstehst.

### Policy für importierte scripts

Importierte PM Scripts durchlaufen mehrere safety gates, bevor sie ausgeführt werden können.

- Packs mit scripts können beim Import durch server policy blockiert werden.
- Importierte scripts werden vom Server als imported markiert.
- Importierte scripts können als unapproved markiert werden und müssen vor Aktivierung approved werden.
- Das Ausführen importierter scripts kann durch server policy deaktiviert werden.
- Das Bearbeiten des Codes eines importierten script kann durch server policy deaktiviert werden.

Diese policies kommen aus `config.yaml` und sind in der App-UI nur lesbar.

Praxis:

- prüfe importierte scripts, bevor du sie aktivierst;
- halte scene-specific logic klein und lesbar;
- speichere shared state ausdrücklich, statt ihn in lokalen Variablen zu verstecken;
- nutze [Macros](/de/docs/macros/), wenn die Aufgabe zu prompt text oder post-generation text cleanup gehört.

## Weiter

- [PM Script Beispiele](/de/docs/pm-script-examples/) für einsatzbereite script patterns.
- [Macros](/de/docs/macros/) für server-side dynamic prompt text.
- [Referenz für Karten-Placeholders](/de/docs/placeholders/) für Kartennamen und prompt context-Werte.