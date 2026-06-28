---
title: Установка
description: Установка TavernAI 2 на Windows, Linux или VPS.
sidebar:
  order: 20
---

TavernAI 2 распространяется как portable приложение (не требующие установки).

## Windows

1. Скачайте последнюю сборку для Windows со страницы [Download](/download/).
2. Распакуйте `.zip` в обычную папку.
3. Запустите `TavernAI.exe`.

При первом запуске TavernAI создаст `user_data` папку.

## Linux

1. Скачайте последнюю сборку для Linux со страницы [Download](/download/).
2. Распакуйте `.tar.gz` в обычную папку.
3. Запустите `./TavernAI` из распакованной папки.

При первом запуске TavernAI создаст `user_data` папку.

## Установка на VPS

Подключитесь к VPS по SSH со своего PC:

```bash
ssh root@SERVER_IP
```

Замените `SERVER_IP` на публичный IP-адрес сервера. Если VPS использует обычного пользователя вместо `root`, укажите имя этого пользователя:

```bash
ssh USERNAME@SERVER_IP
```

Запустите установщик на VPS:

```bash
curl -fsSL https://tavernai.net/install.sh | bash
```

Скрипт скачивает последнюю стабильную Linux-сборку, распаковывает ее в `~/TavernAI` и добавляет `updater/update.sh` для последующих обновлений.

Когда установщик спросит про `systemd` service, ответьте `y`, если TavernAI нужно запустить сразу и автоматически запускать после перезагрузки сервера:

```text
Install systemd service for auto-start? [y/N] y
```

Если ответили `n`, запустите TavernAI вручную:

```bash
cd ~/TavernAI
./core/TavernAI.Backend
```

Оставьте этот терминал открытым, пока TavernAI работает. Остановить запуск можно через `Ctrl+C`.

Если вы установили `systemd` service, используйте эти команды:

```bash
sudo systemctl status tavernai
sudo systemctl stop tavernai
sudo systemctl start tavernai
sudo systemctl restart tavernai
```

Откройте TavernAI в браузере:

```text
http://SERVER_IP:8800
```

Замените `SERVER_IP` на тот же публичный IP-адрес, который использовался для SSH.

Перед тем как делиться этим адресом или оставлять сервер открытым в интернете, установите пароль для своего профиля TavernAI. Откройте TavernAI, перейдите в настройки профиля и задайте пароль профиля.

Если страница не открывается и на сервере используется `ufw`, разрешите порт TavernAI:

```bash
sudo ufw allow 8800/tcp
sudo ufw status
```

Также проверьте firewall-панель у VPS-провайдера. TCP-порт `8800` должен быть открыт и там.

Чтобы установить TavernAI в другую папку:

```bash
curl -fsSL https://tavernai.net/install.sh | TAVERNAI_INSTALL_DIR="/path/to/TavernAI" bash
```

Чтобы обновить позже:

```bash
cd ~/TavernAI
./updater/update.sh
```

Если TavernAI работает через systemd, остановите service перед обновлением и запустите снова после обновления:

```bash
sudo systemctl stop tavernai
cd ~/TavernAI
./updater/update.sh
sudo systemctl start tavernai
```

## Как запустить на телефоне

TavernAI открывается в браузере, поэтому телефон может использовать тот же экземпляр, который уже запущен на PC или сервере.

Для доступа в локальной сети:

1. Запустите TavernAI на PC или сервере.
2. Подключите телефон к той же Wi-Fi или локальной сети.
3. Найдите IP-адрес машины, на которой запущен TavernAI.
4. Откройте `http://IP_ADDRESS:8800` на телефоне.

В Windows локальный IP-адрес показывает `ipconfig`. Используйте IPv4-адрес активного Wi-Fi или Ethernet-адаптера. В Linux `hostname -I` обычно показывает локальные адреса.

Если страница не открывается, разрешите TavernAI доступ через firewall для private/local networks. Порт по умолчанию — `8800`; его можно изменить в `config.yaml` через значение `port`.

Для доступа к VPS откройте TavernAI через публичный адрес или домен VPS:

```text
http://SERVER_IP:8800
```

Для обычного использования VPS рекомендуется домен с HTTPS через reverse proxy. Не открывайте приватный экземпляр TavernAI в публичный интернет без защиты аккаунта и нормальных правил server firewall.

## Данные приложения

TavernAI хранит локальное состояние в `user_data` внутри папки приложения.

В этой папке находятся база данных, чаты, импортированные файлы, изображения и другое локальное состояние. Не удаляйте ее при переносе или обновлении TavernAI.

## Дальше

- [Быстрый старт](/ru/docs/quick-start/)
- [Обновление](/ru/docs/updating/)