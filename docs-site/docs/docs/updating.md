---
title: Updating
description: Update TavernAI 2 without losing your local data.
sidebar:
  order: 40
---

TavernAI updates by replacing the app build and keeping `user_data`.

## Manual update

1. Close TavernAI completely.
2. Back up the old `user_data` folder.
3. Download the new build from [Download](/download/).
4. Extract the new build into a new folder.
5. Copy `user_data` from the old folder into the new folder.
6. Start the new build.

Let TavernAI finish any startup migration before closing it.

## VPS update

If TavernAI was installed with the VPS script, update from the app folder:

```bash
cd ~/TavernAI
./update.sh
```

If you installed TavernAI somewhere else, run `update.sh` from that folder.

## What to back up

Back up the whole `user_data` folder.

It contains the database, chats, imported files, images, and other local TavernAI state.

## Moving TavernAI

TavernAI is portable. To move it to another folder or drive:

1. Close TavernAI.
2. Copy the whole app folder, including `user_data`.
3. Launch TavernAI from the new location.
4. Confirm your chats and files are still there.

## Avoid

- Do not delete `user_data` during an update.
- Do not use the same live `user_data` folder from two different TavernAI versions.
- Do not open migrated data with an older build as a rollback plan.

## Next

- [Installation](/docs/installation/)
- [Quick Start](/docs/quick-start/)
