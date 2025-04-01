import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const RadialDiseaseChart = ({ diseaseData, title }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!diseaseData?.primary?.length) return;

    const svgWidth = 500;
    const svgHeight = 500;
    const radius = Math.min(svgWidth, svgHeight) / 2;

    const svg = d3
      .select(chartRef.current)
      .html("")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);

    // ✅ Step 1: Create nested hierarchy manually
    const nested = d3.group(
      diseaseData.primary,
      (d) => d.geography,
      (d) => d.type,
      (d) => d.year
    );

    const root = {
      name: "Ontario",
      children: Array.from(nested, ([region, diseases]) => ({
        name: region,
        children: Array.from(diseases, ([disease, years]) => ({
          name: disease,
          children: Array.from(years, ([year, records]) => {
            const avgRate = d3.mean(records, (r) => r.rate) || 0;
            return {
              name: year,
              value: avgRate,
            };
          }),
        })),
      })),
    };

    // ✅ Step 2: Create hierarchy and partition
    const hierarchy = d3
      .hierarchy(root)
      .sum((d) => d.value || 0)
      .sort((a, b) => b.value - a.value);

    const partition = d3.partition().size([2 * Math.PI, radius]);
    const rootPartitioned = partition(hierarchy);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 100]);

    svg
      .selectAll("path")
      .data(rootPartitioned.descendants().filter((d) => d.depth > 0))
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.value || 0))
      .style("stroke", "#fff")
      .append("title")
      .text(
        (d) =>
          `${d
            .ancestors()
            .map((n) => n.data.name)
            .reverse()
            .join(" → ")}\nRate: ${d.value?.toFixed(1) ?? "N/A"}`
      );
  }, [diseaseData]);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-4">
        {title || "Disease Spread Sunburst"}
      </h2>
      <div ref={chartRef} className="flex justify-center items-center"></div>
    </div>
  );
};

export default RadialDiseaseChart;
