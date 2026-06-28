---
title: Advanced features
description: Outils avancés pour tester des prompts, consulter l'historique des messages, inspecter les requests et les workflows profonds de TavernAI.
sidebar:
  order: 80
---
Advanced features rassemble les outils de travail plus profonds pour les chats, prompts et générations qui ont besoin de plus de contrôle que le flux de base.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets permettent de sauvegarder des versions de prompts, des configurations de Prompt Manager et des configurations de participants.

#### 1.1 Prompt Quick Presets
Utilisez-les pour tester un changement de prompt sans écraser le texte qui fonctionne déjà. Gardez l'original, essayez l'expérience et revenez en arrière quand c'est nécessaire.

Créez un nouveau prompt quick preset et modifiez le texte :
![Advanced feature](/img/docs/pro_1.png)
La nouvelle version est prête, et vous pouvez revenir à l'ancienne à tout moment avec un swipe en arrière :
![Advanced feature](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
Le même système fonctionne pour les états On/Off dans Prompt Manager :
![Advanced feature](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
Et pour les configurations de participants du chat :
![Advanced feature](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes permettent de régénérer un message au milieu du chat sans créer une nouvelle branche.
![Advanced feature](/img/docs/pro_5.png)
Branching swipes créent un autre chemin. Content Swipes créent une nouvelle réponse à la même position de message, donc le chat reste inchangé autour.

Utilisez-les quand un message a besoin d'une autre version, mais que la structure du chat doit rester en place.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version garde des versions modifiables du contenu d'un message.

Modifiez un message sans perdre le texte original. La modification devient une version que vous pouvez inspecter ou récupérer plus tard.
![Advanced feature](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

Chaque message garde le raw API request et response qui l'ont créé.

Ouvrez le record pour voir le prompt complet, les paramètres, les headers et le raw model response. Quand une réponse a bien fonctionné, le request exact reste sauvegardé pour pouvoir le reproduire plus tard.
![Advanced feature](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer montre le prompt exact qui serait envoyé au modèle si vous lanciez la génération maintenant.

Viewer montre le request final en parties lisibles, avec la source de chaque partie.
![Advanced feature](/img/docs/pro_8.png)
Comme le viewer utilise le même chemin de construction que la génération réelle, vous voyez exactement ce que le modèle recevra. Les changements de structure, roles ou état des items mettent à jour le preview avant tout envoi.