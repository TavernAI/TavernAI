---
title: Actualización
description: Actualizar TavernAI 2 sin perder los datos locales.
sidebar:
  order: 40
---

TavernAI puede actualizarse desde la interfaz. Los métodos manuales solo hacen falta cuando el updater de la interfaz no está disponible o cuando necesitas mover la instalación a mano.

## Actualización desde la interfaz

1. Abre TavernAI.
2. Ve a `Settings` -> `Updates`.
3. Instala la actualización.

El updater descarga la build compatible, la verifica, la prepara en `update_cache` y reemplaza los archivos de la aplicación después de que TavernAI se cierre. Después de una actualización correcta, `update_cache` se elimina. Los datos locales permanecen en su lugar: `user_data`, `logs`, `models` y `config.yaml`.

Deja que TavernAI termine todas las startup migrations antes de volver a cerrar la aplicación.

## Actualización manual

Usa este método si la actualización desde la interfaz no se puede usar, o si quieres reemplazar la build tú mismo.

1. Cierra TavernAI por completo.
2. Haz una copia de seguridad de la carpeta antigua `user_data`.
3. Descarga la nueva build desde [Download](/download/).
4. Extrae la nueva build en una carpeta nueva.
5. Copia `user_data` de la carpeta antigua a la nueva.
6. Inicia la nueva build.

## Actualización en VPS

Si TavernAI se instaló con el VPS script y necesitas actualizar desde terminal, ejecuta el updater desde la carpeta de la aplicación:

```bash
cd ~/TavernAI
./updater/update.sh
```

Si instalaste TavernAI en otro lugar, ejecuta `updater/update.sh` desde esa carpeta.

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