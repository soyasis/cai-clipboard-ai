import { getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";
import { ActionList } from "./components/ActionList";
import { detectContent } from "./detection";

export default async function SmartSelect() {
  let text: string;
  let source: "selection" | "clipboard";

  try {
    // Try to get selected text first
    text = await getSelectedText();
    source = "selection";
  } catch {
    // No selection available, fallback to clipboard
    const clipboardText = await Clipboard.readText();
    if (!clipboardText) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Nothing to process",
        message: "Select text or copy something first",
      });
      return;
    }
    text = clipboardText;
    source = "clipboard";
  }

  // Detect content type
  const detection = await detectContent(text);

  // Show UI with actions
  return <ActionList text={text} detection={detection} source={source} />;
}
