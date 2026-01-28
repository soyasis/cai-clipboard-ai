import { getSelectedText, Clipboard, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { ActionList } from "./components/ActionList";
import { detectContent } from "./detection";
import { ContentResult } from "./detection/types";

export default function SmartSelect() {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState<string>("");
  const [detection, setDetection] = useState<ContentResult | null>(null);
  const [source, setSource] = useState<"selection" | "clipboard">("selection");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadText() {
      try {
        // Add a small delay to allow the system to capture the selection
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Try to get selected text first
        try {
          const selectedText = await getSelectedText();

          // Copy the selected text to clipboard for reliability
          await Clipboard.copy(selectedText);

          setText(selectedText);
          setSource("selection");
          const result = await detectContent(selectedText);
          setDetection(result);
          setIsLoading(false);
          return;
        } catch {
          // No selection, try clipboard
          const clipboardText = await Clipboard.readText();
          if (!clipboardText) {
            setError("Select text or copy something first");
            await showToast({
              style: Toast.Style.Failure,
              title: "Nothing to process",
              message: "Select text or copy something first",
            });
            setIsLoading(false);
            return;
          }

          setText(clipboardText);
          setSource("clipboard");
          const result = await detectContent(clipboardText);
          setDetection(result);
          setIsLoading(false);
        }
      } catch {
        setError("Failed to process text");
        setIsLoading(false);
      }
    }

    loadText();
  }, []);

  if (isLoading) {
    return <List isLoading={true} />;
  }

  if (error || !detection) {
    return (
      <List>
        <List.EmptyView title={error || "Failed to process"} />
      </List>
    );
  }

  return <ActionList text={text} detection={detection} source={source} />;
}
