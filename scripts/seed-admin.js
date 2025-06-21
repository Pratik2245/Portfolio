require("dotenv").config({ path: ".env.local" });

const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Please set MONGODB_URI in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function seedAdmin() {
  try {
    await client.connect();
    const db = client.db("portfolio");

    const existingAdmin = await db
      .collection("admin_users")
      .findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Mh15ee02@@", 12);

    const adminUser = {
      username: "Pratik",
      email: "paithankarpratik3@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    };

    await db.collection("admin_users").insertOne(adminUser);
    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  } finally {
    await client.close();
  }
}

seedAdmin();
