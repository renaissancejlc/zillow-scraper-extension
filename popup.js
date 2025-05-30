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
        hoa: 100,
        vacancy_rate: 0.08,
        repairs: 100,
        location: 'san_diego',
        zip_code: '',
        zillow_link: data.url,
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