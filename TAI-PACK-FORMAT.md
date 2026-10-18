# TavernAI Pack Format Specification (TAI)

**Document version:** 1.0

**Format version:** `1.0` (major version `1`)

**Format identifier:** `tavernai`

**Status:** Official specification

This document formally describes the **TavernAI Pack format** used by TavernAI 2 for exporting and importing cards, chats, chat presets, and Prompt Managers. It is written for third-party developers who want to read, write, or validate `.tai.json` and `.png` packs — for example, to build a website that hosts and distributes resources.

---

## 1. Overview

A TavernAI Pack is a self-contained, single-file representation of one or more TavernAI entities and everything they depend on:

- **Cards** (characters)
- **Prompt Manager Sets** and **Prompt Managers** (prompt templates, scripts, media-tool items)
- **Chat Presets** and **Chats** (conversations, including messages and participants)
- **Files** (attached binaries: images, documents, etc.)
- **Folders** and **Library Trees** (placement of the above in a user's library)
- **Pack metadata** (name, description, type, primary asset)

A pack is delivered in one of two **containers**:

| Container | File extension | Description |
|-----------|----------------|-------------|
| Raw JSON  | `.tai.json`    | A single UTF-8 JSON document |
| PNG       | `.png`         | A valid PNG image with the JSON document embedded in a `tEXt` chunk |

Both containers carry exactly the same JSON payload. The JSON payload is the actual format; the PNG container is a convenience for distributing character cards as images (the same mechanism used by the TavernAI-v1/SillyTavern "character card" convention).

### 1.1 Design goals

- **Self-contained.** Every referenced file and image is embedded inside the pack as base64.
- **Package-scoped references.** Cross-references between entities inside a pack use temporary `assetId` values, never database IDs.
- **Stable global identity.** Entities may additionally carry a persistent `uid` that survives across packs and installations.
- **Forward compatible.** Readers must accept and ignore unknown fields; new fields may be added in minor versions.

---

## 2. Terminology

| Term | Meaning |
|------|---------|
| **Pack** | The whole exported artifact: the JSON document, in either container. |
| **Container** | The physical file format that wraps the JSON (`json` or `png`). |
| **Entity** | Any structured resource in the pack: a card, chat, message, file, etc. |
| **`assetId`** | A package-scoped identifier, unique within one pack, used only for internal cross-references. It is meaningless outside the pack. |
| **`uid`** | A persistent TavernAI identifier that belongs to the resource itself and is stable across packs. Optional. |
| **Primary asset** | The entity the pack is "about" (e.g., the card in a card pack), referenced by `pack.primaryAssetId`. |
| **Producer / exporter** | A tool or program that **writes** a pack (creates the `.tai.json` or `.png` file). |
| **Consumer / importer** | A tool or program that **reads** a pack (parses the `.tai.json` or `.png` file). |

---

## 3. Format identification

A JSON document is a TavernAI Pack if and only if the root object contains:

```json
{ "format": "tavernai" }
```

Matching rules used by the reference implementation:

- `format` must be the string `tavernai` (case-insensitive).
- `version` must be present.
- The **major version** of `version` must equal `1`. Version strings are `major.minor[.patch…]` with non-negative integer components. A minor or patch bump is considered compatible; a major bump is a breaking change and must be rejected.

### 3.1 Detection order

When a file is imported by content (rather than by extension):

1. If the JSON has `"format": "tavernai"` → **TAI pack**.
2. Otherwise, legacy heuristics are applied (Prompt Manager preset, lorebook, regex script, TavernAI-v1/SillyTavern character card V1/V2).

For PNG files:

1. If the PNG contains a `tavernai` text chunk → **TAI pack (PNG)**.
2. Otherwise it is treated as a legacy character card (the `chara` chunk).

---

## 4. Containers

### 4.1 Raw JSON container

- Extension: `.tai.json`
- MIME type: `application/json`
- Encoding: UTF-8 (no BOM is emitted by the reference exporter, but readers should accept a BOM).
- The document is a single JSON object.
- Whitespace and key order are insignificant. The reference exporter writes compact JSON and omits `null` values, but exporters may pretty-print and importers must tolerate either.
- Property names are matched case-insensitively on import.

### 4.2 PNG container

The PNG container is a standard PNG image whose pixel data is a "preview" (usually the card avatar or chat cover). The JSON payload is stored in a PNG **`tEXt` chunk**:

- Chunk type: `tEXt`
- Keyword: `tavernai`
- Value: **base64** (standard alphabet, with `=` padding) of the UTF-8-encoded JSON document.

The `tEXt` chunk data layout is:

```
keyword ("tavernai") | 0x00 | base64(JSON)
```

The keyword and value are encoded as Latin-1 (ISO-8859-1); because base64 and the keyword are pure ASCII, this is byte-identical to ASCII.

The chunk is written **immediately before the `IEND` chunk** (this is a placement detail of the reference writer; readers should scan all chunks up to `IEND` and not assume a position).

#### Coexistence with the SillyTavern/TavernAI-v1 `chara` chunk

A card can be exported as `"format": "both"`, which produces a PNG containing **two** chunks:

| Keyword | Content |
|---------|---------|
| `tavernai` | base64 of the TAI JSON pack |
| `chara`   | base64 of the TavernAI-v1/SillyTavern V2 JSON |

On import, the `tavernai` chunk takes priority over `chara`.

#### Compressed variant

The reference reader also accepts a **`zTXt`** chunk with keyword `tavernai`. `zTXt` layout is:

```
keyword | 0x00 | compression_method (1 byte, must be 0 = zlib/deflate) | compressed base64(JSON)
```

After decompression, the payload is the same base64 string. The reference writer always emits `tEXt` (uncompressed); `zTXt` is supported for reading third-party files.

#### Extracting the JSON (algorithm)

1. Verify the PNG signature `89 50 4E 47 0D 0A 1A 0A`.
2. Iterate chunks: each chunk is `[4-byte big-endian length][4-byte ASCII type][length bytes data][4-byte CRC32]`.
3. For each `tEXt` or `zTXt` chunk, split `data` at the first `0x00` byte into keyword and value.
4. If the keyword is `tavernai`: (a) if `zTXt`, decompress the value after the compression-method byte; (b) base64-decode the value; (c) decode the result as UTF-8 JSON.
5. Stop at `IEND`.

---

## 5. Identifiers: `assetId` vs `uid`

Every entity object has an `assetId`. Many also have an optional `uid`. These are **different concepts** and must never be confused:

| | `assetId` | `uid` |
|---|-----------|-------|
| Scope | One pack only | Global, across packs |
| Who generates it | The exporter, on every export | TavernAI, once per resource |
| Stability | Changes on every export | Stable |
| Uniqueness guarantee | Unique within the pack | Globally unique (best effort) |
| Purpose | Wire up internal references during import | Preserve identity of a resource across machines/packs |
| Format (reference impl.) | GUID string (`Guid.NewGuid()`) | 12-character base62 `[a-zA-Z0-9]` (imported `uid`s are accepted with length 10–14) |

**Rules for readers:**

- All cross-references inside a pack (`promptManagerSetAssetId`, `cardAssetId`, `messageAssetId`, `participantAssetIds`, …) are **`assetId` references**. Resolve them against the `assetId` fields of the entities in the *same* pack.
- Never derive a `uid` from an `assetId`, and never store an `assetId` as a persistent identifier.
- If a referenced `assetId` does not resolve to any entity in the pack, it is a **dangling reference**. The reference importer reports it as a warning and skips that link; it does not fail the import.

---

## 6. Root object

```jsonc
{
  "format": "tavernai",
  "version": "1.0",
  "exportedAt": "2026-10-18T00:29:55.6500000Z",   // ISO 8601 (round-trip format)
  "source": "TavernAI 2",
  "pack": { /* pack metadata */ },
  "cards": [],
  "promptManagerSets": [],
  "promptManagers": [],
  "chatPresets": [],
  "chats": [],
  "messages": [],
  "participants": [],
  "folders": [],
  "libraryTrees": [],
  "files": []
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | ✅ | Must be `"tavernai"`. |
| `version` | string | ✅ | Format version, e.g. `"1.0"`. Major version must be `1`. |
| `exportedAt` | string | — | Export timestamp, ISO 8601 (the reference exporter uses the .NET round-trip `O` format, e.g. `2026-10-18T00:29:55.6500000Z`). |
| `source` | string | — | Free-form producer name, e.g. `"TavernAI 2"`. |
| `pack` | object | — | Pack metadata (see [§6.1](#61-pack-metadata)). |
| `cards` | object[] | — | Top-level cards. |
| `promptManagerSets` | object[] | — | Prompt Manager sets. |
| `promptManagers` | object[] | — | Concrete Prompt Managers. |
| `chatPresets` | object[] | — | Chat presets (same shape as `chats`). |
| `chats` | object[] | — | Chats (conversations). |
| `messages` | object[] | — | All messages of the pack, deduplicated (see [§6.8](#68-top-level-messages-and-message-ownership)). |
| `participants` | object[] | — | All participants of the pack, deduplicated (see [§6.9](#69-top-level-participants)). |
| `folders` | object[] | — | Folders referenced by library trees. |
| `libraryTrees` | object[] | — | Snapshots of library placement. |
| `files` | object[] | — | Registry of embedded binary files (see [§7](#7-files-and-binary-data)). |

All arrays are optional and may be `null` or absent. Unknown fields anywhere in the document must be ignored (and ideally preserved) for forward compatibility.

### 6.1 Pack metadata

Object type: `pack`. All fields optional.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | — | Human-readable pack name. |
| `description` | string | — | Free-form description. |
| `coverImage` | string | — | Reserved for a pack-level cover image. The reference exporter does not set it; card and chat cover art travels on the entities instead (`cards[].avatarImage`, `chatPresets/chats[].coverImage`). |
| `packType` | string | `"card"` | One of the values in [§8](#8-pack-types). |
| `primaryAssetId` | string | — | `assetId` of the entity this pack is "about" (e.g. the exported card). |

### 6.2 Cards

Array: `cards[]`. Object type: **Card**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | ⚠️ | — | Card name. Warning (not error) if missing; importer uses a default. |
| `description` | string | — | — | Card description. |
| `avatarImage` | string | — | — | Card avatar image, raw base64 (see [§7](#7-files-and-binary-data)). |
| `avatarMimeType` | string | — | — | MIME type of `avatarImage`, e.g. `image/png`. |
| `isUnique` | boolean | — | `false` | Whether the card is a unique character. |
| `promptManagerSetAssetId` | string | — | — | `assetId` of the card's Prompt Manager set (reference into `promptManagerSets[]`). |
| `chatPresetAssetIds` | string[] | — | — | `assetId`s of chat presets attached to the card (references into `chatPresets[]`). |
| `metadata` | object | — | — | See [§6.10](#610-metadata). |

### 6.3 Prompt Manager Sets

Array: `promptManagerSets[]`. Object type: **PromptManagerSet**.

A Prompt Manager **Set** is a selectable top-level entity; the concrete prompt templates that belong to it are separate objects in `promptManagers[]` and point back with `setAssetId`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | ⚠️ | — | Set name. Warning if missing. |
| `description` | string | — | — | Description. |
| `activePromptManagerAssetId` | string | — | — | `assetId` of the active Prompt Manager in this set (reference into `promptManagers[]`). |

### 6.4 Prompt Managers

Array: `promptManagers[]`. Object type: **PromptManager**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | — | — | Name. |
| `description` | string | — | — | Description. |
| `setAssetId` | string | — | — | `assetId` of the owning Prompt Manager set (reference into `promptManagerSets[]`). |
| `settings` | object | — | — | Arbitrary JSON object with builder settings. Opaque to this spec. |
| `items` | object[] | — | — | Prompt Manager items, see [§6.5](#65-prompt-manager-items). |
| `mergeGroups` | object[] | — | — | Merge groups, see [§6.6](#66-merge-groups). |
| `hasScripts` | boolean | — | `false` | Convenience flag: `true` if any item has `itemType: "script"`. Informational. |

### 6.5 Prompt Manager items

Nested under `promptManagers[].items[]`. Object type: **PromptManagerItem**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | — | — | Item name. |
| `content` | string | — | `""` | Prompt text / template. May contain `![[...]]` file references (see [§9](#9-file-references)). |
| `itemType` | string | ✅* | `"prompt"` | One of: `prompt`, `folder`, `script`, `media-tool`. Invalid values are hard errors. |
| `isEnabled` | boolean | — | `true` | Whether the item is enabled. |
| `isPreset` | boolean | — | `false` | Whether the item is a preset item. |
| `position` | string | — | `"relative"` | Placement mode. |
| `chatRolePlaceholder` | string | — | `"System"` | Chat role placeholder slug/name. |
| `trim` | boolean | — | `false` | Trim whitespace. |
| `depth` | number | — | `0` | Depth in the prompt tree. |
| `depthOrder` | number | — | `0` | Order at that depth. |
| `hasStructuralPlaceholder` | boolean | — | `false` | Whether content contains a structural placeholder. |
| `hasRules` | boolean | — | `false` | Whether the item has rules. |
| `activationConfig` | object | — | — | Activation rules, see [§6.7](#67-activation-config). |
| `contentAction` | string | — | `"insert"` | Content action. For `media-tool` it is normalized to `"insert"` on import. |
| `replaceAll` | boolean | — | `false` | Replace-all flag. |
| `affectsOn` | number | — | `1` | Affects-on selector. |
| `scriptCode` | string | — | — | JavaScript source, valid only for `itemType: "script"`. Ignored (with warning) for `itemType: "prompt"`. |
| `mediaToolConfig` | object | — | — | Configuration, **required** for `itemType: "media-tool"` and invalid on any other item type. |
| `origin` | string | — | — | Provenance marker. Written on export; **ignored on import** (imported items always get `origin: "imported"`). |

\* `itemType` has a default value in the data model, but an explicitly wrong value fails validation.

### 6.6 Merge groups

Nested under `promptManagers[].mergeGroups[]`. Object type: **MergeGroup**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | — | — | Name. |
| `itemAssetIds` | string[] | — | — | `assetId`s of merged Prompt Manager items. |
| `startItemAssetId` | string | — | — | `assetId` of the start boundary node (may be a PM folder). |
| `endItemAssetId` | string | — | — | `assetId` of the end boundary node. |
| `chatRolePlaceholder` | string | — | `"System"` | Role placeholder for the merged output. |
| `lineSide` | string | — | `"Right"` | Merge line side. |

### 6.7 Activation config

Object type: **ActivationConfig** (on Prompt Manager items).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `conditions` | object[] | — | — | List of activation conditions. |
| `matchLogic` | string | — | `"any"` | Condition matching logic. |
| `scanScope` | string | — | `"last_n"` | Scan scope. |
| `scanDepth` | number | — | — | Scan depth (nullable). |

Object type: **ActivationCondition**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | — | `"keyword"` | Condition type (e.g. `keyword`, `regex`). |
| `pattern` | string | — | `""` | The keyword or regex pattern. |
| `caseSensitive` | boolean | — | `false` | Case sensitivity. |

### 6.8 Top-level messages and message ownership

Messages are stored **once** in the top-level `messages[]` array, even when a single message is shared by several chats. A chat declares which messages belong to it through its `messageOwnerships[]` array.

Object type: **Message** (top-level `messages[]`).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `chatRolePlaceholder` | string | — | `"System"` | Role placeholder. |
| `origin` | string | — | `"input"` | Message origin; round-tripped as-is. |
| `activeContentAssetId` | string | — | — | `assetId` of the active content variant (reference into `contents[]`). |
| `contents` | object[] | — | — | Content variants (swipes), see below. |
| `participantAssetIds` | string[] | — | — | `assetId`s of participants present in this message (references into `participants[]`). |
| `excludedFromContext` | boolean | — | `false` | Whether the message is excluded from context. |

Object type: **MessageContent** (one swipe).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `isActive` | boolean | — | `true` | Whether this variant is active. |
| `isFavorite` | boolean | — | `false` | Favorite swipe. |
| `blocks` | object[] | — | — | Content blocks. |

Object type: **ContentBlock**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | — | `"text"` | Block type, e.g. `text`, `thinking`. |
| `content` | string | — | `""` | Block payload. |

Object type: **ChatMessageOwnership** (nested under a chat's `messageOwnerships[]`). One entry per message owned by that chat.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `messageAssetId` | string | ✅ | — | `assetId` of the message (reference into `messages[]`). |
| `structuralParentMessageAssetId` | string | — | — | `assetId` of the structural parent within the same chat. `null` for a root message. Must reference a message owned by the same chat and must not reference itself. |
| `activeParentMessageAssetId` | string | — | — | `assetId` of the active parent on the active path. |
| `activeChildMessageAssetId` | string | — | — | `assetId` of the active child on the active path. |
| `createdAt` | string | — | — | ISO 8601 timestamp of when the message was added to this chat. |
| `siblingGroupId` | string | ✅ | — | Chat-scoped sibling group. Must be a GUID string. |
| `siblingBranchPosition` | number | ✅ | — | Position of the message inside the sibling group. |

A chat additionally stores its active endpoints directly on the chat object:

| Field | Type | Description |
|-------|------|-------------|
| `activeRootMessageAssetId` | string | `assetId` of the chat's active root message (reference into `messages[]`). |
| `activeEndMessageAssetId` | string | `assetId` of the chat's active end message (reference into `messages[]`). |

### 6.9 Top-level participants

Participants are stored once in the top-level `participants[]` array. Each participant points at its "home" chat with `chatAssetId`; messages reference participants via `participantAssetIds`.

Object type: **Participant**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `chatAssetId` | string | ✅ | — | `assetId` of the participant's home chat (reference into `chats[]` or `chatPresets[]`). |
| `cardAssetId` | string | — | — | `assetId` of the linked card (reference into `cards[]`). `null` = standalone participant (its card was not included in the pack, or it has no card). |
| `name` | string | — | `""` | Display name. |
| `avatarFileAssetId` | string | — | — | `assetId` of the participant's fallback avatar (reference into `files[]`). |
| `isManual` | boolean | — | `false` | `true` if the participant was created manually (not auto-derived from a chat card). |

### 6.10 Metadata

Object type: **Metadata**, shared shape by cards (`cards[].metadata`) and chats/presets (`chats[].metadata`, `chatPresets[].metadata`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | string | — | Author name. |
| `version` | string | — | Resource version. |
| `note` | string | — | Free-form note. |
| `caption` | string | — | Caption. |

Length limits (the reference importer warns but still imports when exceeded) are implementation-defined; readers should not enforce them.

---

## 7. Files and binary data

Binary data (images, documents, audio, …) is carried in the top-level `files[]` registry. Other entities reference files **by `assetId`**.

Object type: **File**.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `originalName` | string | — | `""` | Original file name (used to infer the extension on import). |
| `mimeType` | string | — | `""` | MIME type, e.g. `image/png`, `text/plain`. |
| `category` | string | — | `"image"` | File category (application-defined). |
| `data` | string | ⚠️ | — | File bytes as **raw base64**. Warning if empty. |

### 7.1 Base64 convention

- All binary fields (`files[].data`, `cards[].avatarImage`, `chatPresets/chats[].coverImage`) use **raw standard base64** with `=` padding and no `data:` URI prefix.
- The reference importer also tolerates a `data:<mime>;base64,<payload>` prefix when decoding; producers should not rely on that and should write raw base64.
- Text is UTF-8; JSON strings are escaped as usual.

### 7.2 Deduplication

The same file referenced from multiple places appears **once** in `files[]` and is referenced by the same `assetId` everywhere (the reference exporter deduplicates by storage path / short key).

---

## 8. Pack types

`pack.packType` describes what the pack primarily contains:

| Value | Meaning |
|-------|---------|
| `card` | A single card pack (default). |
| `chat` | A conversation. |
| `chatPreset` | A chat preset. |
| `promptManager` | A single Prompt Manager. |
| `promptManagerSet` | A Prompt Manager set (with all its concrete Prompt Manager versions). |
| `mixed` | A merged pack containing several top-level entity types (e.g. built by combining multiple packs). |

If `pack` or `pack.packType` is absent, the reference importer infers the type: first by matching `primaryAssetId` against the top-level arrays, then by counting distinct non-empty top-level entity arrays (more than one → `mixed`), and finally falling back to `card`.

---

## 9. File references

Prompt text and other string content may embed references to files using this syntax:

```
![[key.ext]]
```

- `key` is a file identifier; `ext` is the file extension.
- **On export**, TavernAI rewrites internal file short keys to package `assetId`s: `![[shortKey.ext]]` → `![[assetId.ext]]`.
- **On import**, the reverse happens: `![[assetId.ext]]` → `![[shortKey.ext]]` (the short key is regenerated by the importing instance).

Reference pattern used by the implementation: `\!\[\[([^\]]+?)\.(\w+)\]\]`. A reference whose `key` does not match any known file is left unchanged.

---

## 10. Chats and chat presets

Both `chats[]` and `chatPresets[]` use the same object type, **Chat**. The distinction is semantic (a preset is a reusable template) and is reflected in `pack.packType`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | — | — | Chat/preset name. |
| `coverImage` | string | — | — | Cover image, raw base64. |
| `coverMimeType` | string | — | — | MIME type of `coverImage`. |
| `promptManagerSetAssetId` | string | — | — | `assetId` of the attached Prompt Manager set. |
| `defaultInputChatRolePlaceholder` | string | — | — | Default role placeholder for input messages. |
| `defaultGeneratedChatRolePlaceholder` | string | — | — | Default role placeholder for generated messages. |
| `chatCards` | object[] | — | — | Cards linked to the chat, see below. |
| `messageOwnerships` | object[] | — | — | Ownership entries for messages, see [§6.8](#68-top-level-messages-and-message-ownership). |
| `activeRootMessageAssetId` | string | — | — | See [§6.8](#68-top-level-messages-and-message-ownership). |
| `activeEndMessageAssetId` | string | — | — | See [§6.8](#68-top-level-messages-and-message-ownership). |
| `metadata` | object | — | — | See [§6.10](#610-metadata). |

Object type: **ChatCard** (`chatCards[]`).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `cardAssetId` | string | ✅ | — | `assetId` of the linked card (reference into `cards[]`). |
| `chatRolePlaceholder` | string | — | — | Role placeholder for this card in this chat. |
| `isSelectedForGenerated` | boolean | — | `false` | Card is selected for generated messages. |
| `isSelectedForInput` | boolean | — | `false` | Card is selected for input messages. |
| `isSelectedForContext` | boolean | — | `false` | Card is selected for context. |

---

## 11. Folders and library trees

A pack may include placement information: which folders entities live in and how a library tree is structured.

Object type: **Folder** (`folders[]`).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `assetId` | string | ✅ | — | Package-scoped ID. |
| `uid` | string | — | — | Persistent TavernAI ID. |
| `name` | string | ⚠️ | — | Folder name. Warning if missing. |
| `description` | string | — | — | Description. |

Object type: **LibraryTree** (`libraryTrees[]`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assetId` | string | ✅ | Package-scoped ID of the tree snapshot. |
| `type` | string | ✅ | Application-defined tree type identifier (e.g. a card library, chat library, …). Treat as opaque. |
| `ownerType` | string | ✅ | Application-defined owner type identifier. Treat as opaque. |
| `ownerAssetId` | string | — | `assetId` of the entity that owns the tree. |
| `nodes` | object[] | ⚠️ | Snapshot nodes (warning if empty). |

