const toggle = document.getElementById('toggle');

// VERSION
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('version').textContent = chrome.runtime.getManifest().version;
    
    // Charger l'état initial
    chrome.storage.local.get(['romanToggle'], (result) => {
        toggle.className = result.romanToggle || 'enabled';
    })
})

// TOGGLE
toggle.addEventListener('click', () => {
    const newState = toggle.className === 'enabled' ? 'disabled' : 'enabled';
    toggle.className = newState;
    chrome.storage.local.set({ romanToggle: newState });
})

// REFRESH
document.getElementById('refresh').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
    })
})