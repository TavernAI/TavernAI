---
title: Ejemplos de PM Scripts
description: Ejemplos listos para usar de PM Scripts para escenas de TavernAI.
sidebar:
  order: 71
---

Esta sección reúne ejemplos prácticos de PM Scripts que puedes pegar en script items de Prompt Manager y adaptar para escenas.

## Auto speaker selector

El primer ejemplo añade un pequeño panel a `TAI.ui.container`: la AI elige una o varias ChatCards del chat actual y después inicia una generación normal para esos participantes seleccionados.

La petición de selección usa modo internal-only: ve el historial actual del chat y el Prompt Manager mediante `injectedPrompts`, devuelve `generatedText` y no crea un mensaje visible. La respuesta final usa generación normal con `chatCardId` overrides temporales.

El código completo del ejemplo está en la página canónica: [PM Script Examples](/docs/pm-script-examples/#auto-speaker-selector).
