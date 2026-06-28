---
title: Macros
description: Server-side JavaScript für prompt-time und post-generation Verarbeitung in Prompt Manager-Elementen.
sidebar:
  order: 60
---
<small><em>Tech term: Pre-gen Macros, Post-gen Macros</em></small>

Macros erlauben Prompt Manager-Text, kleine JavaScript-Fragmente während der Generation auszuführen.

Nutze sie, wenn du einen beliebigen Wert, Zustandsparameter oder das Generationsergebnis ändern musst.


## Macros laufen in zwei Phasen

TavernAI hat zwei Macro-Formen, beide laufen auf dem Server.

- `<% ... %>` ist pre-gen. Es läuft, während TavernAI den Prompt baut. Seine Ausgabe wird Teil des Prompts und an das Modell gesendet.
- `<%% ... %%>` ist post-gen. Es läuft nach Empfang der AI-Antwort und kann generated blocks prüfen und umschreiben, bevor die finale Nachricht angezeigt wird.

Macros sind server-side tools. Wenn die Aufgabe zur live Szene im Browser gehört, nutze [PM Scripts](/de/docs/pm-scripts/).

## Wofür Macros da sind

Nutze Macros, wenn Prompt-Text oder generierter Nachrichteninhalt dynamisch geändert werden soll, statt statisch zu bleiben.

Geeignet für:

- zufällige Ereignisse;
- zeitabhängigen Text;
- bedingte Formulierungen;
- Prompt-Text, der von gemeinsamem Zustand abhängt;
- Nachbearbeitung generierten Textes;
- Chat-Zustand, der in späteren Generationen verwendet werden soll.

## Macro-Syntax

### Pre-gen: `<% %>`

Pre-gen Macros laufen während des Prompt-Baus.

```txt
The room feels <% rand(["warm", "cold", "silent"]) %>.
```

Wenn ein Block eine expression enthält, wird ihr Ergebnis in den Text eingefügt.

Für mehr Kontrolle nutze `print()`.

```txt
<%
print("Turn: ");
print((TAI.store.chat.get("turn") || 0) + 1);
%>
```

### Post-gen: `<%% %%>`

Post-gen Macros laufen nach Empfang der AI-Antwort. Nutze diese Form, wenn die Antwort nach der Generation geändert werden soll.

```txt
<%%
for (var i = 0; i < TAI.generated.blocks.length; i++) {
  var block = TAI.generated.blocks[i];
  if (block.type !== "text") continue;
  block.text = block.text.replace(/OOC:/g, "(OOC:");
}
%%>
```



## Ein item, zwei Ausführungsphasen

Alle `<% %>`-Blöcke im selben Prompt Manager-Element laufen während des Prompt-Baus der Reihe nach.

`<%% %%>`-Blöcke aus demselben item laufen später, nach der Generation.

Verlasse dich nicht darauf, dass lokale JavaScript variables von pre-gen nach post-gen übergehen. Wenn Daten aus `<% %>` in `<%% %%>` verfügbar sein sollen, schreibe sie in `TAI.vars` oder `TAI.store.chat`.

Verschiedene Prompts teilen keine lokalen JavaScript variables. Wenn Daten zwischen Prompts wandern müssen, nutze `TAI.vars` oder `TAI.store.chat`.

## Placeholders und Macros

Placeholders und Macros lösen unterschiedliche Aufgaben.

- placeholders ersetzen bekannte Kontextwerte;
- Macros berechnen oder bauen Text zusammen oder bearbeiten generierten Text nach.

Placeholder resolution passiert vor der Ausführung von pre-gen Macro. `<% %>` arbeitet auf bereits aufgelöstem prompt context.

`<%% %%>`-Blöcke werden nie in den Prompt eingefügt und verhalten sich daher nicht wie placeholder text.

Nutze die [Placeholder-Referenz](/de/docs/placeholders/), wenn der Wert bereits im Kontext existiert. Nutze Macro, wenn der Wert berechnet werden muss.

## Zentrale Datenwerkzeuge

### `TAI.vars`

`TAI.vars` ist gemeinsamer Zustand für einen Prompt-Bau.

Nutze es, wenn ein Prompt einen Wert an einen anderen Prompt in derselben Generation übergeben muss, oder wenn ein `<% %>`-Block Daten für einen späteren `<%% %%>`-Block vorbereiten soll.

Geeignet für:

- einen zufälligen Wurf, der später wiederverwendet wird;
- Berechnung eines gemeinsamen Zustandswerts aus der letzten Nachricht;
- mehrere Scripts, die auf ein temporäres Ergebnis reagieren;
- Verbindung von pre-gen und post-gen Logik im selben prompt cycle.

```txt
<% TAI.vars.set("mood", rand(["tense", "calm", "alert"])) %>
```

Später in einem anderen item:

```txt
Current mood: <% TAI.vars.get("mood") %>
```

Brücke von pre-gen zu post-gen:

