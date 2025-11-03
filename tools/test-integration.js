// Integration test runner for SecSpell
// Tests actual application functions and user interactions

(function() {
    'use strict';
    
    // Test results storage
    let testResults = {
        passed: 0,
        failed: 0,
        total: 0,
        details: []
    };
    
    // Test helpers
    function assert(condition, message) {
        if (!condition) throw new Error(message || 'Assertion failed');
    }
    
    function assertTrue(condition, message) {
        assert(condition, message || 'Expected true');
    }
    
    function assertFalse(condition, message) {
        assert(!condition, message || 'Expected false');
    }
    
    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }
    
    // Integration test helpers - access functions via DOM events and queries
    const TestHelpers = {
        // Type text into the textarea
        typeText(text) {
            const textArea = document.getElementById('text-area') || document.querySelector('[contenteditable="true"]');
            if (!textArea) throw new Error('Textarea not available');
            
            // Clear first
            textArea.textContent = '';
            
            // Set new text
            textArea.textContent = text;
            
            // Trigger input event
            const inputEvent = new Event('input', { bubbles: true });
            textArea.dispatchEvent(inputEvent);
            
            // Blur to trigger spell check (spell check runs on blur when cursor is not in textarea)
            // Use setTimeout to ensure input event is processed first
            setTimeout(() => {
                // Remove focus if it exists
                if (document.activeElement === textArea) {
                    textArea.blur();
                } else {
                    // Trigger blur event manually
                    const blurEvent = new Event('blur', { bubbles: true });
                    textArea.dispatchEvent(blurEvent);
                }
            }, 150);
        },
        
        // Get current text
        getText() {
            const textArea = document.getElementById('text-area') || document.querySelector('[contenteditable="true"]');
            return textArea ? (textArea.innerText || textArea.textContent || '') : '';
        },
        
        // Wait for spell check to complete
        async waitForSpellCheck(delay = 2200) {
            return new Promise(resolve => setTimeout(resolve, delay));
        },
        
        // Force spell check by triggering blur
        triggerSpellCheck() {
            const textArea = document.getElementById('text-area') || document.querySelector('[contenteditable="true"]');
            if (textArea) {
                const blurEvent = new Event('blur', { bubbles: true });
                textArea.dispatchEvent(blurEvent);
            }
        },
        
        // Get all error elements
        getErrorElements() {
            return Array.from(document.querySelectorAll('.spell-error'));
        },
        
        // Get all ignored word elements
        getIgnoredElements() {
            return Array.from(document.querySelectorAll('.spell-ignored'));
        },
        
        // Get error words
        getErrorWords() {
            return this.getErrorElements().map(el => el.getAttribute('data-word')).filter(Boolean);
        },
        
        // Check if word is highlighted as error
        isWordErrored(word) {
            const errors = this.getErrorWords();
            // Check both exact and lowercase match
            const wordLower = word.toLowerCase();
            return errors.some(e => e.toLowerCase() === wordLower);
        },
        
        // Check if word is ignored
        isWordIgnored(word) {
            const ignored = Array.from(document.querySelectorAll('.spell-ignored'))
                .map(el => el.getAttribute('data-word')).filter(Boolean);
            const wordLower = word.toLowerCase();
            return ignored.some(i => i.toLowerCase() === wordLower);
        },
        
        // Clear textarea
        clearText() {
            const textArea = document.getElementById('text-area') || document.querySelector('[contenteditable="true"]');
            if (textArea) {
                textArea.textContent = '';
                const event = new Event('input', { bubbles: true });
                textArea.dispatchEvent(event);
            }
        },
        
        // Test checkWord function directly - try to access via window or use DOM-based test
        testCheckWord(word) {
            // Try accessing via window if exposed
            if (typeof window.checkWord === 'function') {
                return window.checkWord(word);
            }
            // Fallback: test via DOM by checking if word gets highlighted
            // This is a workaround if functions aren't globally exposed
            throw new Error('checkWord function not globally accessible - use DOM-based testing');
        },
        
        // Test getSuggestions function directly
        testGetSuggestions(word, limit = 5) {
            if (typeof window.getSuggestions === 'function') {
                return window.getSuggestions(word, limit);
            }
            throw new Error('getSuggestions function not globally accessible');
        },
        
        // Test via DOM: type word and see if it's highlighted
        async testWordViaDOM(word) {
            this.typeText(word);
            await this.waitForSpellCheck();
            return !this.isWordErrored(word);
        }
    };
    
    // Test scenarios
    const testScenarios = {
        async testCorrectWords() {
            const results = [];
            try {
                TestHelpers.typeText('hello world');
                await TestHelpers.waitForSpellCheck();
                const errors = TestHelpers.getErrorWords();
                assertTrue(errors.length === 0, 'Correct words should not be highlighted');
                results.push({ name: 'Correct words not highlighted', pass: true });
            } catch (e) {
                results.push({ name: 'Correct words not highlighted', pass: false, error: e.message });
            }
            return results;
        },
        
        async testMisspelledWords() {
            const results = [];
            try {
                TestHelpers.typeText('helo wrld');
                await TestHelpers.waitForSpellCheck();
                const errors = TestHelpers.getErrorWords();
                assertTrue(errors.length >= 2, 'Should find at least 2 errors');
                assertTrue(errors.includes('helo') || errors.includes('Helo'), 'Should highlight "helo"');
                assertTrue(errors.includes('wrld') || errors.includes('Wrld'), 'Should highlight "wrld"');
                results.push({ name: 'Misspelled words highlighted', pass: true });
            } catch (e) {
                results.push({ name: 'Misspelled words highlighted', pass: false, error: e.message });
            }
            return results;
        },
        
        async testMixedText() {
            const results = [];
            try {
                TestHelpers.typeText('hello helo world wrld');
                await TestHelpers.waitForSpellCheck();
                const errors = TestHelpers.getErrorWords();
                assertTrue(errors.length >= 2, 'Should find misspelled words');
                assertTrue(!errors.includes('hello'), 'Should not highlight correct word "hello"');
                assertTrue(!errors.includes('world'), 'Should not highlight correct word "world"');
                results.push({ name: 'Mixed text (correct and incorrect)', pass: true });
            } catch (e) {
                results.push({ name: 'Mixed text (correct and incorrect)', pass: false, error: e.message });
            }
            return results;
        },
        
        async testCheckWordViaDOM() {
            const results = [];
            try {
                // Test correct words
                const correct1 = await TestHelpers.testWordViaDOM('hello');
                assertTrue(correct1, 'Word "hello" should be correct');
                
                const correct2 = await TestHelpers.testWordViaDOM('world');
                assertTrue(correct2, 'Word "world" should be correct');
                
                // Test misspelled words
                TestHelpers.typeText('helo');
                await TestHelpers.waitForSpellCheck();
                const incorrect1 = TestHelpers.isWordErrored('helo');
                assertTrue(incorrect1, 'Word "helo" should be highlighted as error');
                
                results.push({ name: 'Word checking via DOM', pass: true });
            } catch (e) {
                results.push({ name: 'Word checking via DOM', pass: false, error: e.message });
            }
            return results;
        },
        
        async testErrorHighlighting() {
            const results = [];
            try {
                // Test correct word first
                TestHelpers.clearText();
                TestHelpers.typeText('test');
                await TestHelpers.waitForSpellCheck();
                // "test" should not be highlighted
                assertFalse(TestHelpers.isWordErrored('test'), 'Correct word should not be highlighted');
                
                // Test misspelled word - use a word that definitely won't be in dictionary
                // Note: cleanWord removes numbers, so "xyzabc123" becomes "xyzabc"
                // Use a definitely wrong word without numbers
                TestHelpers.clearText();
                TestHelpers.typeText('xyzqwerty');
                
                // Wait for spell check and check multiple times if needed
                let attempts = 0;
                let found = false;
                while (attempts < 5 && !found) {
                    await TestHelpers.waitForSpellCheck(500);
                    found = TestHelpers.isWordErrored('xyzqwerty');
                    attempts++;
                }
                
                assertTrue(found, 'Misspelled word "xyzqwerty" should be highlighted');
                
                results.push({ name: 'Error highlighting', pass: true });
            } catch (e) {
                results.push({ name: 'Error highlighting', pass: false, error: e.message });
            }
            return results;
        },
        
        async testIgnoredWords() {
            const results = [];
            try {
                // Test via settings: add a word to ignored words
                const testWord = 'customtestword' + Date.now();
                const textarea = document.getElementById('ignoredWordsTextarea');
                if (!textarea) {
                    throw new Error('Ignored words textarea not found');
                }
                
                // Add word via textarea
                const currentWords = textarea.value ? textarea.value.split('\n') : [];
                currentWords.push(testWord);
                textarea.value = currentWords.join('\n');
                
                // Trigger save
                const blurEvent = new Event('blur', { bubbles: true });
                textarea.dispatchEvent(blurEvent);
                
                // Wait a bit for save
                await TestHelpers.waitForSpellCheck(500);
                
                // Type the word and check it's not highlighted
                TestHelpers.typeText(testWord);
                await TestHelpers.waitForSpellCheck();
                assertFalse(TestHelpers.isWordErrored(testWord), 'Ignored word should not be highlighted');
                
                // Clean up: remove the word
                const newWords = currentWords.filter(w => w !== testWord);
                textarea.value = newWords.join('\n');
                textarea.dispatchEvent(blurEvent);
                
                results.push({ name: 'Ignored words functionality', pass: true });
            } catch (e) {
                results.push({ name: 'Ignored words functionality', pass: false, error: e.message });
            }
            return results;
        }
    };
    
    // Main test runner
    async function runIntegrationTests() {
        // Check if textarea exists (try multiple selectors)
        const textArea = document.getElementById('text-area') || document.querySelector('[contenteditable="true"]');
        if (!textArea) {
            if (typeof showToast === 'function') {
                showToast('Application not ready for testing (textarea not found)', 3000);
            } else {
                alert('Application not ready for testing (textarea not found)');
            }
            return;
        }
        
        // Wait a bit to ensure dictionaries might be loading
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Create test results panel (respects dark mode)
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? '#2d2d2d' : 'white';
        const textColor = isDark ? '#e0e0e0' : '#333';
        const borderColor = isDark ? '#4a9eff' : '#2196F3';
        
        const testPanel = document.createElement('div');
        testPanel.id = 'testResultsPanel';
        testPanel.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; padding: 16px; max-width: 400px; max-height: 80vh; overflow-y: auto; z-index: 10000; box-shadow: 0 4px 16px rgba(0,0,0,0.3); color: ${textColor};`;
        testPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; color: ${textColor};">🧪 Integration Tests</h3>
                <button id="closeTestPanel" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0 8px; color: ${textColor};">×</button>
            </div>
            <div id="testResultsContent" style="font-size: 13px;"></div>
        `;
        document.body.appendChild(testPanel);
        
        const closeBtn = document.getElementById('closeTestPanel');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(testPanel);
        });
        
        const contentDiv = document.getElementById('testResultsContent');
            const runningColor = isDark ? '#4a9eff' : '#1976d2';
            contentDiv.innerHTML = `<div style="color: ${runningColor};">Running tests...</div>`;
        
        // Reset results
        testResults = { passed: 0, failed: 0, total: 0, details: [] };
        
        // Save original text
        const originalText = TestHelpers.getText();
        
        try {
            // Run all test scenarios
            const scenarios = [
                { name: 'Correct Words', fn: testScenarios.testCorrectWords },
                { name: 'Misspelled Words', fn: testScenarios.testMisspelledWords },
                { name: 'Mixed Text', fn: testScenarios.testMixedText },
                { name: 'Word Checking (DOM)', fn: testScenarios.testCheckWordViaDOM },
                { name: 'Error Highlighting', fn: testScenarios.testErrorHighlighting },
                { name: 'Ignored Words', fn: testScenarios.testIgnoredWords }
            ];
            
            const runningTextColor = isDark ? '#999' : '#666';
            for (const scenario of scenarios) {
                contentDiv.innerHTML += `<div style="margin: 8px 0; color: ${runningTextColor};">Running: ${scenario.name}...</div>`;
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const results = await scenario.fn();
                results.forEach(result => {
                    testResults.total++;
                    if (result.pass) {
                        testResults.passed++;
                        testResults.details.push({ name: result.name, pass: true });
                    } else {
                        testResults.failed++;
                        testResults.details.push({ name: result.name, pass: false, error: result.error });
                    }
                });
            }
            
            // Restore original text
            TestHelpers.clearText();
            if (originalText) {
                TestHelpers.typeText(originalText);
            }
            
            // Display results (respects dark mode)
            const allPassed = testResults.failed === 0;
            const passBg = isDark ? '#1e4620' : '#d4edda';
            const passText = isDark ? '#81c784' : '#155724';
            const failBg = isDark ? '#4a1e1e' : '#f8d7da';
            const failText = isDark ? '#e57373' : '#721c24';
            const borderColor2 = isDark ? '#444' : '#e0e0e0';
            const errorColor = isDark ? '#aaa' : '#999';
            
            const summaryStyle = allPassed 
                ? `background: ${passBg}; color: ${passText}; padding: 12px; border-radius: 4px; margin-bottom: 12px;`
                : `background: ${failBg}; color: ${failText}; padding: 12px; border-radius: 4px; margin-bottom: 12px;`;
            
            let html = `
                <div style="${summaryStyle}">
                    <strong>Tests Complete</strong><br>
                    Total: ${testResults.total} | 
                    Passed: ${testResults.passed} ✓ | 
                    Failed: ${testResults.failed} ${testResults.failed > 0 ? '✗' : ''}<br>
                    Success Rate: ${testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(1) : 0}%
                </div>
            `;
            
            testResults.details.forEach(detail => {
                const itemStyle = detail.pass 
                    ? `color: ${passText}; padding: 4px 0; border-bottom: 1px solid ${borderColor2};`
                    : `color: ${failText}; padding: 4px 0; border-bottom: 1px solid ${borderColor2};`;
                html += `<div style="${itemStyle}">
                    ${detail.pass ? '✓' : '✗'} ${detail.name}
                    ${detail.error ? `<div style="font-size: 11px; color: ${errorColor}; margin-top: 2px;">${detail.error}</div>` : ''}
                </div>`;
            });
            
            contentDiv.innerHTML = html;
            
            // Show toast (if available)
            if (typeof showToast === 'function') {
                showToast(`Integration tests: ${testResults.passed}/${testResults.total} passed`, 3000);
            }
            
        } catch (e) {
            const errorColor = isDark ? '#e57373' : '#721c24';
            contentDiv.innerHTML += `<div style="color: ${errorColor}; margin-top: 12px;">Error: ${e.message}</div>`;
            console.error('Test error:', e);
        }
    }
    
    // Expose globally
    window.runIntegrationTests = runIntegrationTests;
    
    console.log('Integration test runner loaded');
})();

