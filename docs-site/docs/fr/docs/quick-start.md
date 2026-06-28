---
title: Démarrage rapide
description: Du premier lancement au premier message d'AI.
sidebar:
  order: 30
---

Le démarrage rapide va de l'ouverture de TavernAI 2 à la première réponse de l'AI.

Utilisez-le après l'[installation](/fr/docs/installation/). Nous allons lancer l'application, connecter un provider, ajouter une carte et envoyer un message.

## 1. Premier message

### 1.1 Lancer TavernAI

Ouvrez TavernAI depuis le dossier que vous avez extrait.

![TavernAI launch placeholder](/img/docs/1.png)

### 1.2 Connecter un provider

Ouvrez la configuration du provider et choisissez le modèle d'AI à utiliser.

![Provider setup placeholder](/img/docs/2.png)


### 1.3 Créer un chat

Appuyez sur le bouton **Chat** du personnage pour démarrer un nouveau chat.

![Create chat placeholder](/img/docs/3.png)

### 1.4 Écrire un message

Écrivons maintenant le premier message.

![Add card placeholder](/img/docs/4.png)

### 1.5 Recevoir une réponse

Nous recevons maintenant la première réponse de l'AI.

![First message placeholder](/img/docs/5.png)

## 2. Ajouter des cartes

À ce stade, nous ne parlons pas encore comme une character card. Ajoutons une carte pour nous, afin que le chat ait un participant de notre côté.

### 2.1 Ouvrir le panneau des cartes

Ouvrez le panneau pour ajouter des cartes au chat.

![First message placeholder](/img/docs/6.png)

### 2.2 Ajouter un personnage

Choisissez la carte que vous voulez utiliser pour vous.

![First message placeholder](/img/docs/7.png)

### 2.3 Configurer la carte

La carte est maintenant dans le chat.

![First message placeholder](/img/docs/8.png)

Pour le moment, l'AI est configurée pour parler au nom des deux cartes. Affectons Scout comme notre carte et laissons Marika comme carte du côté AI.

Voici Scout quand l'AI parle pour cette carte :

![First message placeholder](/img/docs/9.png)

Et voici Scout après être devenu notre carte :

![First message placeholder](/img/docs/10.png)

Les controls de la carte signifient :

`AI` — les cartes avec ce flag activé participent aux AI-generated messages.

`U` — les cartes avec ce flag activé participent à vos messages.

`Ctx` — quand il est activé, le Prompt Manager de la carte est ajouté au generation context.

`Role selector` — contrôle le Chat Completion role pour les messages de cette carte, afin que le modèle sache s'ils doivent être traités comme des messages côté utilisateur ou côté AI.

### 2.4 Envoyer un message comme la carte

Envoyons maintenant un message comme Scout. Marika réagit autrement parce que le chat a désormais un personnage de notre côté.

![First message placeholder](/img/docs/11.png)

## 3. Changer les rôles

Créons maintenant un nouveau chat et inversons la configuration des cartes.

![First message placeholder](/img/docs/12.png)

Cette fois, nous jouons Marika, propriétaire de la boulangerie de nuit, et nous recevons Scout comme invité.

![First message placeholder](/img/docs/13.png)

## Suivant

- [Macros](/fr/docs/macros/)
- [PM Scripts](/fr/docs/pm-scripts/)
- [Advanced features](/fr/docs/advanced-features/)