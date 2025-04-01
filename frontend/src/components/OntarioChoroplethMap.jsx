import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchGeoData } from "../utils/api";

// Generate 5 shades from light to dark red
const generateColorBins = (min, max) => {
  const bins = [];
  const step = (max - min) / 5;
  for (let i = 0; i < 5; i++) {
    const start = (min + step * i).toFixed(1);
    const end = (min + step * (i + 1)).toFixed(1);
    bins.push({
      range: [parseFloat(start), parseFloat(end)],
      color: `rgba(255, ${210 - i * 40}, ${210 - i * 40}, 0.85)`,
    });
  }
  return bins;
};

const OntarioChoroplethMap = ({
  diseaseData,
  title,
  measureOptions,
  dataKey,
}) => {
  const [geoData, setGeoData] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState(measureOptions[0]);
  const [colorBins, setColorBins] = useState([]);

  // 🔄 Load GeoJSON once
  useEffect(() => {
    const loadGeo = async () => {
      const geoJSON = await fetchGeoData();
      setGeoData(geoJSON);
    };
    loadGeo();
  }, []);

  // ✅ Normalize & map region names to rates
  const ratesByRegion = useMemo(() => {
    const regionRates = {};
    diseaseData[dataKey]?.forEach((entry) => {
      const measureMatch =
        entry.measure &&
        entry.measure.toLowerCase().includes(selectedMeasure.toLowerCase());

      if (measureMatch) {
        const region = entry.geography?.trim().toLowerCase();
        if (region) regionRates[region] = entry.rate;
      }
    });
    return regionRates;
  }, [diseaseData, selectedMeasure, dataKey]);

  // 🎨 Generate color bins dynamically
  useEffect(() => {
    const values = Object.values(ratesByRegion).filter(
      (val) => val !== null && val !== undefined && !isNaN(val)
    );
    if (values.length === 0) return;
    const min = Math.min(...values);
    const max = Math.max(...values);
    setColorBins(generateColorBins(min, max));
  }, [ratesByRegion]);

  const getColor = (rate) => {
    for (const bin of colorBins) {
      if (rate >= bin.range[0] && rate <= bin.range[1]) return bin.color;
    }
    return "#f0f0f0"; // fallback
  };

  const styleFeature = (feature) => {
    const name = feature.properties.NAME_ENG?.trim().toLowerCase();
    const rate = ratesByRegion[name];
    return {
      fillColor: rate ? getColor(rate) : "#e0e0e0",
      weight: 1,
      opacity: 1,
      color: "#333",
      fillOpacity: 0.85,
    };
  };

  const onEachFeature = (feature, layer) => {
    const rawName = feature.properties.NAME_ENG;
    const name = rawName?.trim().toLowerCase();
    const rate = ratesByRegion[name];
    const tooltipContent = `
      <strong>${rawName}</strong><br/>
      ${selectedMeasure}<br/>
      <b>${rate ? rate.toFixed(2) : "No data"}</b> per 100,000
    `;
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: "top",
    });
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg z-0">
      <h2 className="text-lg font-semibold text-center mb-4">
        {title} {dataKey === "primary" ? "Incidence" : "Mortality"} Map
      </h2>

      {/* 🔍 Insight Section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 p-3 mb-4 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Visualize how disease incidence or mortality varies across Ontario’s
            public health regions.
          </li>
          <li>
            Darker areas indicate higher rates — helpful for detecting hotspots
            needing intervention.
          </li>
          <li>
            Useful for regional resource planning and comparing geographic
            health burdens.
          </li>
        </ul>
      </div>

      {/* 🔘 Measure selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {measureOptions.map((measure) => (
          <button
            key={measure}
            onClick={() => setSelectedMeasure(measure)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              selectedMeasure === measure
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {measure}
          </button>
        ))}
      </div>

      {/* 🗺 Map Display */}
      {geoData ? (
        <div className="relative">
          <MapContainer
            center={[50, -85]}
            zoom={5}
            minZoom={5}
            maxZoom={5}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            zoomControl={false}
            className="h-[500px] w-full rounded-md z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON
              data={geoData}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          </MapContainer>

          {/* 🧭 Legend */}
          <div className="absolute top-4 right-4 bg-white p-3 shadow rounded-md text-sm text-gray-700 space-y-1 z-10">
            <h4 className="font-semibold text-center mb-1">Legend</h4>
            {colorBins.map((bin, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-5 h-4 rounded-sm"
                  style={{ backgroundColor: bin.color }}
                />
                <span>
                  {bin.range[0].toFixed(0)} – {bin.range[1].toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading map...</p>
      )}
    </div>
  );
};

export default OntarioChoroplethMap;
