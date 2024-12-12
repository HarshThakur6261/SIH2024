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
      icon: { type: String, required: true }, // Store icon name or icon identifier
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
    type: String, // Location where the feedback was given
    required: true,
  },
  scheme: {
    type: String, // Name or ID of the scheme the feedback is related to
    required: true,
  },
  relevant: {
    type: Boolean, // Flag to indicate if the feedback is relevant or not
    default: false,
  },

  point: {
    type: String, // Extracted key point or conclusion from the feedback, if relevant
    default: "", // Empty if no relevant point found
  },
  rating: { type: Number, required: true, min: 0, max: 5 },
  userCategory: {
    type: String,
    enum: ["Visitor", "Official", "Stakeholder", "Other"],
    default: "Visitor",
  },

  createdAt: {
    type: Date, // Timestamp of when the feedback was created
    default: Date.now,
  },
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
    gender_ratio: { type: Number, required: true }, // Females per 1000 males
  },
  age_group_population: {
    male: {
      "0-10": { type: Number, required: true },
      "11-59": { type: Number, required: true },
      "60+": { type: Number, required: true },
    },
    female: {
      "0-10": { type: Number, required: true },
      "11-59": { type: Number, required: true },
      "60+": { type: Number, required: true },
    },
  },
  occupation_based_population: {
    male: {
      agriculture: { type: Number, required: true },
      service: { type: Number, required: true },
      business: { type: Number, required: true },
      others: { type: Number, required: true },
      non_working: { type: Number, required: true },
    },
    female: {
      agriculture: { type: Number, required: true },
      service: { type: Number, required: true },
      business: { type: Number, required: true },
      others: { type: Number, required: true },
      non_working: { type: Number, required: true },
    },
  },
  seasonal_demand_for_money: [
    {
      month: { type: String, required: true },
      demand_score: { type: Number, required: true },
      demand_type: { type: String, required: true },
    },
  ],
});
const populationSchema = new mongoose.Schema(
  {
    Location: {
      type: String,
      required: true,
    },
    Total: {
      type: Number,
      required: true,
    },
    Male: {
      type: Number,
      required: true,
    },
    Female: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const accountSchema = new mongoose.Schema({
  name: String,
  scheme: String,
  branch: String,
  district: String,
  state: String,
  accountTracker: {
    type: Number,
    default: 0, // Initial value set to 0
  },
  predictedScore: {
    type: Number, // Storing the predicted score as a number
    default: null, // Default value is null if no score is predicted yet
  },
});

const ageGroupSchema = new mongoose.Schema({
  ageGroup: {
    type: String, // Age group or range (e.g., "0-4", "5-9", "80")
    required: true,
  },
  persons: {
    type: Number, // Total number of persons in the specified age group
    required: true,
  },
  percentageTotal: {
    type: Number, // Percentage of total population in this age group
    required: true,
  },
  males: {
    count: {
      type: Number, // Number of males in the age group
      required: true,
    },
    percentage: {
      type: Number, // Percentage of male population in this age group
      required: true,
    },
  },
  females: {
    count: {
      type: Number, // Number of females in the age group
      required: true,
    },
    percentage: {
      type: Number, // Percentage of female population in this age group
      required: true,
    },
  },
});



const schemeSchema = new mongoose.Schema({
  scheme_name: { type: String, required: true },
  scheme_type: { type: String, required: true },
  description: { type: String, required: true }, // Added description
  target_gender: { type: String, enum: ['Male', 'Female', 'All'], required: true },
  target_age_group: { type: String, required: true },
  min_investment: { type: String, required: true },
  max_investment: { type: String, required: true }, 
  roi: { type: String, required: true },
  risk_level: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  target_occupation: { type: String, required: true },
  target_income_level: { type: String, required: true },
  target_education_level: { type: String, required: true },
  tax_benefit: { type: String, enum: ['Yes', 'No'], required: true }
});

const regionSchema = new mongoose.Schema({
  region_name: {
    type: String,
    required: true,
    trim: true,
  },
  population_density: {
    type: Number,
    required: true,
    min: 0,
  },
  gender_ratio: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  education_level: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  income_level: {
    type: Number, // Converted to number
    required: true,
    min: 0,
    max: 100, // Represents percentage
    validate: {
      validator: function (v) {
        return v <= 100 && v >= 0;
      },
      message: (props) =>
        `${props.value} must be a valid percentage between 0 and 100.`,
    },
  },
  age_distribution: {
    young: {
      type: Number, // Converted to number
      required: true,
      min: 0,
      max: 100,
    },
    youth: {
      type: Number, // Converted to number
      required: true,
      min: 0,
      max: 100,
    },
    adult: {
      type: Number, // Converted to number
      required: true,
      min: 0,
      max: 100,
    },
    senior_citizen: {
      type: Number, // Converted to number
      required: true,
      min: 0,
      max: 100,
    },
  },
  type: {
    type: String,
    required: true,
    enum: ["Rural", "Urban", "Semi-Urban"], // Validating type
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  festive_season_month: {
    type: [String], // Array of months
    validate: {
      validator: function (v) {
        return v.every((month) =>
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].includes(month)
        );
      },
      message: (props) => `${props.value} contains invalid month(s).`,
    },
  },
  wedding_season_month: {
    type: [String], // Array of months
    validate: {
      validator: function (v) {
        return v.every((month) =>
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].includes(month)
        );
      },
      message: (props) => `${props.value} contains invalid month(s).`,
    },
  },
  admission_season_month: {
    type: [String], // Array of months
    validate: {
      validator: function (v) {
        return v.every((month) =>
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].includes(month)
        );
      },
      message: (props) => `${props.value} contains invalid month(s).`,
    },
  },
});



