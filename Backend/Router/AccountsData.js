const express = require("express");
const { Account } = require("../model/db");
const AccountsData = express.Router();

AccountsData.post("/add", async (req, res) => {
    const { name, scheme, branch, district, state, predictedScore } = req.body;

    try {
        // Check if an account already exists for the same district and scheme
        let existingAccount = await Account.findOne({ district, scheme });

        if (existingAccount) {
            // Increment accountTracker if an existing account is found
            existingAccount.accountTracker += 1;
            await existingAccount.save();
        } else {
            // Create a new account document with accountTracker set to 1
            existingAccount = new Account({
                name,
                scheme,
                branch,
                district,
                state,
                predictedScore,
                accountTracker: 1,
            });
            await existingAccount.save();
        }

        res.status(201).json({
            message: "Account created successfully!",
            account: existingAccount,
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Error creating account", error });
    }
});

AccountsData.get("/total", async (req, res) => {
    try {
        const data = await Account.find({});
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ message: "Error fetching total accounts", error });
    }
});


module.exports = AccountsData;