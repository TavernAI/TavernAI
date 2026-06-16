---
title: Actualización
description: Actualizar TavernAI 2 sin perder los datos locales.
sidebar:
  order: 40
---

TavernAI se actualiza reemplazando la build de la aplicación y conservando `user_data`.

## Actualización manual

1. Cierra TavernAI por completo.
2. Haz una copia de seguridad de la carpeta antigua `user_data`.
3. Descarga la nueva build desde [Download](/download/).
4. Extrae la nueva build en una carpeta nueva.
5. Copia `user_data` de la carpeta antigua a la nueva.
6. Inicia la nueva build.

Deja que TavernAI termine todas las startup migrations antes de cerrar la aplicación.

## Actualización en VPS

Si TavernAI se instaló con el VPS script, actualízalo desde la carpeta de la aplicación:

```bash
cd ~/TavernAI
./update.sh
```

Si instalaste TavernAI en otro lugar, ejecuta `update.sh` desde esa carpeta.

## Qué conservar

Conserva la carpeta completa `user_data`.

Contiene la base de datos, chats, archivos importados, imágenes y otro estado local de TavernAI.

## Mover TavernAI

TavernAI se puede mover como carpeta. Para moverlo a otra carpeta o a otro disco:

1. Cierra TavernAI.
2. Copia toda la carpeta de la aplicación al nuevo lugar.
3. Inicia TavernAI desde el nuevo lugar.
4. Comprueba que tus chats y archivos sigan ahí.

## Evita

- No borres `user_data` durante una actualización.
- No uses la misma carpeta `user_data` activa con dos versiones distintas de TavernAI.
- No uses una build antigua como forma de volver atrás para una carpeta `user_data` que ya se abrió en una versión nueva.

## Siguiente

- [Instalación](/es/docs/installation/)
- [Inicio rápido](/es/docs/quick-start/)