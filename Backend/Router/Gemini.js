const express = require("express");
const GeminiRouter = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { json } = require("body-parser");
const {FeedbackModel} = require("../model/db");

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
      const cleanJsonString = res.replace(/json|\n/g, "").trim().replace(/^`+|`+$/g, "").trim();
      const r = JSON.parse(cleanJsonString);
      console.log(r);
      if (r.relevant == true) {
        const feedback = {
          location: prompts.location, // Where the feedback was given
          scheme: prompts.scheme, // Scheme the feedback is related to
          relevant: r.relevant,
          useCategory:prompts.useCategory,
          point: r.point,
          rating:prompts.rating

        };

        // Store feedback in the database
        const newFeedback = new FeedbackModel(feedback);
        await newFeedback.save();
        return resq.json({success:true , message:"Feedback saved successfully"});
     
      }else {
        resq.json({success:false, message:"irrelevant feedback"})
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
  try{
  const { district, state } = req.body;
  console.log(district, state);
  const result = await model.generateContent("what is the total population , male and female  of bhopal district madhya pradesh in 2011 give answer as json object {total_population:value,female:value,male:value");
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


GeminiRouter.post("/explain", async (req, resq) => {
  const scheme ={
    
     
      scheme_name: "Kisan Vikas Patra",
      scheme_type: "Fixed Deposit",
      target_gender: "All",
      target_age_group: "All",
      min_investment: "1000",
      max_investment: "No limit",
      "roi": "7.2",
      "risk_level": "Low",
      "target_occupation": "Agriculture",
      "target_income_level": "Middle",
      "target_education_level": "Secondary",
      "tax_benefit": "No",
      "description": "A fixed deposit scheme primarily aimed at farmers, doubling the investment in a set time frame."
    
    
  }
  const location = {
    region_name: "Damoh",
    population_density: 50000,
    gender_ratio: 0.3,
    education_level: 53,
    income_level: 12,
    age_distribution: {
      young: 22,
      youth: 22,
      adult: 26,
      senior_citizen: 30
    },
    type: "Urban",
    occupation: "Farming",
    festive_season_month: ["April", "October"],
    wedding_season_month: ["November", "December"],
    admission_season_month: ["June", "July"],
  }
  
   
  const prompt =" i am providing you with a demographic data of location  and scheme parameter like a json object can u provide me why this scheme is best for this particular  location in json object only with 3 point like {point1:  , pont2:  , point3:} , "
  const result = await model.generateContent(prompt);

  try {
    // Assuming the response is an object, you may need to access the content like this:
    if (result && result.response && result.response.text) {
      console.log(result.response.text());
     
   
     

        // Store feedback in the database
      
    } 
  } catch (error) {
    console.error("Error:", error.message);
  }
});

// GeminiRouter.post("/explain", async (req, resq) => {

//   const prompt = "Role of the AI Assistant:You are analysing tool which analyse the given data and provide the analysis of the schemes based on the core it provide the score is basicaly of the provided by the trained recommedation system  also there would be considered to having scheme and their detailso whichich demographic filter is used here in filter ::{} the schemes are recokmmended on the basis of the location and gender by filtering and the recommendation sistem ### so analyse the data acordingly, the scheme details present in scheme {} .provide a JSON response with the following format :{ these are the analysis of the data:{ "points": {"Point1": "Provide the first insightful analysis or observatiohere.
//         "Point2": "Provide the second key finding or insight here.",
//         "Point3": "Provide the third relevant point here.",
//         "Point4": "Provide the fourth important takeaway here."
//  
  
//   const scheme ={
    
     
//       scheme_name: "Kisan Vikas Patra",
//       scheme_type: "Fixed Deposit",
//       target_gender: "All",
//       target_age_group: "All",
//       min_investment: "1000",
//       max_investment: "No limit",
//       "roi": "7.2",
//       "risk_level": "Low",
//       "target_occupation": "Agriculture",
//       "target_income_level": "Middle",
//       "target_education_level": "Secondary",
//       "tax_benefit": "No",
//       "description": "A fixed deposit scheme primarily aimed at farmers, doubling the investment in a set time frame."
    
    
//   }
//   const location = {
//     region_name: "Damoh",
//     population_density: 50000,
//     gender_ratio: 0.3,
//     education_level: 53,
//     income_level: 12,
//     age_distribution: {
//       young: 22,
//       youth: 22,
//       adult: 26,
//       senior_citizen: 30
//     },
//     type: "Urban",
//     occupation: "Farming",
//     festive_season_month: ["April", "October"],
//     wedding_season_month: ["November", "December"],
//     admission_season_month: ["June", "July"],
//   }
  
   
//   const prompt =" i am providing you with a demographic data of location  and scheme parameter like a json object can u provide me why this scheme is best for this particular  location in json object only with 3 point like {point1:  , pont2:  , point3:} , "
//   const result = await model.generateContent(prompt);

//   try {
//     // Assuming the response is an object, you may need to access the content like this:
//     if (result && result.response && result.response.text) {
//       console.log(result.response.text());
     
   
     

//         // Store feedback in the database
      
//     } 
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// });



module.exports = GeminiRouter;
