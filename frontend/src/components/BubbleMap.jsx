import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import { fetchGeoData } from "../utils/api";
import "leaflet/dist/leaflet.css";

const BubbleMap = ({ diseaseData, dataKey = "primary" }) => {
  const [geoData, setGeoData] = useState(null);

  const ontarioCenter = [50, -85];
  const initialZoom = 5.3;

  useEffect(() => {
    const loadGeoData = async () => {
      const geo = await fetchGeoData();
      setGeoData(geo);
    };
    loadGeoData();
  }, []);

  const filteredData =
    Array.isArray(diseaseData[dataKey]) && diseaseData[dataKey].length > 0
      ? diseaseData[dataKey].filter(
          (entry) =>
            entry?.rate !== null &&
            entry?.population &&
            entry?.geography &&
            entry?.type?.toLowerCase().includes("incidence")
        )
      : [];

  const getCoordinatesByRegion = (regionName, geoData) => {
    const feature = geoData.features.find((f) =>
      f.properties.NAME_ENG?.toLowerCase().includes(regionName?.toLowerCase())
    );
    if (!feature) return null;

    const coords = feature.geometry.coordinates;
    let latLng;

    if (feature.geometry.type === "Polygon") {
      const ring = coords[0];
      const avg = ring.reduce(
        (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
        [0, 0]
      );
      latLng = [avg[1] / ring.length, avg[0] / ring.length];
    } else if (feature.geometry.type === "MultiPolygon") {
      const firstPolygon = coords[0][0];
      const avg = firstPolygon.reduce(
        (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
        [0, 0]
      );
      latLng = [avg[1] / firstPolygon.length, avg[0] / firstPolygon.length];
    }

    return latLng;
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
        🗺️ Population vs Incidence Rate Bubble Map (Ontario)
      </h2>

      {/* 🔍 Insight Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 p-3 mb-4 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Spot disease "hotspots" in Ontario based on incidence rates.
          </li>
          <li>
            Bubble size shows population, color intensity shows incidence rate.
          </li>
          <li>
            Helpful for targeting public health and outreach effects.
          </li>
        </ul>
      </div>

      {geoData ? (
        <MapContainer
          center={ontarioCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          zoomControl={true}
          doubleClickZoom={true}
          dragging={true}
          className="h-[500px] w-full rounded-md z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredData.map((entry, idx) => {
            const coords = getCoordinatesByRegion(entry.geography, geoData);
            if (!coords) return null;

            const radius = Math.sqrt(entry.population) / 100;
            const color = `rgba(255, 0, 0, ${entry.rate / 100})`;

            return (
              <CircleMarker
                key={idx}
                center={coords}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              >
                <Tooltip direction="top" sticky>
                  <div>
                    <strong>{entry.geography}</strong>
                    <br />
                    📈 Incidence Rate: {entry.rate.toFixed(2)} per 100k
                    <br />
                    👥 Population: {entry.population.toLocaleString()}
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      ) : (
        <p className="text-center text-gray-500">Loading map...</p>
      )}
    </div>
  );
};

export default BubbleMap;
