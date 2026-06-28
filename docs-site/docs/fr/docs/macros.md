---
title: Macros
description: Server-side JavaScript pour le traitement prompt-time et post-generation dans les éléments de Prompt Manager.
sidebar:
  order: 60
---
<small><em>Tech term: Pre-gen Macros, Post-gen Macros</em></small>

Macros permettent au texte de Prompt Manager d'exécuter de petits fragments JavaScript pendant la génération.

Utilisez-les quand vous devez passer une valeur arbitraire, des paramètres d'état ou modifier le résultat de génération.


## Macros fonctionnent en deux phases

TavernAI a deux formes de Macro, et les deux s'exécutent sur le serveur.

- `<% ... %>` est pre-gen. Il s'exécute pendant que TavernAI construit le prompt. Sa sortie devient une partie du prompt et est envoyée au modèle.
- `<%% ... %%>` est post-gen. Il s'exécute après réception de la réponse AI et peut inspecter et réécrire des generated blocks avant l'affichage du message final.

Macros sont des server-side tools. Si la tâche appartient à une scène live dans le navigateur, utilisez [PM Scripts](/fr/docs/pm-scripts/).

## À quoi servent Macros

Utilisez Macros quand le texte du prompt ou le contenu du message généré doit changer dynamiquement au lieu de rester statique.

Adapté pour :

- événements aléatoires;
- texte dépendant du temps;
- formulations conditionnelles;
- texte de prompt dépendant d'un état partagé;
- post-traitement du texte généré;
- état de chat qui doit être utilisé dans les générations suivantes.

## Syntaxe de Macro

### Pre-gen: `<% %>`

Les pre-gen Macros s'exécutent pendant la construction du prompt.

```txt
The room feels <% rand(["warm", "cold", "silent"]) %>.
```

Si un bloc contient une expression, son résultat est inséré dans le texte.

Pour plus de contrôle, utilisez `print()`.

```txt
<%
print("Turn: ");
print((TAI.store.chat.get("turn") || 0) + 1);
%>
```

### Post-gen: `<%% %%>`

Les post-gen Macros s'exécutent après réception de la réponse AI. Utilisez cette forme quand la réponse doit être modifiée après la génération.

```txt
<%%
for (var i = 0; i < TAI.generated.blocks.length; i++) {
  var block = TAI.generated.blocks[i];
  if (block.type !== "text") continue;
  block.text = block.text.replace(/OOC:/g, "(OOC:");
}
%%>
```



## Un item, deux phases d'exécution

Tous les blocs `<% %>` dans le même élément de Prompt Manager s'exécutent dans l'ordre pendant la construction du prompt.

Les blocs `<%% %%>` du même item s'exécutent plus tard, après la génération.

Ne comptez pas sur le passage de JavaScript variables locales de pre-gen à post-gen. Si les données de `<% %>` doivent être disponibles dans `<%% %%>`, écrivez-les dans `TAI.vars` ou `TAI.store.chat`.

Des prompts différents ne partagent pas leurs JavaScript variables locales. Si des données doivent passer d'un prompt à un autre, utilisez `TAI.vars` ou `TAI.store.chat`.

## Placeholders et Macros

Placeholders et Macros résolvent des tâches différentes.

- placeholders substituent des valeurs connues du contexte;
- Macros calculent ou assemblent du texte, ou post-traitent du texte généré.

Placeholder resolution se produit avant l'exécution de pre-gen Macro. `<% %>` travaille sur un prompt context déjà résolu.

Les blocs `<%% %%>` ne sont jamais insérés dans le prompt, donc ils ne se comportent pas comme du placeholder text.

Utilisez la [référence des placeholders](/fr/docs/placeholders/) quand la valeur existe déjà dans le contexte. Utilisez Macro quand la valeur doit être calculée.

## Principaux outils de données

### `TAI.vars`

`TAI.vars` est un état partagé pour une construction de prompt.

Utilisez-le quand un prompt doit passer une valeur à un autre prompt dans la même génération, ou quand un bloc `<% %>` doit préparer des données pour un bloc `<%% %%>` ultérieur.

Adapté pour :

- un tirage aléatoire réutilisé ensuite;
- calculer une valeur d'état commune depuis le dernier message;
- faire réagir plusieurs scripts à un résultat temporaire;
- relier la logique pre-gen et post-gen dans le même prompt cycle.

