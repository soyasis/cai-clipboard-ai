# Cai: Clipboard Action Intelligence Changelog

## [Initial Release] - 2026-01-29

### Features

- Smart content detection for words, meetings, addresses, URLs, and JSON
- AI-powered actions using local LLMs: define words, explain concepts, translate text, and summarize articles
- Custom Action feature (⌘1) - configure your own AI instruction accessible via keyboard shortcut
- Calendar event creation with intelligent title and location extraction from natural language
- Translation support for 10+ languages with two configurable quick-access languages
- Search integration with multiple engines: Brave Search, DuckDuckGo, Google, Bing, and Ecosia
- Maps integration supporting both Apple Maps and Google Maps
- Two commands: Smart Select (⌥C) and Smart Paste (⌥V)
- Privacy-first design: all AI processing happens locally on your machine, no cloud required

### Supported LLM Providers

- LM Studio
- Ollama
- LocalAI
- text-generation-webui
- Custom OpenAI-compatible servers

### Technical Improvements

- Race condition fix for content type detection to prevent stale state updates
- Async cancellation pattern to prevent memory leaks
- Improved calendar event title extraction with pattern matching
- Enhanced location extraction to capture full venue names (e.g., "Cafe La Palma" instead of just "La Palma")