Object type: **LibraryNode** (`libraryTrees[].nodes[]`).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `nodeAssetId` | string | ✅ | — | Package-scoped ID of the node. |
| `itemType` | string | ✅ | — | One of: `folder`, `prompt_manager_set`, `prompt_manager`, `prompt_manager_item`, `chat_card`, `chat`, `chat_preset`. |
| `itemAssetId` | string | ✅ | — | `assetId` of the entity placed at this node. |
| `parentNodeAssetId` | string | — | — | `nodeAssetId` of the parent node; `null` for root. |
| `order` | number | — | `0` | Sibling order. |

---

## 12. Validation rules (reference behavior)

The reference importer validates a pack in three levels. This describes the de-facto rules; third-party validators may choose to be stricter or more lenient, but a pack that fails level 1 or 2 will be **rejected** by TavernAI.

### Level 1 — Structure (hard errors)

- `format` must equal `tavernai` (case-insensitive).
- `version` must be present and its major component must equal `1`.

### Level 2 — Schema (hard errors unless noted)

- `assetId` is required on: cards, prompt manager sets, prompt managers, prompt manager items, messages, message contents, folders, library trees, files, chats/presets, chat cards.
- `name` missing on cards/folders/sets → **warning** (default name used).
- `files[].data` empty → **warning**.
- `libraryTrees[].nodes` empty → **warning**.
- Prompt manager item `itemType` must be one of `prompt`, `folder`, `script`, `media-tool`.
  - `media-tool` requires `mediaToolConfig`; `mediaToolConfig` is invalid on any other item type.
  - `media-tool` with `contentAction != "insert"` → warning (normalized to `"insert"`).
  - `prompt` with `scriptCode` → warning (code ignored).
