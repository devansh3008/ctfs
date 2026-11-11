const express = require("express");
const router = express.Router();
const Speaker = require("../models/speaker.js");

// Home page
router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.find({ hidden: false })
      .select("-isAdmin -secretKey -hidden -internalNotes")
      .limit(3);
    res.render("index", { speakers });
  } catch (error) {
    res.status(500).render("error", { message: "Error loading speakers" });
  }
});

// Speakers page
router.get("/speakers", async (req, res) => {
  try {
    const speakers = await Speaker.find({ hidden: false }).select(
      "-isAdmin -secretKey -hidden -internalNotes",
    );
    res.render("speakers", { speakers });
  } catch (error) {
    res.status(500).render("error", { message: "Error loading speakers" });
  }
});

// Sanitization function
const sanitizeQuery = (query) => {
  try {
    // Block obvious MongoDB operators
    if (
      query.includes("$ne") ||
      query.includes("$where") ||
      query.includes("$gt") ||
      query.includes("$lt")
    ) {
      return false;
    }

    // Block JavaScript execution keywords
    if (query.match(/(\$|\s+)(exec|eval|function|return)/i)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Vulnerable search endpoint
router.post("/api/speakers/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query format" });
    }

    // Basic sanitization
    if (!sanitizeQuery(query)) {
      return res.status(403).json({ error: "Invalid search terms" });
    }

    // Parse the query
    const parsedQuery = JSON.parse(query);

    // The vulnerable part: only apply security filter if no $or operator is present
    let finalQuery;
    if (!parsedQuery.$or) {
      finalQuery = { ...parsedQuery, hidden: false };
    } else {
      finalQuery = parsedQuery; // No security filter when using $or
    }

    // Execute query with all fields
    const speakers = await Speaker.find(finalQuery).select(
      "+secretKey +hidden +isAdmin +internalNotes",
    );

    res.json(speakers);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
