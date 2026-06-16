---
title: Macros
description: Server-side JavaScript para procesamiento prompt-time y post-generation dentro de elementos de Prompt Manager.
sidebar:
  order: 60
---
<small><em>Tech term: Safe Scripts</em></small>

Macros permiten que el texto de Prompt Manager ejecute pequeños fragmentos de JavaScript durante la generación.

Úsalos cuando necesites pasar un valor arbitrario, parámetros de estado o cambiar el resultado de la generación.


## Macros funcionan en dos fases

TavernAI tiene dos formas de Macro, y ambas se ejecutan en el servidor.

- `<% ... %>` es pre-gen. Se ejecuta mientras TavernAI construye el prompt. Su salida pasa a formar parte del prompt y se envía al modelo.
- `<%% ... %%>` es post-gen. Se ejecuta después de recibir la respuesta de AI y puede inspeccionar y reescribir generated blocks antes de mostrar el mensaje final.

Macros son server-side tools. Si la tarea pertenece a una escena live en el navegador, usa [PM Scripts](/es/docs/pm-scripts/).

## Para qué sirven Macros

Usa Macros cuando el texto del prompt o el contenido del mensaje generado deben cambiar de forma dinámica en lugar de quedar estáticos.

Encajan para:

- eventos aleatorios;
- texto dependiente del tiempo;
- formulaciones condicionales;
- texto de prompt que depende de un estado compartido;
- postprocesamiento del texto generado;
- estado de chat que debe usarse en generaciones posteriores.

## Sintaxis de Macro

### Pre-gen: `<% %>`

Pre-gen Macros se ejecutan durante la construcción del prompt.

```txt
The room feels <% rand(["warm", "cold", "silent"]) %>.
```

Si un bloque contiene una expression, su resultado se inserta en el texto.

Para más control, usa `print()`.

```txt
<%
print("Turn: ");
print((TAI.store.chat.get("turn") || 0) + 1);
%>
```

### Post-gen: `<%% %%>`

Post-gen Macros se ejecutan después de recibir la respuesta de AI. Usa esta forma cuando la respuesta debe cambiar después de la generación.

```txt
<%%
for (var i = 0; i < TAI.generated.blocks.length; i++) {
  var block = TAI.generated.blocks[i];
  if (block.type !== "text") continue;
  block.text = block.text.replace(/OOC:/g, "(OOC:");
}
%%>
```



## Un item, dos fases de ejecución

Todos los bloques `<% %>` dentro del mismo elemento de Prompt Manager se ejecutan en orden durante la construcción del prompt.

Los bloques `<%% %%>` del mismo item se ejecutan más tarde, después de la generación.

No dependas de que las JavaScript variables locales pasen de pre-gen a post-gen. Si los datos de `<% %>` deben estar disponibles en `<%% %%>`, escríbelos en `TAI.vars` o `TAI.store.chat`.

Distintos prompts no comparten JavaScript variables locales entre sí. Si los datos deben moverse entre prompts, usa `TAI.vars` o `TAI.store.chat`.

## Placeholders y Macros

Placeholders y Macros resuelven tareas distintas.

- placeholders sustituyen valores conocidos del contexto;
- Macros calculan o ensamblan texto, o postprocesan texto generado.

Placeholder resolution ocurre antes de la ejecución de pre-gen Macro. `<% %>` trabaja sobre el prompt context ya resuelto.

Los bloques `<%% %%>` nunca se insertan en el prompt, así que no se comportan como placeholder text.

Usa la [referencia de placeholders](/es/docs/placeholders/) cuando el valor ya existe en el contexto. Usa Macro cuando el valor debe calcularse.

## Herramientas principales de datos

### `TAI.vars`

`TAI.vars` es estado compartido para una construccion de prompt.

Úsalo cuando un prompt necesita pasar un valor a otro prompt en la misma generación, o cuando un bloque `<% %>` debe preparar datos para un bloque posterior `<%% %%>`.

Encaja para:

- una tirada aleatoria reutilizada después;
- calcular un valor de estado comun desde el ultimo mensaje;
- reacción de varios scripts a un resultado temporal;
- conectar lógica pre-gen y post-gen dentro del mismo prompt cycle.

