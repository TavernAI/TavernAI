---
title: Массовый импорт из TAI v1 и SillyTavern
description: Импорт карточек, чатов, групповых чатов, lorebooks и prompt presets из старых папок TavernAI v1 или SillyTavern.
sidebar:
  order: 52
---
<small><em>Tech term: Mass Import</em></small>

Mass Import переносит существующий контент TavernAI v1 или SillyTavern в TavernAI 2.

Используйте его, если у вас уже есть папка с карточками, чатами, групповыми чатами, lorebooks или prompt presets, и вы хотите перенести их в новую библиотеку TavernAI 2.

## Что может перенести Mass Import

- **Карточки** из папок персонажей TavernAI v1 или SillyTavern.
- **Чаты**, связанные с импортированными карточками, если найдена подходящая карточка.
- **Групповые чаты** со списком участников и историей чата.
- **Lorebooks / world info** как импортированные prompt resources.
- **Prompt presets**, если TavernAI 2 может определить совместимый preset file.
- **Изображения чатов**, если включен импорт изображений.


## Импорт из SillyTavern

1. Откройте TavernAI 2.
2. Перейдите в **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Перейдите в **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Откройте папку SillyTavern, скопируйте ее адрес и вставьте его в поле ввода.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Запустите scan.
6. Просмотрите найденные карточки, чаты, групповые чаты, lorebooks и presets.
7. Выберите, что хотите импортировать.
8. Запустите импорт и дождитесь отчета.

Mass Import может работать с корневой папкой SillyTavern или с пользовательской папкой SillyTavern. TavernAI определяет известную структуру SillyTavern и показывает, что можно импортировать.

## Импорт из TavernAI v1

1. Откройте TavernAI 2.
2. Перейдите в **General Settings**.
![General Settings screen](/img/docs/mass_import_1.png)
3. Перейдите в **Mass Import**.
![Mass Import section](/img/docs/mass_import_2.png)
4. Откройте папку TavernAI v1, скопируйте ее адрес и вставьте его в поле ввода.
![Mass Import folder path input](/img/docs/mass_import_3.png)
5. Запустите scan.
6. Просмотрите найденные карточки, чаты и lorebooks.
7. Выберите, что хотите импортировать.
8. Запустите импорт и дождитесь отчета.

TavernAI 2 определяет старую структуру папок TavernAI v1 и импортирует поддерживаемые файлы в библиотеку TavernAI 2.

## Как старый контент отображается в TavernAI 2

| Старый контент | Результат в TavernAI 2 |
|---|---|
| Character cards | Cards |
| Solo chats | Chats linked to cards |
| Group chats | Chats linked to cards |
| Lorebooks / world info | Prompt Manager resources |
| Regex-style replacements | Prompt Manager resources |
| Prompt Manager presets | Prompt Manager presets |
| Chat images | Chat files |

## Если что-то не импортируется

Mass Import рассчитан на перенос обычных папок TavernAI v1 и SillyTavern. Поврежденные файлы, необычные community formats, отсутствующие связи с карточками или измененная структура папок могут давать warnings.

## Дальше

- [Начало работы](/ru/docs/getting-started/) для модели TavernAI 2.
- [Быстрый старт](/ru/docs/quick-start/) для первого сообщения после импорта.
- [Macros](/ru/docs/macros/) и [PM Scripts](/ru/docs/pm-scripts/) для расширенного поведения промптов.