```txt
<% TAI.vars.set("mood", rand(["tense", "calm", "alert"])) %>
```

Plus tard, dans un autre item :

```txt
Current mood: <% TAI.vars.get("mood") %>
```

Pont de pre-gen vers post-gen :

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

`TAI.store.chat` est un état associé au chat actuel.

Utilisez-le quand une valeur doit être conservée entre les générations et après la réouverture du chat.

Adapté pour :

- compteurs de tours;
- configurations RPG;
- flags de scène;
- valeurs écrites maintenant et utilisées plus tard.

```txt
<%
var turn = TAI.store.chat.get("turn") || 0;
turn++;
TAI.store.chat.set("turn", turn);
print("Turn " + turn);
%>
```

### `TAI.generated`

`TAI.generated` est disponible dans les blocs `<%% %%>`.

Utilisez-le quand la logique post-gen doit lire ou réécrire le message reçu.

`TAI.generated.message.content.blocks` est une partie de la réponse générée. Elle peut être du texte normal ou un think block, et les modèles peuvent alterner entre types de blocs pendant la production de la réponse.

Exemples courants :

- `TAI.generated.blocks` — alias court de `TAI.generated.message.content.blocks`
- `TAI.generated.message.content.blocks` — chemin complet vers les generated content blocks
- `TAI.generated.finishReason`

Utilisez `TAI.generated.blocks` quand vous devez réécrire le texte généré avant que le message final atteigne l'utilisateur.

### `TAI.chat`, `TAI.card` et `TAI.time`

Les pre-gen Macros peuvent aussi lire directement le structured context.

Exemples courants :

- `TAI.chat.messageCount`
- `TAI.chat.lastMessage`
- `TAI.card.names`
- `TAI.time.hour`

Ils sont utiles quand le prompt doit réagir à la conversation actuelle, aux participants actuels ou à l'heure actuelle.

### Built-in helpers

Macros exposent aussi un petit ensemble de helpers pour le travail courant sur les prompts :

- `print()`
- `rand()`
- `dice()`
- `chance()`

Ils couvrent une grande partie du prompt writing dynamique sans nécessiter un runtime plus grand.

### Debug output

Utilisez `TAI.debug.log(...)` quand une Macro a besoin d'une sortie de diagnostic. Elle écrit dans le backend log/console et n'ajoute pas de texte au prompt ni au message généré.

```js
TAI.debug.log('state', { hp: 10 }, TAI.chat.messageCount);
```

## Common patterns

### Variation aléatoire

Utilisez Macro quand une instruction ou description répétée doit alterner entre plusieurs formes.

### État partagé pour une génération

Utilisez `TAI.vars` quand plusieurs prompts dans un Prompt Manager ont besoin d'une même valeur partagée.

### État persistant du chat

Utilisez `TAI.store.chat` quand l'état doit être conservé et influencer les générations futures.

### Post-traiter du texte généré

Utilisez `<%% %%>` quand le message généré doit être réécrit après réception, par exemple pour normaliser des tags, corriger des patterns de sortie connus ou appliquer un nettoyage propre à la scène.

## Macros et PM Scripts

Macros et PM Scripts se trouvent sur des couches différentes.

### Utilisez Macros quand

- un prompt doit obtenir du texte via `<% %>`;
- generated message doit être réécrit juste après réception via `<%% %%>`;
- l'état doit influencer le prompt output suivant ou le post-processing.

### Utilisez PM Scripts quand

- la logique appartient au navigateur;
- le script réagit aux chat events en temps réel;
- le résultat est UI behavior, notifications ou browser-side interaction.

Si la tâche consiste à réécrire des generated blocks avant l'affichage du message final, commencez par post-gen `<%% %%>`, pas par PM Scripts.

## Limites

Les deux formes de Macro s'exécutent dans un server-side sandbox sécurisé.

C'est un environnement volontairement étroit :

- pas d'accès au DOM;
- pas de browser APIs;
- pas de network fetches;
- pas de `eval()` ni `new Function()`;
- pas de timer-based browser logic.

Macros restent dans les limites du prompt-side scripting.

## Suivant

- [Référence des placeholders de cartes](/fr/docs/placeholders/) pour les valeurs simples de contexte.
- [PM Scripts](/fr/docs/pm-scripts/) pour browser-side logic.