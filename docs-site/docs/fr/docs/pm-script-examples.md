---
title: Exemples de PM Scripts
description: Exemples de PM Scripts prêts à l'emploi pour les scènes TavernAI.
sidebar:
  order: 71
---

Cette section rassemble des exemples pratiques de PM Scripts à coller dans des script items de Prompt Manager et à adapter aux scènes.

## Auto speaker selector

Le premier exemple ajoute un petit panneau dans `TAI.ui.container` : l'AI choisit une ou plusieurs ChatCards du chat actuel, puis lance une génération normale pour les participants sélectionnés.

La requête de sélection utilise le mode internal-only : elle voit l'historique actuel du chat et le Prompt Manager via `injectedPrompts`, retourne `generatedText` et ne crée pas de message visible. La réponse finale utilise la génération normale avec des `chatCardId` overrides temporaires.

Le code complet de l'exemple se trouve sur la page canonique : [PM Script Examples](/docs/pm-script-examples/#auto-speaker-selector).
