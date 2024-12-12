const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use('/public', express.static('public'));
const cors = require("cors");
const feedbackRouter = require("./Router/feedback");
const SearchRouter = require("./Router/SearchRouter");
const dashboarddataRouter = require("./Router/dashboarddataRouter");
const GeminiRouter = require("./Router/Gemini");
const {authrouter} = require("./Router/Authrouter");
const UserRouter = require("./Router/UserdetailRouter");
const EventsRouter = require("./Router/EventsRouter");
const demographicdataRouter = require("./Router/demographicdataRouter");
const ActiveSchemeRouter = require("./Router/ActiveSchemeRouter");

const AddSchemeRouter = require("./Router/AddSchemeRouter");
const AddnewlocationDataRouter = require("./Router/AddnewlocationDataRouter");
const GetSchemeRouter = require("./Router/GetSchemeRouter");
const GetRegionRouter = require("./Router/GetRegionRouter");
const AccountsData = require("./Router/AccountsData");
const AccountPredictionRouter = require("./Router/AccountPredictionRouter");
const TrackRouter = require("./Router/TrackRouter");
const UpdateAccountRouter = require("./Router/IncreaseAccount");
const deminiRouter = require("./Router/newgeminii");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
require("./model/db")
app.use(
  cors()
);

app.use("/search",SearchRouter);
app.use("/dashboard",dashboarddataRouter)
app.use("/feedback" , feedbackRouter);
app.use("/Gemini" , GeminiRouter);
app.use("/auth", authrouter);
app.use("/", UserRouter);
app.use("/events",EventsRouter)
app.use("/demographic-data",demographicdataRouter);
app.use("/ActiveScheme" ,ActiveSchemeRouter);
app.use('/Addscheme' , AddSchemeRouter);
app.use('/AddnewlocationData' ,AddnewlocationDataRouter )
app.use("/getScheme" , GetSchemeRouter);
app.use("/getregion" , GetRegionRouter);
app.use("/accounts" , AccountsData);
app.use("/PredictAccount" , AccountPredictionRouter)
app.use("/addTrack" , TrackRouter)
app.use("/updateAccountByOne" , UpdateAccountRouter);
app.use("/analyseGemini" , deminiRouter);


const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log("Server is running on port " + Port);
});


