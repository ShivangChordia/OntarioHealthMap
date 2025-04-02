import React, { useMemo } from "react";
import * as d3 from "d3";

const TileHeatmap = ({ diseaseData }) => {
  const years = useMemo(() => {
    return Array.from(new Set(diseaseData.primary.map((d) => d.year))).sort();
  }, [diseaseData]);

  // 🔹 Step 1: Calculate average rate per region
  const topRegions = useMemo(() => {
    const regionSums = {};
    const regionCounts = {};

    diseaseData.primary.forEach((d) => {
      if (!regionSums[d.geography]) {
        regionSums[d.geography] = 0;
        regionCounts[d.geography] = 0;
      }
      regionSums[d.geography] += d.rate;
      regionCounts[d.geography] += 1;
    });

    const avgRates = Object.entries(regionSums).map(([region, sum]) => ({
      region,
      avgRate: sum / regionCounts[region],
    }));

    return avgRates
      .sort((a, b) => b.avgRate - a.avgRate)
      .slice(0, 10)
      .map((d) => d.region);
  }, [diseaseData]);

  // 🔹 Step 2: Prepare rate map for quick lookup
  const rateMap = useMemo(() => {
    const map = {};
    diseaseData.primary.forEach((d) => {
      const key = `${d.geography}_${d.year}`;
      map[key] = d.rate;
    });
    return map;
  }, [diseaseData]);

  const colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(Object.values(rateMap))])
    .interpolator(d3.interpolateOrRd);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg overflow-x-auto">
      <h2 className="text-lg font-semibold text-center mb-4">
        Incidence Rate Tile Heatmap by Region × Year (Top 10)
      </h2>

      {/* 🔍 Insight Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 p-3 mb-4 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Focuses on top 10 regions with highest average incidence rates.</li>
          <li>
            Helps identify regional trends and shifts over time using color
            intensity.
          </li>
          <li>
            Darker cells indicate higher rates — watch for consistent hotspots.
          </li>
        </ul>
      </div>

      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Region</th>
            {years.map((year) => (
              <th key={year} className="border p-2 bg-gray-100">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topRegions.map((region) => (
            <tr key={region}>
              <td className="border p-2 font-medium bg-gray-50">{region}</td>
              {years.map((year) => {
                const rate = rateMap[`${region}_${year}`];
                const color = rate ? colorScale(rate) : "#f0f0f0";
                return (
                  <td
                    key={year}
                    className="border p-2 text-xs text-white"
                    style={{ backgroundColor: color }}
                    title={`${rate?.toFixed(1) ?? "N/A"} per 100k`}
                  >
                    {rate ? rate.toFixed(1) : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TileHeatmap;
