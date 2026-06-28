---
title: Macros
description: Server-side JavaScript для prompt-time и post-generation обработки внутри элементов Prompt Manager.
sidebar:
  order: 60
---
<small><em>Tech term: Pre-gen Macros, Post-gen Macros</em></small>

Macros позволяют тексту Prompt Manager запускать небольшие JavaScript-фрагменты во время генерации.

Используйте их, когда нужно передать произвольное значение, параметры состояний или изменить результат генерации.


## Macros работают в двух фазах

В TavernAI есть две формы Macro, и обе выполняются на сервере.

- `<% ... %>` — pre-gen. Выполняется, пока TavernAI собирает промпт. Вывод становится частью промпта и отправляется в модель.
- `<%% ... %%>` — post-gen. Выполняется после получения AI-ответа и может проверять и переписывать generated blocks до показа финального сообщения.

Macros — server-side tools. Если задача относится к live-сцене в браузере, используйте [PM Scripts](/ru/docs/pm-scripts/).

## Для чего нужны Macros

Используйте Macros, когда текст промпта или содержимое сгенерированного сообщения должны меняться динамически, а не оставаться статичными.

Подходят для:

- случайных событий;
- текста, зависящего от времени;
- условных формулировок;
- текста промпта, зависящего от общего состояния;
- постобработки сгенерированного текста;
- состояния чата, которое должно использоваться в следующих генерациях.

## Синтаксис Macro

### Pre-gen: `<% %>`

Pre-gen Macros выполняются во время сборки промпта.

```txt
The room feels <% rand(["warm", "cold", "silent"]) %>.
```

Если блок содержит expression, результат вставляется в текст.

Для большего контроля используйте `print()`.

```txt
<%
print("Turn: ");
print((TAI.store.chat.get("turn") || 0) + 1);
%>
```

### Post-gen: `<%% %%>`

Post-gen Macros выполняются после получения AI-ответа. Используйте эту форму, когда ответ нужно изменить после генерации.

```txt
<%%
for (var i = 0; i < TAI.generated.blocks.length; i++) {
  var block = TAI.generated.blocks[i];
  if (block.type !== "text") continue;
  block.text = block.text.replace(/OOC:/g, "(OOC:");
}
%%>
```



## Один item, две фазы выполнения

Все блоки `<% %>` внутри одного элемента Prompt Manager выполняются по порядку во время сборки промпта.

Блоки `<%% %%>` из того же item выполняются позже, после генерации.

Не рассчитывайте, что локальные JavaScript variables перейдут из pre-gen в post-gen. Если данные из `<% %>` должны быть доступны в `<%% %%>`, запишите их в `TAI.vars` или `TAI.store.chat`.

Разные промпты не делят локальные JavaScript variables друг с другом. Если данные должны перейти между промптами, используйте `TAI.vars` или `TAI.store.chat`.

## Placeholders и Macros

Placeholders и Macros решают разные задачи.

- placeholders подставляют известные значения контекста;
- Macros вычисляют или собирают текст либо постобрабатывают сгенерированный текст.

Placeholder resolution происходит до выполнения pre-gen Macro. `<% %>` работает поверх уже разрешенного prompt context.

Блоки `<%% %%>` никогда не вставляются в промпт, поэтому они вообще не ведут себя как placeholder text.

Используйте [справочник плейсхолдеров](/ru/docs/placeholders/), когда значение уже есть в контексте. Используйте Macro, когда значение нужно вычислить.

## Основные инструменты данных

### `TAI.vars`

`TAI.vars` — общее состояние для одной сборки промпта.

Используйте его, когда одному промпту нужно передать значение другому промпту в той же генерации, или когда блок `<% %>` должен подготовить данные для последующего блока `<%% %%>`.

Подходит для:

- случайного броска кубика с повторным использованием;
- вычисления общего значения состояния из последнего сообщения;
- реакции скриптов на один временный результат;
- связи pre-gen и post-gen логики в одном prompt cycle.

