# TavernAI 2 Changelog
## [2.4.2] - 2026-09-04
### Added
* Added request storage controls for Google AI text and image generation.
* Added support for Gemini 3.8 Flash.
* Added support for GLM-5.3-Flash.
* Added support for Claude Fable 5.1.
* Added support for GPT-6 Astra.

## [2.4.1] - 2026-08-28
### Fixed
* Fixed a database migration error that could prevent TavernAI from starting after upgrading from older versions to 2.4.0.

## [2.4.0] - 2026-08-23
### Added
* Added **Media Tools**, allowing the AI to request image generation as part of its reply
  * Added image generation tools for **Google AI**, **OpenAI**, **xAI**, and **NovelAI**.
  * Added a Media Tool node to Prompt Manager, with independent provider connections, instruction prompts, image references, provider limits, and automatic instruction updates.
  * Added tool execution markers to chat messages, with generating and failed states followed by generated images after successful execution.
  * Added an image generation workspace for each Media Tool node, with independent prompts, references, recent results, and result clearing for manual generation and regeneration.
* Added **Global Cards**, reusable Card collections that are available across chats
  * Global Cards use presets, can be switched from the Chat Cards panel, and keep each Card enabled or disabled separately.
* Added the **Card Preset catalog** for adding ready-made Cards directly to Chat Cards or Global Cards
  * Added built-in presets for Google AI, OpenAI, xAI, and NovelAI image generation.
  * Added presets for AI speaker selection, output trimming, hiding tagged text from AI context, and hiding tagged text from the rendered chat.
* Added **prompt caching controls** for **OpenAI**, **Anthropic**, **xAI**, and **Google AI**
  * Added cache read and, where reported by the provider, write usage to chat generation controls and request details.
  * Added cache breakpoint visualization to the Final Prompt viewer.
* Added direct **document attachments** for compatible Anthropic, OpenAI, OpenRouter, and Google AI models, with provider-specific format and size validation.
* Added file preview and download for chat attachments, plus a dedicated image viewer with image metadata.
* Added optional library subtitles for Cards, Chat Presets, and MultiChat Projects.
* Added model presets for **GLM-5.3**.
* Added **DeepSeek V4 Flash Vision Experimental** (`deepseek-v4-flash-vision-exp`) with image input support.

### Improved
* Improved attachment controls so available file types and limits follow the selected provider and model capabilities.
* Improved provider endpoint handling so image APIs can use a different base address from text generation APIs.
* Improved maintenance cleanup for generated files and expired tool execution data.
* Improved log readability by truncating embedded base64 data, including base64 nested inside JSON and image generation logs.
* Improved library rows and narrow side panels so names, subtitles, counters, and action buttons remain readable at smaller widths.
* Improved Nano Banana model display names.

### Fixed
* Fixed Google AI thought signatures being sent back when they should not be included.
* Fixed Virtual Chat and shared-message covers reverting to default images after switching MultiChat Projects.
* Fixed preset dropdowns being covered by adjacent right-side panels.
## [2.3.2] - 2026-08-14

### Added
* Added Grok 4.6 support for the xAI provider.
* Added Gemini 3.7 Flash support for the Google AI provider.
* Added local GGUF inference support for models using `<|turn>...<turn|>` chat templates, including Gemma 4-style models.
* Added native backend details to error messages when local GGUF models fail to load.

### Changed
* Updated local GGUF inference to LLamaSharp 0.27.0.

### Removed
* Removed outdated `grok-4.3-latest` and `grok-latest` aliases from the xAI model list.

## [2.3.1] - 2026-07-29

### Added
* Added Claude-Opus-5 model for Anthropic AI provider.

### Fixed
* Fixed an issue where swiping in virtual chats could briefly show an older version of an edited message.

## [2.3.0] - 2026-07-24

 ### Added
* Added the **Multichat system** for running one story through several separate chat histories
  * Added **MultiChat Projects** for organizing regular chats and Virtual Chats without merging or moving their original histories.
  * Added **Virtual Chats**, live combined views built from selected source chats. Each source can be configured for message display, AI context, new message targets, and message actions.
  * Added **Ordering Formats** for placing messages in in-world order using dates, chapters, scenes, turns, fictional calendars, or custom sequences. Ordering values can be managed at project or chat level and are stored with each new message.
  * Added the **Timeline**, with one lane per source chat, selectable scales, elapsed gaps, message previews, and an Unplaced section for messages without valid ordering data.
  * Added **shared messages**. One message can belong to several chats while keeping an independent position and branch structure in each chat.
* Added **Nano Banana image generation** through Google AI
* Added Google AI models: **Gemini 3.6 Flash** and **Gemini 3.5 Flash-Lite**.

### Improved
* Improved AI provider presets: AI Model Settings, Chat Sequencer, Message Structure, and AutoSave selections are now stored separately for each provider.
* Improved synchronization of AI provider settings between app windows. Preset selection remains local, while Apply and AutoSave follow the **Sync AI Provider Settings** option.

