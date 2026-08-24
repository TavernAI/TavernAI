---
title: Media Tools
description: Let a chat model request images from Google AI, OpenAI, xAI, or NovelAI, and generate images manually from the same tool.
sidebar:
  order: 56
---

Media Tools connect text generation to image generation. A chat model writes the reply and can request an image from a separate image provider. The text model and image model do not need to come from the same provider: a local text model can call xAI, or an OpenAI text model can call NovelAI.

A Media Tool is a Prompt Manager node. It contains the instruction shown to the chat model, the image provider connection, the image model and its settings. Each node also has an independent workspace for manual generation.
> **Screenshot (Manual generation):** ![TavernAI Media Tools](/img/docs/media_tools_1.png)
## Add a ready-made Media Tool

The Card Preset catalog contains configured image-generator Cards for Google AI, OpenAI, xAI, and NovelAI. This is the shortest path to a working tool:

1. Open **Chat Cards** or **Global Cards**.
2. Select **Add**.
3. Open **Card Presets**.
4. Add the image-generator preset for the required provider.
5. Open the added Card and configure the Media Tool connection, model, and provider settings.
6. Keep the Card's **Ctx** switch enabled in the chat.

The Card must enter the chat Prompt Manager through a **CARD PROMPTS** node. See [Prompt Manager](/docs/prompt-manager/#insert-chat-and-card-prompts) for that assembly step.

## Create a Media Tool node

To build a tool directly:

1. Open a chat or Card Prompt Manager.
2. Click **Media Tool** button in the Prompt Manager toolbar.
3. Open the new node from the Prompt Manager.
4. Configure it in the **Settings**, **Prompt**, and **Generate** tabs.

The node stays at its position in the Prompt Manager tree. Its enabled state and the enabled state of its parent folders determine whether its instruction is available during generation.

### Settings

Set the **Tool name** to the function name presented to the chat model. The default is `generate_image`.

Choose the image **Provider** and **Model**, then configure the options exposed by that provider.

### Connection

Each Media Tool has its own image-provider connection. Select **Current provider connection** to use the active connection, or select a **Connection preset** and choose **Select Connection Preset**.

A connection preset supplies the API key for the selected provider. The Media Tool still owns its provider, model, endpoint, and image settings.

This separation lets several Media Tools use different accounts, endpoints, or providers while the chat continues to use its own text-generation connection.

> **Screenshot:** ![TavernAI Media Tools](/img/docs/media_tools_2.png)

## Instruction prompt

The **Prompt** tab contains the instruction sent to the chat model. It explains the tool-call format and the selected image model's available inputs.

**Update instruction prompt automatically** rebuilds this instruction when the tool name, provider, model, or settings change. Keep it enabled for normal use. Turn it off when the chat model needs a custom instruction, then edit the prompt directly. **Reset Prompt** restores a generated instruction.

Use [Final Prompt Viewer](/docs/advanced-features/#5-final-prompt-viewer) to confirm that the instruction reaches the text model.

## Image requests in chat

When the chat model emits a valid Media Tool request, TavernAI starts image generation and places the execution state inside the message.

The marker can show:

- **Generating image...** while the request is running;
- **Generate image?** when an imported tool configuration requires confirmation;
- **Image generation failed** when the provider rejects the request or generation fails;
- **Image generation cancelled** after a declined request;
- **Generation unavailable** when the tool can no longer be resolved.

A failed request can be inspected, retried, or removed. After successful execution, the marker is replaced by generated image file markers, and the images render as part of the same message.

The text model decides when to request an image. Its model capabilities, the active conversation, and the Media Tool instruction all affect that decision. A valid provider connection does not force every reply to contain an image.

## Generate manually

Open the Media Tool's **Generate** tab to use the same provider without asking the chat model to call it.

1. Enter the image **Prompt**.
2. For NovelAI, optionally enter a **Negative prompt**.
3. Add reference image markers when the selected provider and model accept references.
4. Select **Generate image**.

The workspace belongs to that Media Tool node. Its prompt, negative prompt, references, and latest result remain available when the editor is reopened. Running generation again replaces the displayed latest result; it does not erase files already inserted elsewhere.

Under **Generated images**, open an image, inspect its data, or copy its file marker for use in a prompt or message. **Clear result** clears the workspace result without changing earlier chat messages.

## Troubleshooting

### The text model never calls the tool

- Confirm that the Media Tool node, its parent folders, and the owning Card's **Ctx** switch are enabled.
- Confirm that the chat Prompt Manager contains **CARD PROMPTS** when the tool is stored on a Card.
- Open Final Prompt Viewer and search for the tool name.

### Generation fails

- Open the failed marker and inspect its payload or error.
- Test the Media Tool connection from its Settings tab.

## Related pages

- [Global Cards and Card Presets](/docs/global-cards-and-card-presets/) for reusable tool Cards and bundled presets.
- [Prompt Manager](/docs/prompt-manager/) for tree order, Card prompts, and attachment behavior.