```txt
<% TAI.vars.set("mood", rand(["tense", "calm", "alert"])) %>
```

Позже в другом item:

```txt
Current mood: <% TAI.vars.get("mood") %>
```

Мост из pre-gen в post-gen:

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

`TAI.store.chat` — состояние, связанное с текущим чатом.

Используйте его, когда значение должно сохраняться между генерациями и после повторного открытия чата.

Подходит для:

- счетчиков ходов;
- RPG-установок;
- флагов сцены;
- значений, записанных сейчас и используемых позже.

```txt
<%
var turn = TAI.store.chat.get("turn") || 0;
turn++;
TAI.store.chat.set("turn", turn);
print("Turn " + turn);
%>
```

### `TAI.generated`

`TAI.generated` доступен в блоках `<%% %%>`.

Используйте его, когда post-gen логика должна читать или переписывать полученное сообщение.

`TAI.generated.message.content.blocks` — одна часть сгенерированного ответа. Это может быть обычный текст или think блок, и модели могут чередовать типы блоков при создании ответа.

Частые примеры:

- `TAI.generated.blocks` — короткий alias для `TAI.generated.message.content.blocks`
- `TAI.generated.message.content.blocks` — полный путь к generated content blocks
- `TAI.generated.finishReason`

Используйте `TAI.generated.blocks`, когда нужно переписать сгенерированный текст до того, как финальное сообщение попадет к пользователю.

### `TAI.chat`, `TAI.card` и `TAI.time`

Pre-gen Macros также могут читать structured context напрямую.

Частые примеры:

- `TAI.chat.messageCount`
- `TAI.chat.lastMessage`
- `TAI.card.names`
- `TAI.time.hour`

Они полезны, когда промпт должен реагировать на текущий разговор, текущих участников или текущее время.

### Built-in helpers

Macros также открывают небольшой набор helpers для обычной работы с промптами:

- `print()`
- `rand()`
- `dice()`
- `chance()`

Они покрывают большую часть динамического prompt writing без более крупного runtime.

### Debug output

Используйте `TAI.debug.log(...)`, когда Macro нужен диагностический вывод. Он пишет в backend log/console и не добавляет текст в prompt или generated message.

```js
TAI.debug.log('state', { hp: 10 }, TAI.chat.messageCount);
```

## Common patterns

### Случайная вариация

Используйте Macro, когда повторяющаяся инструкция или описание должны чередоваться между несколькими формами.

### Общее состояние на одну генерацию

Используйте `TAI.vars`, когда нескольким промптам в одном промпт менеджере нужно одно общее значение.

### Постоянное состояние чата

Используйте `TAI.store.chat`, когда состояние должно сохраняться и влиять на будущие генерации.

### Постобработка сгенерированного текста

Используйте `<%% %%>`, когда сгенерированное сообщение нужно переписать после получения, например чтобы нормализовать теги, исправить известные паттерны вывода или применить очистку, специфичную для сцены.

## Macros и PM Scripts

Macros и PM Scripts находятся на разных слоях.

### Используйте Macros, когда

- промпту нужно получить текст через `<% %>`;
- generated message нужно переписать сразу после получения через `<%% %%>`;
- состояние должно влиять на последующий prompt output или post-processing.

### Используйте PM Scripts, когда

- логика относится к браузеру;
- script реагирует на chat events в реальном времени;
- результатом является UI behavior, notifications или browser-side interaction.

Если задача — переписать generated blocks до показа финального сообщения, начинайте с post-gen `<%% %%>`, а не с PM Scripts.

## Ограничения

Обе формы Macro выполняются в безопасном server-side sandbox.

Это намеренно узкая среда:

- нет доступа к DOM;
- нет browser APIs;
- нет network fetches;
- нет `eval()` или `new Function()`;
- нет timer-based browser logic.

Macros остаются в границах prompt-side scripting.

## Дальше

- [Справочник карточных плейсхолдеров](/ru/docs/placeholders/) для простых значений контекста.
- [PM Scripts](/ru/docs/pm-scripts/) для browser-side logic.