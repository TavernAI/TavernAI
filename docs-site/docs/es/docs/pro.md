---
title: TavernAI Pro
description: Supporter tools para probar prompts, historial de mensajes, inspección de requests y flujos avanzados de TavernAI.
sidebar:
  order: 80
---
![Pro](/img/docs/pro_logo_3.png)
TavernAI Pro es la supporter edition para quienes necesitan ajuste más fino y más control después del flujo básico.

Pro agrega herramientas para cambiar y probar prompts rápidamente, ver el historial de cambios de mensajes, inspeccionar requests al modelo y entender exactamente qué recibió el modelo.

Pro no reemplaza TavernAI 2. Es un conjunto de herramientas de trabajo encima de él.

El supporter access está disponible mediante [Patreon](https://www.patreon.com/tavernai) y [Boosty](https://boosty.to/tavernai).

## Qué agrega Pro

Las herramientas de Pro se centran en control, versioning, inspection y recovery.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets permiten guardar versiones de prompts, configuraciones de Prompt Manager y configuraciones de participantes.

#### 1.1 Prompt Quick Presets
Úsalos para probar un cambio de prompt sin sobrescribir el texto que ya funciona. Conserva el original, prueba el experimento y vuelve atrás cuando haga falta.

Crea un prompt quick preset nuevo y cambia el texto:
![Pro](/img/docs/pro_1.png)
La nueva versión está lista, y puedes volver a la anterior en cualquier momento con un swipe hacia atrás:
![Pro](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
El mismo sistema funciona para estados On/Off en Prompt Manager:
![Pro](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
Y para configuraciones de participantes del chat:
![Pro](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes permiten regenerar un mensaje en medio del chat sin crear una rama nueva.
![Pro](/img/docs/pro_5.png)
Branching swipes crean otro camino. Content Swipes crean una respuesta nueva en la misma posición de mensaje, por lo que el chat queda sin cambios alrededor.

Úsalos cuando un mensaje necesita otra versión, pero la estructura del chat debe quedarse en su lugar.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version guarda versiones editables del contenido de un mensaje.

Cambia un mensaje sin perder el texto original. La edición se convierte en una versión que puedes revisar o recuperar después.
![Pro](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

En Pro, cada mensaje guarda el raw API request y response que lo crearon.

Abre el record para ver el prompt completo, parámetros, headers y raw model response. Cuando una respuesta salió bien, el request exacto queda guardado para poder reproducirlo más tarde.
![Pro](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer muestra el prompt exacto que se enviaría al modelo si ejecutas la generación ahora.

Viewer muestra el request final en partes legibles, con la fuente de cada parte.
![Pro](/img/docs/pro_8.png)
Como el viewer usa la misma ruta de construcción que la generación real, ves exactamente lo que recibirá el modelo. Los cambios de estructura, roles o estado de items actualizan el preview antes de enviar nada.