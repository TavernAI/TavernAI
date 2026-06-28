---
title: Advanced features
description: Erweiterte Werkzeuge für Prompt-Tests, Nachrichtenhistorie, request inspection und tiefere TavernAI-Workflows.
sidebar:
  order: 80
---
Advanced features sind die tieferen Arbeitswerkzeuge für Chats, Prompts und Generationen, die mehr Kontrolle als der Basisfluss brauchen.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets erlauben das Speichern von Versionen von Prompts, Prompt Manager-Konfigurationen und Teilnehmerkonfigurationen.

#### 1.1 Prompt Quick Presets
Nutze sie, um eine Prompt-Änderung zu testen, ohne den funktionierenden Text zu überschreiben. Behalte das Original, teste das Experiment und kehre bei Bedarf zurück.

Erstelle ein neues prompt quick preset und ändere den Text:
![Advanced feature](/img/docs/pro_1.png)
Die neue Version ist bereit, und du kannst jederzeit per Swipe zur alten zurückkehren:
![Advanced feature](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
Dasselbe System funktioniert für On/Off-Zustände im Prompt Manager:
![Advanced feature](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
Und für Konfigurationen der Chat-Teilnehmer:
![Advanced feature](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes erlauben das Regenerieren einer Nachricht mitten im Chat, ohne einen neuen Branch zu erstellen.
![Advanced feature](/img/docs/pro_5.png)
Branching swipes erstellen einen anderen Pfad. Content Swipes erstellen eine neue Antwort an derselben Nachrichtenposition, sodass der Chat drumherum unverändert bleibt.

Nutze sie, wenn eine Nachricht eine andere Version braucht, die Chat-Struktur aber an Ort und Stelle bleiben soll.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version hält bearbeitbare Versionen des Nachrichteninhalts.

Ändere eine Nachricht, ohne den Originaltext zu verlieren. Die Bearbeitung wird zu einer Version, die du später prüfen oder wiederherstellen kannst.
![Advanced feature](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

Jede Nachricht speichert den raw API request und response, die sie erzeugt haben.

Öffne den record, um den vollständigen Prompt, Parameter, headers und raw model response zu sehen. Wenn eine Antwort gut funktioniert hat, bleibt der genaue request gespeichert, damit er später reproduziert werden kann.
![Advanced feature](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer zeigt den exakten Prompt, der an das Modell gesendet würde, wenn du jetzt generierst.

Viewer zeigt den finalen request in lesbaren Teilen, mit der Quelle jedes Teils.
![Advanced feature](/img/docs/pro_8.png)
Da der viewer denselben Baupfad wie die echte Generation verwendet, siehst du genau, was das Modell erhalten wird. Änderungen an Struktur, roles oder item-Zustand aktualisieren das preview vor dem Senden.