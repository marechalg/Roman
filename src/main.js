let observer = null;

chrome.storage.local.get(['romanToggle'], (result) => {
    if (result.romanToggle !== 'disabled') {
        startConversion();
    }
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.romanToggle) {
        location.reload();
    }
})

function startConversion() {
    const REG = /\d+([.,]\d+)?/g;
    
    document.title = document.title.replace(REG, match => toRoman(match.replace(',', '.')));
    
    const REG_PAGE = /\b\d+([.,]\d+)?\b/g;
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);
    
    function shouldSkip(node) {
        let parent = node.parentElement;
        while (parent) {
            if (SKIP_TAGS.has(parent.tagName)) return true;
            if (parent.contentEditable === 'true') return true;
            parent = parent.parentElement;
        }
        return false;
    }
    
    function convertNode(node) {
        if (node.nodeType === Node.TEXT_NODE && REG_PAGE.test(node.textContent) && !shouldSkip(node)) {
            node.textContent = node.textContent.replace(REG_PAGE, match => {
                const num = parseFloat(match.replace(',', '.'));
                if (num > 0 && num < 4000) {
                    return toRoman(num);
                }
                return match;
            })
        }
    }
    
    function convertAll(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            convertNode(node);
        }
    }
    
    convertAll(document.body);
    
    observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    convertAll(node);
                } else {
                    convertNode(node);
                }
            })
        })
    })
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
}