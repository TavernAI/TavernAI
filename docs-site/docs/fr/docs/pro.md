---
title: TavernAI Pro
description: Supporter tools pour tester des prompts, consulter l'historique des messages, inspecter les requests et les workflows avancés de TavernAI.
sidebar:
  order: 80
---
![Pro](/img/docs/pro_logo_3.png)
TavernAI Pro est la supporter edition pour ceux qui ont besoin de réglages plus fins et de plus de contrôle au-delà du flux de base.

Pro ajoute des outils pour modifier et tester rapidement des prompts, consulter l'historique des changements de messages, inspecter les requests envoyées au modèle et comprendre exactement ce que le modèle a reçu.

Pro ne remplace pas TavernAI 2. C'est un ensemble d'outils de travail par-dessus lui.

Le supporter access est disponible via [Patreon](https://www.patreon.com/tavernai) et [Boosty](https://boosty.to/tavernai).

## Ce que Pro ajoute

Les outils Pro se concentrent sur le contrôle, le versioning, l'inspection et le recovery.

### 1. Quick Presets
<small><em>Tech term: Quick Presets</em></small>

Quick Presets permettent de sauvegarder des versions de prompts, des configurations de Prompt Manager et des configurations de participants.

#### 1.1 Prompt Quick Presets
Utilisez-les pour tester un changement de prompt sans écraser le texte qui fonctionne déjà. Gardez l'original, essayez l'expérience et revenez en arrière quand c'est nécessaire.

Créez un nouveau prompt quick preset et modifiez le texte :
![Pro](/img/docs/pro_1.png)
La nouvelle version est prête, et vous pouvez revenir à l'ancienne à tout moment avec un swipe en arrière :
![Pro](/img/docs/pro_2.png)
#### 1.2 Prompt Manager Quick State Presets
Le même système fonctionne pour les états On/Off dans Prompt Manager :
![Pro](/img/docs/pro_3.png)
#### 1.3 Participant setups Quick Presets
Et pour les configurations de participants du chat :
![Pro](/img/docs/pro_4.png)
### 2. Message Content Swipes
<small><em>Tech term: Message Content Swipes</em></small>

Content Swipes permettent de régénérer un message au milieu du chat sans créer une nouvelle branche.
![Pro](/img/docs/pro_5.png)
Branching swipes créent un autre chemin. Content Swipes créent une nouvelle réponse à la même position de message, donc le chat reste inchangé autour.

Utilisez-les quand un message a besoin d'une autre version, mais que la structure du chat doit rester en place.

### 3. Message Content Version
<small><em>Tech term: Message Content Version</em></small>

Message Content Version garde des versions modifiables du contenu d'un message.

Modifiez un message sans perdre le texte original. La modification devient une version que vous pouvez inspecter ou récupérer plus tard.
![Pro](/img/docs/pro_6.png)
### 4. Response/Request Message Record
<small><em>Tech term: Prompt Record</em></small>

Dans Pro, chaque message garde le raw API request et response qui l'ont créé.

Ouvrez le record pour voir le prompt complet, les paramètres, les headers et le raw model response. Quand une réponse a bien fonctionné, le request exact reste sauvegardé pour pouvoir le reproduire plus tard.
![Pro](/img/docs/pro_7.png)
### 5. Final Prompt Viewer
<small><em>Tech term: Final Prompt Viewer</em></small>

Final Prompt Viewer montre le prompt exact qui serait envoyé au modèle si vous lanciez la génération maintenant.

Viewer montre le request final en parties lisibles, avec la source de chaque partie.
![Pro](/img/docs/pro_8.png)
Comme le viewer utilise le même chemin de construction que la génération réelle, vous voyez exactement ce que le modèle recevra. Les changements de structure, roles ou état des items mettent à jour le preview avant tout envoi.