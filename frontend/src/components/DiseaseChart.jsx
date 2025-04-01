import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DiseaseChart = ({ data, title }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(chartRef.current).select("svg").remove(); // Clear old chart

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.rate)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.rate))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#1E90FF")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(title);
  }, [data]);

  return <div ref={chartRef} className="w-full h-64"></div>;
};

export default DiseaseChart;
