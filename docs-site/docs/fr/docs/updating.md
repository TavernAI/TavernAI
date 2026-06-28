---
title: Mise à jour
description: Mettre à jour TavernAI 2 sans perdre les données locales.
sidebar:
  order: 40
---

TavernAI peut se mettre à jour depuis l'interface. Les méthodes manuelles servent seulement quand l'updater de l'interface n'est pas disponible ou quand l'installation doit être déplacée à la main.

## Mise à jour depuis l'interface

1. Ouvrez TavernAI.
2. Allez dans `Settings` -> `Updates`.
3. Installez la mise à jour.

L'updater télécharge la build compatible, la vérifie, la prépare dans `update_cache`, puis remplace les fichiers de l'application après la fermeture de TavernAI. Après une mise à jour réussie, `update_cache` est supprimé. Les données locales restent en place : `user_data`, `logs`, `models` et `config.yaml`.

Laissez TavernAI terminer toutes les startup migrations avant de fermer à nouveau l'application.

## Mise à jour manuelle

Utilisez cette méthode si la mise à jour depuis l'interface ne peut pas être utilisée, ou si vous voulez remplacer la build vous-même.

1. Fermez complètement TavernAI.
2. Faites une copie de sauvegarde de l'ancien dossier `user_data`.
3. Téléchargez la nouvelle build depuis [Download](/download/).
4. Extrayez la nouvelle build dans un nouveau dossier.
5. Copiez `user_data` de l'ancien dossier vers le nouveau.
6. Lancez la nouvelle build.

## Mise à jour VPS

Si TavernAI a été installé avec le VPS script et qu'une mise à jour par terminal est nécessaire, lancez l'updater depuis le dossier de l'application :

```bash
cd ~/TavernAI
./updater/update.sh
```

Si vous avez installé TavernAI ailleurs, lancez `updater/update.sh` depuis ce dossier.

## Ce qu'il faut conserver

Conservez tout le dossier `user_data`.

Il contient la base de données, les chats, les fichiers importés, les images et d'autres données locales de TavernAI.

## Déplacer TavernAI

TavernAI peut être déplacé comme un dossier. Pour le déplacer vers un autre dossier ou disque :

1. Fermez TavernAI.
2. Copiez tout le dossier de l'application vers le nouvel emplacement.
3. Lancez TavernAI depuis le nouvel emplacement.
4. Vérifiez que vos chats et fichiers sont toujours là.

## À éviter

- Ne supprimez pas `user_data` pendant une mise à jour.
- N'utilisez pas le même dossier `user_data` actif avec deux versions différentes de TavernAI.
- N'utilisez pas une ancienne build comme retour arrière pour un dossier `user_data` déjà ouvert dans une nouvelle version.

## Suivant

- [Installation](/fr/docs/installation/)
- [Démarrage rapide](/fr/docs/quick-start/)