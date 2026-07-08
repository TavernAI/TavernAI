# TavernAI 2 Changelog
## [2.2.2] - 2026-07-08

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
