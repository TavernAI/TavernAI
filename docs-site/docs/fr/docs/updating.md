---
title: Mise à jour
description: Mettre à jour TavernAI 2 sans perdre les données locales.
sidebar:
  order: 40
---

TavernAI se met à jour en remplaçant la build de l'application et en conservant `user_data`.

## Mise à jour manuelle

1. Fermez complètement TavernAI.
2. Faites une copie de sauvegarde de l'ancien dossier `user_data`.
3. Téléchargez la nouvelle build depuis [Download](/download/).
4. Extrayez la nouvelle build dans un nouveau dossier.
5. Copiez `user_data` de l'ancien dossier vers le nouveau.
6. Lancez la nouvelle build.

Laissez TavernAI terminer toutes les startup migrations avant de fermer l'application.

## Mise à jour VPS

Si TavernAI a été installé avec le VPS script, mettez-le à jour depuis le dossier de l'application :

```bash
cd ~/TavernAI
./update.sh
```

Si vous avez installé TavernAI ailleurs, lancez `update.sh` depuis ce dossier.

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