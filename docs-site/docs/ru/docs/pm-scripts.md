---
title: PM Scripts
description: Extension-level scripting для интерактивных сцен TavernAI.
sidebar:
  order: 70
---
<small><em>Tech term: PM Scripts</em></small>

PM Scripts (Prompt Manager Scripts) — extension-level scripts, написанные прямо в Prompt Manager для интерактивных сцен.

Они выполняются в браузере, пока открыт чат, и могут использовать TavernAI APIs для events, UI, storage и chat state.

Используйте их, когда нужно добавить пользовательские панели в интерфейс, live indicators, состояние на каждый ответ или интерактивную логику.

## Prompt Manager Scripts работают в браузере

PM Scripts — script items внутри Prompt Manager, которые выполняются в браузере, когда открыт чат.

Они реагируют на chat events, отрисовывают UI и сохраняют состояние между сессиями.

Их задача — интерактивное поведение вокруг чата. Сборка промпта относится к prompt text и [Macros](/ru/docs/macros/).

## Для чего нужны PM Scripts

Используйте PM Scripts, когда логика относится к live chat session, а не к самому тексту промпта.

Подходят для:

- UI panels и indicators;
- custom AI games и playable scenes;
- scene helpers, связанных с активностью чата;
- custom message decorations;
- event-driven logic после завершения генерации;
- состояния, которое должно обновляться, пока чат открыт;
- per-chat или per-reply поведения в браузере.

## Модель выполнения

PM Scripts запускаются при открытии чата и останавливаются, когда чат закрывается или меняется.

Каждый script работает в собственной изолированной области. Локальные переменные остаются внутри этого script, если вы явно не используете shared storage.

## Root code и event handlers

Чистый паттерн:

- root code регистрирует handlers;
- event handlers делают основную работу;
- `chat.load` отвечает за async setup и загрузку начального состояния.

Root code остается небольшим, а chat-driven logic находится в event handlers.

## Events

PM Scripts подписываются на chat events через `TAI.on(event, handler)`.

| Event | Когда срабатывает |
|---|---|
| `chat.load` | Чат открыт, все scripts инициализированы. Используйте для async setup и загрузки начального состояния. |
| `chat.unload` | Чат закрывается или переключается. Используйте для финального сохранения состояния. |
| `chat.message.created` | Создано новое сообщение. Payload: `{ messageId, origin, text, activeContentId }` |
| `chat.message.selected` | Активное сообщение в ветке изменилось. Payload: `{ messageId }` |
| `chat.message.deleted` | Сообщение удалено. |
| `chat.message.content.selected` | Активный content внутри сообщения изменился. Payload: `{ messageId, previousContentId, contentId }` |
| `chat.message.content.deleted` | Message content record удален. |
| `chat.message.content.version.selected` | Активная content version изменилась. Payload: `{ messageId, contentId, versionId }` |
| `chat.message.generation.started` | Генерация началась. Payload: `{ chatId }` |
| `chat.message.generation.chunk` | Получен один streaming chunk. Payload: `{ contentId, text, blockType }` |
| `chat.message.generation.completed` | Генерация завершилась. Payload: `{ contentId, text, finishReason }` |
| `chat.message.generation.failed` | Генерация завершилась ошибкой. |
| `chat.ActiveBranchPath.changed` | Активный путь изменился (high-level hook для большинства UI scripts). Payload: `{ reason, changedMessageId, changedContentId, activeLeafMessageId, activeLeafContentId, branchPath }` (`branchPath` может быть частичным или пустым) |

Значения `finishReason`: `"stop"`, `"length"`, `"content_filter"`, `"cancelled"`, `"error"`.

Handlers могут быть async. Используйте `TAI.once(event, handler)`, когда handler должен сработать только один раз.

## Storage

Оба stores постоянные — они сохраняются после закрытия и повторного открытия чата. Разница в scope.

### `TAI.store.chat`

`TAI.store.chat` хранит одно значение на ключ для всего чата.


Подходит для состояния, у которого нет отдельной истории по веткам: settings, toggles, metadata, которые относятся к чату в целом, а не к конкретному пути разговора.

