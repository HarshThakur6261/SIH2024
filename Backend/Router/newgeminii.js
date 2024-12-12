const express = require("express");
const deminiRouter = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { json } = require("body-parser");


const genAI = new GoogleGenerativeAI("AIzaSyCn5UAt76WC7GZ--09qAzHd29mgz8G86TI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
deminiRouter.post("/", async (req, res) => {
  const { schemeName, district, target, totalAccount } = req.body;

  const prompt = ` i am providing you with a name of city${district} and the post office scheme ${schemeName} that apllied on that city and the total account ${totalAccount}opened after promoting a given scheme in that locatioin i also give u with target number ${target} of acccount that need to be opened can u give me reason based on your analysis why the scheme doesnot able to achieve its target account open give me 3 point reason in json object  only no other text give reason for some of demographic data `;

  const result = await model.generateContent(prompt);

  try {
    // Assuming the response is an object, you may need to access the content like this:
    if (result && result.response && result.response.text) {
      console.log(result.response.text());
      const resq = result.response.text();
      const cleanJsonString = resq
        .replace(/json|\n/g, "")
        .trim()
        .replace(/^`+|`+$/g, "")
        .trim();
      const r = JSON.parse(cleanJsonString);
      console.log(r);

      res.json({r});
    }
   
  } catch (error) {
    console.error("Error:", error.message);
  }
});
module.exports = deminiRouter;