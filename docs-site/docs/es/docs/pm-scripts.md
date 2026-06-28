---
title: PM Scripts
description: Extension-level scripting para escenas interactivas de TavernAI.
sidebar:
  order: 70
---
<small><em>Tech term: PM Scripts</em></small>

PM Scripts (Prompt Manager Scripts) son extension-level scripts escritos directamente en Prompt Manager para escenas interactivas.

Se ejecutan en el navegador mientras el chat está abierto y pueden usar TavernAI APIs para events, UI, storage y chat state.

Úsalos cuando necesites agregar paneles personalizados a la interfaz, live indicators, estado por respuesta o lógica interactiva.

## Prompt Manager Scripts funcionan en el navegador

PM Scripts son script items dentro de Prompt Manager que se ejecutan en el navegador cuando un chat está abierto.

Reaccionan a chat events, renderizan UI y guardan estado entre sesiones.

Su trabajo es el comportamiento interactivo alrededor del chat. La construccion del prompt pertenece a prompt text y [Macros](/es/docs/macros/).

## Para qué sirven PM Scripts

Usa PM Scripts cuando la lógica pertenece a la live chat session, no al texto del prompt en sí.

Encajan para:

- UI panels e indicators;
- custom AI games y playable scenes;
- scene helpers vinculados a la actividad del chat;
- custom message decorations;
- event-driven logic después de que termina la generación;
- estado que debe actualizarse mientras el chat está abierto;
- comportamiento per-chat o per-reply en el navegador.

## Modelo de ejecución

PM Scripts empiezan cuando se abre un chat y se detienen cuando el chat se cierra o cambia.

Cada script se ejecuta en su propio scope aislado. Las variables locales permanecen dentro de ese script, salvo que uses shared storage de forma explícita.

## Root code y event handlers

El patrón limpio es:

- root code registra handlers;
- event handlers hacen el trabajo principal;
- `chat.load` se encarga del async setup y de cargar el estado inicial.

Root code se mantiene pequeño, y la chat-driven logic vive en event handlers.

## Events

PM Scripts se suscriben a chat events con `TAI.on(event, handler)`.

| Event | Cuándo se dispara |
|---|---|
| `chat.load` | El chat está abierto y todos los scripts están inicializados. Úsalo para async setup y carga de estado inicial. |
| `chat.unload` | El chat se está cerrando o cambiando. Úsalo para guardar estado final. |
| `chat.message.created` | Se creó un mensaje nuevo. Payload: `{ messageId, origin, text, activeContentId }` |
| `chat.message.selected` | Cambió el mensaje activo en una rama. Payload: `{ messageId }` |
| `chat.message.deleted` | Se eliminó un mensaje. |
| `chat.message.content.selected` | Cambió el content activo dentro de un mensaje. Payload: `{ messageId, previousContentId, contentId }` |
| `chat.message.content.deleted` | Se eliminó un message content record. |
| `chat.message.content.version.selected` | Cambió la content version activa. Payload: `{ messageId, contentId, versionId }` |
| `chat.message.generation.started` | Empezó la generación. Payload: `{ chatId }` |
| `chat.message.generation.chunk` | Se recibió un streaming chunk. Payload: `{ contentId, text, blockType }` |
| `chat.message.generation.completed` | La generación terminó. Payload: `{ contentId, text, finishReason }` |
| `chat.message.generation.failed` | La generación falló. |
| `chat.ActiveBranchPath.changed` | Cambió el camino activo (high-level hook para la mayoría de UI scripts). Payload: `{ reason, changedMessageId, changedContentId, activeLeafMessageId, activeLeafContentId, branchPath }` (`branchPath` puede ser parcial o estar vacío) |

Valores de `finishReason`: `"stop"`, `"length"`, `"content_filter"`, `"cancelled"`, `"error"`.

Los handlers pueden ser async. Usa `TAI.once(event, handler)` cuando un handler debe ejecutarse solo una vez.

## Storage

Ambos stores son persistentes: se conservan después de cerrar y volver a abrir el chat. La diferencia está en el scope.

### `TAI.store.chat`

`TAI.store.chat` guarda un valor por clave para todo el chat.


Encaja para estado que no tiene historial separado por ramas: settings, toggles, metadata que pertenecen al chat completo, no a un camino concreto de la conversación.