- Chat cards require `assetId` and `cardAssetId`.
- Message ownership entries require `messageAssetId`, `siblingGroupId` (valid GUID), and `siblingBranchPosition`.
  - `structuralParentMessageAssetId` must not reference the message itself and must reference a message owned by the same chat.
- Library tree nodes require `nodeAssetId`, `itemAssetId`, and a valid `itemType`.

### Level 3 — References (warnings, not fatal)

All `*AssetId` references are checked against the set of known `assetId`s collected from the pack. A reference that does not resolve produces a **warning**; the affected link is skipped and the rest of the import proceeds.

---

## 13. Import semantics

This section describes how the reference importer applies a pack. It clarifies what producers (tools that **write** packs) can expect, and what consumers (tools that **read** packs) must not assume.

1. **Import is transactional.** All entities are created inside one database transaction; file cleanup happens on rollback.
2. **Creation order (topological):** files → prompt manager sets → cards → prompt managers → chat presets → chats, then wiring of participants, messages, ownerships, merge groups, and library trees.
3. **`assetId` remapping.** Every `assetId` is mapped to a new internal database ID. `assetId`s are never persisted as TavernAI IDs.
4. **`uid` adoption.** An incoming `uid` is applied only if it is valid (alphanumeric, length 10–14 in the reference implementation) and does not conflict with an existing entity of the same type (including soft-deleted ones). Otherwise the importing instance generates its own `uid`. `uid`s are **not** derived from `assetId`s.
5. **Files.** Each `files[]` entry becomes a user file with a freshly generated short key. All `![[assetId.ext]]` references in prompt/script text are rewritten to the new short key.
6. **Scripts.** Prompt manager items with `itemType: "script"` are imported according to a trust mode (`Disabled` or `Trusted`). `promptManagers[].hasScripts` is informational for the UI.
7. **Origin.** PM item `origin` is ignored on import; imported items always get `origin: "imported"`.
8. **Forward compatibility.** Unknown fields are ignored. This is the contract that allows minor version additions without breaking existing readers.

