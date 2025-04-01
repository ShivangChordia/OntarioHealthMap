import React, { useEffect, useState } from "react";
import { fetchDiseaseTrends } from "../utils/api";
import * as d3 from "d3";

const Heatmap = ({ title, dataMatrix, years }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-center font-semibold text-lg mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Metric</th>
              {years.map((year) => (
                <th key={year} className="border p-2 bg-gray-100">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(dataMatrix).map(([metric, yearRates]) => (
              <tr key={metric}>
                <td className="border p-2 font-medium bg-gray-50">{metric}</td>
                {years.map((year) => {
                  const rate = yearRates[year];
                  const color = d3.interpolateBlues(rate ? rate / 100 : 0);
                  return (
                    <td
                      key={year}
                      className="border p-2 text-xs text-white"
                      style={{ backgroundColor: rate ? color : "#e5e7eb" }}
                      title={`${rate ?? "N/A"} per 100k`}
                    >
                      {rate ? rate.toFixed(1) : "0"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DiabetesHypertensionComparison = () => {
  const [diabetesData, setDiabetesData] = useState(null);
  const [hypertensionData, setHypertensionData] = useState(null);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [diabetes, hypertension] = await Promise.all([
        fetchDiseaseTrends("Chronic", "Diabetes"),
        fetchDiseaseTrends("Chronic", "Hypertension"),
      ]);
      console.log("📊 Diabetes Raw Data:", diabetes);
      console.log("📊 Hypertension Raw Data:", hypertension);
      setYears(
        [...new Set(diabetes.primary.map((d) => d.year))]
          .sort()
          .filter((y) => y >= 2013 && y <= 2022)
      );

      setDiabetesData(processData(diabetes));
      setHypertensionData(processData(hypertension));
    };

    loadData();
  }, []);

  const processData = (data) => {
    const matrix = {
      Incidence: {},
      Mortality: {},
      Prevalence: {},
    };

    data.primary.forEach((row) => {
      if (
        row.measure?.includes("Age-standardized rate") &&
        row.year >= 2013 &&
        row.year <= 2022
      ) {
        matrix.Incidence[row.year] = row.rate;
      }
    });

    data.secondary?.forEach((row) => {
      if (
        row.measure?.includes("Age-standardized rate") &&
        row.year >= 2013 &&
        row.year <= 2022
      ) {
        matrix.Mortality[row.year] = row.rate;
      }
    });

    data.tertiary?.forEach((row) => {
      if (
        row.measure?.includes("Age-standardized rate") &&
        row.year >= 2013 &&
        row.year <= 2022
      ) {
        matrix.Prevalence[row.year] = row.rate;
      }
    });

    return matrix;
  };

  return (
    <div className="col-span-2">
      <h2 className="text-2xl font-bold text-center mt-6 mb-4">
        Diabetes vs Hypertension Heatmap (2013–2022)
      </h2>

      {/* 🔍 Insight Section */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800 p-3 mb-6 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Compare Incidence, Mortality, and Prevalence rates of Diabetes and
            Hypertension over a decade.
          </li>
          <li>
            Darker colors indicate higher rates — helpful to detect spikes or
            patterns in chronic disease burden.
          </li>
          <li>
            Useful for identifying which disease shows more consistent rise, and
            in which metric.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diabetesData && (
          <Heatmap title="Diabetes" dataMatrix={diabetesData} years={years} />
        )}
        {hypertensionData && (
          <Heatmap
            title="Hypertension"
            dataMatrix={hypertensionData}
            years={years}
          />
        )}
      </div>
    </div>
  );
};

export default DiabetesHypertensionComparison;
