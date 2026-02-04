// REGEX
const REG = /\d+([.,]\d+)?/g;

// TITLE
document.title = document.title.replace(REG, match => toRoman(match.replace(',', '.')));

// PAGE
(function() {
    const REG = /\b\d+([.,]\d+)?\b/g;
    
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
        if (node.nodeType === Node.TEXT_NODE && 
            REG.test(node.textContent) && 
            !shouldSkip(node)) {
            node.textContent = node.textContent.replace(REG, match => {
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

    const observer = new MutationObserver(mutations => {
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
})()