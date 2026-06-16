---
title: Importation massive depuis TAI v1 et SillyTavern
description: Importer des cartes, chats, chats de groupe, lorebooks et prompt presets depuis d'anciens dossiers TavernAI v1 ou SillyTavern.
sidebar:
  order: 52
---
<small><em>Tech term: Mass Import</em></small>

Mass Import déplace du contenu existant de TavernAI v1 ou SillyTavern vers TavernAI 2.

Utilisez-le si vous avez déjà un dossier avec des cartes, chats, chats de groupe, lorebooks ou prompt presets, et que vous voulez les amener dans la nouvelle bibliothèque TavernAI 2.

## Ce que Mass Import peut importer

- **Cartes** depuis les dossiers de personnages TavernAI v1 ou SillyTavern.
- **Chats** liés aux cartes importées, quand une carte correspondante est trouvée.
- **Chats de groupe** avec leur liste de participants et leur historique de chat.
- **Lorebooks / world info** comme prompt resources importées.
- **Prompt presets**, si TavernAI 2 peut détecter un preset file compatible.
- **Images de chat**, si vous activez l'importation des images.


## Importer depuis SillyTavern

1. Ouvrez TavernAI 2.
2. Allez dans **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Allez dans **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Ouvrez le dossier SillyTavern, copiez son adresse et collez-la dans le champ de saisie.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Lancez le scan.
6. Vérifiez les cartes, chats, chats de groupe, lorebooks et presets détectés.
7. Sélectionnez ce que vous voulez importer.
8. Lancez l'importation et attendez le rapport.

Mass Import peut pointer vers le dossier racine de SillyTavern ou vers un dossier utilisateur SillyTavern. TavernAI détecte la structure connue de SillyTavern et affiche ce qui peut être importé.

## Importer depuis TavernAI v1

1. Ouvrez TavernAI 2.
2. Allez dans **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Allez dans **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Ouvrez le dossier TavernAI v1, copiez son adresse et collez-la dans le champ de saisie.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Lancez le scan.
6. Vérifiez les cartes, chats et lorebooks détectés.
7. Sélectionnez ce que vous voulez importer.
8. Lancez l'importation et attendez le rapport.

TavernAI 2 détecte l'ancienne structure de dossiers de TavernAI v1 et importe les fichiers pris en charge dans la bibliothèque TavernAI 2.

## Correspondance du contenu ancien

| Ancien contenu | Résultat dans TavernAI 2 |
|---|---|
| Character cards | Cards |
| Solo chats | Chats linked to cards |
| Group chats | Chats linked to cards |
| Lorebooks / world info | Prompt Manager resources |
| Regex-style replacements | Prompt Manager resources |
| Prompt Manager presets | Prompt Manager presets |
| Chat images | Chat files |

## Si quelque chose ne s'importe pas

Mass Import est conçu pour déplacer des dossiers TavernAI v1 et SillyTavern normaux. Des fichiers endommagés, des community formats peu courants, des liens de carte manquants ou des structures de dossiers modifiées peuvent produire des warnings.

## Suivant

- [Premiers pas](/fr/docs/getting-started/) pour le modèle de TavernAI 2.
- [Démarrage rapide](/fr/docs/quick-start/) pour le premier message après l'importation.
- [Macros](/fr/docs/macros/) et [PM Scripts](/fr/docs/pm-scripts/) pour le comportement avancé des prompts.