### Fixed
* Fixed system instructions being sent to providers that do not support them.
* Fixed Anthropic reasoning settings for adaptive, manual, disabled, and legacy budget modes.
* Fixed re-adding a card after it had been removed from a chat.
* Fixed duplicated library entries appearing in reverse order inside folders.
* Fixed Prompt Manager export dialogs being covered by right-side panels when opened from the left panel.

## [2.2.3] - 2026-07-17

### Added
* Added Kimi-3 model for Moonshot AI provider.

## [2.2.2] - 2026-07-12

### Added
* Added xAI Grok 4.5.
* Added provider icons for LM Studio and NovelAI.

### Changed
* Updated the character heuristic tokenizer from approximately 4 to 3 characters per token.

### Fixed
* Fixed `StatEvent` token tracking when providers omit input or output token usage, using tokenizer-based estimates as a fallback.

## [2.2.1] - 2026-07-09

### Added
* Added new OpenAI models of the GPT-5.6 family:
  * gpt-5.6 for GPT-5.6 Sol
  * gpt-5.6-terra for GPT-5.6 Terra
  * gpt-5.6-luna for GPT-5.6 Luna
 
## [2.2.0] - 2026-07-08

### Added
* Added the NovelAI provider.
  * Supports native generation and native streaming.
  * Supports OpenAI-compatible endpoints: Chat Completions and Text Completions.
  * Added NovelAI model templates: Xialong, GLM-4.6, Erato, Kayra.
  * Added NovelAI tokenizers, including NerdStash and NerdStash v2.

* Added the LM Studio provider.
  * Supports Chat Completions and Text Completions.
  * Added support for LM Studio vision models for image input.

* Added message counters in chat.
  * The counter can be hidden.
  * Message numbers can be shown under the avatar or next to the timestamp.

### Improved
* Improved token counting for Chat Completions: the structural overhead of response formatting is now included.
* Improved database migrations: old auto-backup files are now cleaned up during migration.

### Fixed
* Fixed handling of empty KoboldCPP responses: TavernAI now shows a clear error instead of an unclear failure.
* Fixed overlapping locale strings in model settings.

## [2.1.6] - 2026-07-01

### Fixed
* Custom provider identity is now preserved for generated message metadata and statistics.
* Fixed Response Record saving for Custom/OpenAI-compatible streaming providers when the API does not return usage metadata.
 
## [2.1.5] - 2026-07-01

### Changed
* Improve updater presentation and update handling.

## [2.1.4] - 2026-07-01

### Fixed
* Fix Custom Provider generation settings not being applied.

## [2.1.3] - 2026-06-30

### Added
* Added a native tokenizer for the LocalLLM provider
 
## [2.1.2] - 2026-06-28

### Fixed
* Fixed Chat Sequencer role message structures not being applied when saved from the UI. Prefixes and suffixes now deserialize correctly from saved settings, preventing duplicate role placeholder ID errors during prompt assembly.

## [2.1.1] - 2026-06-28

### Fixed
* Fixed LocalLLM crashes when using the CPU backend for LLMs on Linux.

## [2.1.0] - 2026-06-28

### Added
* Added local AI model execution through built-in engines.
* Added support for CPU, CUDA, and Vulkan backends.
* Added x.AI provider support.
* Added z.AI / GLM provider support.
* Added AIHorde provider support.
* Added Moonshot / Kimi provider support.
* Added support for loading available models directly from AI providers.
* Added a native updater available from the application interface.
* Added the ability to duplicate Prompt Managers into libraries.
* Added the ability to duplicate prompts inside a Prompt Manager.

### Changed
* Merged Standard and Pro editions into a single public version.
* All previously separated features are now available in one public build.

## [2.0.3] - 2026-06-25

### Added
* Added PM Script access to current chat cards via `TAI.chat.getChatCards()`.
* Added `chatCardId` support to generation `cardOverrides`, allowing scripts to target the exact ChatCard entry in the current chat instead of only the shared library Card ID.

### Changed
* Generation card overrides now resolve by `chatCardId` first, then fall back to `cardId` for backwards compatibility.
 
## [2.0.2] - 2026-06-19

### Added
* Custom provider Chat Completions endpoints now support image recognition.
* KoboldCPP OpenAI-compatible Chat Completions endpoints now support image recognition.

### Changed
* Attachment capability settings are now defined at the model and endpoint level instead of only at the provider level.

### Fixed
* Fixed an issue where the Custom provider always required an API key.

## [2.0.1] - 2026-06-19

### Added
* Added Chinese (Simplified) localization. @GhostXia

### Fixed
* Fixed selector rendering on Linux WebKitGTK.
* Fixed a library drag-and-drop issue on Linux WebKitGTK.
* Fixed a startup crash affecting some Linux versions.
* Minor fixes and improvements.

## [2.0.0] - 2026-06-16
Initial release.