```txt
<% TAI.vars.set("mood", rand(["tense", "calm", "alert"])) %>
```

Mas tarde, en otro item:

```txt
Current mood: <% TAI.vars.get("mood") %>
```

Puente de pre-gen a post-gen:

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

`TAI.store.chat` es estado asociado al chat actual.

Úsalo cuando el valor debe conservarse entre generaciones y después de volver a abrir el chat.

Encaja para:

- contadores de turnos;
- configuraciones RPG;
- flags de escena;
- valores escritos ahora y usados más tarde.

```txt
<%
var turn = TAI.store.chat.get("turn") || 0;
turn++;
TAI.store.chat.set("turn", turn);
print("Turn " + turn);
%>
```

### `TAI.generated`

`TAI.generated` está disponible en bloques `<%% %%>`.

Úsalo cuando la lógica post-gen debe leer o reescribir el mensaje recibido.

`TAI.generated.message.content.blocks` es una parte de la respuesta generada. Puede ser texto normal o un think block, y los modelos pueden alternar entre tipos de bloque al producir la respuesta.

Ejemplos comunes:

- `TAI.generated.blocks` — alias corto de `TAI.generated.message.content.blocks`
- `TAI.generated.message.content.blocks` — ruta completa a los generated content blocks
- `TAI.generated.finishReason`

Usa `TAI.generated.blocks` cuando necesites reescribir el texto generado antes de que el mensaje final llegue al usuario.

### `TAI.chat`, `TAI.card` y `TAI.time`

Pre-gen Macros también pueden leer structured context directamente.

Ejemplos comunes:

- `TAI.chat.messageCount`
- `TAI.chat.lastMessage`
- `TAI.card.names`
- `TAI.time.hour`

Son útiles cuando el prompt debe reaccionar a la conversación actual, los participantes actuales o la hora actual.

### Built-in helpers

Macros también exponen un pequeño conjunto de helpers para trabajo común con prompts:

- `print()`
- `rand()`
- `dice()`
- `chance()`

Cubren gran parte del prompt writing dinámico sin necesitar un runtime más grande.

### Debug output

Usa `TAI.debug.log(...)` cuando una Macro necesita salida de diagnóstico. Escribe en el backend log/console y no añade texto al prompt ni al mensaje generado.

```js
TAI.debug.log('state', { hp: 10 }, TAI.chat.messageCount);
```

## Common patterns

### Variación aleatoria

Usa Macro cuando una instrucción o descripción repetida debe alternar entre varias formas.

### Estado compartido para una generación

Usa `TAI.vars` cuando varios prompts dentro de un Prompt Manager necesitan un mismo valor compartido.

### Estado persistente del chat

Usa `TAI.store.chat` cuando el estado debe conservarse e influir en generaciones futuras.

### Postprocesar texto generado

Usa `<%% %%>` cuando el mensaje generado debe reescribirse después de recibirse, por ejemplo para normalizar etiquetas, corregir patrones de salida conocidos o aplicar una limpieza específica de la escena.

## Macros y PM Scripts

Macros y PM Scripts están en capas distintas.

### Usa Macros cuando

- un prompt necesita obtener texto mediante `<% %>`;
- generated message debe reescribirse justo después de recibirse mediante `<%% %%>`;
- el estado debe influir en el prompt output posterior o en el post-processing.

### Usa PM Scripts cuando

- la lógica pertenece al navegador;
- el script reacciona a chat events en tiempo real;
- el resultado es UI behavior, notifications o browser-side interaction.

Si la tarea es reescribir generated blocks antes de mostrar el mensaje final, empieza con post-gen `<%% %%>`, no con PM Scripts.

## Límites

Ambas formas de Macro se ejecutan en un server-side sandbox seguro.

Es un entorno deliberadamente estrecho:

- sin acceso al DOM;
- sin browser APIs;
- sin network fetches;
- sin `eval()` ni `new Function()`;
- sin timer-based browser logic.

Macros se mantienen dentro de los límites de prompt-side scripting.

## Siguiente

- [Referencia de placeholders de tarjetas](/es/docs/placeholders/) para valores simples de contexto.
- [PM Scripts](/es/docs/pm-scripts/) para browser-side logic.