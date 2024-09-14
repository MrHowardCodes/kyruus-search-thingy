async function fetchAndDisplayData() {
  // Function to get the Access Token
  async function getAccessToken() {
    const url = "https://api.kyruus.com/oauth2/token";

    const data = new URLSearchParams({
      client_id: "2201pkqt_drupal_project",
      client_secret: "c29a0925b27c4c248f73a0db9cf13bd9",
      grant_type: "client_credentials",
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      if (response.ok) {
        const responseData = await response.json();
        const access_token = responseData.access_token;
        console.log("Access token:", access_token);
        return access_token;
      } else {
        console.log(
          "Failed to get access token. Status code:",
          response.status
        );
        const responseData = await response.text();
        console.log("Response:", responseData);
      }
    } catch (error) {
      console.error("Error during the request:", error);
    }
  }

  // Fetch and Display Data
  try {
    const token = await getAccessToken();

    if (!token) {
      throw new Error("Unable to retrieve access token");
    }

    const term = document.getElementById("term").value.toLowerCase();
    const response = await fetch(
      `https://api.kyruus.com/v9/2201pkqt/providers?context=2201pkqt_pmc&unified=${term}&access_token=${token}`
    );

    if (!response.ok) {
      throw new Error("The Data is NOT fetching...");
    }

    const data = await response.json();
    const docs = data._result;
    const docContain = document.getElementById("docContain");
    docContain.innerHTML = "";

    docs.forEach((doc) => {
      const name = doc.provider.name.full;
      const imageUrl = doc.provider.image_url;

      const docElement = document.createElement("div");
      docElement.classList.add("doctor-tile");
      docElement.innerHTML = `
                <h2>${name}</h2>
                <img src="${imageUrl}" alt="${name}">
            `;

      docContain.appendChild(docElement);
    });
  } catch (error) {
    console.error("Here's what went wrong:", error);
  }
}
