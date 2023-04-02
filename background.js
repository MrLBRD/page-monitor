let previousContent = null;
let activeTabId = null;
const interval = 10 * 1000; // 10 secondes en millisecondes
let isFirstLoad = true;

function handleContentScriptMessage(message, sender) {
  if (message.content) {
    if (!isFirstLoad && previousContent !== null && previousContent !== message.content) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "128.png",
        title: "Page Monitor",
        message: "Le contenu de la page a changé !",
      });
    } else {
        console.log("Aucun changement détecté");
    }
    previousContent = message.content;
    isFirstLoad = false;
  }
}

chrome.runtime.onMessage.addListener(handleContentScriptMessage);

function handleTabUpdate(tabId, changeInfo, tab) {
  if (tab.url && tab.url.includes("https://app.foodles.co/")) {
    activeTabId = tabId;

    if (changeInfo.status === "complete") {
      setTimeout(() => {
        chrome.tabs.reload(activeTabId, {}, () => {
          console.log("Page rechargée");
        });
      }, interval);
    }
  }
}

chrome.tabs.onUpdated.addListener(handleTabUpdate);
