---
title: Installation
description: Installer TavernAI 2 sur Windows, Linux ou un VPS.
sidebar:
  order: 20
---

TavernAI 2 est distribué comme application portable, sans installation.

## Windows

1. Téléchargez la dernière build Windows depuis [Download](/download/).
2. Extrayez le fichier `.zip` dans un dossier normal.
3. Lancez `TavernAI.exe`.

Au premier lancement, TavernAI créera le dossier `user_data`.

## Linux

1. Téléchargez la dernière build Linux depuis [Download](/download/).
2. Extrayez le fichier `.tar.gz` dans un dossier normal.
3. Lancez `./TavernAI` depuis le dossier extrait.

Au premier lancement, TavernAI créera le dossier `user_data`.

## Installation sur VPS

Connectez-vous au VPS en SSH depuis votre PC :

```bash
ssh root@SERVER_IP
```

Remplacez `SERVER_IP` par l'adresse IP publique de votre serveur. Si votre VPS utilise un utilisateur normal au lieu de `root`, utilisez ce nom d'utilisateur :

```bash
ssh USERNAME@SERVER_IP
```

Lancez l'installateur sur le VPS :

```bash
curl -fsSL https://tavernai.net/install.sh | bash
```

Le script télécharge la dernière build stable Linux, l'extrait dans `~/TavernAI` et ajoute un fichier `update.sh` pour les mises à jour futures.

Quand l'installateur demande un `systemd` service, répondez `y` si TavernAI doit démarrer maintenant et redémarrer automatiquement après un reboot du serveur :

```text
Install systemd service for auto-start? [y/N] y
```

Si vous répondez `n`, lancez TavernAI manuellement :

```bash
cd ~/TavernAI
./core/TavernAI.Backend
```

Gardez ce terminal ouvert pendant que TavernAI fonctionne. Arrêtez-le avec `Ctrl+C`.

Si vous avez installé le `systemd` service, utilisez ces commandes :

```bash
sudo systemctl status tavernai
sudo systemctl stop tavernai
sudo systemctl start tavernai
sudo systemctl restart tavernai
```

Ouvrez TavernAI dans votre navigateur :

```text
http://SERVER_IP:8800
```

Remplacez `SERVER_IP` par la même adresse IP publique que celle utilisée pour SSH.

Avant de partager cette adresse ou de laisser le serveur ouvert sur internet, définissez un mot de passe pour votre profil TavernAI. Ouvrez TavernAI, allez dans les paramètres de votre profil et définissez un mot de passe de profil.

Si la page ne s'ouvre pas et que le serveur utilise `ufw`, autorisez le port TavernAI :

```bash
sudo ufw allow 8800/tcp
sudo ufw status
```

Vérifiez aussi le panneau firewall de votre fournisseur VPS. Le port TCP `8800` doit aussi y être ouvert.

Pour installer TavernAI dans un autre dossier :

```bash
curl -fsSL https://tavernai.net/install.sh | TAVERNAI_INSTALL_DIR="/path/to/TavernAI" bash
```

Pour mettre à jour plus tard :

```bash
cd ~/TavernAI
./update.sh
```

Si TavernAI fonctionne avec systemd, arrêtez le service avant la mise à jour et relancez-le après :

```bash
sudo systemctl stop tavernai
cd ~/TavernAI
./update.sh
sudo systemctl start tavernai
```

## Utiliser TavernAI depuis un téléphone

TavernAI s'ouvre dans le navigateur, donc un téléphone peut utiliser la même instance déjà lancée sur votre PC ou serveur.

Pour un accès sur le réseau local :

1. Lancez TavernAI sur votre PC ou serveur.
2. Connectez le téléphone au même Wi-Fi ou réseau local.
3. Trouvez l'adresse IP de la machine où TavernAI est lancé.
4. Ouvrez `http://IP_ADDRESS:8800` sur le téléphone.

Sous Windows, `ipconfig` affiche l'adresse IP locale. Utilisez l'adresse IPv4 de l'adaptateur Wi-Fi ou Ethernet actif. Sous Linux, `hostname -I` affiche généralement les adresses locales.

Si la page ne s'ouvre pas, autorisez TavernAI dans le firewall pour les réseaux private/local. Le port par défaut est `8800`; il peut être changé dans `config.yaml` avec la valeur `port`.

Pour un accès VPS, ouvrez TavernAI avec l'adresse publique ou le domaine du VPS :

```text
http://SERVER_IP:8800
```

Pour un usage normal sur VPS, un domaine avec HTTPS via reverse proxy est recommandé. N'exposez pas une instance privée de TavernAI à l'internet public sans protection de compte et règles normales de server firewall.

## Données de l'application

TavernAI garde l'état local dans `user_data`, à l'intérieur du dossier de l'application.

Ce dossier contient la base de données, les chats, les fichiers importés, les images et d'autres données locales. Ne le supprimez pas lors d'un déplacement ou d'une mise à jour de TavernAI.

## Suivant

- [Démarrage rapide](/fr/docs/quick-start/)
- [Mise à jour](/fr/docs/updating/)