import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchGeoData } from "../utils/api";

const OntarioCancerMap = ({ diseaseData }) => {
  const [geoData, setGeoData] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState(
    "Crude rate (both sexes)"
  );

  useEffect(() => {
    const loadGeo = async () => {
      const geoJSON = await fetchGeoData();
      setGeoData(geoJSON);
    };
    loadGeo();
  }, []);

  const getRateForRegion = (regionName) => {
    const match = diseaseData.primary.find(
      (d) =>
        d.geography.toLowerCase().includes(regionName.toLowerCase()) &&
        d.measure.includes(selectedMeasure)
    );
    return match ? match.rate : null;
  };

  const getColor = (rate) => {
    return rate > 100
      ? "#7f0000"
      : rate > 75
      ? "#b30000"
      : rate > 50
      ? "#e34a33"
      : rate > 25
      ? "#fc8d59"
      : rate > 10
      ? "#fdbb84"
      : "#fef0d9";
  };

  const styleFeature = (feature) => {
    const name = feature.properties.NAME_ENG;
    const rate = getRateForRegion(name);
    return {
      fillColor: rate ? getColor(rate) : "#ccc",
      weight: 1,
      opacity: 1,
      color: "#333",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.NAME_ENG;
    const rate = getRateForRegion(name);
    const tooltipContent = `
      <strong>${name}</strong><br/>
      ${selectedMeasure}<br/>
      <b>${rate ? rate.toFixed(2) : "No data"}</b> per 100,000
    `;
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: "top",
    });
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-4">
        Geographic Distribution of Cancer Incidence
      </h2>

      {/* Dropdown for selecting measure */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedMeasure}
          onChange={(e) => setSelectedMeasure(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md"
        >
          <option value="Age-standardized rate (males)">
            Age-Standardized Rate (Males)
          </option>
          <option value="Age-standardized rate (females)">
            Age-Standardized Rate (Females)
          </option>
        </select>
      </div>

      {geoData ? (
        <MapContainer
          center={[50, -85]}
          zoom={5}
          minZoom={5}
          maxZoom={5}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          className="h-[500px] w-full rounded-md"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      ) : (
        <p className="text-center text-gray-500">Loading map...</p>
      )}
    </div>
  );
};

export default OntarioCancerMap;
