---
title: Importación masiva desde TAI v1 y SillyTavern
description: Importar tarjetas, chats, chats de grupo, lorebooks y prompt presets desde carpetas antiguas de TavernAI v1 o SillyTavern.
sidebar:
  order: 52
---
<small><em>Tech term: Mass Import</em></small>

Mass Import mueve contenido existente de TavernAI v1 o SillyTavern a TavernAI 2.

Úsalo si ya tienes una carpeta con tarjetas, chats, chats de grupo, lorebooks o prompt presets, y quieres llevarlos a la nueva biblioteca de TavernAI 2.

## Qué puede traer Mass Import

- **Tarjetas** desde carpetas de personajes de TavernAI v1 o SillyTavern.
- **Chats** vinculados a tarjetas importadas, cuando se encuentra una tarjeta correspondiente.
- **Chats de grupo** con su lista de participantes e historial de chat.
- **Lorebooks / world info** como prompt resources importados.
- **Prompt presets**, si TavernAI 2 puede detectar un preset file compatible.
- **Imágenes de chat**, si activas la importación de imágenes.


## Importar desde SillyTavern

1. Abre TavernAI 2.
2. Ve a **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Ve a **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Abre la carpeta de SillyTavern, copia su dirección y pégala en el campo de entrada.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Ejecuta el scan.
6. Revisa las tarjetas, chats, chats de grupo, lorebooks y presets detectados.
7. Selecciona lo que quieres importar.
8. Inicia la importación y espera el reporte.

Mass Import puede apuntar a la carpeta raíz de SillyTavern o a una carpeta de usuario de SillyTavern. TavernAI detecta la estructura conocida de SillyTavern y muestra lo que puede importar.

## Importar desde TavernAI v1

1. Abre TavernAI 2.
2. Ve a **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Ve a **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Abre la carpeta de TavernAI v1, copia su dirección y pégala en el campo de entrada.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Ejecuta el scan.
6. Revisa las tarjetas, chats y lorebooks detectados.
7. Selecciona lo que quieres importar.
8. Inicia la importación y espera el reporte.

TavernAI 2 detecta la estructura antigua de carpetas de TavernAI v1 e importa los archivos soportados a la biblioteca de TavernAI 2.

## Cómo se mapea el contenido antiguo

| Contenido antiguo | Resultado en TavernAI 2 |
|---|---|
| Character cards | Cards |
| Solo chats | Chats linked to cards |
| Group chats | Chats linked to cards |
| Lorebooks / world info | Prompt Manager resources |
| Regex-style replacements | Prompt Manager resources |
| Prompt Manager presets | Prompt Manager presets |
| Chat images | Chat files |

## Si algo no se importa

Mass Import está pensado para mover carpetas normales de TavernAI v1 y SillyTavern. Archivos dañados, community formats poco comunes, enlaces de tarjeta faltantes o estructuras de carpetas editadas pueden generar warnings.

## Siguiente

- [Primeros pasos](/es/docs/getting-started/) para el modelo de TavernAI 2.
- [Inicio rápido](/es/docs/quick-start/) para el primer mensaje después de importar.
- [Macros](/es/docs/macros/) y [PM Scripts](/es/docs/pm-scripts/) para comportamiento avanzado de prompts.