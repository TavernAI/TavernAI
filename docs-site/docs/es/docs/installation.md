---
title: Instalación
description: Instalar TavernAI 2 en Windows, Linux o un VPS.
sidebar:
  order: 20
---

TavernAI 2 se distribuye como aplicación portable, sin instalación.

## Windows

1. Descarga la última build para Windows desde [Download](/download/).
2. Extrae el archivo `.zip` en una carpeta normal.
3. Ejecuta `TavernAI.exe`.

En el primer inicio, TavernAI creará la carpeta `user_data`.

## Linux

1. Descarga la última build para Linux desde [Download](/download/).
2. Extrae el archivo `.tar.gz` en una carpeta normal.
3. Ejecuta `./TavernAI` desde la carpeta extraída.

En el primer inicio, TavernAI creará la carpeta `user_data`.

## Instalación en VPS

Conéctate al VPS por SSH desde tu PC:

```bash
ssh root@SERVER_IP
```

Sustituye `SERVER_IP` por la dirección IP pública de tu servidor. Si tu VPS usa un usuario normal en lugar de `root`, usa ese nombre de usuario:

```bash
ssh USERNAME@SERVER_IP
```

Ejecuta el instalador en el VPS:

```bash
curl -fsSL https://tavernai.net/install.sh | bash
```

El script descarga la última build estable de Linux, la extrae en `~/TavernAI` y agrega `updater/update.sh` para futuras actualizaciones.

Cuando el instalador pregunte por un `systemd` service, responde `y` si quieres que TavernAI se inicie ahora y vuelva a iniciarse automáticamente después de reiniciar el servidor:

```text
Install systemd service for auto-start? [y/N] y
```

Si respondes `n`, inicia TavernAI manualmente:

```bash
cd ~/TavernAI
./core/TavernAI.Backend
```

Deja esa terminal abierta mientras TavernAI esté ejecutándose. Detenlo con `Ctrl+C`.

Si instalaste el `systemd` service, usa estos comandos:

```bash
sudo systemctl status tavernai
sudo systemctl stop tavernai
sudo systemctl start tavernai
sudo systemctl restart tavernai
```

Abre TavernAI en el navegador:

```text
http://SERVER_IP:8800
```

Sustituye `SERVER_IP` por la misma IP pública usada para SSH.

Antes de compartir esta dirección o dejar el servidor abierto en internet, establece una contraseña para tu perfil de TavernAI. Abre TavernAI, ve a la configuración de tu perfil y establece una contraseña de perfil.

Si la página no abre y el servidor usa `ufw`, permite el puerto de TavernAI:

```bash
sudo ufw allow 8800/tcp
sudo ufw status
```

Revisa también el panel de firewall de tu proveedor VPS. El puerto TCP `8800` debe estar abierto allí también.

Para instalar TavernAI en otra carpeta:

```bash
curl -fsSL https://tavernai.net/install.sh | TAVERNAI_INSTALL_DIR="/path/to/TavernAI" bash
```

Para actualizar más adelante:

```bash
cd ~/TavernAI
./updater/update.sh
```

Si TavernAI se ejecuta con systemd, detén el service antes de actualizar y vuelve a iniciarlo después de la actualización:

```bash
sudo systemctl stop tavernai
cd ~/TavernAI
./updater/update.sh
sudo systemctl start tavernai
```

## Cómo usar TavernAI desde un teléfono

TavernAI se abre en el navegador, así que un teléfono puede usar la misma instancia que ya está ejecutándose en tu PC o servidor.

Para acceso en red local:

1. Inicia TavernAI en tu PC o servidor.
2. Conecta el teléfono a la misma red Wi-Fi o red local.
3. Busca la dirección IP de la máquina donde se está ejecutando TavernAI.
4. Abre `http://IP_ADDRESS:8800` en el teléfono.

En Windows, `ipconfig` muestra la dirección IP local. Usa la dirección IPv4 del adaptador Wi-Fi o Ethernet activo. En Linux, `hostname -I` normalmente muestra las direcciones locales.

Si la página no abre, permite TavernAI en el firewall para redes private/local. El puerto predeterminado es `8800`; se puede cambiar en `config.yaml` con el valor `port`.

Para acceso a VPS, abre TavernAI con la dirección pública o dominio del VPS:

```text
http://SERVER_IP:8800
```

Para uso normal en VPS, se recomienda un dominio con HTTPS mediante reverse proxy. No expongas una instancia privada de TavernAI a internet público sin protección de cuenta y reglas normales de server firewall.

## Datos de la aplicación

TavernAI guarda el estado local en `user_data` dentro de la carpeta de la aplicación.

Esa carpeta contiene la base de datos, chats, archivos importados, imágenes y otro estado local. No la borres al mover o actualizar TavernAI.

## Siguiente

- [Inicio rápido](/es/docs/quick-start/)
- [Actualización](/es/docs/updating/)