```txt
<% TAI.vars.set("target", "OOC:") %>

<%%
var target = TAI.vars.get("target");
for (var i = 0; i < TAI.generated.blocks.length; i++) {
  var block = TAI.generated.blocks[i];
  if (block.type !== "text") continue;
  block.text = block.text.replace(new RegExp(target, "g"), "(OOC:");
}
%%>
```

### `TAI.store.chat`

`TAI.store.chat` ist Zustand, der mit dem aktuellen Chat verbunden ist.

Nutze es, wenn ein Wert zwischen Generationen und nach erneutem Öffnen des Chats erhalten bleiben soll.

Geeignet für:

- Rundenzähler;
- RPG-Einstellungen;
- Szenen-Flags;
- Werte, die jetzt geschrieben und später verwendet werden.

```txt
<%
var turn = TAI.store.chat.get("turn") || 0;
turn++;
TAI.store.chat.set("turn", turn);
print("Turn " + turn);
%>
```

### `TAI.generated`

`TAI.generated` ist in `<%% %%>`-Blöcken verfügbar.

Nutze es, wenn post-gen Logik die empfangene Nachricht lesen oder umschreiben soll.

`TAI.generated.message.content.blocks` ist ein Teil der generierten Antwort. Er kann normaler Text oder ein think block sein, und Modelle können während der Antwort zwischen Blocktypen wechseln.

Häufige Beispiele:

- `TAI.generated.blocks` — kurzer alias für `TAI.generated.message.content.blocks`
- `TAI.generated.message.content.blocks` — vollständiger Pfad zu den generated content blocks
- `TAI.generated.finishReason`

Nutze `TAI.generated.blocks`, wenn generierter Text umgeschrieben werden soll, bevor die finale Nachricht den Nutzer erreicht.

### `TAI.chat`, `TAI.card` und `TAI.time`

Pre-gen Macros können auch structured context direkt lesen.

Häufige Beispiele:

- `TAI.chat.messageCount`
- `TAI.chat.lastMessage`
- `TAI.card.names`
- `TAI.time.hour`

Sie sind nützlich, wenn der Prompt auf die aktuelle Unterhaltung, aktuelle Teilnehmer oder die aktuelle Zeit reagieren soll.

### Built-in helpers

Macros stellen außerdem eine kleine Gruppe von helpers für normale Prompt-Arbeit bereit:

- `print()`
- `rand()`
- `dice()`
- `chance()`

Sie decken einen großen Teil des dynamischen prompt writing ab, ohne eine größere Runtime zu benötigen.

### Debug output

Nutze `TAI.debug.log(...)`, wenn ein Macro diagnostische Ausgabe braucht. Es schreibt in backend log/console und fügt keinen Text zum Prompt oder zur generierten Nachricht hinzu.

```js
TAI.debug.log('state', { hp: 10 }, TAI.chat.messageCount);
```

## Common patterns

### Zufällige Variation

Nutze Macro, wenn eine wiederholte Anweisung oder Beschreibung zwischen mehreren Formen wechseln soll.

### Gemeinsamer Zustand für eine Generation

Nutze `TAI.vars`, wenn mehrere Prompts in einem Prompt Manager denselben gemeinsamen Wert brauchen.

### Persistenter Chat-Zustand

Nutze `TAI.store.chat`, wenn Zustand erhalten bleiben und zukünftige Generationen beeinflussen soll.

### Generierten Text nachbearbeiten

Nutze `<%% %%>`, wenn die generierte Nachricht nach dem Empfang umgeschrieben werden soll, etwa um Tags zu normalisieren, bekannte Ausgabe-Muster zu korrigieren oder eine szenenspezifische Bereinigung anzuwenden.

## Macros und PM Scripts

Macros und PM Scripts liegen auf unterschiedlichen Ebenen.

### Nutze Macros, wenn

- ein Prompt Text über `<% %>` erhalten muss;
- generated message direkt nach Empfang über `<%% %%>` umgeschrieben werden soll;
- Zustand späteren prompt output oder post-processing beeinflussen soll.

### Nutze PM Scripts, wenn

- die Logik in den Browser gehört;
- das Script in Echtzeit auf chat events reagiert;
- das Ergebnis UI behavior, notifications oder browser-side interaction ist.

Wenn die Aufgabe darin besteht, generated blocks vor Anzeige der finalen Nachricht umzuschreiben, beginne mit post-gen `<%% %%>`, nicht mit PM Scripts.

## Grenzen

Beide Macro-Formen laufen in einer sicheren server-side sandbox.

Das ist bewusst eng gehalten:

- kein DOM-Zugriff;
- keine browser APIs;
- keine network fetches;
- kein `eval()` oder `new Function()`;
- keine timer-based browser logic.

Macros bleiben innerhalb der Grenzen von prompt-side scripting.

## Weiter

- [Referenz für Karten-Placeholders](/de/docs/placeholders/) für einfache Kontextwerte.
- [PM Scripts](/de/docs/pm-scripts/) für browser-side logic.