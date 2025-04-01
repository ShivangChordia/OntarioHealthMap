import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchGeoData, fetchPhuData } from "../utils/api";

const OntarioMap = ({ selectedDisease, setSelectedRegion }) => {
  const [geoData, setGeoData] = useState(null);
  const [phuData, setPhuData] = useState([]);
  const [selectedRegion] = useState("");

  // ✅ Define Ontario Boundaries to Restrict Map Movement
  const ontarioBounds = [
    [41.6, -95.2], // Bottom-left (South-West)
    [56.9, -74.3], // Top-right (North-East)
  ];

  useEffect(() => {
    console.log("🏥 Selected Region Updated:", selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [geoJSON, phuCensus] = await Promise.all([
          fetchGeoData(), // ✅ Fetch PHU Boundaries
          fetchPhuData(), // ✅ Fetch Census Data
        ]);

        setGeoData(geoJSON);
        setPhuData(phuCensus);
      } catch (error) {
        console.error("❌ Error loading map data:", error);
      }
    };

    loadMapData();
  }, []);

  // ✅ Function to Style Each Region
  const styleFeature = (feature) => ({
    fillColor: "#3178C6",
    weight: 1,
    opacity: 1,
    color: "#000",
    fillOpacity: 0.6,
  });

  // ✅ Function to Attach Census Data to Regions
  const onEachFeature = (feature, layer) => {
    if (!feature.properties || !feature.properties.NAME_ENG) {
      console.warn("⚠️ Missing NAME_ENG in feature:", feature);
      return;
    }

    const regionName = feature.properties.NAME_ENG.trim().toLowerCase();

    // ✅ Find Matching Census Data
    const matchingPHU = phuData.find(
      (data) => data.phu_name.trim().toLowerCase() === regionName
    );

    layer.on("click", () => {
      console.log("🗺️ Region Clicked:", feature.properties.NAME_ENG); // Debugging Log

      // ✅ Update selectedRegion state
      setSelectedRegion({
        name: feature.properties.NAME_ENG,
        phu: matchingPHU,
      });
    });

    // ✅ Tooltip Showing Basic Info
    layer.bindPopup(`
      <b>${feature.properties.NAME_ENG}</b><br/>
    `);
  };

  if (!geoData)
    return <div className="text-center text-gray-500 py-6">Loading Map...</div>;

  return (
    <div className="w-full h-[650px] z-0 relative bg-white shadow-lg rounded-lg p-4">
      <MapContainer
        center={[50, -85]} // ✅ Center on Ontario
        zoom={5} // ✅ Default zoom
        minZoom={5} // ✅ Prevent zooming out beyond level 5
        maxBounds={ontarioBounds} // ✅ Restrict movement within Ontario
        maxBoundsViscosity={1.0} // ✅ Strictly enforce boundary limits
        scrollWheelZoom={false} // ✅ Disable scroll zoom
        doubleClickZoom={false} // ✅ Prevent double-click zoom
        dragging={true} // ✅ Allow dragging, but restricted
        className="h-full w-full z-0 rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={geoData}
          onEachFeature={onEachFeature}
          style={styleFeature}
        />
      </MapContainer>

      {/* Selected Region Panel */}
      {selectedRegion && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h3 className="font-bold">{selectedRegion.name}</h3>
        </div>
      )}
    </div>
  );
};

export default OntarioMap;
