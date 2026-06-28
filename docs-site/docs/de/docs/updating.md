---
title: Aktualisierung
description: TavernAI 2 aktualisieren, ohne lokale Daten zu verlieren.
sidebar:
  order: 40
---

TavernAI kann sich über die Oberfläche aktualisieren. Die manuellen Methoden sind nur nötig, wenn der Interface-Updater nicht verfügbar ist oder wenn die Installation von Hand verschoben werden soll.

## Aktualisierung über die Oberfläche

1. Öffne TavernAI.
2. Gehe zu `Settings` -> `Updates`.
3. Installiere das Update.

Der updater lädt die passende Build herunter, prüft sie, legt sie in `update_cache` bereit und ersetzt die App-Dateien nach dem Beenden von TavernAI. Nach einem erfolgreichen Update wird `update_cache` entfernt. Lokale Daten bleiben erhalten: `user_data`, `logs`, `models` und `config.yaml`.

Lass TavernAI alle startup migrations abschließen, bevor du die App erneut schließt.

## Manuelle Aktualisierung

Nutze diesen Weg, wenn die Aktualisierung über die Oberfläche nicht verwendet werden kann oder wenn du die Build selbst ersetzen willst.

1. Schließe TavernAI vollständig.
2. Erstelle ein Backup des alten `user_data`-Ordners.
3. Lade die neue Build von [Download](/download/) herunter.
4. Entpacke die neue Build in einen neuen Ordner.
5. Kopiere `user_data` aus dem alten Ordner in den neuen.
6. Starte die neue Build.

## VPS-Aktualisierung

Wenn TavernAI mit dem VPS script installiert wurde und du eine Aktualisierung im Terminal brauchst, starte den updater aus dem App-Ordner:

```bash
cd ~/TavernAI
./updater/update.sh
```

Wenn du TavernAI an einem anderen Ort installiert hast, führe `updater/update.sh` aus diesem Ordner aus.

## Was behalten werden muss

Behalte den gesamten Ordner `user_data`.

Er enthält Datenbank, Chats, importierte Dateien, Bilder und andere lokale TavernAI-Daten.

## TavernAI verschieben

TavernAI kann als Ordner verschoben werden. Um es in einen anderen Ordner oder auf ein anderes Laufwerk zu verschieben:

1. Schließe TavernAI.
2. Kopiere den gesamten App-Ordner an den neuen Ort.
3. Starte TavernAI vom neuen Ort.
4. Prüfe, ob deine Chats und Dateien noch da sind.

## Vermeiden

- Lösche `user_data` nicht während einer Aktualisierung.
- Verwende denselben aktiven `user_data`-Ordner nicht mit zwei verschiedenen TavernAI-Versionen.
- Verwende keine alte Build als Rollback für einen `user_data`-Ordner, der bereits in einer neuen Version geöffnet wurde.

## Weiter

- [Installation](/de/docs/installation/)
- [Schnellstart](/de/docs/quick-start/)