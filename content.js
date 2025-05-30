const scrapeZillowListing = () => {
  const price = document.querySelector("[data-testid='price']")?.textContent?.trim();
  const address = document.querySelector("[data-testid='address']")?.textContent?.trim();
  const url = window.location.href;

  return { price, address, url };
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "scrape") {
    sendResponse(scrapeZillowListing());
  }
});