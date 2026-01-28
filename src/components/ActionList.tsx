import { Action, ActionPanel, List, Icon, openExtensionPreferences } from "@raycast/api";
import { useState, useEffect } from "react";
import { ContentResult, ContentType } from "../detection/types";
import { checkLLM, LLMStatus } from "../services/llm";
import { getActionsForContent } from "../actions";

interface Props {
  text: string;
  detection: ContentResult;
  source: "selection" | "clipboard";
}

export function ActionList({ text, detection, source }: Props) {
  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);

  useEffect(() => {
    checkLLM().then(setLlmStatus);
  }, []);

  const actions = getActionsForContent(text, detection, llmStatus);

  const typeLabels: Record<ContentType, string> = {
    word: "Word",
    short: "Text",
    long: "Long Text",
    meeting: "Meeting",
    address: "Address",
    url: "URL",
    json: "JSON",
  };

  const typeIcons: Record<ContentType, string> = {
    word: "✏️",
    short: "📝",
    long: "📖",
    meeting: "📅",
    address: "📍",
    url: "🔗",
    json: "{ }",
  };

  return (
    <List>
      <List.Section
        title={`${typeIcons[detection.type]} ${typeLabels[detection.type]} detected`}
        subtitle={source === "selection" ? "from selection" : "from clipboard"}
      >
        {actions.map((action, index) => (
          <List.Item
            key={action.id}
            icon={action.icon}
            title={action.title}
            subtitle={action.subtitle}
            accessories={[{ text: `⌘${index + 1}` }]}
            actions={
              <ActionPanel>
                <Action
                  title={action.title}
                  icon={action.icon}
                  onAction={action.execute}
                  shortcut={{ modifiers: ["cmd"], key: String(index + 1) as any }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      {!llmStatus?.running && (
        <List.Section title="⚠️ Local LLM not available">
          <List.Item
            icon="⚙️"
            title="Open Cai Preferences"
            subtitle={llmStatus?.error || "Configure your LLM server URL"}
            actions={
              <ActionPanel>
                <Action title="Open Preferences" onAction={openExtensionPreferences} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      <List.Section title="Always available">
        <List.Item
          icon="📋"
          title="Copy as plain text"
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={text} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
