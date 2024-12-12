const express = require("express");
const GeminiRouter = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { json } = require("body-parser");
const { FeedbackModel } = require("../model/db");

const genAI = new GoogleGenerativeAI("AIzaSyCn5UAt76WC7GZ--09qAzHd29mgz8G86TI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

GeminiRouter.post("/listen", async (req, resq) => {
  const prompts = req.body;

  const prompt = JSON.stringify(prompts);

  const result = await model.generateContent(prompt);

  try {
    // Assuming the response is an object, you may need to access the content like this:
    if (result && result.response && result.response.text) {
      console.log(result.response.text());
      const res = result.response.text();
      const cleanJsonString = res
        .replace(/json|\n/g, "")
        .trim()
        .replace(/^`+|`+$/g, "")
        .trim();
      const r = JSON.parse(cleanJsonString);
      console.log(r);
      if (r.relevant == true) {
        const feedback = {
          location: prompts.location, // Where the feedback was given
          scheme: prompts.scheme, // Scheme the feedback is related to
          relevant: r.relevant,
          useCategory: prompts.useCategory,
          point: r.point,
          rating: prompts.rating,
        };

        // Store feedback in the database
        const newFeedback = new FeedbackModel(feedback);
        await newFeedback.save();
        return resq.json({
          success: true,
          message: "Feedback saved successfully",
        });
      } else {
        resq.json({ success: false, message: "irrelevant feedback" });
        console.log("No text found in the response.");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});

GeminiRouter.post("/get-district/", async (req, res) => {
  try {
    const prompts = req.body;

    const prompt = JSON.stringify(prompts);

    const result = await model.generateContent(prompt);
    var r;
    // Assuming the response is an object, you may need to access the content like this:
    if (result && result.response && result.response.text) {
      const res = result.response.text();

      const cleanJsonString = res.replace(/json|\n/g, "").trim();
      const s = cleanJsonString.replace(/^`+|`+$/g, "").trim();

      r = JSON.parse(s);
      console.log(r);
    }
    res.json(r);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

GeminiRouter.post("/get-data/", async (req, res) => {
  try {
    const { district, state } = req.body;
    console.log(district, state);
    const result = await model.generateContent(
      "what is the total population , male and female  of bhopal district madhya pradesh in 2011 give answer as json object {total_population:value,female:value,male:value"
    );
    var r;
    // Assuming the response is an object, you may need to access the content like this:
    if (result && result.response && result.response.text) {
      const res = result.response.text();

      console.log(res);
    }
    res.json(r);
  } catch (error) {
    console.error("Error:", error.message);
  }
});



module.exports = GeminiRouter;
