const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes/index");
const Speaker = require("./models/speaker");

const app = express();

// Database Connection and Initial Setup
const initializeDatabase = async () => {
  try {
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/conference";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Check if speakers collection is empty
    const count = await Speaker.countDocuments();
    if (count === 0) {
      // Seed initial data
      const seedData = [
        {
          name: "Sarah Johnson",
          title: "Chief Security Officer",
          company: "TechCorp Industries",
          image:
            "https://media.istockphoto.com/id/1226991791/photo/inspirational-female-speaker-talking-about-happiness-self-success-efficiency-health-and-how.jpg?s=612x612&w=0&k=20&c=TcUDRqMWAqi6BnhUWojQJ1JYPl3Vv32HJsegXfJbrW8=",
          bio: "Leading security expert with 15 years experience in cybersecurity",
          isAdmin: false,
          presentations: ["Web Security 2026", "Zero Trust Architecture"],
          hidden: false,
        },
        {
          name: "Michael Chen",
          title: "Principal Engineer",
          company: "CloudSecure Solutions",
          image:
            "https://epoch.org.tw/younginnovatorsconf/wp-content/uploads/2020/10/JiaLu-600x600.jpg",
          bio: "Cloud security specialist and published author",
          isAdmin: false,
          presentations: ["Cloud Native Security"],
          hidden: false,
        },
        {
          name: "Emily Rodriguez",
          title: "Security Researcher",
          company: "DefenseLabs",
          image:
            "https://media.istockphoto.com/id/1388388705/photo/e-business-technology-conference-presentation-innovative-black-tech-engineer-talks-about.jpg?s=612x612&w=0&k=20&c=stO4u6ch4ktKvxz6GJClP14iFQAdrnz7DCupa4zVAq8=",
          bio: "Specializing in threat intelligence and malware analysis",
          isAdmin: false,
          presentations: ["Threat Hunting Workshop"],
          hidden: false,
        },
        {
          name: "admin",
          title: "System Administrator",
          company: "Internal",
          image: "/img/admin-avatar.jpg",
          bio: "System Administrator",
          isAdmin: true,
          secretKey: "BI{n0_sql_n0_pr0bl3m_9f82a1c4}",
          hidden: true,
          internalNotes:
            "TODO: Fix the search functionality vulnerability before the conference",
        },
      ];

      await Speaker.insertMany(seedData);
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Initialize database
initializeDatabase();

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Something broke!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Routes
app.use("/", routes);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

app.use((req, res, next) => {
  // Rate limiting (simple version)
  if (req.url.includes("/api/")) {
    const now = Date.now();
    if (req.session) {
      if (req.session.lastRequest && now - req.session.lastRequest < 1000) {
        return res.status(429).json({ error: "Too many requests" });
      }
      req.session.lastRequest = now;
    }
  }
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
