---
title: Advanced features
description: Расширенные инструменты для тестирования промптов, истории сообщений, просмотра запросов и глубоких рабочих процессов TavernAI.
sidebar:
  order: 80
---
Advanced features — расширенные рабочие инструменты для чатов, промптов и генераций, которым нужен более точный контроль, чем базовому потоку.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets позволяют сохранять версии промптов, настроек Prompt Manager и конфигураций участников.

#### 1.1 Prompt Quick Presets
Используйте их, чтобы проверить изменение промпта без перезаписи рабочего текста. Сохраните оригинал, попробуйте эксперимент и вернитесь назад, когда нужно.

Создайте новый prompt quick preset и измените текст:
![Advanced feature](/img/docs/pro_1.png)
Новая версия готова, и к старой можно вернуться в любой момент свайпом назад:
![Advanced feature](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
Та же система работает для состояний Вкл/Выкл в Prompt Manager:
![Advanced feature](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
И для настроек участников чата:
![Advanced feature](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes позволяют перегенерировать сообщение в середине чата без создания новой ветки.
![Advanced feature](/img/docs/pro_5.png)
Branching swipes создают другой путь. Content Swipes создают новый ответ в той же позиции сообщения, поэтому чат остается неизменным.

Используйте их, когда одному сообщению нужна другая версия, но структура чата должна остаться на месте.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version хранит редактируемые версии содержимого сообщения.

Меняйте сообщение без потери исходного текста. Редактирование становится версией, которую можно посмотреть или вернуть позже.
![Advanced feature](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

Каждое сообщение хранит raw API request и response, которые его создали.

Откройте record, чтобы увидеть полный промпт, параметры, headers и raw model response. Когда ответ получился хорошим, точный запрос остается на месте, чтобы его можно было воспроизвести позднее.
![Advanced feature](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer показывает точный промпт, который был бы отправлен модели, если запустить генерацию прямо сейчас.

Viewer показывает финальный request в виде читаемых частей, с источником каждой части.
![Advanced feature](/img/docs/pro_8.png)
Так как viewer использует тот же путь сборки, что и реальная генерация, вы точно видите то, что получит модель. Изменения структуры, roles или состояния items обновляют preview до отправки чего-либо.