# SecSpell

A fast, offline spell checker that works entirely in your browser - no server or internet connection required. Perfect for checking brief text without uploading sensitive data to cloud services (AI link is optional :)

## Features

- ✅ **100% Offline** - Works without internet or server
- ✅ **Multi-Language Support** - Auto-detects available dictionaries
- ✅ **All Languages Mode** - Check against all loaded dictionaries simultaneously
- ✅ **AI Chat Integration** - Copy text and open DuckDuckGo AI Chat (optional, can be disabled)
- ✅ **Settings Panel** - Configure dark mode, AI button visibility, autosave, and access tools
- ✅ **Dark Mode** - System preference detection with manual toggle
- ✅ **Autosave & Restore** - Automatically saves and restores your text
- ✅ **Ignored Words Management** - View and edit personal dictionary in settings (textarea interface)
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
5. Click ⚙️ settings icon to configure AI button, autosave, or access tools
6. Use 🤖 "Copy & Open AI Chat" button to send text to DuckDuckGo AI (if enabled)

**Settings (⚙️ icon):**
- **Dark mode** - Toggle dark color scheme (respects system preference)
- **Show AI Chat button** - Toggle AI button visibility (default: enabled)
- **Autosave text** - Automatically save/restore text (default: enabled)
- **Ignored Words** - View and edit personal dictionary in textarea (comma or newline separated)
- **Dictionary Converter** - Convert and add new language dictionaries
- **Test Suite** - Run comprehensive tests

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

1. Open settings (⚙️ icon) and click "Dictionary Converter" link, or open `tools/converter.html` directly
2. Download .aff and .dic files from [wooorm/dictionaries](https://github.com/wooorm/dictionaries)
3. Drag & drop files into converter, enter locale (e.g., `de_DE`)
4. Click "Convert All" and download the JavaScript file
5. Add script tag to `index.html`: `<script src="tools/dictionaries-de_DE.js"></script>`
6. Language automatically appears in selector

## Performance

- **Suggestion Caching** - Instant retrieval for repeated requests
- **Pre-caching** - Suggestions pre-computed for first 10 misspelled words (throttled)
- **On-demand Loading** - Dictionaries loaded based on language mode
- **Efficient Storage** - Map-based dictionary storage

## Privacy & Security

**100% private by default** - text never leaves your device:
- No network requests or cloud services (unless AI Chat button is used)
- Works completely offline with no tracking or analytics
- Browser spell check disabled to prevent data leaks
- XSS protection via HTML escaping and DOM manipulation
- Locale validation to prevent injection attacks

**Important:**
- ⚠️ **AI Chat** - Sends text to external servers (DuckDuckGo). Can be disabled in settings.
- ⚠️ **Autosave** - Stores text unencrypted in localStorage. Not recommended for sensitive information.

## Keyboard Shortcuts

- **Escape** - Force spell check, close suggestions/settings
- **Arrow Up/Down** - Navigate suggestions
- **Enter** - Select highlighted suggestion
- **Ctrl+Z/Y** - Undo/Redo
- **Ctrl+Shift+I** - Clear all ignored words
- **Space/Enter** - Instant spell check after word/line

Spell checking happens automatically after 2s idle, on Space/Enter, or manually with Escape.

## License

- Typo.js: MIT License
- Dictionaries: Various open-source licenses (from LibreOffice)
