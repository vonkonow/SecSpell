# Spell Checker

A fast, offline spell checker that works entirely in your browser - no server or internet connection required. Perfect for checking brief text without uploading sensitive data to cloud services (AI link is optional :)

## Features

- ✅ **100% Offline** - Works without internet or server
- ✅ **Multi-Language Support** - Auto-detects available dictionaries
- ✅ **All Languages Mode** - Check against all loaded dictionaries simultaneously
- ✅ **AI Chat Integration** - Copy text and open DuckDuckGo AI Chat
- ✅ **Dynamic Language Addition** - Easily add new languages via dictionary converter
- ✅ **Suggestions** - Hover over misspelled words for corrections
- ✅ **Keyboard Navigation** - Arrow keys + Enter to navigate suggestions
- ✅ **Ignore List** - Personal dictionary (persists in localStorage)
- ✅ **Undo/Redo** - Ctrl+Z/Ctrl+Y
- ✅ **Real-time Checking** - Highlights errors as you type

## Usage

1. Open `index.html` in your browser
2. Select language mode: "All" or specific language
3. Type - misspelled words are highlighted in red
4. Hover over words for suggestions, click to replace
5. Click "Ignore word" to add to personal dictionary
6. Use "Copy & Open AI Chat" button to send text to DuckDuckGo AI
7. Click "Language:" label to open dictionary converter

## Files

- `index.html` - Main application
- `tools/typo.js` - Spell checking library
- `tools/dictionaries-en_US.js` - English dictionary (~723 KB)
- `tools/dictionaries-sv_SE.js` - Swedish dictionary (~3 MB)
- `tools/converter.html` - Dictionary converter tool
- `tools/tests.html` - Comprehensive test suite
- `tools/convert-dictionaries.py` - Dictionary converter script (optional, command-line alternative)

## How It Works

Dictionaries are embedded as base64-encoded JavaScript files, allowing them to work with the `file://` protocol without CORS restrictions. This means you can open the HTML file directly without a web server.

The application automatically detects available dictionaries by scanning for `window.dictionary_*` variables. Languages are dynamically added to the UI, making it easy to extend support.

## Adding New Languages

1. Click "Language:" label to open converter
2. Download .aff and .dic files from [wooorm/dictionaries](https://github.com/wooorm/dictionaries)
3. Drag & drop files into converter, enter locale (e.g., `de_DE`)
4. Click "Convert All" and download the JavaScript file
5. Add script tag to `index.html`: `<script src="tools/dictionaries-de_DE.js"></script>`
6. Language automatically appears in selector

## Testing

Open `tools/tests.html` in your browser for comprehensive test coverage including dictionary loading, spell checking, suggestions, security, and performance.

## Performance

- **Suggestion Caching** - Instant retrieval for repeated requests
- **Pre-caching** - Suggestions pre-computed for first 10 misspelled words (throttled)
- **On-demand Loading** - Dictionaries loaded based on language mode
- **Efficient Storage** - Map-based dictionary storage

## Privacy & Security

**100% private** - text never leaves your device:
- No network requests or cloud services
- Browser spell check disabled to prevent data leaks
- Works completely offline
- No tracking or analytics
- XSS protection via HTML escaping

## Keyboard Shortcuts

- **Escape** - Force spell check or close suggestions menu
- **Arrow Up/Down** - Navigate suggestions (when open)
- **Enter** - Select highlighted suggestion
- **Ctrl+Z/Y** - Undo/Redo
- **Space/Enter** - Instant spell check after word/line

Spell checking happens automatically after 2s idle, on Space/Enter, or manually with Escape. Cursor position is always preserved.

## License

- Typo.js: MIT License
- Dictionaries: Various open-source licenses (from LibreOffice)
