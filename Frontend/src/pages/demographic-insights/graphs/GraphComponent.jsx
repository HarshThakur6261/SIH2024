import React, { useEffect, useState } from "react";

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
} from "recharts";
import { Cell } from "recharts";

import Modal from "react-modal";
import styles from "./GraphComponent.module.css";
import villageData from "./villageData";
import { useLocation, useNavigate } from "react-router-dom";

const GraphComponent = () => {
  const [hoveredChart, setHoveredChart] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getPopulationData = () => [
    { name: "Male Population", value: villageData.demographics.totalPopulation.male },
    { name: "Female Population", value: villageData.demographics.totalPopulation.female },
  ];

  const getAgeGroupData = () => {
    const { ageGroups } = villageData.demographics;
    return Object.keys(ageGroups).map((group) => ({
      name: group,
      Male: ageGroups[group].male,
      Female: ageGroups[group].female,
    }));
  };

  const getOccupationData = () => [
    {
      name: "Agricultural Labourers",
      Male: villageData.occupations.agriculturalLabourers.main.male + villageData.occupations.agriculturalLabourers.marginal.male,
      Female: villageData.occupations.agriculturalLabourers.main.female + villageData.occupations.agriculturalLabourers.marginal.female,
    },
    {
      name: "Non-working Population",
      Male: villageData.occupations.nonWorkingPopulation.male,
      Female: villageData.occupations.nonWorkingPopulation.female,
    },
  ];

  const openModal = (chartType) => setHoveredChart(chartType);
  const closeModal = () => setHoveredChart(null);
  const location = useLocation();
  const navigate=useNavigate();
  const { locationName, locationpoint } = location.state || {};
  console.log(locationName);
  console.log(locationpoint);
  const [currlocation,setcurrlocation]=useState("");

  useEffect(()=>{
    if (locationName) {
      console.log(locationName); 
      console.log(locationpoint);
    
  
      const words = locationName.split(",");
      const lastThreeWords = words.slice(-5);
    setcurrlocation(lastThreeWords[0])
  
      console.log(lastThreeWords); 
    
      
      const lastThreeWordsObject = {
       city: lastThreeWords[0],
        state: lastThreeWords[1],
        country: lastThreeWords[2],
      };
    
      console.log(lastThreeWordsObject);
    }
  },[currlocation]);

const handleNavigate=()=>{
  navigate('/recommendations')
}
  return (
    <div className={styles.bigCon}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          Demographic Insights for {currlocation}
        </h2>     
        
      </div>
      <button onClick={handleNavigate} className={styles.recommendationbtn}>Show Recommendations</button>
      <div className={styles.chartContainer}>
        {/* Population Pie Chart */}
        <div className={`${styles.chartBox} ${styles.firstChart}`} onClick={() => openModal("population")}>

          <ResponsiveContainer width="100%" height={200}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="square"
                formatter={(value, entry) => `${value} (${entry.payload.value})`}
              />
            </PieChart>
          </ResponsiveContainer>
          <p>Population Based Chart</p>

        </div>


        {/* Age Group Bar Chart */}
        <div className={`${styles.chartBox} ${styles.secondChart}`} onClick={() => openModal("ageGroup")}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getAgeGroupData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Male" fill="#8884d8" />
              <Bar dataKey="Female" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <p>Age Group Chart</p>
        </div>

        {/* Occupation Bar Chart */}
        <div className={`${styles.chartBox} ${styles.thirdChart}`} onClick={() => openModal("occupation")}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getOccupationData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Male" fill="#FFBB28" />
              <Bar dataKey="Female" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
          <p>Occupation Chart</p>
        </div>
      </div>

      {/* Modal */}

      <Modal
        isOpen={hoveredChart !== null}
        onRequestClose={closeModal}
        className={styles.modal}
      >
        <div >
          {hoveredChart === "population" && (
            <ResponsiveContainer width="100%" height={200}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="square"
                  formatter={(value, entry) => `${value} (${entry.payload.value})`}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {hoveredChart === "ageGroup" && (
            <ResponsiveContainer width="80%" height={350}>
              <BarChart data={getAgeGroupData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#8884d8" />
                <Bar dataKey="Female" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {hoveredChart === "occupation" && (
            <ResponsiveContainer width="80%" height={350}>
              <BarChart data={getOccupationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#FFBB28" />
                <Bar dataKey="Female" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          )}

          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>

    </div>
  );
};

export default GraphComponent;
