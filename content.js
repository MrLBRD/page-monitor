function getSpecificContent() {
    const elements = document.querySelectorAll("main>div>div[class^='styledComponents__CategoryContainer']>div[class^='styledComponents__ProductContainer']");
    console.log(elements)
    const element = elements[1]
    console.log(element)
    return element ? element.outerHTML : null;
}
  
function sendContentToBackgroundScript() {
    const content = getSpecificContent();
    if (content === null) {
        setTimeout(() => {
            sendContentToBackgroundScript();
        }, 300);
    } else {
        chrome.runtime.sendMessage({ content: content });
    }
}
  
let contentObserverTimeout = null;
  
function observeContentChanges() {
    const targetElement = document.querySelectorAll("main>div>div[class^='styledComponents__CategoryContainer']>div[class^='styledComponents__ProductContainer']")[1];
    console.log(targetElement)
    if (!targetElement) {
        setTimeout(observeContentChanges, 300);
        return;
    }
  
    const observer = new MutationObserver((mutations) => {
        clearTimeout(contentObserverTimeout);
        contentObserverTimeout = setTimeout(() => {
            sendContentToBackgroundScript();
        }, 400);
    });
  
    const config = { childList: true, subtree: true };
    observer.observe(targetElement, config);
}
  
function createObserver() {
    const bodyElement = document.querySelector("body");
  
    if (bodyElement) {
        const observer = new MutationObserver((mutations) => {
            if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
                observeContentChanges();
                observer.disconnect();
            }
        });
    
        const config = { childList: true, subtree: true };
        observer.observe(bodyElement, config);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createObserver);
} else {
    createObserver();
}
