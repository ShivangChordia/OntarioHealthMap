"use client";

import { useEffect } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { getColorForRate } from "../utils/color-utils";
import L from "leaflet";

const MapView = ({
  geoData,
  geoJsonKey,
  phuData,
  healthData,
  selectedDisease,
  selectedCancerType,
  selectedChronicType,
  setSelectedRegion,
  minRate,
  maxRate,
}) => {
  // Get the appropriate type label based on the selected disease
  const getTypeLabel = () => {
    if (selectedDisease === "Cancer") return selectedCancerType.toUpperCase();
    if (selectedDisease === "Chronic") return selectedChronicType;
    return selectedDisease;
  };

  const onEachFeature = (feature, layer) => {
    if (!feature.properties || !feature.properties.NAME_ENG) {
      console.warn("⚠️ Missing NAME_ENG in feature:", feature);
      return;
    }

    const phuNameGeoJSON = feature.properties.NAME_ENG.trim().toLowerCase();

    // Find PHU Data
    const matchingPHU = phuData.find(
      (data) => data.phu_name.trim().toLowerCase() === phuNameGeoJSON
    );

    // Find Health Data
    const matchingHealthData = healthData.filter(
      (entry) => entry.geography.trim().toLowerCase() === phuNameGeoJSON
    );

    // Log matched data
    console.log(
      `📌 Matching ${selectedDisease} Data for`,
      phuNameGeoJSON,
      matchingHealthData
    );

    // Add Click Event to Show Data in Right Panel
    layer.on("click", () => {
      setSelectedRegion({
        name: feature.properties.NAME_ENG,
        phu: matchingPHU || {},
        healthData: matchingHealthData || [],
      });
    });

    // Popup with basic info
    let popupContent = `<b>${phuNameGeoJSON.toUpperCase()}</b><br/>`;

    if (matchingPHU) {
      popupContent += `
        <b>Region:</b> ${matchingPHU.region || "N/A"}<br/>
        <b>Population:</b> ${matchingPHU.population || "N/A"}<br/>
        <b>Median Income:</b> $${matchingPHU.median_total_income || "N/A"}<br/>
      `;
    } else {
      popupContent += `<i>No demographic data available.</i><br/>`;
    }

    if (matchingHealthData.length > 0) {
      popupContent += `
        <hr/>
        <b>Type:</b> ${getTypeLabel()}<br/>
        <b>Rate:</b> ${matchingHealthData[0].rate || "N/A"} per 100,000<br/>
        <b>Year:</b> ${matchingHealthData[0].year || "N/A"}<br/>
      `;
    } else {
      popupContent += `<i>No ${selectedDisease.toLowerCase()} data available.</i>`;
    }

    layer.bindPopup(popupContent);
  };

  const styleFeature = (feature) => {
    const phuName = feature.properties.NAME_ENG;
    const match = healthData.find((entry) => entry.geography === phuName);
    const rate = match ? match.rate : 0; // Default to 0 if no data

    return {
      fillColor: getColorForRate(rate, minRate, maxRate),
      weight: 1,
      opacity: 1,
      color: "#000", // Border color
      fillOpacity: 0.7,
    };
  };

  return (
    <>
      <GeoJSON
        key={geoJsonKey}
        data={geoData}
        onEachFeature={onEachFeature}
        style={styleFeature}
      />
      <MapLegend
        minRate={minRate}
        maxRate={maxRate}
        selectedDisease={selectedDisease}
      />
    </>
  );
};

// Legend Component
const MapLegend = ({ minRate, maxRate, selectedDisease }) => {
  const map = useMap();

  // Get the appropriate rate label based on the selected disease
  const getRateLabel = () => {
    if (selectedDisease === "Cancer") return "Incidence Rate";
    if (selectedDisease === "Chronic") return "Prevalence Rate";
    if (selectedDisease === "Smoking") return "Usage Rate";
    if (selectedDisease === "Reproductive") return "Health Rate";
    if (selectedDisease === "Overall Health") return "Health Index";
    return "Rate";
  };

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [
        minRate,
        minRate + (maxRate - minRate) * 0.2,
        minRate + (maxRate - minRate) * 0.4,
        minRate + (maxRate - minRate) * 0.6,
        minRate + (maxRate - minRate) * 0.8,
        maxRate,
      ];

      div.innerHTML += `<strong> ${getRateLabel()} </strong><br>`;
      for (let i = 0; i < grades.length - 1; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColorForRate(grades[i], minRate, maxRate) +
          '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
          Math.round(grades[i]) +
          (grades[i + 1] ? " - " + Math.round(grades[i + 1]) + "<br>" : "+");
      }
      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [minRate, maxRate, map, selectedDisease]);

  return null;
};

export default MapView;
