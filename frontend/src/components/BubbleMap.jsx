import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { fetchGeoData } from "../utils/api";
import "leaflet/dist/leaflet.css";

const BubbleMap = ({ diseaseData, dataKey }) => {
  const [geoData, setGeoData] = useState(null);

  console.log("📍 Data in BubbleMap:", diseaseData[dataKey]);

  const getCoordinatesByRegion = (regionName, geoData) => {
    const feature = geoData.features.find(
      (f) => f.properties.NAME_ENG === regionName
    );
    if (!feature) return null;

    const coords = feature.geometry.coordinates;

    let latLng;

    if (feature.geometry.type === "Polygon") {
      const ring = coords[0]; // Outer ring
      const avg = ring.reduce(
        (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
        [0, 0]
      );
      latLng = [avg[1] / ring.length, avg[0] / ring.length]; // [lat, lng]
    } else if (feature.geometry.type === "MultiPolygon") {
      const firstPolygon = coords[0][0];
      const avg = firstPolygon.reduce(
        (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
        [0, 0]
      );
      latLng = [avg[1] / firstPolygon.length, avg[0] / firstPolygon.length]; // [lat, lng]
    }

    return latLng;
  };
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
            entry.measure?.includes("Age-standardized rate") &&
            entry.rate !== null &&
            entry.population !== null
        )
      : [];

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-4">
        Population vs Incidence Rate Bubble Map
      </h2>

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
          className="h-[500px] w-full rounded-md z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredData.length > 0 &&
            filteredData.map((entry, idx) => {
              const coords = getCoordinatesByRegion(entry.geography, geoData);
              if (!coords) return null;

              const radius = Math.sqrt(entry.population) / 80;
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
                      Rate: {entry.rate.toFixed(2)} per 100k
                      <br />
                      Population: {entry.population.toLocaleString()}
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
