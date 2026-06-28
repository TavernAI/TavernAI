---
title: Примеры PM Scripts
description: Готовые примеры PM Scripts для сцен TavernAI.
sidebar:
  order: 71
---

Этот раздел собирает практические PM Script examples, которые можно добавить в script item внутри Prompt Manager и адаптировать под сцену.

## Auto speaker selector

Первый пример добавляет кнопку в `TAI.ui.container`: AI выбирает одну или несколько ChatCards текущего чата, а затем запускается обычная генерация ответа за выбранных участников.

Служебный запрос выбора работает в internal-only режиме: он видит текущую историю чата и Prompt Manager через `injectedPrompts`, возвращает `generatedText` и не создает видимое сообщение. Финальный ответ идет через обычную генерацию с временными `chatCardId` overrides.

Полный код примера находится в канонической странице: [PM Script Examples](/docs/pm-script-examples/#auto-speaker-selector).
