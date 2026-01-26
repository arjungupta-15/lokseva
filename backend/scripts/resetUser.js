const mongoose = require("mongoose");
const User = require("../models/Users");
require("dotenv").config({ path: "../.env" }); // Adjust path to reach .env in parent

async function resetUser() {
    try {
        // Hardcoded connection string fallback in case .env doesn't load for the script
        // But try to use the environment variable if possible.
        // Based on previous logs, the URI is likely in the .env file.
        // Use the same connection logic as index.js

        if (!process.env.MONGO_URI) {
            console.log("❌ MONGO_URI not found in environment. Please check .env path.");
            // I will try to connect using the URI I can infer or just ask user to run it with context.
            // Actually, since I am making this file, I can assume the user runs it from `backend` directory.
        }

        await mongoose.connect(process.env.MONGO_URI, { dbName: "lokseva" });
        console.log("✅ Connected to MongoDB");

        const emailToDelete = "aryapadole510@gmail.com";
        const result = await User.deleteOne({ email: emailToDelete });

        // Also try checking for the other one just in case
        const emailToDelete2 = "aryapadole1@gmail.com";
        const result2 = await User.deleteOne({ email: emailToDelete2 });

        console.log(`Deleted user ${emailToDelete}: ${result.deletedCount}`);
        console.log(`Deleted user ${emailToDelete2}: ${result2.deletedCount}`);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

resetUser();