### `TAI.store.message.content`

`TAI.store.message.content` guarda datos en un message content concreto.

Un mensaje es una posición en el chat. Su content es la reply variant activa dentro de ese mensaje. Cuando un mensaje tiene varios content swipes, cada content record puede tener sus propios stored data.

Encaja para datos producidos por una respuesta generada: parsed damage, label, roll result, score o UI state que pertenece exactamente a ese texto de respuesta.

Usa `TAI.store.chat` para estado de todo el chat. Usa `TAI.store.message.content` cuando el valor pertenece a un reply content concreto.

## UI tools

PM Scripts pueden renderizar scene UI en `TAI.ui.container`.

También pueden registrar message content decorators cuando el UI pertenece antes o después de un message content concreto.

```js
TAI.ui.container.innerHTML = `<div>Scene state: active</div>`;
```

Usa `TAI.ui.showNotification(message, type)` para pequeñas scene notifications.

## ChatCards y generación

PM Scripts pueden leer las ChatCards del chat actual e iniciar una generación con participant overrides temporales.

Usa `TAI.chat.getChatCards()` para obtener una lista plana de las ChatCards del chat abierto:

```js
const chatCards = await TAI.chat.getChatCards();
// [{ id, cardId, name, chatRolePlaceholderId, isSelectedForGenerated, ... }]
```

`id` es el ChatCard ID: la vinculación concreta de la Card en el chat actual. `cardId` es el ID de la Card en la biblioteca. Cuando un script elige quién debe responder en este chat, usa `chatCardId` en generation overrides.

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

`cardId` queda solo para compatibilidad con el comportamiento card-level antiguo. Si la misma Library Card está en el chat más de una vez, `cardId` puede coincidir con varias ChatCards; `chatCardId` selecciona la entrada exacta del chat actual.

Para helper calls de una sola vez, pasa `saveResult: false`, `emitToClient: false` y `stream: false`. La respuesta incluye `generatedText` y no crea un mensaje visible en el chat.

Si pasas `customPrompt`, el helper call omite la construcción normal del chat prompt y envía solo ese raw prompt. Si el helper debe ver el historial actual del chat y el Prompt Manager, omite `customPrompt` y usa `injectedPrompts`.

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

El valor HP se guarda en el content de la respuesta generada. Cuando cambia el active content, el script carga el HP vinculado exactamente a ese content record.

## PM Scripts y Macros

PM Scripts y Macros suelen trabajar juntos, pero pertenecen a capas distintas.

### Macros

- se ejecutan en el servidor;
- afectan al prompt text;
- se ejecutan durante prompt building.

### PM Scripts

- se ejecutan en el navegador;
- reaccionan a chat events;
- afectan al UI y al interactive behavior.

Pueden compartir estado mediante `TAI.store.chat`. Un script puede actualizar chat storage en el navegador, y luego un Macro puede leer ese valor durante una generación posterior.

## Seguridad

PM Scripts son JavaScript activo que se ejecuta en el navegador. Trata PM Scripts como extensions: activa solo scripts de fuentes en las que confíes y que entiendas.

### Política de scripts importados

Los PM Scripts importados pasan por varias safety gates antes de poder ejecutarse.

- Packs con scripts pueden ser bloqueados durante la importación por server policy.
- Los scripts importados son marcados por el servidor como imported.
- Los scripts importados pueden marcarse como unapproved y deben ser approved antes de activarse.
- La ejecución de scripts importados puede desactivarse por server policy.
- La edición del código de un script importado puede desactivarse por server policy.

Estas policies vienen de `config.yaml` y están disponibles desde el UI de la aplicación solo en modo lectura.

Practica:

- revisa los scripts importados antes de activarlos;
- mantén la scene-specific logic pequeña y legible;
- guarda shared state de forma explicita en lugar de esconderlo en variables locales;
- usa [Macros](/es/docs/macros/) cuando la tarea pertenece a prompt text o post-generation text cleanup.

## Siguiente

- [Ejemplos de PM Scripts](/es/docs/pm-script-examples/) para script patterns listos para usar.
- [Macros](/es/docs/macros/) para server-side dynamic prompt text.
- [Referencia de placeholders de tarjetas](/es/docs/placeholders/) para nombres de tarjetas y valores de prompt context.