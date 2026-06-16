---
title: Premiers pas
description: Ce qu'est TavernAI 2, ce qu'il peut faire et où continuer.
sidebar:
  order: 10
---

## Ce qu'est TavernAI

**TavernAI** est apparu en 2022, quand les applications de chat avec AI cherchaient encore leur forme, et a posé une idée : les dialogues et les personnages restent sur le PC, et le modèle d'AI reste au choix.

**TavernAI 2** est une reconstruction complète de la première version, nourrie par l'expérience des années suivantes. Ces chats ne se limitent plus aux conversations avec un seul personnage : ils peuvent devenir des scènes avec une distribution changeante, des histoires ramifiées, des ressources visuelles et une logique interactive.

**La base reste simple :** connecter un provider, choisir un personnage, envoyer un message. La profondeur apparaît seulement quand elle devient utile.

![TavernAI chat screen placeholder](/img/docs/screen1.png)
![TavernAI chat screen placeholder](/img/docs/screen2.png)

## Fonctions principales de TavernAI 2

- **Application portable** : télécharger et lancer, sans installateur. Taille : 300 Mo.

- **Swipes à branches** : un swipe sur n'importe quel message crée une autre branche dans le même chat. Chaque réponse alternative peut continuer comme une ligne séparée.

- **Multi-génération** : un chat peut exécuter plusieurs générations d'AI en même temps.

- **Participants dynamiques du chat** : ajoutez autant de cartes que nécessaire au chat, puis réordonnez-les, retirez-les ou remplacez-les selon l'évolution de la scène. L'historique du chat continue de fonctionner même quand la distribution change.

- **Prompt Manager unifié** : un seul système construit ce que voit le modèle. World info, lorebooks, regex-style replacements et prompts vivent au même endroit.

- **Nouveau format de cartes** : chaque carte a son propre Prompt Manager. Un personnage n'est plus limité à un seul grand champ de texte.

- **Pièces jointes dans les prompts** : Prompt Manager peut joindre des fichiers et des images à chaque prompt. Comme les cartes ont leur propre Prompt Manager, une carte peut inclure des images du personnage, et l'AI peut voir le personnage directement depuis la carte.

- **Éditeur de thèmes** : modifiez l'apparence de n'importe quelle partie de TavernAI. Créez un thème pour toute l'interface, pas seulement une couleur d'accent.

- **Pre-gen et post-gen Macros** : automatisez les changements avant la génération d'AI et après la réponse. Utilisez-les pour modifier des prompts, le contenu des messages ou l'état de la scène au bon moment.

- **Prompt Manager Scripts** : transforment TavernAI 2 en AI game engine. Ajoutez des panneaux personnalisés, créez des mécaniques et transformez le chat en scène d'AI jouable.

## Où continuer

- [Installation](/fr/docs/installation/) pour Windows, Linux et VPS.
- [Démarrage rapide](/fr/docs/quick-start/) pour le premier lancement, la connexion du provider et le premier message.
- [Macros](/fr/docs/macros/) pour l'automatisation pre-gen et post-gen des prompts.
- [PM Scripts](/fr/docs/pm-scripts/) pour les scénarios interactifs.
- [TavernAI Pro](/fr/docs/pro/) pour la supporter edition.
- [Mise à jour](/fr/docs/updating/) si vous avez déjà un dossier TavernAI.
- [Importation massive depuis TavernAI et SillyTavern](/fr/docs/migrating-from-tavernaiv1-sillytavern/) si vous apportez du contenu ancien.