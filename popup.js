document.getElementById("scrapeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, async (data) => {
      if (!data || !data.address || !data.price) {
        alert("Failed to scrape this page.");
        return;
      }

      const token = await getAuthToken();
      if (!token) {
        alert("Could not authenticate user.");
        return;
      }

      const parsedPrice = parseFloat(data.price.replace(/[^\d\.]/g, '')) || 0;
      const zipMatch = data.address.match(/\b\d{5}\b/);
      const zipCode = zipMatch ? zipMatch[0] : '';
      const cityMatch = data.address.split(',')[1]?.trim().toLowerCase().replace(/\s+/g, '_') || 'san_diego';
      const hoaText = document.querySelector("span:contains('HOA fee')")?.nextSibling?.textContent || '';
      const parsedHOA = parseFloat(hoaText.replace(/[^\d\.]/g, '')) || 100;
      // Additional fields from Zillow
      const beds = document.querySelector("[data-testid='bed-bath-beyond'] span")?.textContent?.match(/(\d+\.?\d*)\s*bd/)?.[1] || '';
      const baths = document.querySelector("[data-testid='bed-bath-beyond'] span")?.textContent?.match(/(\d+\.?\d*)\s*ba/)?.[1] || '';
      const sqft = document.querySelector("[data-testid='bed-bath-beyond'] span")?.textContent?.match(/([\d,]+)\s*sqft/)?.[1]?.replace(/,/g, '') || '';
      const lotSize = Array.from(document.querySelectorAll("[data-testid='key-features'] li")).find(el => el.textContent?.includes("Lot"))?.textContent?.match(/([\d,]+)\s*sqft/)?.[1]?.replace(/,/g, '') || '';
      const homeType = Array.from(document.querySelectorAll("[data-testid='key-features'] li")).find(el => el.textContent?.toLowerCase().includes("type"))?.textContent?.split(':')[1]?.trim() || '';
      const downPayment = parsedPrice * 0.2;
      const closingCosts = parsedPrice * 0.03;
      const propertyTax = parsedPrice * 0.01;

      const payload = {
        purchase_price: parsedPrice,
        down_payment: downPayment,
        closing_costs: closingCosts,
        loan_term_years: 30,
        interest_rate: 0.06,
        property_tax: propertyTax,
        insurance: 1200,
        monthly_rent: 2000,
        hoa: parsedHOA,
        vacancy_rate: 0.08,
        repairs: 100,
        location: cityMatch,
        zip_code: zipCode,
        zillow_link: data.url,
        bedrooms: beds,
        bathrooms: baths,
        square_footage: sqft,
        lot_size: lotSize,
        home_type: homeType,
        rehab_rating: '',
        crime_rating: '',
        population_growth: '',
        contacted: 'no',
        notes: ''
      };

      await fetch("https://u0hewg9v3a.execute-api.us-east-2.amazonaws.com/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(payload)
      });

      alert("Listing saved successfully!");
    });
  });
});

async function getAuthToken() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
  } catch (err) {
    console.error("❌ Failed to get auth token:", err);
    return null;
  }
}