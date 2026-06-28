---
title: PM Script Examples
description: Ready-to-use PM Script examples for TavernAI scenes.
sidebar:
  order: 71
---

This page collects practical PM Script examples that can be pasted into Prompt Manager script items and adapted for scenes.

## Auto speaker selector

This script adds a small panel to `TAI.ui.container`. When clicked, it asks the AI to choose one or more ChatCards from the current chat, then starts a normal visible generation for the selected speakers.

The selector request is internal-only: it uses the current chat history and Prompt Manager through `injectedPrompts`, returns `generatedText`, and does not create a visible message. The final response uses normal generation and temporary `chatCardId` overrides.

````js
// PM Script: AI speaker selector for the current chat.
// Requires TAI.chat.getChatCards() and TAI.chat.generate({ cardOverrides, generatedText }).

(() => {
  let isRunning = false;
  let lastStatus = "Ready";
  let lastReason = "";
  let maxSpeakers = 2;

  render();

  function render() {
    TAI.ui.container.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 0;">
        <button type="button" data-action="tai-auto-speaker" ${isRunning ? "disabled" : ""}>
          ${isRunning ? "Choosing..." : "Choose next speaker"}
        </button>
        <label style="display:flex;gap:4px;align-items:center;">
          <span>Max speakers</span>
          <select data-role="max-speakers" ${isRunning ? "disabled" : ""}>
            ${[1, 2, 3, 4].map(value => `<option value="${value}" ${value === maxSpeakers ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <span data-role="status" style="opacity:.75;"></span>
        ${lastReason ? `<span data-role="reason" title="${escapeAttribute(lastReason)}" style="cursor:help;opacity:.75;border-bottom:1px dotted currentColor;">reason</span>` : ""}
      </div>
    `;

    const button = TAI.ui.container.querySelector('[data-action="tai-auto-speaker"]');
    const status = TAI.ui.container.querySelector('[data-role="status"]');
    const maxSpeakersSelect = TAI.ui.container.querySelector('[data-role="max-speakers"]');
    if (status) status.textContent = lastStatus;
    if (button) button.addEventListener("click", chooseAndGenerate);
    if (maxSpeakersSelect) {
      maxSpeakersSelect.addEventListener("change", () => {
        maxSpeakers = Number(maxSpeakersSelect.value) || 1;
        render();
      });
    }
  }

  async function chooseAndGenerate() {
    if (isRunning) return;
    isRunning = true;
    lastStatus = "Loading ChatCards...";
    render();

    try {
      const chatCards = await TAI.chat.getChatCards();
      if (!chatCards.length) {
        throw new Error("No ChatCards in the current chat.");
      }

      lastStatus = "Asking AI to choose...";
      render();

      const selectorPrompt = buildSelectorPrompt(chatCards, maxSpeakers);
      const selectionResponse = await TAI.chat.generate({
        stream: false,
        saveResult: false,
        emitToClient: false,
        injectedPrompts: [
          {
            content: selectorPrompt,
            chatRole: "user",
            position: "relative",
            depth: 0,
            depthOrder: 0
          }
        ]
      });

      if (!selectionResponse.success) {
        throw new Error(selectionResponse.errorMessage || "Speaker selection failed.");
      }

      const selectedChatCardIds = parseSelectedChatCardIds(selectionResponse.generatedText || "", chatCards, maxSpeakers);
      if (!selectedChatCardIds.length) {
        throw new Error("AI did not return a valid chatCardIds array.");
      }

      lastReason = parseSelectionReason(selectionResponse.generatedText || "");

      const selectedCards = chatCards.filter(card => selectedChatCardIds.includes(card.id));
      lastStatus = `Generating as ${selectedCards.map(card => card.name).join(", ")}...`;
      render();

      const generationResponse = await TAI.chat.generate({
        stream: true,
        injectedPrompts: [
          {
            content: `The next assistant response must be written by: ${selectedCards.map(card => card.name).join(", ")}.`,
            chatRole: "system",
            position: "relative",
            depth: 0,
            depthOrder: 0
          }
        ],
        cardOverrides: {
          replaceOriginal: true,
          items: selectedChatCardIds.map(chatCardId => ({
            chatCardId,
            isSelectedForGenerated: true
          }))
        }
      });

      if (!generationResponse.success) {
        throw new Error(generationResponse.errorMessage || "Generation failed.");
      }

      lastStatus = `Selected: ${selectedCards.map(card => card.name).join(", ")}`;
    } catch (error) {
      lastStatus = "Failed";
      lastReason = "";
      TAI.ui.showNotification(error?.message || String(error), "error");
    } finally {
      isRunning = false;
      render();
    }
  }

  function buildSelectorPrompt(chatCards, maxSpeakers) {
    const compactCards = chatCards.map(card => ({
      chatCardId: card.id,
      name: card.name,
      isSelectedForGenerated: card.isSelectedForGenerated,
      isSelectedForInput: card.isSelectedForInput,
      isSelectedForContext: card.isSelectedForContext
    }));

    const effectiveMaxSpeakers = Math.max(1, Math.min(maxSpeakers, chatCards.length));

    return [
      "Based on the current chat history, choose which current chat card or cards should answer next.",
      `You may choose between 1 and ${effectiveMaxSpeakers} ChatCards.`,
      "Choose multiple ChatCards when the next reply naturally belongs to a group, dialogue pair, chorus, team action, or shared response.",
      "Choose one ChatCard when one speaker is clearly the best next responder.",
      "Return only strict JSON with this shape:",
      '{"chatCardIds":[123,456],"reason":"short reason"}',
      "Use chatCardId values from this list only.",
      "Do not always choose a single card; decide from the current conversation.",
      "Current ChatCards:",
      JSON.stringify(compactCards)
    ].join("\n");
  }

  function parseSelectedChatCardIds(text, chatCards, maxSpeakers) {
    const allowed = new Set(chatCards.map(card => card.id));
    const jsonText = extractJsonObject(text);
    const parsed = JSON.parse(jsonText);
    const ids = Array.isArray(parsed.chatCardIds)
      ? parsed.chatCardIds
      : parsed.chatCardId != null
        ? [parsed.chatCardId]
        : [];

    const uniqueIds = [];
    for (const id of ids.map(id => Number(id))) {
      if (Number.isInteger(id) && allowed.has(id) && !uniqueIds.includes(id)) {
        uniqueIds.push(id);
      }
    }

    return uniqueIds
      .slice(0, Math.max(1, Math.min(maxSpeakers, chatCards.length)));
  }

  function parseSelectionReason(text) {
    try {
      const parsed = JSON.parse(extractJsonObject(text));
      return typeof parsed.reason === "string" ? parsed.reason.trim() : "";
    } catch {
      return "";
    }
  }

  function extractJsonObject(text) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : text;
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start < 0 || end < start) {
      throw new Error("No JSON object found in selector response.");
    }
    return candidate.slice(start, end + 1);
  }

  function escapeAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
})();
````