---

## 14. Forward compatibility policy

- **Producers (tools that write packs)** may add new fields at any time. New fields must be additive and must not change the meaning of existing fields.
- **Consumers (tools that read packs)** must ignore fields they do not recognize and must not fail on their presence.
- A **minor** version bump (`1.x`) may add fields or relax constraints. A **major** version bump (`2.x`) may break compatibility.
- Never repurpose an existing field name for a different meaning; introduce a new name instead.

---

## 15. Minimal example

```json
{
  "format": "tavernai",
  "version": "1.0",
  "pack": {
    "name": "Example Card",
    "packType": "card",
    "primaryAssetId": "00000000-0000-0000-0000-000000000001"
  },
  "cards": [
    {
      "assetId": "00000000-0000-0000-0000-000000000001",
      "uid": "AbCdEfGhIj12",
      "name": "Example Card",
      "description": "A minimal example card.",
      "avatarImage": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...",
      "avatarMimeType": "image/png",
      "metadata": {
        "author": "Example Author",
        "version": "1.0.0",
        "note": "Created for the format specification.",
        "caption": "Example"
      }
    }
  ]
}
```

Notes on the example:

- `assetId` values in real exports are GUIDs (`Guid.NewGuid()`); any package-unique string is valid.
- `avatarImage` is raw base64 (truncated here with `...` for readability).
- All top-level arrays except the one being used may be omitted.

