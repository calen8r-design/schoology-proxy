const express = require("express");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

const app = express();

const consumerKey = process.env.SCHOOLOGY_KEY;
const consumerSecret = process.env.SCHOOLOGY_SECRET;

const oauth = OAuth({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto
      .createHmac("sha1", key)
      .update(base_string)
      .digest("base64");
  },
});

app.get("/sections", async (req, res) => {
  const request_data = {
    url: "https://api.schoology.com/v1/users/me/sections",
    method: "GET",
  };

  const authHeader = oauth.toHeader(oauth.authorize(request_data));

  try {
    const response = await fetch(request_data.url, {
      method: "GET",
      headers: {
        ...authHeader,
        Accept: "application/json",
      },
    });

    const text = await response.text();

    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(500).send(text);
    }

  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

  const authHeader = oauth.toHeader(oauth.authorize(request_data));

  try {
    const response = await fetch(request_data.url, {
      method: "GET",
      headers: {
        ...authHeader,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