### `TAI.store.message.content`

`TAI.store.message.content` хранит данные на конкретном message content.

Сообщение — это позиция в чате. Его content — активный reply variant внутри этого сообщения. Когда у сообщения несколько content swipes, у каждого content record могут быть свои stored data.

Подходит для данных, полученных из одного сгенерированного ответа: parsed damage, label, roll result, score или UI state, относящееся именно к этому тексту ответа.

Используйте `TAI.store.chat` для состояния всего чата. Используйте `TAI.store.message.content`, когда значение относится к одному конкретному reply content.

## UI tools

PM Scripts могут отрисовывать scene UI в `TAI.ui.container`.

Они также могут регистрировать message content decorators, когда UI относится к месту до или после конкретного message content.

```js
TAI.ui.container.innerHTML = `<div>Scene state: active</div>`;
```

Используйте `TAI.ui.showNotification(message, type)` для небольших scene notifications.

## ChatCards и генерация

PM Scripts могут получить ChatCards текущего чата и запустить генерацию с временным переопределением участников.

Используйте `TAI.chat.getChatCards()`, чтобы получить плоский список ChatCards открытого чата:

```js
const chatCards = await TAI.chat.getChatCards();
// [{ id, cardId, name, chatRolePlaceholderId, isSelectedForGenerated, ... }]
```

`id` — это ChatCard ID: конкретное прикрепление карточки в текущем чате. `cardId` — ID карточки в библиотеке. Когда script выбирает, кто должен ответить именно в этом чате, используйте `chatCardId` в generation overrides.

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

`cardId` нужен только для совместимости со старым card-level поведением. Если одна и та же библиотечная Card добавлена в чат несколько раз, `cardId` может совпасть с несколькими ChatCards; `chatCardId` выбирает точную запись текущего чата.

Для одноразовых helper-запросов передавайте `saveResult: false`, `emitToClient: false` и `stream: false`. Ответ содержит `generatedText` и не создает видимое сообщение в чате.

Если передать `customPrompt`, helper-запрос обойдет обычную сборку chat prompt и отправит только этот сырой prompt. Если helper должен видеть текущую историю чата и Prompt Manager, не передавайте `customPrompt`; используйте `injectedPrompts`.

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

Значение HP хранится на content сгенерированного ответа. Когда active content меняется, script загружает HP, привязанный именно к этому content record.

## PM Scripts и Macros

PM Scripts и Macros часто работают вместе, но относятся к разным слоям.

### Macros

- выполняются на сервере;
- влияют на prompt text;
- выполняются во время prompt building.

### PM Scripts

- выполняются в браузере;
- реагируют на chat events;
- влияют на UI и interactive behavior.

Они могут делить состояние через `TAI.store.chat`. Script может обновить chat storage в браузере, а Macro затем прочитает это значение во время следующей генерации.

## Безопасность

PM Scripts — активный JavaScript, который выполняется в браузере. Относитесь к PM Scripts как к extensions: включайте только scripts из источников, которым доверяете и которые понимаете.

### Политика импортированных scripts

Импортированные PM Scripts проходят несколько safety gates перед запуском.

- Packs со scripts могут быть заблокированы при импорте server policy.
- Импортированные scripts помечаются сервером как imported.
- Импортированные scripts могут помечаться как unapproved и должны быть approved перед включением.
- Запуск импортированных scripts может быть отключен server policy.
- Редактирование кода импортированного script может быть отключено server policy.

Эти policies приходят из `config.yaml` и доступны из UI приложения только для чтения.

Практика:

- проверяйте импортированные scripts перед включением;
- держите scene-specific logic небольшой и читаемой;
- храните shared state явно, а не прячьте его в локальных переменных;
- используйте [Macros](/ru/docs/macros/), когда задача относится к prompt text или post-generation text cleanup.

## Дальше

- [Примеры PM Scripts](/ru/docs/pm-script-examples/) с готовыми script patterns.
- [Macros](/ru/docs/macros/) для server-side dynamic prompt text.
- [Справочник карточных плейсхолдеров](/ru/docs/placeholders/) для имен карточек и значений prompt context.