// Define the Track schema
const trackSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  totalAccounts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Track model
const Track = mongoose.model('Track', trackSchema);




const AccountPredictionSchema = new mongoose.Schema({
  

    CityName: {
        type: String,
      },
      SukanyaSamriddhiYojana: {
        type: Number,
        minimum: 0
      },
      KisanVikasPatra: {
        type: Number,
        minimum: 0
      },
      SeniorCitizenSavingsScheme: {
        type: Number,
        minimum: 0
      },
      PostOfficeSavingsAccount: {
        type: Number,
        minimum: 0
      },
      PostOfficeMonthlyIncomeScheme: {
        type: Number,
        minimum: 0
      },
      PublicProvidentFund: {
        type: Number,
        minimum: 0
      },
      MahilaSammanSavingsCertificate: {
        type: Number,
        minimum: 0
      },
      PostOfficeTimeDepositAccount: {
        type: Number,
        minimum: 0
      },
      PMCARESforChildrenScheme: {
        type: Number,
        minimum: 0
      },
      PostOfficeRecurringDepositAccount: {
        type: Number,
        minimum: 0
      },
      NationalSavingsCertificate: {
        type: Number,
        minimum: 0
      },
      PostalLifeInsurance: {
        type: Number,
        minimum: 0
      },
      RuralPostalLifeInsurance: {
        type: Number,
        minimum: 0
      },
      FixedDeposits: {
        type: Number,
        minimum: 0
      },
      RecurringDeposits: {
        type: Number,
        minimum: 0
      },
})
const AccountPredictionModel = mongoose.model("accountprediction" , AccountPredictionSchema);
const Account = mongoose.model("Account", accountSchema);




const RegionModel = mongoose.model("Region", regionSchema);

const SchemeModel = mongoose.model("Scheme", schemeSchema);

const AgeGroup = mongoose.model("AgeGroup", ageGroupSchema);
const Population = mongoose.model("Population", populationSchema);
const ActiveSchemeSchema = new mongoose.Schema({
  schemeName: { type: String, required: true }, // Name of the scheme
  state: { type: String, required: true },
  districts: [
    {
      districtName: { type: String, required: true }, // District name
      isActive: { type: Boolean, default: true }, // Whether the scheme is active in this district
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp for record creation
});





const ActiveSchemeModel = mongoose.model("ActiveScheme", ActiveSchemeSchema);

const EventModel = mongoose.model("Event", eventSchema);

const DemographicModel = mongoose.model("Demographic", DemographicsSchema);

const DashboardModel = mongoose.model("Dashboard", dashboardDataSchema);
const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
const UserModel = mongoose.model("UserModel", userSchema);

module.exports = {
  FeedbackModel,
  UserModel,
  DashboardModel,
  EventModel,
  DemographicModel,
  Population,
  AgeGroup,
  ActiveSchemeModel,
  SchemeModel,
  RegionModel,
  Account,
  AccountPredictionModel,
  Track,
};
