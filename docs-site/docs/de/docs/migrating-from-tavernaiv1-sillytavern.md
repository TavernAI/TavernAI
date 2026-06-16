---
title: Massenimport aus TAI v1 und SillyTavern
description: Karten, Chats, Gruppenchats, lorebooks und prompt presets aus alten TavernAI v1- oder SillyTavern-Ordnern importieren.
sidebar:
  order: 52
---
<small><em>Tech term: Mass Import</em></small>

Mass Import verschiebt vorhandene Inhalte aus TavernAI v1 oder SillyTavern nach TavernAI 2.

Nutze ihn, wenn du bereits einen Ordner mit Karten, Chats, Gruppenchats, lorebooks oder prompt presets hast und sie in die neue TavernAI 2-Bibliothek übernehmen willst.

## Was Mass Import übernehmen kann

- **Karten** aus Charakterordnern von TavernAI v1 oder SillyTavern.
- **Chats**, die mit importierten Karten verknüpft werden, wenn eine passende Karte gefunden wird.
- **Gruppenchats** mit Teilnehmerliste und Chat-Verlauf.
- **Lorebooks / world info** als importierte prompt resources.
- **Prompt presets**, wenn TavernAI 2 eine kompatible preset file erkennen kann.
- **Chat-Bilder**, wenn Bildimport aktiviert ist.


## Import aus SillyTavern

1. Öffne TavernAI 2.
2. Gehe zu **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Gehe zu **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Öffne den SillyTavern-Ordner, kopiere seine Adresse und füge sie in das Eingabefeld ein.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Starte den scan.
6. Prüfe die erkannten Karten, Chats, Gruppenchats, lorebooks und presets.
7. Wähle aus, was du importieren willst.
8. Starte den Import und warte auf den Bericht.

Mass Import kann auf den SillyTavern-Root-Ordner oder auf einen SillyTavern-Nutzerordner zeigen. TavernAI erkennt die bekannte SillyTavern-Struktur und zeigt an, was importiert werden kann.

## Import aus TavernAI v1

1. Öffne TavernAI 2.
2. Gehe zu **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Gehe zu **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Öffne den TavernAI v1-Ordner, kopiere seine Adresse und füge sie in das Eingabefeld ein.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Starte den scan.
6. Prüfe die erkannten Karten, Chats und lorebooks.
7. Wähle aus, was du importieren willst.
8. Starte den Import und warte auf den Bericht.

TavernAI 2 erkennt die alte Ordnerstruktur von TavernAI v1 und importiert unterstützte Dateien in die TavernAI 2-Bibliothek.

## Zuordnung alter Inhalte

| Alter Inhalt | Ergebnis in TavernAI 2 |
|---|---|
| Character cards | Cards |
| Solo chats | Chats linked to cards |
| Group chats | Chats linked to cards |
| Lorebooks / world info | Prompt Manager resources |
| Regex-style replacements | Prompt Manager resources |
| Prompt Manager presets | Prompt Manager presets |
| Chat images | Chat files |

## Wenn etwas nicht importiert wird

Mass Import ist für normale TavernAI v1- und SillyTavern-Ordner gedacht. Beschädigte Dateien, ungewöhnliche community formats, fehlende Kartenverknüpfungen oder geänderte Ordnerstrukturen können warnings erzeugen.

## Weiter

- [Erste Schritte](/de/docs/getting-started/) für das TavernAI 2-Modell.
- [Schnellstart](/de/docs/quick-start/) für die erste Nachricht nach dem Import.
- [Macros](/de/docs/macros/) und [PM Scripts](/de/docs/pm-scripts/) für erweitertes Prompt-Verhalten.