---

## 16. Reading a pack (reference code)

### 16.1 Reading a `.tai.json` pack

```python
import json

def read_json_pack(path: str) -> dict:
    with open(path, "r", encoding="utf-8-sig") as f:
        data = json.load(f)
    assert data.get("format") == "tavernai", "not a TavernAI pack"
    return data
```

### 16.2 Reading a `.png` pack

```python
import base64
import json
import struct

def read_png_pack(path: str) -> dict:
    with open(path, "rb") as f:
        png = f.read()

    assert png[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    offset = 8
    tavernai_json = None

    while offset + 8 <= len(png):
        (length,) = struct.unpack(">I", png[offset:offset + 4])
        chunk_type = png[offset + 4:offset + 8].decode("ascii")
        data_start = offset + 8
        data = png[data_start:data_start + length]

        if chunk_type == "tEXt":
            keyword, _, value = data.partition(b"\x00")
            if keyword == b"tavernai":
                tavernai_json = base64.b64decode(value).decode("utf-8")
        elif chunk_type == "IEND":
            break

        offset = data_start + length + 4  # skip data + CRC32

    if tavernai_json is None:
        raise ValueError("no 'tavernai' chunk found")
    return json.loads(tavernai_json)
```

---

## 17. Appendix: enumeration summary

| Context | Field | Allowed values |
|---------|-------|----------------|
| Root | `format` | `tavernai` |
| Pack metadata | `packType` | `card`, `chat`, `chatPreset`, `promptManager`, `promptManagerSet`, `mixed` |
| Prompt Manager item | `itemType` | `prompt`, `folder`, `script`, `media-tool` |
| Library tree node | `itemType` | `folder`, `prompt_manager_set`, `prompt_manager`, `prompt_manager_item`, `chat_card`, `chat`, `chat_preset` |
| Content block | `type` | `text`, `thinking`, … (open set) |
| Activation condition | `type` | `keyword`, `regex`, … (open set) |
| PNG chunk keyword (TAI) | — | `tavernai` |
| PNG chunk keyword (TavernAI-v1/SillyTavern V2) | — | `chara` |
