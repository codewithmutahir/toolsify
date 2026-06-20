type MessageValue = string | MessageTree | MessageValue[];
type MessageTree = { [key: string]: MessageValue };

export function mergeMessages(
  base: MessageTree,
  override: MessageTree
): MessageTree {
  const result: MessageTree = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = result[key];
    const overrideValue = override[key];

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = mergeMessages(
        baseValue as MessageTree,
        overrideValue as MessageTree
      );
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }

  return result;
}

/** Remove English tool page bodies so non-English locales use localized fallbacks. */
export function stripToolPageContent(messages: MessageTree): MessageTree {
  const tools = messages.tools;
  if (!tools || typeof tools !== "object" || Array.isArray(tools)) {
    return messages;
  }

  const strippedTools: MessageTree = {};
  for (const [slug, value] of Object.entries(tools)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const entry = { ...(value as MessageTree) };
      delete entry.content;
      strippedTools[slug] = entry;
    } else {
      strippedTools[slug] = value;
    }
  }

  return { ...messages, tools: strippedTools };
}
