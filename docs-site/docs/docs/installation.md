---
title: Installation
description: Install TavernAI 2 on Windows, Linux, or a VPS.
sidebar:
  order: 20
---

TavernAI 2 is distributed as a portable app.

## Windows

1. Download the latest Windows build from [Download](/download/).
2. Extract the `.zip` file to any normal folder.
3. Run `TavernAI.exe`.

On first launch, TavernAI creates its local folders inside the app folder.

## Linux

1. Download the latest Linux build from [Download](/download/).
2. Extract the `.tar.gz` file to any normal folder.
3. Run `./TavernAI` from the extracted folder.

On first launch, TavernAI creates its local folders inside the app folder.

## VPS install

Connect to the VPS with SSH from your PC:

```bash
ssh root@SERVER_IP
```

Replace `SERVER_IP` with the public IP address of your server. If your VPS uses a normal user instead of `root`, use that user name:

```bash
ssh USERNAME@SERVER_IP
```

Run the installer on the VPS:

```bash
curl -fsSL https://tavernai.net/install.sh | bash
```

The script downloads the latest stable Linux build, extracts it to `~/TavernAI`, and adds an `update.sh` file for later updates.

When the installer asks about a `systemd` service, answer `y` if TavernAI should start now and restart automatically after a server reboot:

```text
Install systemd service for auto-start? [y/N] y
```

If you answer `n`, start TavernAI manually:

```bash
cd ~/TavernAI
./core/TavernAI.Backend
```

Leave that terminal open while TavernAI is running. Stop it with `Ctrl+C`.

If you installed the systemd service, use these commands instead:

```bash
sudo systemctl status tavernai
sudo systemctl stop tavernai
sudo systemctl start tavernai
sudo systemctl restart tavernai
```

Open TavernAI in your browser:

```text
http://SERVER_IP:8800
```

Replace `SERVER_IP` with the same public IP address used for SSH.

Before you share this address or keep the server open on the internet, set a password for your TavernAI profile. Open TavernAI, go to your profile settings, and set a profile password.

If the page does not open and the server uses `ufw`, allow the TavernAI port:

```bash
sudo ufw allow 8800/tcp
sudo ufw status
```

Also check the firewall panel from your VPS provider. TCP port `8800` must be open there too.

To install into another folder:

```bash
curl -fsSL https://tavernai.net/install.sh | TAVERNAI_INSTALL_DIR="/path/to/TavernAI" bash
```

To update later:

```bash
cd ~/TavernAI
./update.sh
```

If TavernAI runs through systemd, stop it before updating and start it again after the update:

```bash
sudo systemctl stop tavernai
cd ~/TavernAI
./update.sh
sudo systemctl start tavernai
```

## How to run on a phone

TavernAI opens in a browser, so a phone can use the same running app as your PC or server.

The phone only needs network access to the machine where TavernAI is running.

For local network access:

1. Start TavernAI on your PC or server.
2. Connect the phone to the same Wi-Fi or local network.
3. Find the IP address of the machine running TavernAI.
4. Open `http://IP_ADDRESS:8800` on the phone.

On Windows, the local IP address is shown by `ipconfig`. Use the IPv4 address of the active Wi-Fi or Ethernet adapter. On Linux, `hostname -I` usually shows the local addresses.

If the page does not open, allow TavernAI through the firewall for private/local networks. The default port is `8800`; it can be changed in `config.yaml` with the `port` value.

For VPS access, open TavernAI through the VPS public address or domain:

```text
http://SERVER_IP:8800
```

A domain with HTTPS through a reverse proxy is recommended for regular VPS use. Do not expose a private TavernAI instance to the public internet without account protection and normal server firewall rules.

## App data

TavernAI stores local state in `user_data` inside the app folder.

That folder contains your database, chats, imported files, images, and other local state. Do not delete it when moving or updating TavernAI.

## Next

- [Quick Start](/docs/quick-start/)
- [Updating](/docs/updating/)
