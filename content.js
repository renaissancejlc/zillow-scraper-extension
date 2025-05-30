console.log("✅ content.js loaded");

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const node = document.querySelector(selector);
      if (node) {
        observer.disconnect();
        resolve(node);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error("⏱ Timeout: Element not found"));
    }, timeout);
  });
}

function fallbackScrape() {
  const allTextNodes = document.querySelectorAll("h1, span, div");
  let price = null;
  let address = null;

  allTextNodes.forEach((el) => {
    const text = el.textContent?.trim();
    if (!text) return;

    if (!price && /^\$\d{1,3}(,\d{3})*/.test(text)) {
      price = text;
    }

    if (
      !address &&
      /\d{3,5}\s+[\w\s]+(Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Court|Ct)/i.test(text) &&
      text.length < 100 &&
      !text.includes("window.") &&
      !text.includes("{")
    ) {
      address = text;
    }
  });

  return { price, address };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "scrape") {
    (async () => {
      let price, address;

      try {
        const priceEl = await waitForElement("[data-testid='price']") ||
                         await waitForElement(".ds-summary-row .Text-c11n-8-84-0__sc-aiai24-0, .Text-c11n-8-84-0__sc-aiai24-0");

        const addressEl = await waitForElement("[data-testid='address']") ||
                           await waitForElement(".ds-price-change-address-row .Text-c11n-8-84-0__sc-aiai24-0, .Text-c11n-8-84-0__sc-aiai24-0");

        price = priceEl.textContent?.trim();
        address = addressEl.textContent?.trim();
      } catch (err) {
        console.warn("⚠️ Primary selectors failed, using fallback...");
        const fallback = fallbackScrape();
        price = fallback.price;
        address = fallback.address;
      }

      const url = window.location.href;

      const result = price && address ? { price, address, url } : null;
      console.log(result ? "📦 Scraped data:" : "❌ Scraping failed", result);

      sendResponse({
        action: "scrape_result",
        data: result
      });
    })();

    return true;
  }
});