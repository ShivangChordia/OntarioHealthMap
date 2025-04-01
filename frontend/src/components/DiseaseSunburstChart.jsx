import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchDiseaseData } from "../utils/api";

const DiseaseSunburstChart = ({ diseaseType }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const diseaseList =
          diseaseType === "Reproductive"
            ? ["HIV", "AIDS"]
            : ["Influenza", "Tuberculosis", "Covid"];

        let rawData = [];
        for (const disease of diseaseList) {
          const data = await fetchDiseaseData({
            disease: diseaseType,
            type: disease,
          });
          rawData = rawData.concat(data);
        }

        const nodes = [];
        const parents = [];
        const values = [];

        const regionSet = new Set();
        const diseaseSet = new Set();

        rawData.forEach(({ geography, type, year, cases }) => {
          if (!geography || !type || !year || !cases) return;

          const region = geography.trim();
          const disease = type.trim();
          const yearStr = year.toString();
          const regionKey = region;
          const diseaseKey = `${region}-${disease}`;
          const yearKey = `${region}-${disease}-${yearStr}`;

          regionSet.add(regionKey);
          diseaseSet.add(diseaseKey);

          nodes.push(yearKey);
          parents.push(diseaseKey);
          values.push(Number(cases));
        });

        regionSet.forEach((region) => {
          nodes.push(region);
          parents.push("");
          values.push(0); // placeholder
        });

        diseaseSet.forEach((disease) => {
          nodes.push(disease);
          parents.push(disease.split("-")[0]);
          values.push(0); // placeholder
        });

        setChartData({ labels: nodes, parents, values });
      } catch (error) {
        console.error("Error loading sunburst data:", error);
      }
    };

    loadData();
  }, [diseaseType]);

  if (!chartData.labels)
    return <p className="text-center text-gray-500">Loading chart...</p>;

  return (
    <div className="bg-white p-6 shadow-md rounded-lg col-span-2">
      <h2 className="text-xl font-bold text-center mb-4">
        Sunburst Chart: Region → Disease → Year
      </h2>
      <Plot
        data={[
          {
            type: "sunburst",
            labels: chartData.labels,
            parents: chartData.parents,
            values: chartData.values,
            branchvalues: "total",
            hoverinfo: "label+value+percent parent",
          },
        ]}
        layout={{
          margin: { l: 0, r: 0, t: 0, b: 0 },
          width: "100%",
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};

export default DiseaseSunburstChart;
