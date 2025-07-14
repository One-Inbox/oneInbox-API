// const { getLongLivedToken } = require("./instagramTokenController");

// // Reemplaza con tus valores reales
// const shortToken =
//   "IGQWRNS1h6TU9JalA3RWl2cFQ5LUJrNkpTNWRxbk9jNU9OY2h0ZAVExelUzWmJidzRJSzB6QkxlVHhHdkM4YXZAldVlEd090cmtoMjktamR0amxrSzRHbF9OQ1dnWXRKakgzcDY2Qng2Xy1GNjYwLUR2bmFRcGdjN3cZD";
// const businessId = "c3844993-dea7-42cc-8ca7-e509e27c74ce"; // Tu business ID (número)

// Prueba simple sin DB
const axios = require("axios");
require("dotenv").config();

async function probarToken() {
  const shortToken = "tu_token_aqui";

  try {
    const response = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          access_token: shortToken,
        },
      }
    );

    console.log("✅ Funcionó:", response.data);
  } catch (error) {
    console.log("❌ Error:", error.response?.data || error.message);
  }
}

probarToken();
