import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleError, handleSucess } from "../../../utils/utils";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Parallax, Pagination, Navigation } from "swiper/modules";
import "./styles.css";
import PieCornerRadius from "./charts/PieChart";
import Column from "./charts/BarChart";
import CylindricalColumn from "./charts/CylindricalColumn";
import OccupationBased from "./charts/OccupationBased";
import Doughnut from "./charts/OccupationBased";
import ApexChart from "./charts/HeatMap";
import SeasonalDemandChart from "./charts/CylindricalColumn";
import { Navigate, useLocation } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const GraphSwiper = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { locationName } = location.state || {};
  console.log("l", locationName);
  const [toggle, setToggle] = useState("Age Group-Based");

  const [ageData, setageData] = useState(null);
  const [currlocation, setcurrlocation] = useState("");
  const [fetchDistrict, setFetchingDistrict] = useState(true);
  const [Schemes, SetSchemes] = useState([]);

  const fetchingDistrict = async () => {
    const newPrompt = {
      address: locationName,
      myprompt:
        "You have been provided with a full address. Your task is to analyze the address and extract the district and state from it. Return only the following JSON object: { district: <district>, state: <state> }. Do not include any other data in the response. If the district or state cannot be determined, leave the corresponding field empty (e.g., district:  or state: )",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/Gemini/get-district",
        { newPrompt }
      );

      setFetchingDistrict(true);
      console.log(response.data);
      setcurrlocation(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingDistrict(false); // Stop loading for district
    }
  };
  console.log(currlocation.district);

  useEffect(() => {
    fetchingDistrict(locationName);
  }, []);
  const fetchSchemes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getScheme");
      if (response.data.success) {
        console.log(response.data.data);
        SetSchemes(response.data.data);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    fetchSchemes();
  }, []);

  // Fetch data from backend API

  // const fetchData = async () => {
  //   try {
  //     const location = currlocation.district;
  //     const response = await axios.get('http://localhost:3000/demographic-data/get', {
  //       params: {location}
  //     });
  //     console.log(response.data)
  //     setGraphData(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [currlocation])

  const fetchPopulationData = async () => {
    try {
      const Location = currlocation.district;
      const response = await axios.get(
        "http://localhost:3000/demographic-data/getPopulationData",
        {
          params: { Location },
        }
      );
      setGraphData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchData();
    fetchPopulationData();
  }, [currlocation]);

  const fetchAgeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/demographic-data/getAgedata"
      );
      console.log(response.data);
      setageData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAgeData();
  }, []);

  // Prepare data for charts
  const getPopulationData = () =>
    graphData
      ? [
          { name: "Male Population", value: graphData.Male },
          { name: "Female Population", value: graphData.Female },
        ]
      : [];

  const formattedData = getPopulationData().map((item) => ({
    x: item.name,
    y: item.value,
  }));

  // const getAgeGroupData = () =>
  //   graphData
  //     ? [
  //       { name: '0-10', Male: graphData.age_group_population.male['0-10'], Female: graphData.age_group_population.female['0-10'] },
  //       { name: '11-59', Male: graphData.age_group_population.male['11-59'], Female: graphData.age_group_population.female['11-59'] },
  //       { name: '60+', Male: graphData.age_group_population.male['60+'], Female: graphData.age_group_population.female['60+'] },
  //     ]
  //     : [];
  const getAgeGroupData = () =>
    ageData
      ? ageData.map((ageGroup) => ({
          name: ageGroup.Column1,
          Male: ageGroup.Males,
          Female: ageGroup.Females,
        }))
      : [];

  const getOccupationData = () =>
    graphData
      ? [
          {
            name: "Agriculture",
            Male: graphData.occupation_based_population.male.agriculture,
            Female: graphData.occupation_based_population.female.agriculture,
          },
          {
            name: "Service",
            Male: graphData.occupation_based_population.male.service,
            Female: graphData.occupation_based_population.female.service,
          },
          {
            name: "Business",
            Male: graphData.occupation_based_population.male.business,
            Female: graphData.occupation_based_population.female.business,
          },
          {
            name: "Others",
            Male: graphData.occupation_based_population.male.others,
            Female: graphData.occupation_based_population.female.others,
          },
          {
            name: "Non-working",
            Male: graphData.occupation_based_population.male.non_working,
            Female: graphData.occupation_based_population.female.non_working,
          },
        ]
      : [];

  const getColorByDemandType = (demandType) => {
    switch (demandType) {
      case "low":
        return "#C7FFA4"; // Light blue
      case "medium":
        return "#FEAA00"; // Yellow
      case "high":
        return "#89141C"; // Red
      default:
        return "#D5DBDB"; // Grey for unexpected values
    }
  };

  const seasonalDemandData = graphData
    ? graphData.seasonal_demand_for_money
    : [];
  const handleToggle = (option) => {
    setToggle(option); // Set the clicked option
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // if (fetchingDistrict) {
  //   return <p>Loading district data...</p>; // Loader for district fetching
  // }

  if (!graphData) {
    return <p>Error loading data.</p>;
  }

  const handleClick = async (schemeName, state, district) => {
    console.log(state, district);
    try {
      // Define the request body
      const requestBody = {
        schemeName,
        location: {
          state,
          district,
        },
      };
      console.log(requestBody);

      // Call the API endpoint
      const response = await axios.post(
        `http://localhost:3000/ActiveScheme/Apply`,
        requestBody
      );

      if (response.data.success == true) {
        handleSucess(response.data.message);
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with an error
        handleError(error.response.message);
      } else {
        // Network error or other issues
        handleError("Error: Unable to connect to the server.");
      }
    }
  };
  const handleAi = async() => {
    const a = {
      useid: "123",
      location: [currlocation.district],
    };
    const response = await axios.post("" , a)
    console.log(a)
    
  };

  return (
    <div className="bigCon">
      <button onClick={handleAi}>Ai Prediction</button>

      {fetchDistrict && (
        <div className="loader">
          <HashLoader
            style={{ position: "relative", right: "12%" }}
            size={50}
            color="#3A57E8"
          />
        </div>
      )}

      <div className="toggleButton">
        <button
          onClick={() => handleToggle("Age Group-Based")}
          className={`toggle-option ${
            toggle === "Age Group-Based" ? "active" : ""
          }`}
        >
          Age Group-Based
        </button>
        <button
          onClick={() => handleToggle("Population-Based")}
          className={`toggle-option ${
            toggle === "Population-Based" ? "active" : ""
          }`}
        >
          Population-Based
        </button>
      </div>
      <div className="graphCon">
        <div className="swipper">
          <Swiper
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
            }}
            speed={600}
            parallax={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Parallax, Pagination, Navigation]}
            className="mySwiper"
          >
            <div
              slot="container-start"
              className="parallax-bg"
              style={{
                backgroundImage:
                  "url(https://cdn.pixabay.com/photo/2023/04/10/19/49/ai-generated-7914562_960_720.jpg)",
                opacity: "0.4",
                // backgroundColor:"white"
              }}
              data-swiper-parallax="-23%"
            >
              {" "}
            </div>

            {/* Population Pie Chart */}
            <SwiperSlide>
              <div className="graphBox1">
                <p>Population Based Chart</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getPopulationData()}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={50}
                      fill="#8884d8"
                    >
                      {getPopulationData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                {/* <PieCornerRadius data={formattedData} /> */}
              </div>
            </SwiperSlide>

            {/* Age Group Bar Chart */}
            <SwiperSlide>
              <div className="graphBox1">
                <p>Age Group Chart</p>
                <ResponsiveContainer width="100%" height={370}>
                  <BarChart data={getAgeGroupData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45} // Adjust the angle to make it slanted
                      textAnchor="end"
                      fontSize={12} // Aligns the text correctly after rotation
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    {/* <Legend

                  // Aligns the legend at the top
                  margin={{ top: 40 }} // Adds margin at the top
                /> */}
                    <Bar dataKey="Male" fill="#8884d8" />
                    <Bar dataKey="Female" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>

                {/* <Column ageGroupData={getAgeGroupData()} /> */}
              </div>
            </SwiperSlide>

            {/* Occupation Bar Chart */}
            <SwiperSlide>
              <div className="OccupationgraphBox1">
                <p>Occupation Chart</p>
                {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getOccupationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#FFBB28" />
                <Bar dataKey="Female" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer> */}
                {/* <Doughnut data={getOccupationData()} /> */}
              </div>
            </SwiperSlide>

            {/* Heatmap for Seasonal Demand */}
            <SwiperSlide>
              <div className="SeasongraphBox1">
                <p>Seasonal Demand Heatmap</p>
                {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seasonalDemandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="demand_score"
                  fill="#8884d8" // Default fill color
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    const fillColor = getColorByDemandType(payload.demand_type); // Get the color based on demand type
                    return (
                      <rect x={x} y={y} width={width} height={height} fill={fillColor} />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer> */}
                {/* <SeasonalDemandChart seasonalDemandData={seasonalDemandData} /> */}
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="suggestionsList" style={{ overflow: scroll }}>
          <h4>List</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {Schemes.map((scheme) => (
              <div
                key={scheme._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  borderRadius: "8px",
                  width: "250px",
                }}
              >
                <h2>{scheme.scheme_name}</h2>
                <button
                  onClick={() => {
                    console.log(currlocation.state, currlocation.district);
                    handleClick(
                      "Hello",
                      currlocation.state,
                      currlocation.district
                    );
                  }}
                >
                  Add to Promote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GraphSwiper;
