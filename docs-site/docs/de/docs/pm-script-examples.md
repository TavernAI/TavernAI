---
title: PM Script Beispiele
description: Einsatzbereite PM Script Beispiele für TavernAI-Szenen.
sidebar:
  order: 71
---

Dieser Bereich sammelt praktische PM Script Beispiele, die in Prompt Manager script items eingefügt und für Szenen angepasst werden können.

## Auto speaker selector

Das erste Beispiel fügt eine kleine Schaltfläche in `TAI.ui.container` ein: Die AI wählt eine oder mehrere ChatCards aus dem aktuellen Chat und startet danach eine normale Generierung für diese ausgewählten Teilnehmer.

Der Auswahlaufruf läuft im internal-only Modus: Er sieht die aktuelle Chat-Historie und den Prompt Manager über `injectedPrompts`, gibt `generatedText` zurück und erstellt keine sichtbare Nachricht. Die finale Antwort nutzt normale Generierung mit temporären `chatCardId` overrides.

Der vollständige Beispielcode steht auf der kanonischen Seite: [PM Script Examples](/docs/pm-script-examples/#auto-speaker-selector).
