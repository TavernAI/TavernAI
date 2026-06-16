---
title: Installation
description: TavernAI 2 unter Windows, Linux oder auf einem VPS installieren.
sidebar:
  order: 20
---

TavernAI 2 wird als portable App ohne Installation verteilt.

## Windows

1. Lade die aktuelle Windows-Build von [Download](/download/) herunter.
2. Entpacke die `.zip`-Datei in einen normalen Ordner.
3. Starte `TavernAI.exe`.

Beim ersten Start erstellt TavernAI den Ordner `user_data`.

## Linux

1. Lade die aktuelle Linux-Build von [Download](/download/) herunter.
2. Entpacke die `.tar.gz`-Datei in einen normalen Ordner.
3. Starte `./TavernAI` aus dem entpackten Ordner.

Beim ersten Start erstellt TavernAI den Ordner `user_data`.

## Installation auf einem VPS

Verbinde dich von deinem PC aus per SSH mit dem VPS:

```bash
ssh root@SERVER_IP
```

Ersetze `SERVER_IP` durch die öffentliche IP-Adresse deines Servers. Wenn dein VPS einen normalen Benutzer statt `root` nutzt, verwende diesen Benutzernamen:

```bash
ssh USERNAME@SERVER_IP
```

Starte den Installer auf dem VPS:

```bash
curl -fsSL https://tavernai.net/install.sh | bash
```

Das Script lädt die aktuelle stabile Linux-Build herunter, entpackt sie nach `~/TavernAI` und fügt eine `update.sh`-Datei für spätere Updates hinzu.

Wenn der Installer nach einem `systemd` service fragt, antworte mit `y`, wenn TavernAI jetzt starten und nach einem Server-Neustart automatisch wieder starten soll:

```text
Install systemd service for auto-start? [y/N] y
```

Wenn du `n` antwortest, starte TavernAI manuell:

```bash
cd ~/TavernAI
./core/TavernAI.Backend
```

Lass dieses Terminal offen, solange TavernAI läuft. Beende es mit `Ctrl+C`.

Wenn du den `systemd` service installiert hast, nutze diese Befehle:

```bash
sudo systemctl status tavernai
sudo systemctl stop tavernai
sudo systemctl start tavernai
sudo systemctl restart tavernai
```

Öffne TavernAI im Browser:

```text
http://SERVER_IP:8800
```

Ersetze `SERVER_IP` durch dieselbe öffentliche IP-Adresse, die du für SSH verwendet hast.

Bevor du diese Adresse teilst oder den Server im Internet offen lässt, setze ein Passwort für dein TavernAI-Profil. Öffne TavernAI, gehe zu deinen Profileinstellungen und setze ein Profilpasswort.

Wenn die Seite nicht geöffnet wird und der Server `ufw` nutzt, erlaube den TavernAI-Port:

```bash
sudo ufw allow 8800/tcp
sudo ufw status
```

Prüfe auch das Firewall-Panel deines VPS-Anbieters. Der TCP-Port `8800` muss auch dort geöffnet sein.

Für eine Installation in einen anderen Ordner:

```bash
curl -fsSL https://tavernai.net/install.sh | TAVERNAI_INSTALL_DIR="/path/to/TavernAI" bash
```

Zum späteren Aktualisieren:

```bash
cd ~/TavernAI
./update.sh
```

Wenn TavernAI über systemd läuft, stoppe den service vor dem Update und starte ihn danach wieder:

```bash
sudo systemctl stop tavernai
cd ~/TavernAI
./update.sh
sudo systemctl start tavernai
```

## TavernAI vom Telefon aus nutzen

TavernAI öffnet sich im Browser. Ein Telefon kann deshalb dieselbe Instanz nutzen, die bereits auf deinem PC oder Server läuft.

Für Zugriff im lokalen Netzwerk:

1. Starte TavernAI auf deinem PC oder Server.
2. Verbinde das Telefon mit demselben Wi-Fi oder lokalen Netzwerk.
3. Ermittle die IP-Adresse der Maschine, auf der TavernAI läuft.
4. Öffne `http://IP_ADDRESS:8800` auf dem Telefon.

Unter Windows zeigt `ipconfig` die lokale IP-Adresse. Nutze die IPv4-Adresse des aktiven Wi-Fi- oder Ethernet-Adapters. Unter Linux zeigt `hostname -I` normalerweise die lokalen Adressen.

Wenn die Seite nicht geöffnet wird, erlaube TavernAI in der Firewall für private/local Netzwerke. Der Standardport ist `8800`; er kann in `config.yaml` über den Wert `port` geändert werden.

Für VPS-Zugriff öffne TavernAI über die öffentliche Adresse oder Domain des VPS:

```text
http://SERVER_IP:8800
```

Für reguläre VPS-Nutzung wird eine Domain mit HTTPS über reverse proxy empfohlen. Stelle keine private TavernAI-Instanz ohne Account-Schutz und normale server firewall Regeln ins öffentliche Internet.

## App-Daten

TavernAI speichert lokalen Zustand in `user_data` innerhalb des App-Ordners.

Dieser Ordner enthält Datenbank, Chats, importierte Dateien, Bilder und andere lokale Daten. Lösche ihn nicht, wenn du TavernAI verschiebst oder aktualisierst.

## Weiter

- [Schnellstart](/de/docs/quick-start/)
- [Aktualisierung](/de/docs/updating/)