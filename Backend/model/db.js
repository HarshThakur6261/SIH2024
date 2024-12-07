
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("dotenv").config();
const URL = process.env.URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("User database connected");
  })
  .catch((e) => {
    console.log("User database connection error", e);
  });

  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      profilePicture: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );

  const dashboardDataSchema = new mongoose.Schema({
    schemeName: { type: String, required: true },
    metrics: [
      {
        icon: { type: String, required: true },  // Store icon name or icon identifier
        title: { type: String, required: true },
        value: { type: String, required: true },
        progress: { type: Number, required: true },
      },
    ],
    registrationsOverYears: [
      {
        year: { type: Number, required: true },
        registrations: { type: Number, required: true },
      },
    ],
    lastUpdated: { type: Date, required: true },
  });

const feedbackSchema = new Schema({
  location: {
    type: String,  // Location where the feedback was given
    required: true
  },
  scheme: {
    type: String,  // Name or ID of the scheme the feedback is related to
    required: true
  },
  relevant: {
    type: Boolean,  // Flag to indicate if the feedback is relevant or not
    default: false
  },
  point: {
    type: String,  // Extracted key point or conclusion from the feedback, if relevant
    default: ""  // Empty if no relevant point found
  },
  createdAt: {
    type: Date,  // Timestamp of when the feedback was created
    default: Date.now
  }
});



const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
});




const DemographicsSchema = new mongoose.Schema({
  location: { type: String, required: true },
  population: {
    total: { type: Number, required: true },
    male: { type: Number, required: true },
    female: { type: Number, required: true },
    gender_ratio: { type: Number, required: true } // Females per 1000 males
  },
  age_group_population: {
    male: {
      "0-10": { type: Number, required: true },
      "11-59": { type: Number, required: true },
      "60+": { type: Number, required: true }
    },
    female: {
      "0-10": { type: Number, required: true },
      "11-59": { type: Number, required: true },
      "60+": { type: Number, required: true }
    }
  },
  occupation_based_population: {
    male: {
      agriculture: { type: Number, required: true },
      service: { type: Number, required: true },
      business: { type: Number, required: true },
      others: { type: Number, required: true },
      non_working: { type: Number, required: true }
    },
    female: {
      agriculture: { type: Number, required: true },
      service: { type: Number, required: true },
      business: { type: Number, required: true },
      others: { type: Number, required: true },
      non_working: { type: Number, required: true }
    }
  },
  seasonal_demand_for_money: [
    {
      month: { type: String, required: true },
      demand_score: { type: Number, required: true },
      demand_type: { type: String, required: true }
    }
  ]
});




const EventModel = mongoose.model('Event', eventSchema);



const DemographicModel = mongoose.model("Demographic", DemographicsSchema);

const DashboardModel = mongoose.model('Dashboard', dashboardDataSchema);
const FeedbackModel = mongoose.model('Feedback', feedbackSchema);
const UserModel = mongoose.model("UserModel", userSchema);

module.exports = {FeedbackModel , UserModel , DashboardModel,EventModel,DemographicModel};
