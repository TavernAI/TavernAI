---
title: Updating
description: Update TavernAI 2 without losing your local data.
sidebar:
  order: 40
---

TavernAI can update itself from the interface. Use the manual methods only when the interface updater is not available or when you need to move the installation by hand.

## Update from the interface

1. Open TavernAI.
2. Go to `Settings` -> `Updates`.
3. Install the update.

The updater downloads the matching build, verifies it, stages it in `update_cache`, and replaces the app files after TavernAI exits. After a successful update, `update_cache` is removed. Local data stays in place: `user_data`, `logs`, `models`, and `config.yaml`.

Let TavernAI finish any startup migration before closing it again.

## Manual update

Use this when the interface updater cannot be used, or when you want to replace the build yourself.

1. Close TavernAI completely.
2. Back up the old `user_data` folder.
3. Download the new build from [Download](/download/).
4. Extract the new build into a new folder.
5. Copy `user_data` from the old folder into the new folder.
6. Start the new build.

## VPS update

If TavernAI was installed with the VPS script and you need a terminal update, update from the app folder:

```bash
cd ~/TavernAI
./updater/update.sh
```

If you installed TavernAI somewhere else, run `updater/update.sh` from that folder.

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
