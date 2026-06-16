---
title: TavernAI Pro
description: Supporter tools für Prompt-Tests, Nachrichtenhistorie, request inspection und erweiterte TavernAI-Workflows.
sidebar:
  order: 80
---
![Pro](/img/docs/pro_logo_3.png)
TavernAI Pro ist die supporter edition für Nutzer, die feinere Einstellungen und mehr Kontrolle über den Basisfluss hinaus brauchen.

Pro ergänzt Werkzeuge zum schnellen Ändern und Testen von Prompts, zur Historie von Nachrichtenänderungen, zur Prüfung von requests an das Modell und zum genauen Verständnis dessen, was das Modell erhalten hat.

Pro ersetzt TavernAI 2 nicht. Es ist ein Satz Arbeitswerkzeuge darüber.

Supporter access ist über [Patreon](https://www.patreon.com/tavernai) und [Boosty](https://boosty.to/tavernai) verfügbar.

## Was Pro hinzufügt

Die Pro-Werkzeuge konzentrieren sich auf Kontrolle, versioning, inspection und recovery.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets erlauben das Speichern von Versionen von Prompts, Prompt Manager-Konfigurationen und Teilnehmerkonfigurationen.

#### 1.1 Prompt Quick Presets
Nutze sie, um eine Prompt-Änderung zu testen, ohne den funktionierenden Text zu überschreiben. Behalte das Original, teste das Experiment und kehre bei Bedarf zurück.

Erstelle ein neues prompt quick preset und ändere den Text:
![Pro](/img/docs/pro_1.png)
Die neue Version ist bereit, und du kannst jederzeit per Swipe zur alten zurückkehren:
![Pro](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
Dasselbe System funktioniert für On/Off-Zustände im Prompt Manager:
![Pro](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
Und für Konfigurationen der Chat-Teilnehmer:
![Pro](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes erlauben das Regenerieren einer Nachricht mitten im Chat, ohne einen neuen Branch zu erstellen.
![Pro](/img/docs/pro_5.png)
Branching swipes erstellen einen anderen Pfad. Content Swipes erstellen eine neue Antwort an derselben Nachrichtenposition, sodass der Chat drumherum unverändert bleibt.

Nutze sie, wenn eine Nachricht eine andere Version braucht, die Chat-Struktur aber an Ort und Stelle bleiben soll.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version hält bearbeitbare Versionen des Nachrichteninhalts.

Ändere eine Nachricht, ohne den Originaltext zu verlieren. Die Bearbeitung wird zu einer Version, die du später prüfen oder wiederherstellen kannst.
![Pro](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

In Pro speichert jede Nachricht den raw API request und response, die sie erzeugt haben.

Öffne den record, um den vollständigen Prompt, Parameter, headers und raw model response zu sehen. Wenn eine Antwort gut funktioniert hat, bleibt der genaue request gespeichert, damit er später reproduziert werden kann.
![Pro](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer zeigt den exakten Prompt, der an das Modell gesendet würde, wenn du jetzt generierst.

Viewer zeigt den finalen request in lesbaren Teilen, mit der Quelle jedes Teils.
![Pro](/img/docs/pro_8.png)
Da der viewer denselben Baupfad wie die echte Generation verwendet, siehst du genau, was das Modell erhalten wird. Änderungen an Struktur, roles oder item-Zustand aktualisieren das preview vor dem Senden.